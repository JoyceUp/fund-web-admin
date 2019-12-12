<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">

            <el-form :inline="true" :model="filters" ref="filters" size="medium">
                <el-form-item prop="order_no">
                    <el-input
                            placeholder="订单号"
                            v-model.trim="filters.order_no">
                    </el-input>
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
                <el-form-item prop="order_state">
                    <el-select placeholder="订单状态" v-model="filters.order_state" clearable="">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.deposit_order_state"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="fund_type">
                    <el-select placeholder="资金类型" v-model="filters.cause" clearable="">
                        <el-option :key="item.value" :label="item.key" :value="item.value" v-for="item in causeOptions" ></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions2"
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getDepositList" size="small">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetSearch('filters')" size="small">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="exportExcel" size="small">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--数据列表-->
        <el-table
                :data="datas"
                @sort-change="handleSortChange"

                stripe
                v-loading="listLoading"
                style="width: 100%">
              <el-table-column
                      prop="order_no"
                      label="订单号">
              </el-table-column>
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
                    prop="amount"
                    sortable="custom"
                             :formatter="cent2dollar"
                    label="申请金额（元）">
            </el-table-column>
            <el-table-column
                    prop="cause"
                    :formatter="causeFormatter"
                    label="资金类型">
            </el-table-column>
            <el-table-column
                    prop="product_name"
                    label="产品名称">
            </el-table-column>
            <el-table-column width="120"
                    prop="pay_amount"
                    :formatter="cent2dollar"
                    label="支付金额（元）">
            </el-table-column>
            <el-table-column
                    prop="order_state"
                    :formatter="statusFormatter"
                    label="状态">
            </el-table-column>
            <el-table-column width="160"
                    prop="gmt_create"
                    label="创建时间">
            </el-table-column>
             <el-table-column width="160"
                     prop="gmt_modified"
                     label="更新时间">
             </el-table-column>
            <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                    <el-button size="mini"
                               @click="depositDetails(scope.row.id)">查看
                    </el-button>
                </template>
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

        <!-- 入金统计 -->

        <el-col class="money-total">
            <el-col :span="8"><div class="grid-content bg-purple">&nbsp;</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple total_amount">申请金额总计：<span>{{ this.total_amount | moneyFormat }}</span> 元</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple"> </div></el-col>
        </el-col>

        <!-- 入金详情 -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.dialogFormVisible" :before-close="resetDialogData">
            <el-tabs type="border-card" >
                <el-tab-pane>
                    <span slot="label"><i ></i> 入金详情</span>
                    <el-form :model="dialog.dialogData" ref="userFormRef" :label-width="dialog.formLabelWidth">
                        <el-form-item label="订单号：">
                            <span>{{ dialog.dialogData.order_no }}</span>
                        </el-form-item>
                        <el-form-item label="客户编号：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_no }}</span>
                        </el-form-item>
                        <el-form-item label="客户姓名：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_name }}</span>
                        </el-form-item>
                        <el-form-item label="证件类型：" :label-width="dialog.formLabelWidth">
                            <span>{{ identityType(dialog.dialogData.customer_identity_type) }}</span>
                        </el-form-item>
                        <el-form-item label="证件号码：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_identity_no }}</span>
                        </el-form-item>
                        <el-form-item label="手机号码：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_mobile }}</span>
                        </el-form-item>
                        <el-form-item label="产品名称：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.product_name }}</span>
                        </el-form-item>

                        <el-form-item label="资金类型：" :label-width="dialog.formLabelWidth">
                            <span>{{ options.cause[dialog.dialogData.cause] }}</span>
                        </el-form-item>
                        <el-form-item label="申请金额：" :label-width="dialog.formLabelWidth">
                            <span>{{ cent2dollar(dialog.dialogData.amount) }}</span>
                        </el-form-item>
                        <el-form-item label="支付金额：" :label-width="dialog.formLabelWidth">
                            <span>{{ cent2dollar(dialog.dialogData.pay_amount) }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.gmt_create }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.gmt_modified }}</span>
                        </el-form-item>
                        <el-form-item label="当前状态：" :label-width="dialog.formLabelWidth">
                            <span>{{options.order_state[dialog.dialogData.order_state ] }}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="resetDialogData">取 消</el-button>-->
            </div>
        </el-dialog>

        <!-- 统计列表 -->

    </section>


</template>

<script>
    import * as money_api from '../../api/money_api.js';
    import dict from '../../common/js/dict';
    import {fileDownload} from '../../common/js/download';
    import * as date from "../../common/js/date"
    import {centToDollar,getNowFormatDate,pickerOptions2} from "../../common/js/commons"

    export default {
        props: ["params"],
        data() {
            return {
                pickerOptions2:pickerOptions2,
                clearable:false,
                listLoading: false,
                statistics: {},     //统计
                causeOptions: dict.funds_cause,
                options: {
                    cause: dict.cause,
                    order_state: dict.order_state,
                    deposit_order_state: dict.deposit_order_state,
                    identity_type_map: dict.identity_type_map
                },
                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                datas: [],
                total_amount:"",
                filters: {
                    fund_type:"",
                    order_no: '',
                    customer_no: '',
                    customer_name: '',
                    identity_no: '',
                    mobile: '',
                    cause: '',
                    order_state: '',
                    start_time: '',
                    end_time: '',
                    createDate: ''
                },
                dialog: {
                    title: "查看详情",
                    dialogFormVisible: false,
                    dialogData: {},
                    formLabelWidth: '150px',
                    formInputWidth: '80px'
                }
            }
        },
        methods: {
            handleSortChange(column, prop, order){
                console.log(column)
                console.log(prop)
                console.log(order)
            },
            initData(){
                let now = getNowFormatDate()
                this.filters.createDate=[now,now]
                this.handleCreateDateChange(this.filters.createDate)
            },
            identityType(key){
                return this.options.identity_type_map[key];
            },
            //美分变美元
            cent2dollar(row, column) {
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
                this.getDepositList();
            },
            //查询列表
            getDepositList() {
                this.listLoading = true;
                let condition = {
                    cause:this.filters.cause,
                    order_no: this.filters.order_no,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
//                    cause: this.filters.cause,
                    order_state: this.filters.order_state,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    condition: condition
                };

                money_api.depositList(params).then((res) => {
                    if (res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.datas = datas.items;
                        this.total_amount = datas.deposit_statistics.total_amount;
                        this.pager.total = datas.total;
                    } else {
                        if (res.data.status == 401) {
                            // this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                    this.listLoading = false;
                });
            },
            depositDetails(id) {
                let params = {
                    order_id: id
                };
                money_api.depositDetails(params).then((res) => {
                    if (res.data.status === 200) {
                        let row = JSON.parse(res.data.datas);
                        this.dialog.dialogFormVisible = true;
                        this.dialog.dialogData = row;
                    } else {
                        if (res.data.status == 401) {
                            // this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                });
            },
            exportExcel() {

                let condition = {
                    order_no: this.filters.order_no,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
                    cause: this.filters.cause,
                    order_state: this.filters.order_state,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    /*page_size: this.pager.page_size,
                    page_no: this.pager.page_no,*/
                    condition: condition
                };

                money_api.depositExport(params).then((res) => {
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
                this.filters.cause=""
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getDepositList();
            },
            resetDialogData() {       //重置 表单
                this.dialog.dialogFormVisible = false;
            },
            causeFormatter(row, column){

                return dict.cause[row.cause];
            },
            statusFormatter(row, column) {
                return dict.deposit_order_state[row.order_state];
            },

        },
        mounted() {
            this.$nextTick(function () {
                this.initData()
                this.getDepositList();

            })
        }
    }
</script>

<style lang="scss">
    .el-button {
        /*margin: 4px !important*/
    }
    .el-table .cell
    {
        padding-left:5px!important;
        padding-right:5px!important;
    }
    .total_amount{
        line-height: 50px;
        font-size:16px;
        text-align: center;
    }
    .total_amount span{ 
        font-size:20px;
        color: #F56C6C;
    }

</style>