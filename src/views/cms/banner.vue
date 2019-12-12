<template>
    <section>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filtersFrom" label-width="80px">
                <el-form-item prop="state">
                    <el-select placeholder="状态" v-model="filters.state">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.state_type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="channel">
                    <el-select placeholder="渠道" v-model="filters.channel">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.channel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList()">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filtersFrom')">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger"  @click="openDielog()">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!-- table -->
        <el-table
                :data="items"
                stripe
                v-loading="listLoading">

            <el-table-column
                    prop="name"
                    label="标题"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="showDetails(scope.row.id)" type="text" size="small">{{ scope.row.name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="order_no"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="photo_id"
                    label="预览">
                <template slot-scope="scope">
                    <div>
                        <img :src='scope.row.photo_url ' width="200px"  height="70px"/>
                    </div>

                </template>
            </el-table-column>

            <el-table-column
                    prop="state"
                    label="状态"
                    :formatter="stateFormatter">
            </el-table-column>
            <el-table-column
                    prop="channel"
                    label="渠道"
                    :formatter="channelFormatter">
            </el-table-column>
            <el-table-column
                    prop="link"
                    label="链接"

            >
            </el-table-column>
            <el-table-column
                    prop="gmt_create"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="gmt_modified"
                    label="更新时间">
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.state == 0" @click="changeBannerState(scope.$index,scope.row.id, 1) ">启用</el-button>
                    <el-button type="primary" v-if="scope.row.state == 1" @click="changeBannerState(scope.$index,scope.row.id, 0) ">禁用</el-button>
                    <el-button type="danger primary" v-if="scope.row.state == 0" @click="changeBannerState(scope.$index,scope.row.id, 2) ">删除</el-button>
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
        <el-dialog
                :title="dialogFormTitle"
                width="60%"
                :visible.sync="addBannerVisible"
                @close="clearUpData">
            <el-form
                    label-width="80px"
                    :model="banForm"
                    :rules="bannerBules"
                    ref="banForm">
                <el-input v-model="banForm.id" auto-complete="off" type="hidden"></el-input>
                <el-form-item label="标题" prop="name">
                    <el-input v-model="banForm.name" auto-complete="off" :disabled="dialogDisable"></el-input>

                </el-form-item>
                <el-form-item label="链接" prop="link">
                    <el-input v-model="banForm.link" :disabled="dialogDisable"  ></el-input>
                </el-form-item>

                <el-form-item label="序号" prop="order_no">
                    <el-input v-model="banForm.order_no" :disabled="dialogDisable"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select placeholder="请选择渠道"  v-model="banForm.channel" :disabled="dialogDisable">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.channel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" prop="photo_id">

                    <el-upload
                            :disabled="dialogDisable"
                            class="avatar-uploader"
                            action="/common/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="'/common/images/'+imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                </el-form-item>

            </el-form>
            <div v-if="dialogDisable == true" slot="footer" class="dialog-footer">
                <el-button v-if="dialogDisable" @click="addBannerVisible = false">关 闭</el-button>
            </div>
            <div v-else slot="footer" class="dialog-footer">
                <el-button @click="addBannerVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBanner()">发 布</el-button>
            </div>
        </el-dialog>


    </section>
</template>
<script>

    import * as API from "../../api/cms_api";
    import dict from '../../common/js/dict';
    import * as checkFields from "../../common/js/checkFields"


    export default {

        data() {
            return {

                imageUrl:"",
                items:[],
                custInfo: {
                    photo_id:'',//图片

                },
                banForm: {
                    "id":"",
                    "name":"",
                    "link":"",
                    "state":"",
                    "channel":"",
                    "order_no":"",
                    "photo_id":""
                },
                dialogFormTitle:'新增Banner',
                addBannerVisible:false,
                dialogDisable: false,
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color:"#333",
                    textAlign: "center"
                },

                options: {
                    state_type: dict.notice_state_type,
                    channel: dict.channel_type
                },
                listLoading:false,

                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1,
                },
                filters: {
                    state:'',//状态
                    channel:'',//渠道
                },
                bannerBules: {
                    name: [{required: true, message: '标题不可为空！', trigger: 'blur'}],
                    order_no: [{validator: checkFields.order_no, required: true, trigger: 'blur'}],
                    channel: [{ required: true, message: '请选择渠道!', trigger: 'change'}],
                    photo_id: [{required: true, message: '图片不可为空！', trigger: 'blur'}],

                }
            }
        },
        methods: {
            showDetails(iid) {
                this.addBannerVisible = true;
                this.dialogFormTitle = 'Banner详情';
               // this.dialogDisable = true;
                let paras = {};
                paras.id = iid;
                API.showBanner(paras).then((res) =>{
                    if (res.data.status == 200) {
                        let result = JSON.parse(res.data.datas);
                        this.banForm = Object.assign(this.banForm,result);
                        this.banForm.state = this.banForm.state+"";
                        this.banForm.channel = this.banForm.channel+"";
                        this.imageUrl = this.banForm.photo_id;
                        console.log(this.banForm)
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);

                    }


                })
            },
            changeBannerState(index, row, state) {
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
                    API.changeBannerState(paras).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.getList();
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    })
                })
            },
            selectType(val) {

            },
            addBanner(){
                console.log(this.banForm)
                this.banForm.photo_id = this.imageUrl;
                this.$refs['banForm'].validate((valid) => {
                    if (valid) {
                        API.getBannerAdd(this.banForm).then((res) => {
                            this.addBannerVisible = false
                            if (res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '发布成功!'
                                });
                               // this.banForm = {};
                                this.imageUrl = "";
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
      /*      bannerUpdate() {
                return new Promise((resolve, reject) => {
                    API.getBannerUpdate(this.banForm).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: res.msg
                            });
                        }
                        resolve(res)
                    })

                })

            },*/
            handleAvatarSuccess(res, file) {

                this.imageUrl = JSON.parse(res.datas).id
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片只能是 JPG和PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            //重置搜索表彰
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList()
            },
            //打开弹框
            openDielog() {
                this.banForm.id=""
                this.addBannerVisible = true;
                this.dialogDisable = false;
            },
            //弹框关闭清除已添加的数据
            clearUpData()  {

               // this.banForm = {};
                this.imageUrl = "";
                this.addBannerVisible = false;
               // this.$refs['banForm'].clearValidate();
                this.$refs['banForm'].resetFields();

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
            handlePagerChange()
            {
                this.getList();
            },
            getList(num){
                //获取客户列表
                //查询列表
                this.listLoading = true;
                if (num) {
                    this.pager.page_no = 1;
                }
                let condition = Object.assign({}, this.filters);
                let paras = {};
                paras.condition = condition;
                paras.page_no = this.pager.page_no;
                paras.page_size = this.pager.page_size;
                API.getBannerList(paras).then((res) => {

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
                let url = window.location.host;
                let state = row.state;
                let path ="/published/";

                switch(state){
                    case 0:
                        path ="/published/";
                        break;
                    case 1:
                        path ="/unpublish/";
                        break;
                }
                return url + path + row.id
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
            })
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
