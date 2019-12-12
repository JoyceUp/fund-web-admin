<template>
    <section>

        <el-col :span="24"  class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filtersFrom" size="medium">
                <el-form-item prop="account_no">
                    <el-input placeholder="账户" v-model="filters.account_no"></el-input>
                </el-form-item >
                <el-form-item>
                    <el-button type="primary" @click="getAccounts(1)" size="small">查询</el-button>
                    <el-button  @click="resetForm('filtersFrom')" size="small">清空</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!-- table -->
        <el-table
                :data="accounts"
                stripe
                v-loading="listLoading"
        >

            <el-table-column
                    prop="account_no"
                    label="MT4账号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="account_type"
                    label="账户类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="full_name"
                    label="客户姓名">
            </el-table-column>

            <el-table-column
                    prop="balance"
                    label="账户余额">
            </el-table-column>
            <el-table-column
                    prop="ib_account_no"
                    label="代理账号">
            </el-table-column>
            <el-table-column
                    prop="sales_employee_no"
                    label="销售账号">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="帐号状态">
            </el-table-column>
            <el-table-column
                    prop="gmt_create"
                    label="注册时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="showDetail(scope.$index, scope.row) " size="mini" >
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    style="text-align: center;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pager.page_size"
                    :current-page="pager.page_no"
                    :page-sizes="pager.sizes"
                    background
                    layout="prev,pager,next,sizes,total"
                    :total="pager.total">
            </el-pagination>
        </el-col>


    </section>
</template>
<script>


    export default {

        data() {
            return {
                listLoading:false,

                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                filters: {
                    account_no: '',//mt4号

                }
            }
        },
        methods: {
            //清空筛选表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange()
            {
                this.getList();
            },

            getList(num) {//获取客户列表

            }

        },
        mounted() {
            this.$nextTick(function () {
                this.getList();
            })
        }
    }
</script>
