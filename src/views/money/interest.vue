<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">

            <el-form :inline="true" :model="filters" ref="filters"  size="medium">
                <el-form-item prop="type">
                    <el-select placeholder="类型" v-model="filters.type">
                        <el-option key="1" label="活期利息" value="1"></el-option>
                        <el-option key="2" label="定期利息" value="2"></el-option>
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
                                :picker-options="pickerOptions2"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间" end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"  @click="getInterestList">查询</el-button>
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
            <el-table-column width="160"
                    prop="gmt_create"
                    label="创建时间">
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
                    prop="product_name"
                    label="产品名称">
            </el-table-column>
            <el-table-column
                    prop="rate"
                    label="预期年化利率（%）" :formatter="centToPerCent">
            </el-table-column>
            <el-table-column
                    prop="difference"
                    label="利息金额（元）" :formatter="centToDollar">
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

    </section>


</template>

<script>
    import * as money_api from '../../api/money_api.js';
    import {fileDownload} from '../../common/js/download';
    import * as date from "../../common/js/date";
    import {centToDollar,centToPerCent,getNowFormatDate,pickerOptions2} from '../../common/js/commons';

    export default {
        props:["params","request_type"],
        data() {
            return {
                pickerOptions2:pickerOptions2,
                clearable:false,
                listLoading :false,
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
                    type:"1",
                    customer_name: '',
                    customer_no: '',
                    identity_no: '',
                    mobile: '',
                    start_time: '',
                    end_time: '',
                    createDate: ''
                }
            }
        },
        methods: {
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
                this.getInterestList();
            },
            //查询列表
            getInterestList() {
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
                money_api.interestList(params).then((res) => {
                    if(res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);

                        money_api.interestSum(params).then((res)=>{
                            this.total_amount = JSON.parse(res.data.datas).total_amount;
                        })

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
                money_api.interestExport(params).then((res) => {
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
                this.filters.start_time="";
                this.filters.end_time="";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getInterestList();
            },
            centToPerCent(row, column){
                return centToPerCent(row.rate);
            },
            centToDollar(row, column){
                return centToDollar(row.difference);
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
                this.getInterestList();
            })
        }

    }
</script>