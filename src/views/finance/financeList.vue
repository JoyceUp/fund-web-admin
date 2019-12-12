<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" ref="filters" :model="filters" :rules="filterRules">
                <el-form-item prop="query_month">
                    <el-date-picker v-model="filters.query_month" type="month" @change="handleMonth" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"  @click="exportExcel" v-if="exportBtn">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--数据列表-->
        <el-table stripe v-loading="listLoading" :data="items" style="width: 100%">
            <el-table-column width="55"></el-table-column>
            <el-table-column prop="sale_full_name" label="销售姓名"></el-table-column>
            <el-table-column prop="employee_no" label="销售编号"></el-table-column>
            <el-table-column prop="identity_no" label="证件号码"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="reward_money" label="累计提成（元）">
                <template slot-scope="scope">
                    {{scope.row.reward_money | money}}
                </template>
            </el-table-column>
            <el-table-column prop="interest_money" label="累计利息（元）">
                <template slot-scope="scope">
                    {{scope.row.interest_money | money}}
                </template>
            </el-table-column>
            <el-table-column prop="commission_money" label="累计佣金（元)">

                <template slot-scope="scope">
                    {{scope.row.commission_money | money}}
                </template>

            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>


    </section>

</template>

<script>
    import  * as API  from '../../api/finance_api';
    import dict from '../../common/js/dict';
    import {all_identity_no} from '../../common/js/checkFields';
    import {fileDownload} from '../../common/js/download';
    import {getPreMonth} from '../../common/js/commons';
    export default {
        data() {
            return {
                exportBtn:false,
                listLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                items: [],
                //搜索条件
                filters: {
                    query_month: getPreMonth(),
                    is_inside:1 //1 代表销售  2代表内勤
                },
                filterRules: {
                    query_month: [
                        {required: true, message: '请选择出入金时间'},
                    ]
                }

            }
        },
        methods: {
            // 分页page_size改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.handlePagerChange();
            },
            // 分页page_no改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getItems();
            },
            handleMonth(){
          //      let condition = Object.assign(this.filters);
                let paras = this.filters;

                this.getItems()
                API.getFinanceExist(paras).then((res) => {
                   if(res == true){
                        this.exportBtn=true

                   }else{
                       this.exportBtn=false
                   }

                });
            },
            exportExcel() {
                this.$refs['filters'].validate((valid) => {
                    if (valid) {
                        let condition = {
                            query_month: this.filters.query_month,
                        };
                        let params = {
                            condition: condition
                        };
                        API.getFinanceExport(params).then((res) => {
                            //res.data有可能是字符串，即正常获取的文件内容, 不含stauts信息
                            //也可能是错误信息，含有res.data.status
                            console.log(res)
                            console.log(res.status)
                            if (res.status == 200) {
                              fileDownload(res, this);
                            } else {
                                if (res.data.status == 401) {
                                    // this.$router.push('/login');
                                }
                                this.$message.error(res.data.status + " " + res.data.msg);
                            }
                        }).catch((e) => {
                            this.$message({
                                type: 'info',
                                message: e.message
                            });
                        });

                    }
                });


            },
            getItems(num) {
                //查询列表
                this.listLoading = true;
                if (num) {
                    this.pager.currentPage = 1;
                }

                // let paras = Object.assign(this.positionDic, this.filters);
                let condition = Object.assign(this.filters);

                let paras = {};
                paras.condition = condition;
                paras.page_no = this.pager.currentPage;
                paras.page_size = this.pager.pageSize;
                API.getFinanceList(paras).then((res) => {
                    console.log(res.status)
                    this.listLoading = false;
                    if (res.status ==200) {
                        let result = JSON.parse(res.datas);

                        this.items = result.items;
                        this.pager.total = result.total;
                    } else {
                        if (res.status == 401) {
                            this.$router.push('/login');
                        }

                        this.$message.error(res.msg);
                    }

                });
            },
        },
        mounted() {
            this.$nextTick(function () {

                this.getItems();
                this.handleMonth()
            })
        }

    }
</script>