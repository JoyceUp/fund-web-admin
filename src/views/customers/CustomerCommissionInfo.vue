<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <!--<el-form-item prop="customer_no">-->
                    <!--<el-input placeholder="客户编号" v-model="filters.customer_no"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="customer_name">-->
                    <!--<el-input placeholder="客户姓名" v-model="filters.customer_name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item prop="mobile">-->
                    <!--<el-input placeholder="手机号码" v-model="filters.mobile"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item prop="type">
                    <el-select placeholder="数据" v-model="filters.type">
                        <el-option key="1" label="老版佣金数据" value="1"></el-option>
                        <el-option key="2" label="新版佣金数据" value="2"></el-option>
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


        <el-table :data="items" stripe style="width: 100%"  size="small">
            <el-table-column type="index" width="50" label=" ">&nbsp;</el-table-column>
            <el-table-column prop="gmt_create" label="创建时间"></el-table-column>
            <el-table-column label="佣金金额(元)"><template slot-scope="scope"><span>{{ centToDollar(scope.row.difference) }}</span></template></el-table-column>
        </el-table>
        <el-row :gutter="20" >
            <el-col><div class="div_c">总计(元): <span style="padding-left: 20px">{{showFloat(total_amount)}}</span></div></el-col>
        </el-row>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

    </section>
</template>
<script>
    import {getCustomersCommissionList} from '../../api/customers_api';
    import dict from '../../common/js/dict';
    import {isNull,centToDollar} from '../../common/js/commons';
    import {formatDate} from '../../common/js/date';

    export default {
        data() {
            return {
                listLoading:false,
                items: [],
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                filters: {
                    type:"2",
                    // customer_no: '',  //客户编号
                    // customer_name: '',//客户姓名
                    // mobile: '',       //手机号码
                    data_range:''     //时间范围
                },
                total_amount: 10000.00,
                stateOptions: dict.account_state,
                accountTypeOptions: dict.account_type
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
                this.listLoading = true;
                if(num){
                    this.pager.currentPage = 1;
                }
                let flag = false;
                if(this.filters.data_range == '' || this.filters.data_range == null){
                    flag = true;
                }
                let condition = {
                    type:this.filters.type,
                    customer_id: this.$route.params.id,
                    // customer_no: this.filters.customer_no,
                    // customer_name: this.filters.customer_name,
                    // mobile: this.filters.mobile,
                    start_time: flag ?'':formatDate(this.filters.data_range[0], "yyyy-MM-dd") + ' 00:00:00',
                    end_time: flag ?'':formatDate(this.filters.data_range[1], "yyyy-MM-dd") + ' 23:59:59'
                };
                let params = {
                    condition: condition,
                    "order_column": "",
                    "order_by": "",
                    "page_size": this.pager.pageSize,
                    "page_no": this.pager.currentPage,
                };
                getCustomersCommissionList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {
                        this.listLoading = false;
                        if(result != null){
                            this.items = result.items;
                            this.total_amount = result.total_amount!=null?result.total_amount:0;
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
            },
            centToDollar(val){
                return centToDollar(val);
            },
            showFloat(val){
                return centToDollar(val);
            }
        },
        mounted()
        {
            this.$nextTick(function(){
                this.getItems(1);
            })
        }
    }
</script>
<style lang="scss" scoped>
    .el-row {
        text-align: right;
    }
    .el-row {
        margin-bottom: 2px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .div_c {
        margin-right: 120px;
        margin-top: 10px;
        line-height: 50px;
        font-size: 14px
    }

</style>
