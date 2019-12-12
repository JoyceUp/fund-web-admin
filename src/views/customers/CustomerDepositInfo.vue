<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="order_no">
                    <el-input placeholder="订单号" v-model="filters.order_no"></el-input>
                </el-form-item>
                <el-form-item prop="product_name">
                    <el-input placeholder="产品名称" v-model="filters.product_name"></el-input>
                </el-form-item>
                <el-form-item prop="order_state">
                    <el-select placeholder="状态" v-model="filters.order_state">
                        <el-option :key="item.value" :label="item.key" :value="item.value" v-for="item in orderStateOptions" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="cause">
                    <el-select placeholder="入金类型" v-model="filters.cause">
                        <el-option :key="item.value" :label="item.key" :value="item.value" v-for="item in causeOptions" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="data_range">
                    <el-date-picker v-model="filters.data_range" type="daterange" range-separator="至"
                          start-placeholder="创建时间" end-placeholder="创建时间"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">清空</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="items" stripe v-loading="listLoading" style="width: 100%"  size="small">
            <el-table-column type="index" width="50" label=" ">&nbsp;</el-table-column>
            <el-table-column prop="order_no" label="订单号"> </el-table-column>
            <el-table-column label="申请金额(元)">
                <template slot-scope="scope">{{centToDollar(scope.row.amount)}}</template>
            </el-table-column>
            <el-table-column label="入金类型">
                <template slot-scope="scope">
                    <span>{{ causeMapOptions[scope.row.cause] }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称"> </el-table-column>
            <el-table-column label="支付金额(元)">
                <template slot-scope="scope">{{centToDollar(scope.row.pay_amount)}}</template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ orderStateMapOptions[scope.row.order_status] }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="gmt_create" label="创建时间"> </el-table-column>
            <el-table-column prop="gmt_modified" label="更新时间"> </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

        <el-table :data="statistics" style="width: 100%" stripe>
            <el-table-column prop="a" label="统计"></el-table-column>
            <el-table-column prop="b"></el-table-column>
            <el-table-column prop="total_amount"></el-table-column>
            <el-table-column prop="submitted_amount"></el-table-column>
            <el-table-column prop="finished_amount"></el-table-column>
        </el-table>



    </section>
</template>
<script>
    import {getCustomersDepositList} from '../../api/customers_api';
    import dict from '../../common/js/dict';
    import {isNull,centToDollar,trimBlank} from '../../common/js/commons';
    import {formatDate} from '../../common/js/date';

    export default {
        data() {
            return {
                order_column: "",
                order_by: "",
                listLoading:false,
                items: [],
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                filters: {
                    order_no: '',  //订单号
                    product_name: '',//产品名称
                    order_state: '',     //状态
                    cause: '',      //入金类型
                    data_range:''  //时间范围
                },
                statistics: [], //统计
                stateOptions: dict.account_state,
                accountTypeOptions: dict.account_type,
                causeOptions: dict.funds_cause,
                orderStateOptions: dict.funds_order_status,
                //列表应用
                orderStateMapOptions: dict.funds_order_status_map,
                causeMapOptions: dict.cause
            }
        },
        methods: {
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
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getItems();
            },
            getItems(num) {
                this.listLoading=true;
                if(num){
                    this.pager.currentPage = 1;
                }
                let flag = false;
                if(this.filters.data_range == '' || this.filters.data_range == null){
                    flag = true;
                }
                let condition = {
                    customer_id: this.$route.params.id,
                    order_no: trimBlank(this.filters.order_no),  //订单号
                    product_name: trimBlank(this.filters.product_name),
                    order_state: this.filters.order_state,     //状态
                    cause: this.filters.cause,
                    start_time: flag ?'':formatDate(this.filters.data_range[0], "yyyy-MM-dd") + ' 00:00:00',
                    end_time: flag ?'':formatDate(this.filters.data_range[1], "yyyy-MM-dd") + ' 23:59:59'
                };
                let params = {
                    condition: condition,
                    order_column: "",
                    order_by: "",
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage
                };
                getCustomersDepositList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {
                        this.listLoading = false;
                        if(result != null){
                            this.items = result.items;
                            this.getStatistics(result.deposit_statistics);  //统计数据传递
                            this.pager.total = result.total;
                        }
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getItems(1);
            },
            getStatistics(result){
                var statistics_temp= [];
                var obj = {}; obj.a = '';obj.b = '';obj.total_amount = '全部';obj.submitted_amount = '已提交';obj.finished_amount = '已完成';
                statistics_temp[0] = obj;
                var obj = {}; obj.a = '网上入金';obj.b = '申请金额（元）';obj.total_amount = result!=null ? this.centToDollar(result.total_amount) : 0;
                obj.submitted_amount = result!=null ? this.centToDollar(result.submitted_amount) : 0;obj.finished_amount = result!=null ? this.centToDollar(result.finished_amount) : 0;
                statistics_temp[1] = obj;
                var obj = {}; obj.a = '';obj.b = '支付金额（元）';obj.total_amount = result!=null ? this.centToDollar(result.total_pay_amount) : 0;
                obj.submitted_amount = result!=null ? this.centToDollar(result.submitted_pay_amount) : 0;obj.finished_amount = result!=null ? this.centToDollar(result.finished_pay_amount) : 0;
                statistics_temp[2] = obj;
                this.statistics = statistics_temp;
            },
            changeStatus(row,options){
                let val = '';
                options.forEach((item)=>{
                    if(item.value == row){
                        val = item.key;
                    }
                });
                return val;
            },
            isNull(val){
                return isNull(val);
            },centToDollar(val){
                return centToDollar(val);
            },
        },
        mounted()
        {
            this.$nextTick(function(){
                this.getItems();
                // this.getStatistics();
            })
        }
    }
</script>
<style lang="scss" scoped>
 /*   .el-row1 {
        color: white;
        margin: 8px 0;
        border-radius: 4px;
    }*/
    .row-bg {
        padding: 10px 0px;
        background-color: #d3dce6;
        padding: 10px 20px;
    }

    .grid-content {

        min-height: 36px;
        border:#d3dce6 1px solid;
        line-height: 20px;
    }
</style>
