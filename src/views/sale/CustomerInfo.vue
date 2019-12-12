<template>
    <section>
        <!--客户列表-->
        <el-table :header-row-style="headerRowStyle" :data="items" stripe v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="gmt_create" align="center" label="注册时间"> </el-table-column>
            <el-table-column align="center" prop="customer_no" label="客户编号"> </el-table-column>
            <el-table-column align="center" prop="name" label="客户姓名"> </el-table-column>
            <el-table-column prop="identity_no" align="center" label="证件号码"> </el-table-column>
            <el-table-column prop="identity_type" align="center" label="证件类型" :formatter="identityTypeFormatter"> </el-table-column>
            <el-table-column prop="mobile" align="center" label="手机号码"> </el-table-column>
            <el-table-column prop="total_asset" align="center" label="资产总额(元)" :formatter="centToDollar"> </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.pageSize"
                    :page-sizes="pager.sizes" background :current-page="pager.currentPage" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>

        </el-col>

    </section>
</template>

<script>
//    import * as api from '../../api/sale'
    import {getCustomerInfoList} from '../../api/sale_api';
    import {centToDollar} from '../../common/js/commons';
    import dict from '../../common/js/dict';

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
                //客户信息
                items: [],
                identityTypeOptionsMap: dict.identity_type_map
            }
        },
        methods: {
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.showCustomerInfo();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.showCustomerInfo();
            },
            // 显示客户列表
            showCustomerInfo(num) {
                this.listLoading = true;
                if(num){
                    this.pager.currentPage = 1;
                }
                let condition = {
                    sales_id: this.$route.params.id,
                };
                let params = {
                    "page_size": this.pager.pageSize,
                    "page_no": this.pager.currentPage,
                    "order_column": "",
                    "order_by": "",
                    condition: condition
                };

                getCustomerInfoList(params).then((res) => {

                    if (res.data.status == 200) {
                        this.listLoading = false;
                        let data = JSON.parse(res.data.datas);
                        this.items = data.items;
                        this.pager.total = data.total;
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
                this.showCustomerInfo();
            },
            centToDollar(row, column) {
                if (column) {
                    return centToDollar(row[column.property]);
                }
                return centToDollar(row);
            },
            identityTypeFormatter(row, column){
                if (column) {
                    return this.identityTypeOptionsMap[row[column.property]];
                }
                return this.identityTypeOptionsMap[row];
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style scoped>

</style>