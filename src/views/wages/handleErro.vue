<template>
    <section style="min-height:560px">
        <el-table
                :data="pagdatas"
                border
                style="width: 100%">
            <el-table-column
                    prop="identityNo"
                    label="证件号码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="fullName"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="金额（元）">
                <template slot-scope="scope">
                    {{scope.row.amount | money}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="company_payment_state"
                    label="失败原因">
                <template slot-scope="scope">
                    {{wages_err_code[scope.row.errorCode]}}
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar" >
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
        props:["datas"],
        data() {
            return {
                wages_err_code:dict.wages_err_code,
                clearable:false,
                listLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                pagdatas:[]

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
                this.pagination()
                //this.getList();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },

            pagination(){
                this.pager.total = this.datas.length;
                this.pagdatas=this.datas.slice((this.pager.page_no-1)*this.pager.page_size,(this.pager.page_no-1)*this.pager.page_size+this.pager.page_size)
            }

        },
        watch: {
            datas(curVal,oldVal){
                this.pagination();
                console.log(this.datas)
            }

        },
        mounted() {
            this.$nextTick(function () {
             //   this.getList();
                this.pagination()
            })

        }
    }
</script>

