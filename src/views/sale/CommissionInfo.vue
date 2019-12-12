<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="data_range">
                    <el-date-picker v-model="filters.data_range" type="daterange" range-separator="至" start-placeholder="创建时间"
                                    end-placeholder="创建时间"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetSearch('filters')">清空</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--提成信息-->
        <el-table :header-row-style="headerRowStyle" :data="items" stripe v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="change_time" align="center" label="创建时间"></el-table-column>
            <el-table-column align="center" label="提成金额"><template slot-scope="scope">   <span>{{showFloat(scope.row.difference)}} </span></template></el-table-column>
        </el-table>
        <el-row :gutter="20" >
            <el-col><div class="div_c">合计(元): <span style="padding-left: 20px">{{showFloat(total_amount)}}</span></div></el-col>
        </el-row>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>

        </el-col>

    </section>
</template>

<script>
    import {getCommissionInfoList} from '../../api/sale_api';
    import {formatDate} from '../../common/js/date';
    import {centToDollar} from "../../common/js/commons";

    export default {
        props: ["sale_id"],
        data() {
            return {
                listLoading :false,
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color: "#333",
                    textAlign: "center"
                },
                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                //搜索条件
                filters: {
                    data_range:''      //时间范围
                },
                //客户信息
                items: [],
                total_amount: 0,
            }
        },
        methods: {
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.getItems();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.getItems();
            },
            // 显示客户列表
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
                    sales_id: this.$route.params.id,
                    start_time : flag ?'':formatDate(this.filters.data_range[0], "yyyy-MM-dd") + ' 00:00:00',
                    end_time: flag ?'':formatDate(this.filters.data_range[1], "yyyy-MM-dd") + ' 23:59:59'
                };
                let params = {
                    "page_size": this.pager.pageSize,
                    "page_no": this.pager.currentPage,
                    "order_column": "",
                    "order_by": "",
                    condition: condition
                };

                getCommissionInfoList(params).then((res) => {

                    if (res.data.status == 200) {
                        this.listLoading = false;
                        let data = JSON.parse(res.data.datas);
                        if(data != null){
                            this.items = data.items;
                            this.total_amount = data.reward_statistics!=null?data.reward_statistics.total_amount:0;
                            this.pager.total = data.total;
                        }
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },
            //页面初始化，显示当前销售的基本信息
            initData() {
                this.getItems(1);
            },
            showFloat(val){
                return centToDollar(val);
            },
            resetSearch(formName) {
                this.$refs[formName].resetFields();
                this.getItems(1);
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style scoped>
    .el-row {
        text-align: right;
    }
    .div_c {
        margin-right: 120px;
        margin-top: 10px;
        line-height: 50px;
        font-size: 14px
    }
</style>