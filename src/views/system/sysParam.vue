<template>
    <div>
        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form>
                <el-form-item>
                    <el-button type="primary" @click="showSysParamPop('add')">添加系统参数</el-button>
                </el-form-item>
            </el-form>
        </el-col>-->
        <el-dialog :title="sysFormTitle" :visible.sync="sysFormVisible" :before-close="handleClose">
            <el-form :model="sysForm" :rules="rules" ref="sysForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="参数名" prop="key">
                    <el-input v-model="sysForm.key" :disabled="keyDisable"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="value">
                    <el-input v-model="sysForm.value"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('sysForm')">取 消</el-button>
                <el-button type="primary" @click="sysParamSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!--列表-->
        <el-table :data="sysParamData" stripe highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="key" label="参数名"></el-table-column>
            <el-table-column prop="value" label="值" width="150"></el-table-column>

            <el-table-column label="操作" width="150">

                <template slot-scope="scope">
                    <el-button size="small" @click="showSysParamPop('edit',scope.row)">编辑</el-button>
                    <!--<el-button type="danger" size="small" @click="shwoDelSysParam(scope.row)">删除</el-button>-->
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>

        <!--&lt;!&ndash;工具条&ndash;&gt;
        <el-col :span="24" class="toolbar">
            <el-pagination
                    background
                    layout="prev, pager, next" :page-size="page_size"
                    :total="total" @current-change="handleCurrentChange"
                    style="float:right;">
            </el-pagination>
        </el-col>-->

    </div>
</template>


<script>
    import util from '../../common/js/util'
    import * as api from '../../api/auth_api'
    import * as checkFields from "../../common/js/checkFields"

    export default {
        data() {
            return {
                keyDisable: false,
                listLoading: false,
                page_no: 1,
                page_size: 10,
                total: 0,
                settingData: {},
                sysParamData: [],
                sysFormTitle: '',
                sysFormVisible: false,
                selectOptions: [
                    {value: 0, label: '字符型'}
                ],
                sysForm: {
                    id: '',
                    key: '',
                    value: '',
                    status: 0,
                    mark: ''
                },
                money_field: ["withdraw_poundage", "withdraw_min_limit", "withdraw_max_limit", "withdraw_daily_max_limit","deposit_max_amount_once"],
                remarks: [
                    "提现手续费，单位人民币元"
                    , "每月免费提现次数。-1代表每月可以免费提现无数次；0代表每月没有免费提现次数；其他正数代表免费提现次数。"
                    , "每日最大提现次数限制"
                    , "单笔提现最低额，单位人民元"
                    , "单笔提现最高额，单位人民币元"
                    , "提现单日累计最高额，单位人民币元"
                    , "单笔支付最大金额，单位人民币元"

                ],
                rules: {
                    key: [{validator: checkFields.key, required: true, trigger: 'blur'}],
                    value: [{validator: checkFields.value, required: true, trigger: 'blur'}],
                    mark: [{pattern: /^.{0,255}$/, message: '请输入内容不大于255个字符', trigger: 'blur'}]
                }
            }
        },

        methods: {
            contains(arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            //状态显示转换
            formatRMB(row) {

                if (!row.value) return ""
                return row.value / 100
            },
            formatState(row) {
                return row == 0 ? '启用' : row == 1 ? '禁用' : '未知';
            },
            handleCurrentChange(val) {
                this.page_no = val;
                this.getSysParam();
            },
            //获取系统参数列表
            getSysParam() {
                let para = {
                    page_no: this.page_no
                };
                this.listLoading = true;
                api.getSysParamList(para).then((res) => {
                    if (res.data.status == 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.settingData = datas
                        //this.total = datas.total;
                        let dataObj = []
                        let index = 0
                        let data = 0
                        for (var item in datas) {
                            /*    console.log(item)
                                console.log(this.money_field)
                                console.log(item.indexOf(this.money_field))*/
                            if (this.contains(this.money_field, item)) {
                                data = datas[item] / 100
                            } else {
                                data = datas[item]
                            }
                            dataObj.push({"key": item, "value": data, "id": index, "remark": this.remarks[index]})
                            index++

                        }
                        /*	console.log(dataObj)*/
                        this.sysParamData = dataObj;

                        this.listLoading = false;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },
            //删除系统参数
            shwoDelSysParam(index) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: index.id,
                        key: index.key
                    };
                    api.removeSysParam(para).then(res => {
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getSysParam();
                        } else {
                            this.$message(res.data.msg);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //新增、编辑提交
            sysParamSubmit() {

            },
            //新增系统参数
            addSysParam() {
                this.$refs['sysForm'].validate((valid) => {
                    if (valid) {
                        let para = {
                            key: this.sysForm.key,
                            value: this.sysForm.value,
                            status: this.sysForm.status,
                            mark: this.sysForm.mark
                        };
                        api.addSysParam(para).then(res => {
                            if (res.data.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.getSysParam();
                                this.$refs['sysForm'].resetFields();
                            } else {
                                this.$message(res.data.msg);
                            }
                            this.sysFormVisible = false;
                        })
                    } else {

                        return false
                    }
                })
            },
            //编辑系统参数
            editSysParam() {
                this.$refs['sysForm'].validate((valid) => {
                    if (valid) {
                        let temp = {};
                        if (this.contains(this.money_field, this.sysForm.key)) {

                            this.settingData[this.sysForm.key] = Number(this.sysForm.value) * 100
                            temp[this.sysForm.key] = Number(this.sysForm.value) * 100
                        } else {
                            this.settingData[this.sysForm.key] = Number(this.sysForm.value)
                            temp[this.sysForm.key] = Number(this.sysForm.value)
                        }


                        api.editSysParam(temp).then(res => {
                            if (res.data.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.getSysParam();
//                location.reload();
                                this.sysForm = {
                                    key: '',
                                    value: '',
                                    data_type: '',
                                    status: 0,
                                    mark: ''
                                };
                                this.$refs['sysForm'].resetFields();
                            } else {
                                this.$message(res.data.msg);
                            }
                            this.sysFormVisible = false;
                        })
                    } else {

                        return false
                    }
                })
            },

            //显示弹窗
            showSysParamPop(...val) {

                if (val[0] == 'add') {
                    this.keyDisable = false
                    this.sysFormTitle = '添加参数';
                    this.sysForm = {
                        key: '',
                        value: '',
                        data_type: '',
                        status: 0,
                        mark: ''
                    };
                    this.sysParamSubmit = this.addSysParam;
                } else {
                    this.keyDisable = true
                    this.sysFormTitle = '修改参数';
                    this.sysForm = {
                        id: val[1].id,
                        key: val[1].key,
                        value: val[1].value,
                    };
                    this.sysParamSubmit = this.editSysParam;
                }
                this.sysFormVisible = true;
            },
            resetForm(form) {

                this.$refs[form].resetFields();
                this.sysFormVisible = false;
            },
            handleClose(done){

                this.$refs['sysForm'].resetFields();
                done();
               /* this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});*/
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getSysParam();
            })
        }
    }
</script>
<style scoped>
    .dialog-footer {
        padding-top: 0 !important;
    }

    .el-select {
        width: 100%;
    }

    .el-dialog--small {
        width: 40%;
    }
</style>