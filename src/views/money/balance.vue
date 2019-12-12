<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">

            <el-form :inline="true" :model="filters" ref="filters"  size="medium">
                <el-form-item prop="account_type">
                    <el-select placeholder="选择账户" v-model="filters.account_type" @change="handleType">
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.account_type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="customer_no">
                    <el-input
                            placeholder="客户编号"
                            v-model.trim="filters.customer_no">
                    </el-input>
                </el-form-item>
                <el-form-item prop="customer_name">
                    <el-input
                            placeholder="客户姓名"
                            v-model.trim="filters.customer_name">
                    </el-input>
                </el-form-item>

                <el-form-item prop="cause">
                    <el-select placeholder="余额变动类型" v-model="filters.cause" >
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.balance_cause"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="identity_no">
                    <el-input
                            placeholder="证件号码"
                            v-model.trim="filters.identity_no">
                    </el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input
                            placeholder="手机号码"
                            v-model.trim="filters.mobile">
                    </el-input>
                </el-form-item>
                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间" end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small"  @click="getBalanceList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"  @click="resetSearch('filters')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"  @click="exportExcel">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--数据列表-->
        <el-table
                stripe
                v-loading="listLoading"
                :data="datas"
                style="width: 100%">
            <el-table-column
                    prop="customer_no"
                    label="客户编号">
            </el-table-column>
            <el-table-column
                    prop="customer_name"
                    label="客户姓名">
            </el-table-column>
            <el-table-column
                    prop="customer_identity_no"
                    label="证件号码">
            </el-table-column>
            <el-table-column
                    prop="customer_mobile"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="cause"
                    :formatter="causeFormatter"
                    label="余额变动类型">
            </el-table-column>
            <el-table-column
                    prop="difference"
                    :formatter="differenceProfix"
                    label="收支金额（元）">
            </el-table-column>
            <el-table-column
                    prop="balance_after"
                    :formatter="cent2dollar"
                    v-if="this.filters.account_type != 3"
                    :label="options.account_type[filters.account_type]">
            </el-table-column><!--定期账户的余额算不出来，判断账户类型，暂时把这一列隐藏-->
            <el-table-column width="160"
                    prop="gmt_create"
                    label="创建时间">
            </el-table-column>
        </el-table>


        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--分页-->
            <el-pagination
                    style="text-align: center;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pager.page_size"
                    :page-sizes="pager.sizes"
                    background
                    :current-page="pager.page_no"
                    layout="prev,pager,next,sizes,total"
                    :total="pager.total">
            </el-pagination>
        </el-col>

        <!-- 统计列表 -->

    </section>


</template>

<script>
    import * as money_api from '../../api/money_api.js';
    import dict from '../../common/js/dict';
    import {fileDownload} from '../../common/js/download';
    import * as date from "../../common/js/date"
    import {centToDollar,getNowFormatDate} from "../../common/js/commons"

    export default {
        props:["params"],
        data() {
            return {
                clearable:false,
                listLoading :false,
                statistics: {},     //统计
                options: {
                    account_type:dict.account_type,
                    balance_cause:dict.account_balance_cause,
                },

                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                datas: [],
                filters: {
                    account_type:"1",
                    customer_no: '',
                    customer_name: '',
                    identity_no: '',
                    cause:'',
                    mobile: '',
                    start_time: '',
                    end_time: '',
                    createDate: ''
                }
            }
        },
        methods: {
            initData(){

                let now = getNowFormatDate()
                this.filters.createDate=[now,now]
                this.handleCreateDateChange(this.filters.createDate)
            },
            handleType(val){
                switch(val){
                    case "1" :
                        this.options.balance_cause =dict.account_balance_cause
                        break
                    case "2":
                        this.options.balance_cause =dict.current_balance_cause
                        break
                    case "3":
                        this.options.balance_cause =dict.fix_balance_cause
                        break
                }
                this.pager.page_no=1
                this.filters.cause =""
                this.getBalanceList()
            },
            differenceProfix(row, column){
                let val = this.cent2dollar(row, column);
                if(val > 0)
                {
                    return ("+" + val);
                }
                return val;
            },
            //美分变美元
            cent2dollar(row, column) {
/*                if(this.filters.account_type == 3){
                    return "-"
                }*/
                if (column) {
                    return centToDollar(row[column.property]);
                }
                return centToDollar(row);
            },
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
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
                this.getBalanceList();
            },
            //查询列表
            getBalanceList() {
                this.listLoading = true;
                let condition = {
                    account_type:this.filters.account_type,
                    order_no: this.filters.order_no,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    cause: this.filters.cause,
                    mobile: this.filters.mobile,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    condition: condition
                };
                money_api.balanceList(params).then((res) => {
                    if(res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.datas = datas.items;
                        this.pager.total = datas.total;
                    }else{
                        if(res.data.status == 401){
                            // this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                    this.listLoading = false;
                });
            },
            exportExcel() {

                let condition = {
                    account_type:this.filters.account_type,
                    order_no: this.filters.order_no,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    cause: this.filters.cause,
                    mobile: this.filters.mobile,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    /*page_size: this.pager.page_size,
                    page_no: this.pager.page_no,*/
                    condition: condition
                };
                money_api.balanceExport(params).then((res) => {
                    if (res.status === 200) {
                        fileDownload(res, this);
                    } else {
                        if (res.data.status == 401) {
                            // this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                }).catch((e) => {
                    this.$message({
                        type: 'info',
                        message: e.message
                    });
                });
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.options.balance_cause =dict.account_balance_cause
                this.filters.start_time="";
                this.filters.end_time="";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getBalanceList();
            },
            causeFormatter(row, column){
                return this.options.balance_cause[row.cause];
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData()
                this.getBalanceList();

            })
        }

    }
</script>