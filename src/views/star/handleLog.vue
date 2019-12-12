<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" label-width="80px">
                <el-form-item   prop="customer_no">
                    <el-input placeholder="客户编号" v-model="filters.customer_no">
                    </el-input>
                </el-form-item>
                <el-form-item  prop="full_name">
                    <el-input placeholder="客户姓名" v-model="filters.full_name">
                    </el-input>
                </el-form-item>
                <el-form-item   prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no">
                    </el-input>
                </el-form-item>
                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :span="3"
                                :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="acancelStar()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetSearch('filters')">重置</el-button>
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
                    prop="identity_no"
                    align="center"
                    label="证件号码">
            </el-table-column>
            <el-table-column
                    prop="operator_type"
                    align="center"
                    :formatter="statusFormatter"
                    label="操作类型">
            </el-table-column>
            <el-table-column
                    prop="operator_name"
                    align="center"
                    label="操作人">
            </el-table-column>
            <el-table-column
                    prop="gmt_create"
                    align="center"
                    label="操作时间">
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
    </section>
</template>

<script>
    import * as api from '../../api/star'
    import dict from '../../common/js/dict'

    export default {
        data() {
            return {
                clearable: false,
                addStarVisible:false,
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color:"#333",
                    textAlign: "center"
                },
                //搜索条件
                filters: {
                    customer_no: "",
                    full_name: "",
                    mobile: "",
                    identity_no: "",
                    start_time:"",
                    createDate:"",
                    end_time:""
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
            // 标星操作状态、
            statusFormatter(row, column) {
                return dict.operator_type[row.operator_type];
            },
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
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0] + " 00:00:00";
                this.filters.end_time = val[1] + " 23:59:59";
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.acancelStar();
            },
            //分页引起的页面数据更改
            handlePagerChange()
            {
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage,
                    note_time: this.filters.note_time,
                    customer_no: this.filters.customer_no,
                    full_name: this.filters.full_name,
                    mobile: this.filters.mobile,
                    identity_no: this.filters.identity_no,
                    start_time: this.filters.start_time,
                    end_time: this.filters.end_time,
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
                    customer_no: this.filters.customer_no,
                    full_name: this.filters.full_name,
                    mobile: this.filters.mobile,
                    identity_no: this.filters.identity_no,
                    start_time: this.filters.start_time,
                    end_time: this.filters.end_time,
                };
                this.getStarByFilter(params);
            },
            //根据条件搜索销售数据-实体方法
            getStarByFilter(params) {
                api.getStarLog(params).then((res) => {
                    if (res.data.status == 200) {
                        this.listLoading = false  //隐藏loading
                        let data = JSON.parse(res.data.datas);
                        this.pager.total = data.total;
                        this.tableData = data.items;

                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },

            //初始化页面
            initData() {
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage
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