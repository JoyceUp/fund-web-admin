<template>
    <section>
        <el-col :span="24"  class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filtersFrom" size="medium" >
                <el-form-item prop="state">
                    <el-select placeholder="状态" v-model="filters.state">
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.state_type"></el-option>
                        <!--<el-option :key="item.value" :label="item.key" :value="item.value" v-for="item in orderStateOptions" ></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item prop="channel">
                    <el-select placeholder="渠道" v-model="filters.channel">
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.channel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList(1)" size="small">查询</el-button>
                    <el-button  @click="resetForm('filtersFrom')" size="small">清空</el-button>
                    <el-button  @click="addDialogItem" size="small">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>


        <!-- table -->
        <el-table :data="items" stripe v-loading="listLoading" size="middle">

            <el-table-column prop="name" label="标题" width="180">
                <template slot-scope="scope">
                    <el-button @click="showDetails(scope.row.id)" type="text" size="small">{{ scope.row.name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" :formatter="stateFormatter"></el-table-column>
            <el-table-column prop="channel" label="渠道" :formatter="channelFormatter"></el-table-column>
            <!--<el-table-column prop="link" label="链接" width="180" :formatter="createLink"></el-table-column>-->
            <el-table-column prop="gmt_create" label="创建时间"></el-table-column>
            <el-table-column prop="gmt_modified" label="更新时间"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.state == 0" @click="changeNoticeState(scope.$index,scope.row.id, 1) ">启用</el-button>
                    <el-button type="primary" v-if="scope.row.state == 1" @click="changeNoticeState(scope.$index,scope.row.id, 0) ">禁用</el-button>
                    <el-button type="danger primary" v-if="scope.row.state == 0" @click="changeNoticeState(scope.$index,scope.row.id,2) ">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                    :current-page="pager.page_no" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>
        <el-dialog :title="dialogFormTitle" :visible.sync="addItemDialogVisible" @close="clearUpData" :fullscreen="true">
            <el-form :model="addItem" :rules="formRules" label-width="80px" ref="addItem">
                <!--<el-input type="hidden" v-model="addItem.id" auto-complete="off"></el-input>-->
                <el-form-item label="标题" prop="name">
                    <el-input v-model="addItem.name" auto-complete="off" :disabled="dialogDisable"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="link">
                    <el-input v-model="addItem.link" :disabled="dialogDisable"  readonly></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select placeholder="请选择状态" v-model="addItem.state" :disabled="dialogDisable">
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.state_type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select placeholder="请选择渠道" v-model="addItem.channel" :disabled="dialogDisable">
                        <el-option :key="key" :label="value" :value="key" v-for="(value, key) in options.channel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">

                    <editor ref="editor" @ievent = "ievent" :contentHtml="addItem.content"></editor>
                    <input type="hidden" v-model="addItem.content"  >
                </el-form-item>

            </el-form>
            <div v-if="dialogDisable == true" slot="footer" class="dialog-footer">
                <!--<el-button type="primary" @click="saveItem('addItem')">保 存</el-button>-->
                <!--<el-button @click="addItemDialogVisible = false">取 消</el-button>-->
                <el-button v-if="dialogDisable" @click="addItemDialogVisible = false">关 闭</el-button>
            </div>
            <div v-else slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveItem('addItem')">保 存</el-button>
                <el-button @click="addItemDialogVisible = false">取 消</el-button>
                <!--<el-button @click="addItemDialogVisible = false">关 闭</el-button>-->
            </div>
        </el-dialog>


    </section>
</template>
<script>

    import * as API from "../../api/cms_api";
    import dict from '../../common/js/dict';
    import * as checkFields from "../../common/js/checkFields"
    import Editor from './Editor'
    export default {
        components: {
            Editor
        },
        data() {
            return {
                listLoading:false,
                addItemDialogVisible: false,
                dialogFormTitle: '新增通知',     //展示详情的标题
                dialogDisable: false,
                items: [],
                addItem: {
                    id: '',
                    name: "",
                    link: "",
                    channel: '',
                },
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                options: {
                    state_type: dict.notice_state_type,
                    channel: dict.channel_type
                },

                filters: {
                    state:'',//状态
                    channel:'',//渠道
                },
                formRules: {
                    name: [{required: true, message: '名称不可为空！', trigger: 'blur'}],
                    state: [{required: true, message: '请选择状态！', trigger: 'blur'}],
                    channel: [{ required: true, message: '请选择渠道', trigger: 'change'}]
                },
            }
        },
        methods: {
            //清空筛选表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
            handlePagerChange() {this.getList();},

            getList(num) {
                this.listLoading=true;
                if(num){
                    this.pager.page_no = 1;
                }
                // let paras = Object.assign(this.positionDic, this.filters);
                let condition = Object.assign({},this.filters);
                let paras = {};
                paras.condition = condition;
                paras.page_no = this.pager.page_no;
                paras.page_size =this.pager.page_size;
                paras.order_column = "";
                paras.order_by = "";
                API.getNoticeList(paras).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {
                        this.listLoading = false;
                        if(result != null){
                            this.items = result.items;
                            this.pager.total = result.total;
                        }
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                })
            },

            //弹框关闭清除已添加的数据
            clearUpData() {
                this.addItem = {
                    id: '',
                    name: "",
                    link: "",
                    channel: '',
                    content:""
                };
                this.addItemDialogVisible = false;
                this.$refs['addItem'].clearValidate();
            },
            addDialogItem() {
                this.addItemDialogVisible = true;
                this.dialogDisable = false;
            },
            showDetails(iid) {
                this.addItemDialogVisible = true;
                this.dialogFormTitle = '通知详情';
                this.dialogDisable = false;
                let paras = {};
                paras.id = iid;
                API.showNotice(paras).then((res) =>{
                    if (res.data.status == 200) {
                        let result = JSON.parse(res.data.datas);
                        this.addItem = result;
                        this.addItem.state = this.addItem.state+"";
                        this.addItem.channel = this.addItem.channel+"";
                        this.$nextTick(function () {
                            this.$refs.editor.setEditor()
                        })
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                })
            },
            ievent(data){
                this.addItem.content = data
            },

            saveItem(formName) {
                let that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = Object.assign({},that.addItem);

                        if (params.id == "" || params.id == undefined) {             //新增
                            API.addNotice(params).then((res) =>{
                                if (res.data.status == 200) {
                                    this.getList(1);
                                } else {
                                    if (res.data.status == 401) {
                                        this.$router.push('/login');
                                    }
                                    this.$message.error(res.data.msg);
                                }

                            })
                        }else{
                            API.editNotice(params).then((res) =>{
                                if (res.data.status == 200) {
                                    this.getList(1);
                                } else {
                                    if (res.data.status == 401) {
                                        this.$router.push('/login');
                                    }
                                    this.$message.error(res.data.msg);
                                }

                            })
                        }
                        this.addItemDialogVisible = false;
                    }
                })

            },
            changeNoticeState(index, row, state) {
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
                    API.changeNoticeState(paras).then((res) => {
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
