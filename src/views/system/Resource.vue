<template>
    <section>
        <el-tree

                :data="tree_data"
                accordion
                node-key="id"
                :default-expand-all="false"
                ref="tree"
                :render-content="renderContent">
        </el-tree>

        <div class="el-row"><div class="el-col el-col-24"><div class="add-content bg-purple-dark" @click="showAddResource(null, null)">  添加一级资源  </div></div></div>

        <!-- Form -->


        <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :before-close="resetForm">
            <el-form :model="resource_form" :rules="rules" ref="resource_form_ref">
                <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="resource_form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="URL路径" prop="uri" :label-width="formLabelWidth">
                    <el-input v-model="resource_form.uri" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="权限值" prop="permission" :label-width="formLabelWidth">
                    <el-select v-model="resource_form.permission" clearable placeholder="请选择">
                        <el-option
                                v-for="item in permissions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="resource_form.type">
                        <el-radio :label="0">菜单</el-radio>
                        <el-radio :label="1">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编码" prop="code" :label-width="formLabelWidth">
                    <el-input v-model="resource_form.code" auto-complete="off" :maxlength="9" :minlength="5"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-switch
                            v-model="resource_form.status"
                            :active-value=default_status_normal
                            :inactive-value=default_status_error>
                    </el-switch>
                </el-form-item>
                <el-form-item label="请求方式" prop="request_type" :label-width="formLabelWidth">
                    <el-select v-model="resource_form.request_type" clearable placeholder="请选择">
                        <el-option
                                v-for="item in request_types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>

    import * as auth_api from '../../api/auth_api';	// node 接口
    import * as checkFields from "../../common/js/checkFields"

    export default {
        data() {
            return {
                type: 1,                    //1 新增，2 修改
                dialogFormVisible: false,   //显示/隐藏表单
                dialogFormTitle: '添加资源',
                parent_node_data: {},       //添加节点的时候使用
                current_node_data: {},      //修改的时候使用
                default_status_normal: 0,    //正常状态
                default_status_error: 1,     //异常状态
                resource_form: {            //表单 数据绑定
                    id: '',
                    name: '',
                    uri: '',
                    request_type: '',   //类型描述
                    type: 0,            //0：菜单, 1：按钮
                    status: 0,          //0：正常, 1：异常
                    lev: 0,             //页面此处默认为0/ 1.2.3菜单级别 4.5页面级
                    parent_id: '0',
                    children: [],
                    code: 10010,
                    permission: '',
                    create_time: '',
                    update_time: ''
                },
                rules: {                //表单过滤
                    name: [
                        {validator:checkFields.name, required: true,trigger: 'blur'}
                    ],
                    uri: [
                        {validator:checkFields.uri, required: true,trigger: 'blur'}
                    ],
                    /*permission: [
                        {type: "string", required: true, message: '请选择权限值', trigger: 'blur'}
                    ],*/
                    request_type: [
                        {type: "string", required: true, message: '请选择类型描述', trigger: 'blur'}
                    ]
                    ,
                    code: [
                        {validator:checkFields.codeMustBeNumber, required: true,trigger: 'blur'}
                    ]
                },
                request_types:[{
                    value: 'GET',
                    label: 'GET'
                },{
                    value: 'POST',
                    label: 'POST'
                },{
                    value: 'PUT',
                    label: 'PUT'
                },{
                    value: 'DELETE',
                    label: 'DELETE'
                }],
                permissions:[{
                    value: 'add',
                    label: '添加'
                },{
                    value: 'update',
                    label: '更新'
                },{
                    value: 'delete',
                    label: '删除'
                },{
                    value: 'get',
                    label: '查询列表'
                },{
                    value: 'find',
                    label: '查询通过ID'
                },{
                    value: 'password',
                    label: '修改密码'
                }],
                formLabelWidth: '120px',
                tree_data: [        //树 数据
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },

        methods: {
            removeNode(node, data, event) {        //删除节点

                event.cancelBubble = true;      //阻止事件冒泡
                this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    auth_api.removeResources({'id': data.id, 'name': data.name}).then((res) => {
                        if (res.data.status == 200) {
                            const parent = node.parent;
                            const children = parent.data.children || parent.data;
                            const index = children.findIndex(d => d.id === data.id);
                            children.splice(index, 1);

                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            renderContent(h, { node, data, store }) {       //渲染 树

                let jsx = (
                    <span style="flex: 1; display: flex; align-items: center; /*justify-content: space-between;*/ font-size: 14px; padding-right: 8px; " v-show="false" >
                    </span>
                );

                if(data.status == 1){
                    jsx.children.push(
                        <span>
                        <span>{node.data.name}</span>
                        <span style="margin-left: 11px;color: #CCCCCC;">{node.data.code}</span>
                        <span style="margin-left: 11px;color: #CCCCCC;">禁用</span>
                            </span>
                    )
                }else{
                    jsx.children.push(
                        <span>
                        <span>{node.data.name}</span>
                    <span style="margin-left: 11px;color: #CCCCCC;">{node.data.code}</span>
                            </span>
                    )
                }

                if(node.data.lev == 1){
                    jsx.children.push(
                        <span class="btn">
                            <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.showAddResource(data, event) }>添加下级</el-button>
                            <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.showEditResource(data, event) }>编辑</el-button>
                            <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.removeNode(node, data, event) }>删除</el-button>
                        </span>
                    )
                }else if(node.data.lev == 2){
                    jsx.children.push(
                        <span class="btn">
                            <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.showAddResource(data, event) }>添加下级</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.showEditResource(data, event) }>编辑</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.removeNode(node, data, event) }>删除</el-button>
                        </span>
                    )
                }else if(node.data.lev == 3){
                    jsx.children.push(
                        <span class="btn">
                        <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.showEditResource(data, event) }>编辑</el-button>
                        <el-button style="font-size: 12px;" type="text" on-click={ (event) => this.removeNode(node, data, event) }>删除</el-button>
                        </span>
                    )
                }

                return (jsx)
            },
            showAddResource(data, event) {          //添加新的节点，显示 表单并加载数据
                this.dialogFormTitle = '添加资源';
                if (data == null) {
                    this.resource_form.lev = 0;
                    data = Object.assign({}, this.resource_form);
                }else{
                    event.cancelBubble = true;      //阻止事件冒泡
                    console.log( '编辑资源')
                }
                this.dialogFormVisible = true;
                this.type = 1;
                this.parent_node_data = data;

                switch (data.lev + 1) {
                    case 1:
                        if (!this.tree_data || this.tree_data.length == 0) {
                            this.resource_form.code = 10010;
                        } else {
                            this.resource_form.code = 10000 + (this.tree_data.length + 1) * 10;
                        }

                        this.resource_form.lev = 1;
                        this.resource_form.parent_id = "0";
                        break;
                    case 2:
                        if (!data.children || data.children.length == 0) {
                            this.resource_form.code = 30010;
                        } else {
                            this.resource_form.code = 30000 + (data.children.length + 1) * 10;
                        }
                        this.resource_form.lev = data.lev + 1;
                        this.resource_form.parent_id = data.id;
                        break;
                    case 3:
                        if (!data.children || data.children.length == 0) {
                            this.resource_form.code = 50010;
                        } else {
                            this.resource_form.code = 50000 + (data.children.length + 1) * 10;
                        }
                        this.resource_form.lev = data.lev + 1;
                        this.resource_form.parent_id = data.id;
                        break;
                    default:
                        break;
                }
            },
            showEditResource(data, event) {     //修改节点，显示表单并加载数据
                event.cancelBubble = true;      //阻止事件冒泡
                this.dialogFormVisible = true;
                this.dialogFormTitle = '编辑资源';
                this.type = 2;
                this.current_node_data = data;
                this.resource_form = Object.assign({}, data);
            },
            submit() {           //修改/添加
                let that = this;
                if (that.type == 1) {             //新增
                    that.$refs["resource_form_ref"].validate((valid) => {
                        if (valid) {
                            that.resource_form.lev = that.parent_node_data.lev + 1;
                            auth_api.addResources(that.resource_form).then(res => {
                                if (res.data.status == 200) {

                                    const newChild = Object.assign({}, that.resource_form);
                                    newChild.id = JSON.parse(res.data.datas).id;
                                    newChild.lev = that.parent_node_data.lev + 1;
                                    newChild.children = [];

                                    if (newChild.lev == 1) {
                                        that.tree_data.push(newChild);
                                    } else {
                                        if (!that.parent_node_data.children) {
                                            that.$set(that.parent_node_data, 'children', []);
                                        }
                                        that.parent_node_data.children.push(newChild);
                                    }
                                    that.resetForm();

                                    this.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                } else if (that.type == 2) {       //修改
                    that.$refs["resource_form_ref"].validate((valid) => {
                        if (valid) {

                            auth_api.editResources(that.resource_form).then((res) => {
                                if (res.data.status == 200) {
                                    that.current_node_data.name = that.resource_form.name;
                                    that.current_node_data.uri = that.resource_form.uri;
                                    that.current_node_data.request_type = that.resource_form.request_type;
                                    that.current_node_data.permission = that.resource_form.permission;
                                    that.current_node_data.type = that.resource_form.type;
                                    that.current_node_data.code = that.resource_form.code;
                                    that.current_node_data.status = that.resource_form.status;

                                    that.resetForm();

                                    this.$message({
                                        type: 'success',
                                        message: '更新成功!'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            });

                        } else {
                            return false;
                        }
                    });
                }
            },
            resetForm() {       //重置 表单
                this.dialogFormVisible = false;
                this.resource_form = {            //表单 数据绑定
                    id: '',
                    name: '',
                    uri: '',
                    request_type: '',   //类型描述
                    type: 0,            //0：菜单, 1：按钮
                    status: 0,          //0：正常, 1：异常
                    lev: 0,             //页面此处默认为0/ 1.2.3菜单级别 4.5页面级
                    parent_id: '0',
                    children: [],
                    code: 10010,
                    permission: '',
                    create_time: '',
                    update_time: ''
                };
                this.$refs["resource_form_ref"].resetFields();
            },

            initTreeData() {     //从 服务器获取数据
                auth_api.getResourcesList().then((res) => {
                    if(res.data.status == 200){
                        let raw_tree_list = JSON.parse(res.data.datas);
                        console.log(raw_tree_list)
                        this.tree_data = raw_tree_list;
                    }else{
                        if(res.data.status == 401){
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initTreeData();
            })

        }
    };
</script>

<style>
    .el-tree-node__content {height:40px;position:relative;}
    .el-tree-node__content .btn{display:none;position:absolute;left:450px;top:0px;}
    .el-tree-node__content:hover .btn{display:block}


    .el-col{border-radius:4px}
    .bg-purple-dark{background:#f6f6f6}
    .bg-purple-dark:hover{background:#eee}
    .add-content{margin-top:20px;color:#666;text-align:center;line-height:36px;cursor:pointer;border-radius:4px;min-height:36px}
</style>