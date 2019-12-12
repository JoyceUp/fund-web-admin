<template>
    <section>


        <el-dialog  :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :fullscreen="true">
            <el-form :model="cmsForm" :rules="rules" ref="cmsForm" label-width="100px" class="demo-ruleForm">
                <el-input v-model="cmsForm.id" auto-complete="off" type="hidden"></el-input>
                <el-form-item label="标题" prop="name">
                    <el-input v-model="cmsForm.name" auto-complete="off" :disabled="dialogDisable"></el-input>
                </el-form-item>

                <el-form-item label="链接">
                    <el-input v-model="cmsForm.link" :disabled="dialogDisable"  readonly></el-input>
                </el-form-item>

                <el-form-item label="序号" prop="order_no">
                    <el-input v-model="cmsForm.order_no" :disabled="dialogDisable"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type">

                    <el-select v-model="cmsForm.type" clearable　placeholder="请选择" @change="selectType" :disabled="dialogDisable">
                        <el-option
                                v-for="(value, key)  in dict.cms_type_map"
                                :key="key"
                                :label="value"
                                :value="key">
                        </el-option>
                    </el-select>

                </el-form-item>

                <el-form-item label="内容" prop="content">
                    <editor ref="editor" @ievent = "ievent" :contentHtml="cmsForm.content"></editor>
                    <input type="hidden" v-model="cmsForm.content"  :disabled="dialogDisable">
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click=" handleClose() ">取 消</el-button>
                <el-button type="primary" @click="add()">确 定</el-button>
            </div>
        </el-dialog>


        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filtersFrom" size="medium">
                <el-form-item prop="state">
                    <el-select placeholder="状态" v-model="filters.state">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.state_type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type">
                    <el-select placeholder="类型" v-model="filters.type">
                        <el-option :key="key" :label="value" :value="key"
                                   v-for="(value, key) in options.type"></el-option>
                    </el-select>
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
                    <el-button type="primary" @click="showAdd()">新增</el-button>
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
                    prop="name"
                    label="标题"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="showDetails(scope.row.id)" type="text" size="small">{{ scope.row.name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="order_no"
                    label="序号"
            >
            </el-table-column>
           <!-- <el-table-column
                    prop="content"
                    label="内容"
            >

                <template slot-scope="scope">
                    <div>  {{ scope.row.content}} </div>

                </template>
            </el-table-column>-->
            <el-table-column
                    prop="type"
                    label="类型">

                <template slot-scope="scope">
                    {{ dict.cms_type_map[scope.row.type]}}

                </template>

            </el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    :formatter="stateFormatter">
            </el-table-column>
            <el-table-column
                    prop="link"
                    label="链接"
                    :formatter="createLink"
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
                    <el-button type="primary" v-if="scope.row.state == 0" @click="changeArticleState(scope.$index,scope.row.id, 1) ">启用</el-button>
                    <el-button type="primary" v-if="scope.row.state == 1" @click="changeArticleState(scope.$index,scope.row.id, 0) ">禁用</el-button>
                    <el-button type="danger primary" v-if="scope.row.state == 0" @click="changeArticleState(scope.$index,scope.row.id, 2) ">删除</el-button>
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
    import * as API from "../../api/cms_api"
    import Editor from './Editor'

    export default {
        components: {
            Editor
        },
        data() {
            return {
                options: {
                    state_type: dict.notice_state_type,
                    channel: dict.channel_type,
                    type: dict.cms_type_map
                },
                dict: dict,
                items: [],
                listLoading: false,

                dialogTitle: '',
                dialogVisible: false,
                dialogDisable: false,

                cmsForm: {
                    id: '',
                    name: '',
                    link: '',
                    state:"1",
                    order_no: '',
                    type: "",
                    content: ''
                },
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                filters: {
                    state:'',//状态
                    channel:'',//渠道

                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
                    ],
                    order_no: [{validator: checkFields.order_no, required: true, trigger: 'blur'}],
                    type: [
                        { required: true, message: '请选择分类', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '文章不能为空', trigger: 'blur' }
                    ],

                }
            }
        },
        methods: {
            showDetails(iid) {

                this.dialogTitle = '文章详情';

                let paras = {};
                paras.id = iid;
                API.getArticleSingle(paras).then((res) =>{
                    if (res.status == 200) {
                        this.cmsForm = Object.assign(this.cmsForm,JSON.parse(res.datas)) ;
                        this.cmsForm.type = this.cmsForm.type+"";
                        this.cmsForm.content = this.cmsForm.content+"";

                        this.dialogVisible = true;

                        this.$nextTick(function () {
                            this.$refs.editor.setEditor()
                        })

                        // this.editor = this.cmsForm.content;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);

                    }


                })
            },
            ievent(data){
                this.cmsForm.content = data
            },

            selectType(val) {

            },
            add(){

                this.$refs['cmsForm'].validate((valid) => {
                        if (valid) {

                            API.getArticleAdd(this.cmsForm).then((res) => {
                                this.dialogVisible = false
                                if (res.status == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '发布成功!'
                                    });
                                    this.cmsForm = {};
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
            articleUpdate() {
                return new Promise((resolve, reject) => {

                    API.getArticleUpdate(this.cmsForm).then((res) => {

                        if (res.status == 200) {
                            this.getList(1)
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

                this.dialogTitle = "添加文章"
                this.dialogVisible = true
                this.dialogDisable = false;
                this.cmsForm.content = ""
                this.cmsForm.id = ""
            },
            handleClose() {
                this.cmsForm = {};
                this.dialogVisible = false
                this.$refs['cmsForm'].clearValidate();
            },
            //清空筛选表单
            resetForm(formName) {
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

                API.getArticleList(paras).then((res) => {
                    console.log(res)
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
            })
        }
    }
</script>
