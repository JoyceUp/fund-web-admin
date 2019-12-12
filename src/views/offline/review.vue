<template>
    <section>


        <el-dialog  :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" width="1100px">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" class="demo-ruleForm " :class="dialogDisable?'from-text':''">

                <el-row :gutter="30">
                    <el-col :span="8">

                        <el-form-item label="入金类型" prop="cause">

                            <el-select v-model="addForm.cause" clearable placeholder="请选择" @change="selectType" :disabled="dialogDisable">
                                <el-option
                                        v-for="(value, key)  in options.cause"
                                        :key="key"
                                        :label="value"
                                        :value="key">
                                </el-option>
                            </el-select>

                        </el-form-item>

                    </el-col>
                    <el-col :span="8">

                        <el-form-item  label="手机号" prop="mobile">
                            <el-input disabled="" v-model="addForm.mobile" auto-complete="off" ></el-input>
                        </el-form-item>


                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="客户姓名" prop="customer_name">
                            <el-input disabled="" v-model="addForm.customer_name" auto-complete="off" ></el-input>
                        </el-form-item>


                    </el-col>


                </el-row>


                <el-row :gutter="30">
                    <el-col :span="8">

                        <el-form-item label="证件号码" prop="identity_no">
                            <el-input @blur="getCustomerInfo" v-model="addForm.identity_no" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="金额" prop="amount">
                            <el-input v-model="addForm.amount" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="原合同号" prop="contract_no">
                            <el-input v-model="addForm.contract_no" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>

                </el-row>




                <el-row :gutter="30">
                    <el-col :span="8">

                        <el-form-item label="理财经理" prop="manager">
                            <el-input v-model="addForm.manager" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="公司" prop="company">
                            <el-select placeholder="公司名称" @change="changeCompany" v-model="addForm.company" :disabled="dialogDisable">
                                <el-option :key="item.company_name" :label="item.company_name" :value="item.company_name"
                                           v-for="item in treeData"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="部门" prop="department">
                            <el-select placeholder="部门名称"  v-model="addForm.department" :disabled="dialogDisable">
                                <el-option :key="item.department_name" :label="item.department_name" :value="item.department_name"
                                           v-for="item in department"></el-option>
                            </el-select>
                        </el-form-item>

                    </el-col>

                </el-row>

                <el-row :gutter="30"  v-if="addForm.state!=1">
                    <el-col :span="8">

                        <el-form-item label="审核人">
                            <el-input  v-model="addForm.auditor" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="审核日期" >
                            <el-input v-model="addForm.gmt_modified" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>

                    <el-col :span="8">

                        <el-form-item label="审核状态" >
                            <el-input auto-complete="off" :disabled="dialogDisable" :value="addForm.state == 3? '审核通过':'审核拒绝'"></el-input>
                        </el-form-item>

                    </el-col>

                </el-row>

                <el-row :gutter="30" v-if="addForm.state!=1">
                    <el-col :span="12">

                        <el-form-item label="审核意见" >
                            <el-input  type="textarea"  v-model="addForm.remark" auto-complete="off" :disabled="dialogDisable"></el-input>
                        </el-form-item>

                    </el-col>


                </el-row>


                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="附件" prop="">
                        <el-upload
                                :disabled="dialogDisable"
                                :file-list="fileList"
                                :before-remove="beforeRemove"
                                :on-change="uploadOnChange"
                                :before-upload="beforeAvatarUpload"
                                action=""
                                :limit="3"
                                :on-success="uploadSuccess"
                                :http-request="httpRequest"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        </el-form-item>
                    </el-col>

                </el-row>



                <el-row :gutter="30">
                    <el-col :span="12">

                        <el-form-item label="审核意见" prop="remark" v-if="addForm.state==1">
                            <el-input   type="textarea" v-model="addForm.remark" auto-complete="off" ></el-input>
                        </el-form-item>

                    </el-col>


                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">

                <el-button type="primary" @click="review(3)" v-if="addForm.state==1">审核通过</el-button>
                <el-button type="danger" @click="review(4)" v-if="addForm.state==1">审核拒绝</el-button>
                <el-button @click=" handleClose() " v-if="addForm.state==1">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogImgVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filtersFrom" size="medium">
                <el-form-item prop="state">
                    <el-select placeholder="状态" v-model="filters.state">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.state"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select v-model="filters.cause" clearable　placeholder="请选择" @change="selectType" >
                        <el-option
                                v-for="(value, key)  in options.cause"
                                :key="key"
                                :label="value"
                                :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :span="3"
                                clearable
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <!--<el-form-item prop="channel">-->
                    <!--<el-select placeholder="渠道" v-model="filters.channel">-->
                        <!--<el-option :key="key" :label="value" :value="key"-->
                                   <!--v-for="(value, key) in options.channel"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="getList(1)" size="small">搜索</el-button>
                    <el-button @click="resetForm('filtersFrom')" size="small">清空</el-button>
                    <!--<el-button type="primary" @click="showAdd()">新增</el-button>-->
                </el-form-item>


            </el-form>
        </el-col>


        <!-- table -->
        <el-table
                :data="items"
                stripe
                v-loading="listLoading"
        >

            <el-table-column
                    prop="gmt_create"
                    label="创建日期"
                  >
                <template slot-scope="scope">
                    {{ scope.row.gmt_create.substr(0,10) }}
                </template>
            </el-table-column>

            <el-table-column
                    prop="mobile"
                    label="手机号"
            >
            </el-table-column>

            <el-table-column
                    prop="customer_name"
                    label="客户姓名"
            >
            </el-table-column>

            <el-table-column
                    prop="identity_no"
                    label="证件号"
            >
            </el-table-column>

            <el-table-column
                    prop="cause"
                    label="入金类型"
            >
                <template slot-scope="scope">
                    {{ options.cause[ scope.row.cause ]}}
                </template>
            </el-table-column>

            <el-table-column
                    prop="amount"
                    label="金额（元）"
            >
                <template slot-scope="scope">

                   <span style="color:#901818"> {{ String((scope.row.amount/100).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g , ',')}}</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="contract_no"
                    label="合同编号"
            >
            </el-table-column>

            <el-table-column
                    prop="manager"
                    label="理财经理"
            >
            </el-table-column>

            <el-table-column
                    prop="company"
                    label="公司"
            >
            </el-table-column>

            <el-table-column
                    prop="department"
                    label="部门"
            >
            </el-table-column>

            <el-table-column
                    prop="state"
                    label="状态"
            >
                <template slot-scope="scope">
                    <el-tag size="success" v-if="scope.row.state==3">  {{ options.state[ scope.row.state ]}}</el-tag>
                    <el-tag size="warning" v-if="scope.row.state==1">  {{ options.state[ scope.row.state ]}}</el-tag>
                    <el-tag size="info"    v-if="scope.row.state==4">  {{ options.state[ scope.row.state ]}}</el-tag>

                </template>
            </el-table-column>

            <el-table-column
                    prop="gmt_modified"
                    label="审核时间"
            >
                <template slot-scope="scope">

                    <span v-if="scope.row.state !=1"> {{ scope.row.gmt_modified.substr(0,10)  }} </span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="auditor"
                    label="审核人"
            >
            </el-table-column>

            <el-table-column
                    prop="remark"
                    label="审核意见"
            >
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary"  @click="showDetails(scope.$index,scope.row) " v-if="scope.row.state == 1">审核</el-button>
                    <el-button  @click="showDetails(scope.$index,scope.row)" v-if="scope.row.state!==1">查看</el-button>
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

    </section>
</template>
<script>
    import dict from '../../common/js/dict';
    import * as checkFields from "../../common/js/checkFields"
    import * as API from "../../api/money_api"
    import {addSaleInfo, getSalesOrganization} from '../../api/sale_api';
    import {update_img} from '../../api/common';
    import {isNull,centToDollar,trimBlank} from "../../common/js/commons";
    export default {

        data() {
            return {
                fileList:[],
                dialogImageUrl: '',
                dialogImgVisible: false,
                options: {
                    state: dict.offline.state,
                    cause: dict.offline.cause,
                },
                treeData:[],
                company:[],
                department:[],

                dict: dict,
                items: [],
                listLoading: false,

                dialogTitle: '',
                dialogVisible: false,
                dialogDisable: false,

                addForm: {
                    customer_id:'',
                    cause: '',
                    mobile : '',
                    customer_name:"",
                    identity_no:"",
                    amount:"",
                    contract_no:"",
                    manager:"",
                    company:"",
                    department:"",
                    file_ids:[],
                    remark:""
                },
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                filters: {
                    state:'',//状态
                    cause:'',//类型
                    createDate: ''

                },
                rules: {
                    remark: [
                        { required: true, message: '填写备注  ', trigger: 'blur' }
                    ],
                    cause: [
                        { required: true, message: '请选择入金类型  ', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true,validator: checkFields.phone, trigger: 'blur' }
                    ],
                    customer_name: [
                        { required: true, message: '请填写客户姓名', trigger: 'blur' }
                    ],
                    identity_no: [
                        { required: true, validator: checkFields.all_identity_no, trigger: 'blur' }
                    ],
                    amount: [
                        { required: true, message: '请填写金额', trigger: 'blur' }
                    ],
                    contract_no: [
                        { required: true, message: '请填写原合同号', trigger: 'blur' }
                    ],
                    manager: [
                        { required: true, message: '请填写理财经理', trigger: 'blur' }
                    ],
                    company: [
                        { required: true, message: '请选择写公司', trigger: 'blur' }
                    ],
                    department: [
                        { required: true, message: '请选择部门', trigger: 'blur' }
                    ],

                }
            }
        },
        methods: {

            review(state){
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        let params={
                            "state":state,
                            "remark":this.addForm.remark,
                            "id":this.addForm.id
                        }
                        API.offline.review(params).then(res=>{
                            if(res.status == 200){
                                this.dialogVisible = false
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.msg || "操作失败"
                                });
                            }
                        })
                    }
                })


            },
            handleRemove(file, fileList) {
                //console.log(fileList)
              //  this.fileList = fileList

            },

            getCustomerInfo(){
                if(! checkFields.all_d_identity_no(this.addForm.identity_no)){
                    return false
                }
                let condition = {
                    identity_no : trimBlank(this.addForm.identity_no),
                };
                let params = {
                    "page_size": 10,
                    "page_no": 1,
                    condition: condition
                };

                let _this = this
                $.ajax({
                    type : "POST",
//                  contentType:'application/json;charset=utf-8, charset=UTF-8',
                    timeout : 200000, //超时时间设置，单位毫秒
                    url : "customers/customers/listpage",

                    data : {data:JSON.stringify(params)},
                    success : function(res) {
                        if (res.status == 200) {

                            let data = JSON.parse(res.datas).items[0];
                            _this.addForm.customer_id = data.id
                            _this.addForm.customer_name = data.name
                            _this.addForm.mobile = data.mobile
                        console.log( _this.addForm)
                        } else{
                            _this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }

                    },
                    error : function(){
                        // alert("错误");
                    }

                });

            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImgVisible = true;
            },
            beforeRemove(){},
            uploadOnChange(file, fileList){
                this.fileList=fileList
            },
            uploadSuccess(res, file, fileList){

            },
            httpRequest(item,fileList) {

             let formData = new FormData();
                formData.append('file', item.file);
                /*     formData.append('roleType', "1");
                  formData.append('fileName', item.file.name);
                  let user = JSON.parse(sessionStorage.getItem("user"));
                  formData.append('roleId', user.id);*/
                update_img(formData).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    console.log(result)
                    if (res.data.status == 200) {
                        this.fileList[this.fileList.length-1].id=result.id
                        console.log(this.fileList)

                    } else {
                        if (res.data.status === 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            },

            beforeAvatarUpload (file, fileList) {
             //   this.file_list = fileList
              //  console.log(fileList)
                var fileName=new Array()
                fileName =file.name.split('.');
                const extension = fileName[fileName.length-1] === 'jpg'
                const extension2 =  fileName[fileName.length-1]=== 'png'
                const extension3 =  fileName[fileName.length-1]=== 'gif'
                const isLt2M = file.size / 1024 / 1024 < 2

                if (!extension && !extension2 && !extension3) {
                    this.$message({
                        message: '上传图片只能是.jpg、.png、.gif格式!',
                        type: 'warning'
                    });
                }
                if (!isLt2M) {
                    this.$message({
                        message: '上传图片大小不能超过 2MB!',
                        type: 'warning'
                    });
                }

                if (extension || extension2 || extension3 && isLt2M == true) {

                    let fd = new FormData()
                    fd.append('file', file)

                    return true
                }
                return extension || extension2 || extension3 && isLt2M
            },
            initTreeData() {     //从 服务器获取数据
                getSalesOrganization().then((res) => {
                    if (res.data.status == 200) {
                        this.treeData = JSON.parse(res.data.datas).children;
                        console.log(this.treeData)
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            },

            changeCompany() {
                let company_name = this.addForm.company;
                for (let i = 0; i < this.treeData.length; i++) {
                    if (this.treeData[i].company_name === company_name) {
                        let company = this.treeData[i];

                        if (company.children) {
                            this.department = company.children;
                        }
                        return;
                    }
                }

            },
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = val[0] +" 00:00:00.000";
                this.filters.end_time = val[1]+" 59:59:59.999";
            },
            showDetails(index , row) {

                this.dialogTitle = '详情';
                this.addForm = Object.assign(this.addForm,row) ;
                this.addForm.cause = String(this.addForm.cause)
                this.addForm.amount = this.addForm.amount / 100
                this.dialogVisible = true;
                this.dialogDisable = true;
                this.fileList=[]
                if(this.addForm.file_ids.length>0){
                    this.addForm.file_ids = this.addForm.file_ids.split(",")
                    this.addForm.file_ids.forEach((val)=>{
                        this.fileList.push({
                            url:"/common/images/"+val,
                            id:val
                        })
                    })

                }

            },
            ievent(data){
                this.addForm.content = data
            },

            selectType(val) {

            },
            add(){

                this.$refs['addForm'].validate((valid) => {
                        if (valid) {
                            let arr=[]
                            this.fileList.forEach((val)=>{
                                arr.push(val.id)
                            })
                            this.addForm.file_ids =  arr.join(",")
                            this.addForm.amount = this.addForm.amount * 100
                            API.offline.add(this.addForm).then((res) => {
                                this.dialogVisible = false
                                if (res.status == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '发布成功!'
                                    });
                                    this.addForm = {};
                                    this.content = "";
                                    this.getList();
                                } else {
                                    this.$message({
                                        type: 'info',
                                        message: res.msg
                                    });
                                }
                            })


                        }
                })
            },

            changeArticleState(index, row, state) {
                let paras = {
                    state:state,
                    id:row
                };
                let msg = state == 2 ? "确认执行该操作？" : "确认执行该操作？"
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    API.changeArticleState(paras).then((res) => {
                        console.log(res)
                        if (res.data.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });

                            this.getList();
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.data.msg
                            });
                        }
                    })
                })
            },
            showAdd() {
                this.fileList=[]
                this.dialogTitle = "新增"
                this.dialogVisible = true
                this.dialogDisable = false;
                this. addForm={
                    customer_id:'',
                        cause: "",
                        mobile : '',
                        customer_name:"",
                        identity_no:"",
                        amount:"",
                        contract_no:"",
                        manager:"",
                        company:"",
                        department:"",
                        file_ids:[]
                }

                console.log(this.addForm)
            },
            handleClose() {
                this.fileList=[]
                this.addForm = {};
                this.dialogVisible = false
                this.$refs['addForm'].clearValidate();
            },
            //清空筛选表单
            resetForm(formName) {

                this.filters.start_time ="";
                this.filters.end_time = "";
                this.filters.cause = "";

                this.$refs[formName].resetFields();
                this.getList()
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
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getList();
            },
            cmsSubmit() {

            },

            getList(num) {//获取客户列表
                //查询列表
                this.listLoading = true;
                if (num) {
                    this.pager.page_no = 1;
                }
                // let paras = Object.assign(this.positionDic, this.filters);
                let condition = Object.assign({}, this.filters);
                let paras = {};
                paras.condition = condition;
                paras.page_no = this.pager.page_no;
                paras.page_size = this.pager.page_size;
                paras.order_column = "gmt_create"
                paras.order_by = "desc"

                API.offline.list(paras).then((res) => {

                    if (res.status == 200) {
                        let datas = JSON.parse(res.datas);
                        this.items = datas.items;
                        this.pager.total = datas.total;
                    }
                    this.listLoading = false
                    //
                })
            },
            createLink(row, column){
                let url = window.location.host
                let type = row.type
                let path ="/news/detail/"

                switch(type){
                    case 1:
                        path ="/news/detail/"
                        break;
                    case 2:
                        path ="/news/detail/"
                        break
                    case 3:
                        path ="/notice/detail/"
                        break;
                }
                return  path + row.id
            },
            stateFormatter(row, column) {
                return this.options.state_type[row[column.property]];
            },
            channelFormatter(row, column) {
                return this.options.channel[row[column.property]];
            },

        },
        mounted() {
            this.$nextTick(function () {
                this.getList();
                this.initTreeData()
            })
        }
    }
</script>

<style>

    .from-text input{border:none;background: none}
    .el-select{width:100%}
    .el-input.is-disabled .el-input__inner{color:#333}
    .el-input.is-disabled .el-input__icon{display:none}
    .is-disabled + .el-upload--picture-card {display:none}
</style>

