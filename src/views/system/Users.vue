<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>


        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                            placeholder="用户名"
                            v-model="filters.user_name">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                            placeholder="昵称"
                            v-model="filters.nickname">
                    </el-input>
                </el-form-item>
                <el-form-item label="所属角色" :label-width="formLabelWidth">
                    <el-select v-model="filters.role_name" clearable　placeholder="请选择" @change="selectRole">
                        <el-option
                                v-for="role in roles"
                                :key="role.id"
                                :label="role.role"
                                :value="role.role">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getUsers()">查询</el-button>

                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="showAddUserPage">新增</el-button>

                </el-form-item>

            </el-form>
        </el-col>


        <el-table
                :data="users"
                style="width: 100%">
            <el-table-column
                    prop="user_name"
                    label="用户名"
            >
            </el-table-column>
            <el-table-column
                    prop="nickname"
                    label="昵称"
            >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button

                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button

                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    background
                    layout="prev, pager, next" :page-size="20"
                    :total="total" @current-change="changePageNumber"
                    style="float:right;">
            </el-pagination>
        </el-col>


        <!-- Form-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="resetForm">
            <el-form :model="userForm" :rules="rules" ref="userFormRef" :label-width="formLabelWidth">
                <el-form-item label="手机号" prop="user_name">
                    <el-input v-model.number="userForm.user_name" :input-width="formInputWidth"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
                    <el-input v-model="userForm.nickname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="userForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属角色" :label-width="formLabelWidth" prop="role_id">
                    <el-select v-model="userForm.role_id" clearable　placeholder="请选择" @change="selectRole">
                        <el-option
                                v-for="role in roles"
                                :key="role.id"
                                :label="role.role"
                                :value="role.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="addOrUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </section>


</template>

<script>
    import {
        getAdminUserList,
        addAdminUser,
        removeAdminUser,
        editAdminUser,
        getRoleList,
        getAdminUserById
    } from '../../api/auth_api.js';
    import ElButton from "element-ui/packages/button/src/button";
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import ElInput from "element-ui/packages/input/src/input";
    import request from "superagent";

    import * as checkFields from "../../common/js/checkFields"

    export default {
        props: ["params"],
        components: {
            ElInput,
            ElFormItem,
            ElButton
        },
        data() {

            return {
                current_data: {},
                page_size: 20,
                page_no: 1,
                total: 0,
                users: [{
                    user_name: '',
                    nickname: '',
                    role_id: '',
                    role_name: ''
                }],
                roles: [{
                    id: '',
                    role: '',
                    desc: '',
                    resources: '',
                    status: ''
                }],
                rules: {
                    user_name: [{validator: checkFields.phone, required: true, trigger: 'blur'}],
                    nickname:[{validator:checkFields.nickname,trigger: 'blur'}],
                    password: [{validator: checkFields.password, required: true, trigger: 'blur'}]
                    // role_id:[{type: "string", required: false, message: '请选择所属角色', trigger:'blur'}]
                },
                title: "",
                type: '',
                filters: {
                    user_name: '',
                    nickname:'',
                    role_name:''
                },
                dialogFormVisible: false,
                userForm: {
                    id: '',
                    user_name: '',
                    nickname: '',
                    password: '',
                    role_name: '',
                    role_id: ''
                },
                formLabelWidth: '80px',
                formInputWidth: '80px'

            }
        },
        methods: {
            /* formatStatus(row) {
                 return row.status === '1' ? '启用' : row.status === '0' ? '禁用' : '未知';
             },*/
            changePageNumber(val) {
                this.page_no = val;
                this.getUsers();
            },
            selectRole(val) {
                let obj = {};
                obj = this.roles.find((role) => {
                    return role.id === val;
                });
                this.userForm.role_name = obj.role;
            },
            getUsers() {
                let paras = {
                    page_size: this.page_size,
                    page_no: this.page_no,
                    user_name: this.filters.user_name,
                    nickname:this.filters.nickname,
                    role_name:this.filters.role_name
                };

                getAdminUserList(paras).then((res) => {

                    if (res.data.status === 200) {

                        let datas = JSON.parse(res.data.datas);
                        this.users = datas.items;
                        this.total = datas.total;
                    } else {
                        this.$message.error(res.data.msg);
                    }

                });
            },
            getRoles() {
                getRoleList().then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status === 200) {
                        this.roles = result.items;
                    }
                })

            },
            showAddUserPage() {
                this.title = "新增用户";
                this.type = 1;
                //this.getRoles();
                this.dialogFormVisible = true;
                this.rules.password[0].required = true;
            },
            addOrUpdate() {
                this.$refs['userFormRef'].validate((valid) => {
                    if (valid) {
                        if (this.type === 1) {
                            this.addUser();
                        } else if (this.type === 2) {
                            this.updateUser();
                        }
                    } else {
                        this.$message("数据不符合规则");
                        return false;
                    }
                })
            },
            addUser: function () {
                addAdminUser(this.userForm).then((res) => {
                    if (res.data.status === 200) {
                        this.users.splice(0, 0, Object.assign({}, this.userForm));
                        this.$message("添加成功!");
                        this.getUsers();
                        //重置表单
                        this.resetForm();
                    } else {
                        this.$message.error(res.data.msg);
                    }

                });

            },
            updateUser() {

                editAdminUser(this.userForm).then((res) => {
                    if (res.data.status === 200) {
                        this.$message("修改成功!");
                        this.current_data = this.userForm;
                        //重置表单
                        this.resetForm();
                        this.getUsers();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });

            },
            handleEdit(index, row) {
                this.rules.password[0].required = false; //修改的时候密码可以为空
                this.title = "修改用户";
                getAdminUserById({"id": row.id}).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status === 200) {
                        this.current_data = result;
                        this.userForm = Object.assign({}, result);
                    }
                });
                this.userForm.password = '';
                this.dialogFormVisible = true;
                this.type = 2;
            },
            handleDelete(index, row) {
                let that = this;
                this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeAdminUser({"id": row.id, "user_name": row.user_name}).then((res) => {
                        if (res.data.status === 200) {
                            this.users.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                type: 'info',
                                message: result.msg
                            });
                        }
                    });

                });
            },
            resetForm() {       //重置 表单
                this.dialogFormVisible = false;
                this.userForm = {
                    id: '',
                    user_name: '',
                    nickname: '',
                    password: '',
                    role_name: '',
                    role_id: ''
                }
                this.$refs['userFormRef'].resetFields();
            }

        },
        mounted() {
            this.$nextTick(function () {

                this.getUsers();
                this.getRoles();
            })
        }

    }
</script>