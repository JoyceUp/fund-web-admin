<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">

            <el-form :inline="true" :model="filters" ref="filters" size="medium">

                <el-form-item prop="type">
                    <el-select placeholder="数据" v-model="filters.type">
                        <el-option key="1" label="老版佣金数据" value="1"></el-option>
                        <el-option key="2" label="新版佣金数据" value="2"></el-option>
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
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                :picker-options="pickerOptions2"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="getCommissionList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="resetSearch('filters')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--数据列表-->
        <el-table
                stripe
                v-loading="listLoading"
                :data="datas"
                style="width: 100%">
            <el-table-column width="160"
                    prop="gmt_create"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="customer_no"
                    label="客户编号">
            </el-table-column>
            <el-table-column
                    label="客户姓名">
                <template slot-scope="scope">
                    <el-button type="text"
                               @click="showCommissionDetails(scope.row.id)">{{scope.row.customer_name}}
                    </el-button>
                </template>
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
                    prop="product_name"
                    label="产品名称">
            </el-table-column>
            <el-table-column
                    prop="commission_percentage"
                    label="佣金比例（%）" :formatter="cent2PerCent">
            </el-table-column>
            <el-table-column
                    prop="difference"
                    label="佣金金额（元）" :formatter="cent2dollar">
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
            <el-col :span="8"><div class="grid-content bg-purple total_amount">金额总计：<span>{{ this.total_amount | moneyFormat }}</span> 元</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple"> </div></el-col>
        </el-col>

        <!-- 佣金详情 -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.dialogFormVisible" :before-close="resetDialogData">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i ></i> 佣金明细</span>

                    <el-table
                            stripe
                            v-loading="listLoading"
                            :data="dialog.dialogData"
                            style="width: 100%">
                        <el-table-column
                                prop="child_customer_no"
                                label="客户编号">
                        </el-table-column>
                        <el-table-column
                                prop="child_customer_name"
                                label="客户姓名">
                        </el-table-column>
                        <el-table-column
                                prop="child_customer_interest"
                                :formatter="cent2dollar"
                                label="利息金额（元）">
                        </el-table-column>
                        <el-table-column
                                prop="commission"
                                :formatter="cent2dollar"
                                label="佣金金额（元）">
                        </el-table-column>
                    </el-table>

                    <el-col :span="24" class="toolbar">
                        <!--分页-->
                        <el-pagination
                                style="text-align: center;"
                                @size-change="handleDlgSizeChange"
                                @current-change="handleDlgCurrentChange"
                                :page-size="dialog.dialogPager.page_size"
                                :page-sizes="dialog.dialogPager.sizes"
                                background
                                :current-page="dialog.dialogPager.page_no"
                                layout="prev,pager,next,sizes,total"
                                :total="dialog.dialogPager.total">
                        </el-pagination>
                    </el-col>
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
    import {fileDownload} from '../../common/js/download';
    import * as date from "../../common/js/date"
    import {centToDollar,centToPerCent,getNowFormatDate,pickerOptions2} from '../../common/js/commons';

    export default {
        props: ["params", "request_type"],
        data() {
            return {
                pickerOptions2:pickerOptions2,
                clearable:false,
                listLoading: false,
                statistics: {},     //统计
                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                datas: [],
                total_amount:'',
                filters: {
                    type:"2",
                    customer_name: '',
                    customer_no: '',
                    identity_no: '',
                    mobile: '',
                    start_time: '',
                    end_time: '',
                    createDate: ''
                },
                dialog: {
                    title: "查看详情",
                    dialogFormVisible: false,
                    dialogData: [],
                    id: "",
                    formLabelWidth: '150px',
                    formInputWidth: '80px',
                    dialogPager: {
                        sizes: [10, 20, 30, 40, 50],
                        total: 0,
                        page_size: 10,
                        page_no: 1
                    }
                }
            }
        },
        methods: {
            cent2PerCent(row, column){
                if (column) {
                    return centToPerCent(row[column.property]);
                }
                return centToPerCent(row);
            },
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
                this.getCommissionList();
            },

            //查询列表
            getCommissionList() {
                this.listLoading = true;
                let condition = {
                    type:this.filters.type,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    condition: condition
                };
                money_api.commissionList(params).then((res) => {
                    if (res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);
                        money_api.commissionSum(params).then((res)=>{
                            this.total_amount = JSON.parse(res.data.datas).total_amount;
                        })
                        this.datas = datas.items;
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


            //分页page_size发生改变
            handleDlgSizeChange(val) {
                this.dialog.dialogPager.page_no = 1;
                this.dialog.dialogPager.page_size = val;
                this.handleDlgPagerChange();
            },
            //page_no
            handleDlgCurrentChange(val) {
                this.dialog.dialogPager.page_no = val;
                this.handleDlgPagerChange();
            },
            //分页引起的页面数据更改
            handleDlgPagerChange() {
                this.getCommissionDetails();
            },
            showCommissionDetails(id){
                this.dialog.dialogPager.id = id;
                this.getCommissionDetails();
                this.dialog.dialogFormVisible = true;
            },
            //查询详情
            getCommissionDetails() {
                let params = {
                    condition:{
                        type:this.filters.type,
                    },

                    id: this.dialog.dialogPager.id,
                    page_size: this.dialog.dialogPager.page_size,
                    page_no: this.dialog.dialogPager.page_no
                };
                money_api.commissionDetails(params).then((res) => {
                    if (res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.dialog.dialogData = datas.items;
                        this.dialog.dialogPager.total = datas.total;
                    } else {
                        if (res.data.status == 401) {
                            // this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                });
            },
            resetDialogData() {       //重置 表单
                this.dialog.dialogFormVisible = false;
                this.dialog.dialogPager.page_no = 1;
                this.dialog.dialogData = [];
                this.dialog.dialogPager.id = "";
            },
            exportExcel() {

                let condition = {
                    type:this.filters.type,
                    customer_no: this.filters.customer_no,
                    customer_name: this.filters.customer_name,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };

                let params = {
                    /*page_size: this.pager.page_size,
                    page_no: this.pager.page_no,*/
                    condition: condition
                };
                money_api.commissionExport(params).then((res) => {
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
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getCommissionList();
            },
            initData(){
                let now = getNowFormatDate()
                this.filters.createDate=[now,now]
                this.handleCreateDateChange(this.filters.createDate)
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData()
                this.getCommissionList();
            })
        }

    }
</script>