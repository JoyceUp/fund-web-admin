<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="customer_no">
                    <el-input placeholder="客户编号"  v-model="filters.customer_no"></el-input>
                </el-form-item>
                <el-form-item prop="customer_name">
                    <el-input placeholder="客户姓名"  v-model="filters.customer_name"></el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input placeholder="手机号码"  v-model="filters.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="identity_no">
                    <el-input placeholder="证件号码"  v-model="filters.identity_no"></el-input>
                </el-form-item>
                <el-form-item prop="parent_no">
                    <el-input placeholder="邀请人编号"  v-model="filters.parent_no"></el-input>
                </el-form-item>
                <el-form-item prop="parent_name">
                    <el-input placeholder="邀请人姓名"  v-model="filters.parent_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getCustomers">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">清空</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--主要功能按钮-->
        <el-col :span="24" class="toolbar" >
            <el-button type="primary" size="small"   @click="saleChange">更换上级</el-button>
        </el-col>
        <!--代理列表-->
        <el-table stripe v-loading="listLoading" :header-row-style="headerRowStyle" ref="customersData" :data="customersData"
                  tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="customer_no" align="center" label="客户编号"></el-table-column>
            <el-table-column prop="name" align="center" label="客户姓名"></el-table-column>
            <el-table-column prop="mobile" align="center" label="手机号码"></el-table-column>
            <el-table-column prop="identity_no" align="center" label="证件号码"></el-table-column>
            <el-table-column prop="parent_no" align="center" label="邀请人编号"></el-table-column>
            <el-table-column prop="parent_name" align="center" label="邀请人姓名"></el-table-column>
            <el-table-column prop="sales_no" align="center" label="销售编号"></el-table-column>
            <el-table-column prop="sales_name" align="center" label="销售姓名"></el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :page-sizes="pager.sizes" background :current-page="pager.page_no" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

        <!--详细操作对话框-选择邀请人-->
        <el-dialog title="更换上级" fullscreen :visible.sync="dialogInvisibleVisible" @open="dialogSaleOpen">
            <customer-invitee :receiverCount="dialogReceiverCount" :selectedCustomers="multipleSelection" v-on:closeDialog="dialogInvisible"></customer-invitee>
        </el-dialog>
    </section>
</template>

<script>
    import * as api from '../../api/relation'
    import {getCustomersList} from '../../api/relation';
    import customerInvitee from './CustomerInvitee';
    import {trimBlank} from '../../common/js/commons';

    export default {
        data() {
            return {
                listLoading :false,
                name: "proxy-list",
                // 分页信息
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                // 被选中的代理
                multipleSelection: [],
                // 修改销售对话框显示
                dialogInvisibleVisible: false,
                dialogReceiverCount:0,
                //列表header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color: "#333",
                    textAlign: "center"
                },
                // 搜索条件
                filters: {
                    customer_no: "",
                    customer_name: "",
                    mobile: "",
                    identity_no: "",
                    parent_no: "",
                    parent_name: ""
                },
                // 代理列表数据
                customersData: []
            }
        },
        components: {
            customerInvitee
        },
        methods: {
            // 选择代理
            handleSelectionChange(val) {
                this.multipleSelection = [];
                if (val.length > 0) {
                    for (let i = 0; i < val.length; i++) {
                        this.multipleSelection.push(val[i].id);
                    }
                }
            },
            // 分页page_size改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            // 分页page_no改变
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getCustomerListByFilter();
            },
            // ====主要操作====[修改选中的客户的邀请人]
            saleChange() {
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请至少选择一个客户'
                    });
                }
                else {
                    this.dialogInvisibleVisible = true;
                }
            },
            //监听子控件的操作，关掉修改邀请人对话框
            dialogInvisible() {
                this.dialogInvisibleVisible = false;
                this.getCustomerListByFilter();
            },
            // 根据条件搜索客户
            getCustomers() {
                this.pager.page_no = 1;
                this.getCustomerListByFilter();
            },
            // 根据条件搜索客户-实体方法
            getCustomerListByFilter() {
                this.listLoading = true;
                let condition = {
                    customer_no: trimBlank(this.filters.customer_no),
                    customer_name: trimBlank(this.filters.customer_name),
                    mobile: trimBlank(this.filters.mobile),
                    identity_no: trimBlank(this.filters.identity_no),
                    parent_no: trimBlank(this.filters.parent_no),
                    parent_name: trimBlank(this.filters.parent_name),
                    auth_state:3
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    order_column: "",
                    order_by: "",
                    condition: condition
                };

                let _this = this
              $.ajax({
                    type : "POST",
//                  contentType:'application/json;charset=utf-8, charset=UTF-8',
                    timeout : 200000, //超时时间设置，单位毫秒
                    url : "/relation/customer_list",

                    data : {data:JSON.stringify(params)},
                    success : function(res) {
                        if (res.status == 200) {
                            _this.listLoading = false;
                            let data = JSON.parse(res.datas);
                            _this.customersData = data.items;
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
/*
                getCustomersList(params).then((res) => {

                    if (res.data.status == 200) {
                        this.listLoading = false;
                        let data = JSON.parse(res.data.datas);
                        this.customersData = data.items;
                        this.pager.total = data.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });*/
            },
            //弹出修改销售对话框时事件
            dialogSaleOpen() {
                this.dialogReceiverCount++;
            },
            // 重置搜索表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getCustomerListByFilter();
            },
            // 初始化页面数据
            initData() {
                //默认显示所有客户数据
                this.getCustomerListByFilter();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style scoped>

</style>