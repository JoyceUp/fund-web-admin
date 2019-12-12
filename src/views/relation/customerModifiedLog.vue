<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item label="" prop="customer_no">
                    <el-input placeholder="客户编号"  v-model="filters.customer_no">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="customer_name">
                    <el-input placeholder="客户姓名"  v-model="filters.customer_name">
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="update_time">
                    <el-date-picker :clearable="clearable" v-model="filters.update_time" type="daterange" @change="handleUpdateDateChange" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="变更开始日期" end-placeholder="变更结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" @click="getLog">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">清空</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--客户列表-->
        <el-table stripe v-loading="listLoading" :header-row-style="headerRowStyle" ref="customerData" :data="customerData" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="customer_no" label="客户编号" align="center"></el-table-column>
            <el-table-column prop="customer_name" label="客户姓名" align="center"></el-table-column>
            <el-table-column prop="parent_no_from" label="变更前邀请人编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parent_name_from" label="变更前邀请人姓名" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parent_no_to" label="变更后邀请人编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parent_name_to" label="变更后邀请人姓名" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="update_time" label="变更时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operator_name" label="操作人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="变更原因" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                    :page-sizes="pager.sizes" background :current-page="pager.page_no" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import * as api from '../../api/relation'
    import {trimBlank} from '../../common/js/commons';
    export default {
        data() {
            return {
                clearable:false,
                listLoading :false,
                //分页信息
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color: "#333",
                    textAlign: "center"
                },
                //搜索客户条件
                filters: {
                    customer_no: "",
                    customer_name: "",
                    start_time: "",
                    end_time: "",
                    update_time:""
                },
                //客户列表数据
                customerData: []
            }
        },
        methods: {
            handleUpdateDateChange(val){
                this.filters.start_time = val[0] + ' 00:00:00';
                this.filters.end_time = val[1] + ' 23:59:59';
            },
            //分页page_size发生改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            //page_no
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getCustomerModifiedLog();
            },
            getLog(){
                this.pager.page_no = 1;
                this.getCustomerModifiedLog();
            },
            //根据条件搜索客户列表
            getCustomerModifiedLog() {
                this.getCustomerModifiedLogByFilter();
            },
            //根据条件搜索客户列表-实体方法
            getCustomerModifiedLogByFilter() {

                this.listLoading = true;
                let condition = {
                    customer_no: trimBlank(this.filters.customer_no),
                    customer_name: trimBlank(this.filters.customer_name),
                    start_time: this.filters.start_time,
                    end_time: this.filters.end_time
                };
                
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    order_column: 'gmt_create',
                    order_by: "DESC",
                    condition: condition
                };

                api.getCustomerParentLog(params).then((res) => {

                    if (res.data.status == 200) {
                        let data = JSON.parse(res.data.datas);
                        this.customerData = data.items;
                        this.pager.total = data.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                    this.listLoading = false;
                });
            },
            //重置搜索表单
            resetForm(formName) {
                this.filters.start_time="";
                this.filters.end_time="";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getCustomerModifiedLogByFilter();
            },
            //初始化页面数据
            initData() {
                // 默认显示所有客户
                this.getCustomerModifiedLogByFilter();
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