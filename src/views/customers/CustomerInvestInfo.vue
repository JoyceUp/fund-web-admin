<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">

            <el-form :inline="true" :model="filters" ref="filters"  size="medium">
                <el-form-item prop="order_no">
                    <el-input placeholder="订单号" v-model="filters.order_no"></el-input>
                </el-form-item>
                <el-form-item prop="product_name">
                    <el-input placeholder="产品名称" v-model="filters.product_name"></el-input>
                </el-form-item>
                <el-form-item prop="invest_state">
                    <el-select placeholder="状态" v-model="filters.invest_state">
                        <el-option :key="item.value" :label="item.key" :value="item.value" v-for="item in orderStateOptions" ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间" end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small"  @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"  @click="resetSearch('filters')">重置</el-button>
                </el-form-item>
               <!-- <el-form-item>
                    <el-button type="primary" size="small"  @click="exportExcel">导出</el-button>
                </el-form-item>-->
            </el-form>
        </el-col>

        <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
        <!--数据列表-->
        <el-table stripe v-loading="listLoading" :data="datas" style="width: 100%">
            <el-table-column type="index" width="50" label=" ">&nbsp;</el-table-column>
            <el-table-column prop="order_no" label="订单号"></el-table-column>
            <el-table-column prop="amount" label="申请金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.amount / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称"></el-table-column>
            <el-table-column prop="pay_amount" label="支付金额（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_amount / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态"><template slot-scope="scope"><span>{{ orderPayTypes[scope.row.invest_state] }}</span></template></el-table-column>
            <el-table-column width="160" prop="gmt_create" label="创建时间"></el-table-column>
            <el-table-column width="160" prop="gmt_modified" label="更新时间"></el-table-column>
            <el-table-column width="160" prop="insurance_path" label="保险合同">
                <template slot-scope="scope">
                    <span><a href="javascript:;" v-if="scope.row.insurance_path != null" @click="clickImg(scope.row.insurance_path)" :src=" scope.row.insurance_path ">阳光保险</a></span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-upload

                            class="upload-demo"
                            action="/common/upload"
                            :on-success="handleUploadSuccess"
                            accept=".jpg,.png,.jpeg"
                            multiple
                            :show-file-list="false"

                           >
                        <el-button size="small" type="primary"  @click="setUploadId(scope.row.id)" v-if="scope.row.insurance_path != null">重新上传{{scope.row.product}}</el-button>
                        <el-button size="small" type="primary"  @click="setUploadId(scope.row.id)" v-if="scope.row.insurance_path == null">上传合同</el-button>

                    </el-upload>

                </template>
            </el-table-column>
        </el-table>


        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--分页-->
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

        <!-- 统计列表 -->

    </section>


</template>

<script>
    import {getCustomersInvestList,updateContract} from '../../api/customers_api';
    import dict from '../../common/js/dict';
    import {fileDownload} from '../../common/js/download';
    import * as date from "../../common/js/date"
    import {centToDollar , trimBlank} from "../../common/js/commons"
    import BigImg from '../common/BigImg.vue';
    export default {
        components: {
            'big-img':BigImg
        },
        props:["params"],
        data() {
            return {
                showImg:false,
                imgSrc: '',
                clearable:false,
                listLoading :false,
                statistics: {},     //统计
                uploadId:"",
                options: {
                    cause:dict.balance_cause
                },
                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                datas: [],
                filters: {
                    order_id: '',
                    customer_id: '',
                    product_name:'',
                    invest_state:'',
                    start_time: '',
                    end_time: '',
                    createDate: ''
                },
                orderPay:dict.order_pay,
                orderPayTypes: dict.order_invest_pay_status,
                orderStateOptions: dict.order_invest_status,
                orderPayType: dict.funds_cause,
            }
        },
        methods: {
            // changeNoticeState(index, row, state) {
            //     let paras = {
            //         state:state,
            //         id:row
            //     };
            //     let msg = state == 2 ? "确认执行该操作？" : "确认执行该操作？"
            //     this.$confirm(msg, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         API.changeNoticeState(paras).then((res) => {
            //             if (res.data.status == 200) {
            //                 this.$message({
            //                     type: 'success',
            //                     message: '操作成功!'
            //                 });
            //                 this.getList();
            //             } else {
            //                 this.$message({
            //                     type: 'info',
            //                     message: res.data.msg
            //                 });
            //             }
            //         })
            //     })
            // },
            //美分变美元
            clickImg(e) {
                this.showImg = true;
                // 获取当前图片地址

                this.imgSrc = e
            },
            viewImg(){
                this.showImg = false;
            },
            handleUploadSuccess(res, file) {

                this.updateContract(JSON.parse(res.datas).id)

               // this.uploadform.id = JSON.parse(res.datas).id;
            },
            setUploadId(id){

                this.uploadId=id
            },
            updateContract(id){

                let params = {
                    "id":this.uploadId,
                    "insurance_path_id":id
                }

                updateContract(params).then((res)=>{

                    if(res.status == 200){
                        this.$message({
                            message: '合同上传成功',
                            type: 'success'
                        });
                        this.getItems()
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            cent2dollar(row, column) {
                if (column) {
                    var d = centToDollar(row[column.property]);
                    if(column.property == 'difference' && d > 0){
                        return "+"+d;
                    }
                    return d;
                }
                return centToDollar(row);
            },
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
            },
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.handlePagerChange();
            },
            //page_no
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getItems(1);
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
                    "customer_id": this.$route.params.id,
                    "order_no": this.filters.order_no,
                    "product_name": this.filters.product_name,
                    "invest_state": this.filters.invest_state,     //状态
                    "pay_type": this.filters.pay_type,
                    "start_time": flag ?'':formatDate(this.filters.data_range[0], "yyyy-MM-dd") + ' 00:00:00',
                    "end_time": flag ?'':formatDate(this.filters.data_range[1], "yyyy-MM-dd") + ' 23:59:59'
                };
                let params = {
                    condition: condition,
                    "order_column": "",
                    "order_by": "",
                    "page_size": this.pager.pageSize,
                    "page_no": this.pager.currentPage,
                };
                getCustomersInvestList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {

                        this.listLoading = false;
                        if(result != null){
                            this.datas = result.items;
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
            exportExcel() {

                let condition = {
                    customer_no: this.filters.customer_no,
                    cause: this.filters.cause,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage,
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
                this.filters.start_time="";
                this.filters.end_time="";
                this.$refs[formName].resetFields();
                this.filters.currentPage = 1;
                this.getItems(1);
            },
            causeFormatter(row, column){
                return this.options.cause[row.cause];
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getItems(1);
            })
        }

    }
</script>