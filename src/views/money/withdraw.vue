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
                <el-form-item prop="customer_name">
                    <el-input
                            placeholder="客户姓名"
                            v-model.trim="filters.customer_name">
                    </el-input>
                </el-form-item>
                <el-form-item prop="customer_no">
                    <el-input
                            placeholder="客户编号"
                            v-model.trim="filters.customer_no">
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
                    <el-select placeholder="订单状态" v-model="filters.order_state">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.withdraw_order_state"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="card_no">
                    <el-input
                            placeholder="银行卡号"
                            v-model.trim="filters.card_no">
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
                    <el-button type="primary" size="small" @click="getWithdrawList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="resetSearch('filters')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" v-if="roleDisplay.approveDisplay"
                               @click="withdrawApproveBatch">批量处理
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" v-if="roleDisplay.doneDisplay" @click="withdrawDoneBatch">
                        批量完成
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!--数据列表-->
        <el-table
                stripe
                v-loading="listLoading"
                :data="datas"
                @selection-change="handleSelectionChange"
                style="width: 100%">
            <el-table-column
                    type="selection"
                    align="center">
            </el-table-column>
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
                    prop="cause"
                    :formatter="causeTypeFormatter"
                    label="出金方式">
            </el-table-column>
            <el-table-column
                    prop="card_no"
                    label="银行卡号">
            </el-table-column>
            <el-table-column
                    prop="customer_identity_no"
                    label="证件号码">
            </el-table-column>
            <el-table-column
                    prop="customer_mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    :formatter="cent2dollar"
                    label="申请金额（元）">
            </el-table-column>
            <el-table-column
                    prop="pay_amount"
                    :formatter="cent2dollar"
                    label="支付金额（元）">
            </el-table-column>
            <el-table-column
                    prop="poundage"
                    :formatter="cent2dollar"
                    label="手续费">
            </el-table-column>
            <el-table-column
                    prop="gmt_create"
                    label="提交时间">
            </el-table-column>
            <el-table-column
                    prop="gmt_modified"
                    :formatter="updateTimeFormatter"
                    label="更新时间">
            </el-table-column>
            <el-table-column
                    prop="order_state"
                    :formatter="statusFormatter"
                    label="状态">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini"
                               @click="withdrawDetails(scope.row.id)">查看
                    </el-button>
                    <el-button size="mini"
                               type="danger"
                               @click="withdrawApproveSingle(scope.row.id)"
                               v-if="roleDisplay.approveDisplay && scope.row.approveDisplay">处理
                    </el-button>
                    <el-button size="mini"
                               type="danger"
                               @click="withdrawDoneSingle(scope.row.id)"
                               v-if="roleDisplay.doneDisplay && scope.row.doneDisplay">完成
                    </el-button>
                    <el-button size="mini"
                               type="danger"
                               @click="withdrawIgnore(scope.row.id)"
                               v-if="roleDisplay.ignoreDisplay && scope.row.ignoreDisplay">忽略
                    </el-button>
                    <el-button size="mini"
                               type="danger"
                               @click="withdrawReturn(scope.row.id)"
                               v-if="roleDisplay.returnDisplay && scope.row.returnDisplay">银行退回
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


        <!-- 出金详情 -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.dialogFormVisible" :before-close="resetDialogData">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i ></i> 出金详情</span>
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
                            <span>{{ options.identity_type[dialog.dialogData.customer_identity_type] }}</span>
                        </el-form-item>
                        <el-form-item label="证件号码：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_identity_no }}</span>
                        </el-form-item>
                        <el-form-item label="手机号码：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.customer_mobile }}</span>
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
                        <el-form-item label="手续费：" :label-width="dialog.formLabelWidth">
                            <span>{{ cent2dollar(dialog.dialogData.poundage) }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.gmt_create }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间：" :label-width="dialog.formLabelWidth">
                            <span v-if="dialog.dialogData.order_state != 1">{{ dialog.dialogData.gmt_modified }}</span>
                        </el-form-item>
                        <el-form-item label="当前状态：" :label-width="dialog.formLabelWidth">
                            <span>{{options.order_state[dialog.dialogData.order_state ] }}</span>
                        </el-form-item>
                        <el-form-item label="开户行名称：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.bank_name }}</span>
                        </el-form-item>
                        <el-form-item label="开户行省：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.bank_province }}</span>
                        </el-form-item>
                        <el-form-item label="开户行市：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.bank_city }}</span>
                        </el-form-item>
                        <el-form-item label="开户行分行/支行：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.bank_branch_name }}</span>
                        </el-form-item>
                        <el-form-item label="转入账号：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.card_no }}</span>
                        </el-form-item>
                        <el-form-item label="处理备注：" :label-width="dialog.formLabelWidth">
                            <span>{{ dialog.dialogData.remark }}</span>
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
    import * as date from "../../common/js/date"
    import util from '../../common/js/util'
    import * as checkFields from "../../common/js/checkFields"
    import dict from '../../common/js/dict';
    import {fileDownload} from '../../common/js/download';
    import {centToDollar, centToPerCent,getNowFormatDate,pickerOptions2} from "../../common/js/commons"

    export default {
        props: ["params"],
        data() {
            return {
                pickerOptions2:pickerOptions2,
                clearable: false,
                order_ids: [],
                roleDisplay: {
                    ignoreDisplay: false,
                    returnDisplay: false,
                    approveDisplay: false,
                    doneDisplay: false
                },
                listLoading: false,
                statistics: {},     //统计
                options: {
                    identity_type: dict.identity_type_map,
                    cause: dict.cause,
                    order_state: dict.order_state,
                    withdraw_order_state: dict.withdraw_order_state
                },
                //已选中的订单，即将被修改的数据
                multipleSelection: [],
                //审核校验通过
                approveValid: true,
                //完成校验通过
                doneValid: true,
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
                    order_no: '',
                    customer_name: '',
                    customer_no: '',
                    identity_no: '',
                    mobile: '',
                    order_state: '',
                    card_no: '',
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
            //美分变美元
            cent2dollar(row, column) {
                if (column) {
                    return centToDollar(row[column.property]);
                }
                return centToDollar(row);
            },
            centToPerCent(row, column) {
                if (column) {
                    return centToPerCent(row[column.property]);
                }
                return centToPerCent(row);
            },
            //选中某些订单
            handleSelectionChange(val) {
                this.approveValid = true;
                this.doneValid = true;
                this.multipleSelection = [];
                if (val.length > 0) {
                    for (let i = 0; i < val.length; i++) {
                        this.multipleSelection.push(val[i].id);
                        this.validateRow(val[i].order_state);
                    }
                }
            },
            selectSingleItem(id) {
                this.approveValid = true;
                this.doneValid = true;
                this.multipleSelection = [];
                this.multipleSelection.push(id);
            },
            validateRow(order_state) {
                this.approveValid = (this.approveValid && order_state === 3);
                this.doneValid = (this.doneValid && order_state === 2);
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
                this.getWithdrawList();
            },
            //查询列表
            getWithdrawList() {
                this.listLoading = true;
                let condition = {
                    order_no: this.filters.order_no,
                    customer_name: this.filters.customer_name,
                    customer_no: this.filters.customer_no,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
                    order_state: this.filters.order_state,
                    card_no: this.filters.card_no,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    page_size: this.pager.page_size,
                    page_no: this.pager.page_no,
                    condition: condition
                };

                money_api.withdrawList(params).then((res) => {
                    if (res.data.status === 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.total_amount = datas.withdraw_statistics.total_amount;
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
            exportExcel() {
                let condition = {
                    order_no: this.filters.order_no,
                    customer_name: this.filters.customer_name,
                    customer_no: this.filters.customer_no,
                    identity_no: this.filters.identity_no,
                    mobile: this.filters.mobile,
                    order_state: this.filters.order_state,
                    card_no: this.filters.card_no,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time)
                };
                let params = {
                    /*page_size: this.pager.page_size,
                    page_no: this.pager.page_no,*/
                    condition: condition
                };
                money_api.withdrawExport(params).then((res) => {

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
            withdrawDetails(id) {
                let params = {
                    order_id: id
                };
                money_api.withdrawDetails(params).then((res) => {
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
            withdrawApprove() {

                if (this.approveValid === false) {
                    this.$message({
                        type: 'error',
                        message: '已选中的某些订单状态不符合操作条件'
                    });
                    return;
                }
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请至少选择一条订单'
                    });
                    return;
                }

                this.$confirm('确认处理？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,   //不通过点击遮罩关闭弹框
                    type: 'info'
                }).then(() => {

                    let params = {
                        order_ids: this.multipleSelection
                    };
                    money_api.withdrawApprove(params).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                //message: '确认成功!'
                                message: res.data.msg
                            });
                            this.getWithdrawList();
                        } else {
                            this.$message.error(res.data.msg);
                            this.getWithdrawList();
                        }

                    });
                }).catch((e) => {
                    /*this.$message({
                        type: 'info',
                        message: e.message
                    });*/
                });

            },
            withdrawApproveSingle(id) {
                this.selectSingleItem(id);
                this.withdrawApprove();
            },
            withdrawApproveBatch() {
                this.withdrawApprove();
            },
            withdrawDone() {
                if (this.doneValid === false) {
                    this.$message({
                        type: 'error',
                        message: '已选中的某些订单状态不符合操作条件'
                    });
                    return;
                }
                if (this.multipleSelection.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请至少选择一条订单'
                    });
                    return;
                }

                this.$confirm('确认处理完成？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,   //不通过点击遮罩关闭弹框
                    type: 'info'
                }).then(() => {

                    let params = {
                        order_ids: this.multipleSelection
                    };
                    money_api.withdrawDone(params).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                //message: '出金完成，邮件已发送客户、级联销售!'
                                message: res.data.msg
                            });
                            this.getWithdrawList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            });
                            this.getWithdrawList();
                        }

                    });

                }).catch(() => {
                    /*this.$message({
                        type: 'info',
                        message: e.message
                    });*/
                });

            },
            withdrawDoneSingle(id) {
                this.selectSingleItem(id);
                this.withdrawDone();
            },
            withdrawDoneBatch() {
                this.withdrawDone();
            },
            withdrawReturn(id) {
                this.$prompt('请输入退回原因（必填）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/^.{1,100}$/,
                    closeOnClickModal: false,   //不通过点击遮罩关闭弹框
                    inputErrorMessage: '请输入退回原因，1-100字'
                }).then(({value}) => {

                    let params = {
                        order_id: id,
                        remark: value
                    };
                    money_api.withdrawReturn(params).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                //message: '已成功忽略该条出金记录，邮件已发送!'
                                message: res.data.msg
                            });
                            this.getWithdrawList();
                        } else {
                            this.$message.error(res.data.msg);
                            this.getWithdrawList();
                        }
                    });

                }).catch(() => {
                    /*this.$message({
                        type: 'info',
                        message: e.message
                    });*/
                });

            },
            withdrawIgnore(id) {
                this.$prompt('请输入忽略原因（必填）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/^.{1,100}$/,
                    closeOnClickModal: false,   //不通过点击遮罩关闭弹框
                    inputErrorMessage: '请输入忽略原因，1-100字'
                }).then(({value}) => {

                    let params = {
                        order_id: id,
                        remark: value
                    };
                    money_api.withdrawIgnore(params).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                //message: '已处理完成！'
                                message: res.data.msg
                            });
                            this.getWithdrawList();
                        } else {
                            this.$message.error(res.data.msg);
                            this.getWithdrawList();
                        }
                    });


                }).catch(() => {
                    /*this.$message({
                        type: 'info',
                        message: e.message
                    });*/
                });
            },
            bankInfo(bank, column) {
                return bank[column];
            },
            resetDialogData() {       //重置 表单
                this.dialog.dialogFormVisible = false;
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getWithdrawList();
            },
            causeTypeFormatter(row, column) {
                return dict.cause[row.cause];
            },
            statusFormatter(row, column) {
                row.approveDisplay = false;
                row.doneDisplay = false;
                row.ignoreDisplay = false;
                row.returnDisplay = false;
                switch (row.order_state) {
                    case 3:
                        row.approveDisplay = true;
                        row.ignoreDisplay = true;
                        break;
                    case 2:
                        row.doneDisplay = true;
                        row.ignoreDisplay = true;
                        break;
                    case 204:
                        row.returnDisplay = true;
                        break;
                }
                return dict.order_state[row.order_state];
            },
            updateTimeFormatter(row, column) {
                switch (row.order_state) {
                    case 1:
                        return '';
                    default:
                        return row[column.property];
                }
            },
            setRoleDidsplay() {
                console.log("set Role start ...")
               let user = this.$store.getters.getUserInfo;
                let role_name ="";
                role_name = user.role_name;
                console.log(user)
                if(!role_name){
                    console.log("no role_name")
                    let user = JSON.parse(util.cookieMethod.getCookie('user'))
                    role_name = user.role_name;
                }




            /*    if (!role_name) {
                    role_name = "";
                }*/
                console.log(user)
                console.log(role_name.indexOf("财务")>-1)
                if (role_name.indexOf("资金岗") > -1 || role_name.indexOf("财务") > -1 || role_name.indexOf("admin") > -1 || role_name.indexOf("管理员") > -1 ) {
                    this.roleDisplay.ignoreDisplay = true;
                    this.roleDisplay.returnDisplay = true;
                    this.roleDisplay.approveDisplay = true;
                    this.roleDisplay.doneDisplay = true;
                }
            },
            initData(){
                let now = getNowFormatDate()
                this.filters.createDate=[now,now]
                this.handleCreateDateChange(this.filters.createDate)
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.initData()
                this.getWithdrawList();
                this.setRoleDidsplay();
            })
        }

    }
</script>
<style>

    .el-table .cell {
        padding-left: 5px !important;
        padding-right: 5px !important;
    }
</style>