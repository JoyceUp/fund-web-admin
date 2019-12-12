<template>
    <section
            v-loading.fullscreen="importLoading"
            element-loading-text="拼命导入中"
            element-loading-spinner="el-icon-loading"

    >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="company_payment_state" label="发放状态:">
                    <el-select placeholder="全部" v-model="filters.company_payment_state">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in wages.wages_status"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="company_payment_type" label="文件类型:">
                    <el-select placeholder="全部" v-model="filters.company_payment_type">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in wages.wages_type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :span="3"
                                :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList(1)" size="small">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button  @click="resetSearch('filters')" size="small">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar">
            <el-button type="primary" size="small" @click="dialogFormVisible = true">导入文件</el-button>
            <el-dialog title="导入文件" :visible.sync="dialogFormVisible" @close="resetForm('uploadform')" width="50%">
                <el-form ref="uploadform" :model="uploadform" label-width="80px">
                    <el-form-item label="文件类型">
                        <el-radio v-model="uploadform.company_payment_type" label="1">对私工资</el-radio>
                        <el-radio v-model="uploadform.company_payment_type" label="2">会员奖金</el-radio>
                    </el-form-item>
                    <el-form-item
                            label="文件主题"
                            prop="file_title"
                            :rules="[{ required: true, message: '文件主题不能为空'}]"
                    >
                        <el-input v-model="uploadform.file_title" :maxlength="40"></el-input>
                    </el-form-item>
                    <el-form-item label="上传文件"
                                  prop="id"
                                  :rules="[{ required: true, message: '请上传文件'}]"
                    >
                        <el-upload
                                class="upload-demo"
                                ref="upload"
                                :on-change = "onChange"
                                :before-upload="beforeUpload"
                                :on-success="handleAvatarSuccess"
                                action="/common/file/upload"
                                :file-list="uploadform.fileList"
                                accept=".xls,.xlsx,.csv"
                                :auto-upload="false"
                                multiple
                                :before-remove="beforeRemove"
                                :limit="1"
                        >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success"
                                       @click="submitUpload('uploadform')">导入数据
                            </el-button>
                        </el-upload>
                    </el-form-item>
                    <div class="file-up-tips">
                        <span>重要提示：</span>
                        <p>
                            请参考 <a href="/downloads/template.xls" download="">工资奖金发放模板.xls</a> 进行数据构建，每一项都要求必须填写，请提前做好线下审核工作；
                        </p>
                        <el-table
                                :data="temptableData"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="tempid"
                                    label="证件号码">
                            </el-table-column>
                            <el-table-column
                                    prop="tempname"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    prop="tempmoney"
                                    label="发放金额（元）">
                            </el-table-column>
                        </el-table>

                    </div>
                </el-form>
            </el-dialog>
        </el-col>
        <!-- table -->
        <el-table
                :data="datas"
                stripe
                v-loading="listLoading"
        >
            <el-table-column

                    label="批次号"
                    width="180">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleInfo(scope.row.id)">{{scope.row.batch_no}}</el-button>

                </template>
            </el-table-column>
            <el-table-column
                    prop="import_date"
                    label="导入日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="file_title"
                    label="文件主题">
            </el-table-column>

            <el-table-column
                    prop="company_payment_type"
                    :formatter="magesTypeFormatter"
                    label="文件类型">
            </el-table-column>
            <el-table-column
                    prop="count"
                    label="导入总笔数"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="company_payment_state"
                    :formatter="statusFormatter"
                    label="发放状态">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.company_payment_state == 1"
                               @click="handlePerform(scope.$index, scope.row)">执行发放
                    </el-button>
                    <el-button type="primary" v-if="scope.row.company_payment_state == 3"
                               @click="handlePerform(scope.$index, scope.row)">重新发放
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination
                    style="text-align: center;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pager.page_size"
                    :current-page="pager.page_no"
                    :page-sizes="pager.sizes"
                    background
                    layout="prev,pager,next,sizes,total"
                    :total="pager.total">
            </el-pagination>
        </el-col>

        <div class="wage-operation-info">
            <el-dialog
                    title="工资发放详情"
                    :visible.sync="dialogVisible"
                    width="60%"
                    >
                        <handle-info :id="wages_id"></handle-info>
            </el-dialog>
        </div>

        <div class="wage-operation-info">
            <el-dialog
                    title="失败原因"
                    :visible.sync="erroDialogVisible"
                    @close="resetFormErrCode()"
                    width="60%"
            >
                        <handle-erro :datas="erro_datas"></handle-erro>
            </el-dialog>
        </div>

    </section>
</template>
<script>
    import * as API from '../../api/wages_api';
    import dict from '../../common/js/dict';
    import * as date from "../../common/js/date";
    import handleInfo from "./handleInfo.vue";
    import handleErro from "./handleErro.vue";

    export default {
        components:{
            handleInfo,
            handleErro,
        },
        data() {
            return {
                clearable: false,
                listLoading: false,
                importLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1,

                },
                wages: {
                    wages_status: dict.wages_status,
                    wages_type: dict.wages_type,
                    wages_err_code: dict.wages_err_code
                },
                filters: {
                    start_time: '',
                    end_time: '',
                    company_payment_type: '',
                    company_payment_state: '',
                    createDate: ''
                },
                datas: [],
                uploadform: {
                    company_payment_type: '1',
                    file_title: '',
                    id: '',
                    fileList: []
                },
                dialogTableVisible: false,
                dialogFormVisible: false,

                activeName: 'first',
                dialogVisible: false,//显示详情
                erroDialogVisible: false,//显示失败详情
                erro_datas:[],
                wages_id:"",
                temptableData:[
                    {
                        tempid:'',
                        tempname:'',
                        tempmoney:''
                    },
                ]

            }
        },
        methods: {

            //清空筛选表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.uploadform= {company_payment_type: '1', file_title: '', id: '', fileList: []}
                this.getList(1)  //1是让列表回到第一页
            },
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getList();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getList();
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`).then(() => {
                    this.uploadform.id = ""
                });
            },
            getList(num) {
                if (num) {
                    this.pager.page_no = 1
                }
                let condition = {
                    start_time: this.filters.start_time,
                    end_time: this.filters.end_time,
                    company_payment_type: this.filters.company_payment_type,
                    company_payment_state: this.filters.company_payment_state
                }
                let params = {
                    "condition": condition,
                    "page_size": this.pager.page_size,
                    "page_no": this.pager.page_no,
                    "order_column": "",
                    "order_by": ""
                }
                API.getWagesList(params).then((res) => {
                    if (res.data.status == 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.datas = datas.items;
                        this.pager.total = datas.total;
                    } else {
                        if (res.data.status == 401) {
                        }
                        this.$message.error(res.data.msg);
                    }
                    this.listLoading = false;
                });
            },
            statusFormatter(row, column) {
                return dict.wages_status[row.company_payment_state];
            },
            magesTypeFormatter(row, column) {
                return dict.wages_type[row.company_payment_type];
            },
            // 执行发放
            handlePerform(index, row) {
                let _this = this
                let params = {
                    "id": row.id
                }
                this.$confirm('是否确定执行发放？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.importLoading = true
               /*     $.ajax({
                        type : "POST",
                        timeout : 200000, //超时时间设置，单位毫秒
                        url : "wages/handle",
                        data : params,
                        success : function(res) {
                            if (res.status == 200) {
                                let datas = JSON.parse(res.datas)
                                if (datas.is_successful == 1) {
                                    _this.handleStatusSuccess();
                                } else if (datas.is_successful == -1) {
                                    _this.erro_datas = datas.items
                                    _this.handleStatusErr()
                                }
                            } else{
                                _this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });
                            }
                            _this.importLoading = false;
                        },
                        error : function(){
                            // alert("错误");
                        }

                    });*/
                   API.handlePerform(params).then((res) => {
                       let datas = res.data
                       if (datas.status == 200) {
                           this.gethandlePerformResult(row.id)
                       } else{
                           _this.$message.error(res.data.msg);
                       }


                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发放'
                    });
                });
            },

            //查询执行发放结果
            gethandlePerformResult(id){


                let params = {
                    id: id
                }
                let timing= setInterval(()=>{

                    API.handlePerformResult(params).then((res) => {


                        let datas = JSON.parse(res.data.datas)
                        if(datas.status == 2){
                            clearInterval(timing)
                            this.importLoading = false;
                            if (datas.is_successful == 1) {
                                this.handleStatusSuccess();
                            } else if (datas.is_successful == -1) {
                                this.erro_datas = datas.items
                                this.handleStatusErr()
                            } else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });
                            }

                        }



                    });


                },2000)

            },

            // 导入成功
            handleStatusSuccess() {
                this.$alert('执行成功！', '提示', {
                    confirmButtonText: '确定',
                    type: 'success'
                });
                this.getList();
            },
            // 导入失败
            handleStatusErr() {
                this.$confirm('执行失败！', '提示', {
                    confirmButtonText: '查看原因',
                    cancelButtonText: '取消',
                    type: 'error',
                    center: true
                }).then(() => {
                    this.handleErroInfo();
                    this.getList();
                }).catch(() => {
                    this.getList();
                });
            },
            handleErroInfo() {
                this.erroDialogVisible = true
            },
            resetFormErrCode(){
                this.erro_datas = [];
            },
            handleInfo(id) {
                this.activeName='first'
                this.wages_id = id
                this.dialogVisible = true
            },
            onChange(file){
                let  accept=".xls,.xlsx"
                let fileFormat = (file.name).split(".");
                let ext = fileFormat[fileFormat.length - 1]
                if(accept.indexOf(ext)<0){
                    this.$message.error('请上传excel文件');
                    this.$refs.upload.clearFiles()
                }else{

                    this.$refs.upload.submit();
                }
            },
            beforeUpload(file) {
                this.importLoading = true
            },
            handleAvatarSuccess(res, file) {
                this.importLoading = false
                this.uploadform.id = JSON.parse(res.datas).id;
            },

            // 文件导入
            submitUpload(formName) {
                if(this.uploadform.file_title.length >= 40){
                    this.$alert('文件主题最大长度不得超过40个字符！', '提示', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        let _this = this
                        this.importLoading = true
                        let params = {
                            company_payment_type: this.uploadform.company_payment_type,
                            file_title: this.uploadform.file_title,
                            id: this.uploadform.id
                        }
                    /*    $.ajax({
                            type : "POST",
                            timeout : 200000, //超时时间设置，单位毫秒
                            url : "wages/import",
                            data : params,
                            success : function(res) {

                                this.getImportResult()
                             /!*   setTimeout(() => {
                                    _this.importLoading = false
                                    _this.dialogFormVisible=false
                                    _this.resetForm("uploadform")

                                    let datas = JSON.parse(res.datas)
                                    if (datas.is_successful == 1) {
                                        _this.handleStatusSuccess();
                                    } else if (datas.is_successful == -1){
                                        _this.erro_datas = datas.items
                                        _this.handleStatusErr()

                                        //this.$message.error(res.data.msg);
                                    } else{
                                        _this.$message.error(res.data.msg);
                                    }
                                }, 1000)*!/
                            },
                            error : function(){
                                // alert("错误");
                            }

                        });*/
                        API.flieUpload(params).then((res) => {

                            let datas = res.data
                            if (datas.status == 200) {
                               this.getImportResult()
                            } else{
                                _this.$message.error(res.data.msg);
                            }
                        });
                    }
                });
            },

           getImportResult(){
               let params = {
                   id: this.uploadform.id
               }
               let timing= setInterval(()=>{

                   API.flieUploadResult(params).then((res) => {


                       let datas = JSON.parse(res.data.datas)

                       if(datas.status == 2){


                           clearInterval(timing)
                           this.importLoading = false
                           this.dialogFormVisible=false
                           this.resetForm("uploadform")

                           if (datas.is_successful == 1) {

                               this.handleStatusSuccess();
                           } else if (datas.is_successful == -1){
                               this.erro_datas = datas.items
                               this.handleStatusErr()

                               //this.$message.error(res.data.msg);
                           } else{
                               this.$message.error(res.data.msg);
                           }

                       }



                   });


               },2000)

           }




        },        mounted() {
            this.$nextTick(function () {

                this.getList();
            })
        }
    }
</script>
<style>
    .file-up-tips{
        padding: 20px;
        border: 1px solid #f2f5f9;
        -webkit-border-r·adius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;

        background-color: #f8f9fa;
    }
    .file-up-tips .el-table th.is-leaf{
        background: none;
        height: auto;
        color: #999;
        padding: 0;
    }
    .file-up-tips p{
        margin: 0;
        padding:0 0 15px;
    }
    .file-up-tips p a{
        color: #409EFF;
    }
    .file-up-tips span{
        margin:  5px 0;
        padding: 0 0 5px;
        line-height: 1;
        display: block;
        width: 100%;
        color:#333;
        font-weight: bold;
    }
    .wage-operation-info .el-dialog__body {
        padding: 5px 20px 10px;
    }
    .wage-operation-info .el-dialog__body .toolbar{
        float: inherit;
    }
</style>

