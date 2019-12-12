<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item label="" prop="customer_no">
                    <el-input placeholder="邀请人编号" v-model="filters.customer_no">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="customer_name">
                    <el-input placeholder="邀请人姓名" v-model="filters.customer_name">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="mobile">
                    <el-input placeholder="手机号码" v-model="filters.mobile">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getInvitee">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">清空</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--邀请人列表-->
        <el-table stripe v-loading="listLoading" :header-row-style="headerRowStyle" :data="inviteeData" border
                  style="width: 100%; ">
            <el-table-column align="center" label="单选" width="50px">
                <template slot-scope="scope">
                    <el-radio v-model="target"  :label="scope.row.id">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="customer_no" align="center" label="邀请人编号" width="auto"></el-table-column>
            <el-table-column prop="name" align="center" label="邀请人姓名" width="auto"></el-table-column>
            <el-table-column prop="mobile" align="center" label="手机号码" width="auto"></el-table-column>
            <el-table-column prop="identity_no" align="center" label="证件号码" width="auto"></el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :page-sizes="pager.sizes" background :current-page="pager.page_no"
                           layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

        <!--确认提交按钮-->
        <el-col :span="24" class="toolbar" style=" text-align: center; ">
            <el-button size="small" type="primary" @click="inviteeSubmit">提交</el-button>
            <el-button size="small" @click="cancelSubmit">取消</el-button>
        </el-col>
    </section>
</template>

<script>
    import {getCustomersList} from '../../api/customers_api';
    import * as api from '../../api/relation';
    import dict from '../../common/js/dict';
    import {trimBlank} from '../../common/js/commons';

    export default {
        // 父级页面传来的数据-选中的客户
        props: ["selectedCustomers","receiverCount"],
        data() {
            return {
                listLoading: false,
                // 分页信息
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                // 选中的销售
                target: [],
                //列表header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color: "#333",
                    textAlign: "center"
                },
                // 搜索条件
                filters: {
                    parent_no: "",
                    parent_name: "",
                    email: "",
                    mobile: "",
                    identity_no: "",
                    auth_state: 1//只查询实名认证通过的所有客户
                },
                // 销售列表数据
                inviteeData: []
            };
        },
        methods: {
            // 分页page_size发生改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            // 分页page_no发生改变
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getInviteeByFilter();
            },
            //清空选中
            clearSelected() {
                this.target = [];
            },
            // 取消修改，关闭对话框
            cancelSubmit() {
                this.$emit("closeDialog");
            },
            //提交更改
            inviteeSubmit() {
                if (this.target.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请选择一个邀请人'
                    });
                }
                else {
                    this.$prompt('请输入变更原因（必填）', '确定变更邀请人归属?', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,   //不通过点击遮罩关闭弹框
                        inputValidator: function (value) {
                            if (value) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        inputErrorMessage: '请输入变更原因'
                    }).then(({value}) => {

                        let params = {
                            customer_ids: this.selectedCustomers,
                            parent_id: this.target,
                            remark: value
                        };
                        this.listLoading = true;
                        api.customersParentSubmit(params).then((res) => {
                            this.listLoading = false;
                            if (res.data.status == 200) {
                                if(res.data.msg.indexOf('失败') != -1){
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg
                                    });
                                }else{

                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg
                                    });
                                }
                                this.cancelSubmit();

                            } else {
                                this.$message.error(res.data.status + " " + res.data.msg);
                            }
                        });

                    }).catch(() => {
                        console.log("err");
                        /*this.$message({
                            type: 'info',
                            message: e.message
                        });*/
                    });
                }
            },
            // 根据条件搜索销售数据
            getInvitee() {
                this.pager.page_no = 1;
                this.getInviteeByFilter();
            },
            // 根据条件搜索邀请人列表-实体方法
            getInviteeByFilter() {
                this.clearSelected();
                let condition = {
                    customer_no: trimBlank(this.filters.customer_no),
                    customer_name: trimBlank(this.filters.customer_name),
                    mobile: trimBlank(this.filters.mobile),
                    identity_no: trimBlank(this.filters.identity_no),
                    auth_state: 3//只查询实名认证通过的所有客户
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    condition: condition
                };
                let _this=this
                this.listLoading=true
                $.ajax({
                    type : "POST",
//                  contentType:'application/json;charset=utf-8, charset=UTF-8',
                    timeout : 200000, //超时时间设置，单位毫秒
                    url : "customers/customers/listpage",

                    data : {data:JSON.stringify(params)},
                    success : function(res) {
                        if (res.status == 200) {
                            _this.listLoading = false;
                            let data = JSON.parse(res.datas);
                            _this.inviteeData = data.items;
                            _this.pager.total = data.total;
                        } else{
                            _this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                        _this.listLoading = false;
                    },
                    error : function(){
                        // alert("错误");
                    }

                });
             /*   getCustomersList(params).then((res) => {

                    if (res.data.status == 200) {
                        let data = JSON.parse(res.data.datas);
                        this.inviteeData = data.items;
                        this.pager.total = data.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });*/
            },
            // 重置搜索表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.clearSelected();
                this.getInvitee();
            },
            // 初始化页面数据
            initData() {
                // 默认显示所有销售
                this.getInviteeByFilter();
            },

        },
        watch:{
            receiverCount(cur){
                this.resetForm('filters');
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style scoped>
.el-radio__label
{
    display: none;
}
</style>