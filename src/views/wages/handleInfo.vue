<template>
    <section style="width:100%">

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" >
                <el-form-item prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input placeholder="姓名" v-model="filters.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList(1)" size="small">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetSearch('filters')" size="small">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table
                :data="datas"
                border
                style="width: 100%">
            <el-table-column
                    prop="identity_no"
                    label="证件号码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="customer_name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="金额">
                <template slot-scope="scope">
                    {{scope.row.amount | money}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="company_payment_state"
                    label="发放状态">
                <template slot-scope="scope">
                         {{wages_status[scope.row.company_payment_state]}}
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
    import * as API from '../../api/wages_api';
    import dict from '../../common/js/dict';
    export default {
        props:["id"],
        data() {
            return {
                wages_status:dict.wages_status,
                clearable:false,
                listLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                datas: [],
                activeName: 'first',
                filters: {
                    identity_no: '',
                    name: '',
                },


            }
        },
        methods: {
            //清空筛选表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1)  //1是让列表回到第一页
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
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getList();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getList();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            getList(num) {

                if (num) {
                    this.pager.page_no = 1
                }
                let condition =this.filters
                let params = {
                    "condition": condition,
                    "page_size": this.pager.page_size,
                    "page_no": this.pager.page_no,
                    "id":this.id,
                    "order_column": "",
                    "order_by": ""
                }
                API.getWagesInfo(params).then((res) => {
                    if (res.data.status == 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.datas = datas.items;
                        this.pager.total = datas.total;
                    } else {
                        if (res.data.status == 401) {
                        }
                        this.$message.error(res.data.msg);
                    }
                    this.listLoading = false;

                });



            }
        },
        watch:{
            id(curVal,oldVal){
                this.getList();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getList();

            })

        }
    }
</script>

