<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" label-width="80px">
                <el-form-item  prop="customer_no">
                    <el-input placeholder="客户编号" v-model="filters.customer_no">
                    </el-input>
                </el-form-item>
                <el-form-item  prop="customer_name">
                    <el-input placeholder="客户姓名" v-model="filters.customer_name">
                    </el-input>
                </el-form-item>
                <el-form-item  prop="mobile">
                    <el-input placeholder="手机号码" v-model="filters.mobile">
                    </el-input>
                </el-form-item>
                <el-form-item  prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="acancelStar()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger"  @click="openDielog()">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--搜索结果表格-->
        <el-table
                :header-row-style="headerRowStyle"
                :data="tableData"
                stripe
                v-loading="listLoading"
                style="width: 100%;">
            <el-table-column
                    prop="gmt_create"
                    label="标星时间"
                    align="center"
            >
                <template slot-scope="scope">
                    <span>{{ isBirthDate(scope.row.gmt_create) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="customer_no"
                    label="客户编号"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="name"
                    align="center"
                    label="客户姓名">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    align="center"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="identity_no"
                    align="center"
                    label="证件号码">
            </el-table-column>
            <el-table-column
                    prop="update_date"
                    align="center"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            type="text"
                            size="small"
                            @click="cancelStar(scope.row.id)"
                    >取消标星</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    style="text-align: center;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pager.pageSize"
                    :page-sizes="pager.sizes"
                    background
                    :current-page="pager.page_no"
                    layout="prev,pager,next,sizes,total"
                    :total="pager.total">
            </el-pagination>
        </el-col>

        <el-dialog
            title="新增标星客户"
            width="60%"
            :visible.sync="addStarVisible"
            @close="clearUpData"

    >
        <el-form
                :model="addStarVerifyData"
                label-width="80px"
        >
            <el-form-item label="证件号码" >
                <el-input v-model="addStarVerifyData.identity_no" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="客户姓名">
                <el-input
                        v-model="addStarVerifyData.full_name"
                        auto-complete="off"
                >
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                        type="primary"
                        size="small"
                        @click="addStarVerify()"
                >添加
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="addStarData">
            <el-table-column property="number" label="序号" width="150"   type="index" > </el-table-column>
            <el-table-column property="identity_no" label="证件号码" width="200"> </el-table-column>
            <el-table-column property="full_name" label="客户姓名"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger"
                               @click="delAddItme(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addStarVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStars()">确 定</el-button>
        </div>
    </el-dialog>

    </section>
</template>

<script>
    import * as api from '../../api/star'
    import {isBirthDate} from '../../common/js/commons'
    export default {
        data() {
            return {
                addStarVisible:false,
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color:"#333",
                    textAlign: "center"
                },

                //新增标星客户校验
                addStarVerifyData: {
                    identity_no: "",
                    full_name: "",
                },
                //新增标星客户列表
                addStarData: [ ],
                //搜索条件
                filters: {
                    customer_no: "",
                    customer_name: "",
                    mobile: "",
                    identity_no: ""
                },
                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                //表格数据
                tableData: [],
                listLoading:false
            };
        },
        methods: {
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.handlePagerChange();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange()
            {
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage,
                    note_time: this.filters.note_time,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    mobile: this.filters.mobile,
                    identity_no: this.filters.identity_no
                };
                this.getStarByFilter(params);
            },
            //根据条件搜索数据
            acancelStar() {
                this.listLoading = true  //显示loading
                this.pager.currentPage = 1;
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage,
                    note_time: this.filters.note_time,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    mobile: this.filters.mobile,
                    identity_no: this.filters.identity_no,
                };
                this.getStarByFilter(params);
            },
            //根据条件搜索销售数据-实体方法
            getStarByFilter(params) {
                api.getStarList(params).then((res) => {
                    if (res.data.status == 200) {
                        this.listLoading = false  //隐藏loading
                        let data = JSON.parse(res.data.datas);
                        this.tableData = data.items;
                        this.pager.total = data.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },
            //打开弹框
            openDielog() {
                this.addStarVisible = true
            },
            //弹框关闭清除已添加的数据
            clearUpData() {
                this.addStarData = [];
                this.addStarVerifyData = {}
            },
            //新增标星-实体方法
            addStars() {
                let customer_list = this.addStarData;
                if(!customer_list.length == 0){
                    this.$confirm('请再次确定是否将该客户加入标星列表?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        api.addStar(customer_list).then((res) => {
                            if (res.data.status == 200) {
                                this.addStarVisible = false;
                                this.initData();
                                this.addStarData = [];
                                this.$message("新增成功！");
                            } else {
                                if (res.data.status == 401) {
                                    this.$router.push('/login');
                                }
                                this.$message(res.data.msg);
                            }
                        });
                    });
                } else{
                    this.$message("请添加客户信息");
                }
            },
            //取消标星-实体方法
            cancelStar(customer_no) {
                this.$confirm('删除后，该客户将失去标星特权，是否确认?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:customer_no
                    }
                    api.cancelStar(params).then((res) => {
                        if (res.data.status == 200) {
                            this.$message("取消成功！");
                            this.initData();
                        } else {
                            if (res.data.status == 401) {
                                this.$router.push('/login');
                            }
                            this.$message(res.data.msg);
                        }
                    });
                });

            },
            //新增标星校验
            addStarVerify() {
                if(this.addStarVerifyData.identity_no && this.addStarVerifyData.full_name && this.addStarData.length < 20){
                    for(var i = 0; i < this.addStarData.length; i++){
                        if(this.addStarData[i].identity_no == this.addStarVerifyData.identity_no){
                            this.$message("该证件号码上传列表已存在，请勿重复上传");
                            return false
                        }
                    }
                    let params = {
                        full_name: this.addStarVerifyData.full_name,
                        identity_no: this.addStarVerifyData.identity_no
                    };
                    api.addStarVerify(params).then((res) => {
                        if (res.data.status == 200) {
                            let {id,identity_no,name} = JSON.parse(res.data.datas);
                            let addData = {
                                "id":id,
                                "identity_no":identity_no,
                                "full_name":name
                            }
                            this.addStarData.push(addData);
                            this.addStarVerifyData = {}
                        } else {
                            if (res.data.status == 401) {
                                this.$router.push('/login');
                            }
                            this.$message(res.data.msg);
                        }
                    });
                }else if(!this.addStarVerifyData.identity_no){
                    this.$message("请输入证件号码");
                }else if(!this.addStarVerifyData.full_name) {
                    this.$message("请输入客户姓名");
                }else if(this.addStarData.length >= 20){
                    this.$message("待提交列表客户数量最多为20条");
                }
            },
            //删除上传列表
            delAddItme(row){
                this.addStarData.splice(row,1)

            },
            //格式化日期
            isBirthDate(row) {
                return isBirthDate(row);
            },
            //重置搜索表彰
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.initData();
            },
            //初始化页面
            initData() {
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage,
                    "order_by": "asc",
                    "order_column":'gmt_create',
                };
                //默认显示所有销售
                this.acancelStar(params);
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