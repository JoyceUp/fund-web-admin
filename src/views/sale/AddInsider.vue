<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <el-col>
            <el-form :model="userForm" :inline="true" :rules="userFormRules" ref="userFormRef" label-position="left"
                     label-width="95px">
                <el-col :span="24"   class="toolbar" style="padding-bottom: 0px; ">
                    <el-form-item label="销售姓名" prop="name" style="margin-top: 10px">
                        <el-input disabled placeholder="销售姓名" v-model="userForm.name" auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="identity_type" style="margin-top: 10px">
                        <el-select disabled placeholder="证件类型" v-model="userForm.identity_type">
                            <el-option :key="item.value" :label="item.key" :value="item.value"
                                       v-for="item in identityTypeOptions"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile" style="margin-top: 10px">
                        <el-input disabled placeholder="请输入手机号" v-model.number="userForm.mobile"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="证件号码" prop="identity_no" style="margin-top: 10px">
                        <el-input disabled placeholder="请输入证件号" v-model="userForm.identity_no"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="在岗状态" prop="sales_state" style="margin-top: 10px">
                        <el-select placeholder="在岗状态" v-model="userForm.sales_state">
                            <el-option :key="item.value" :label="item.key" :value="item.value"
                                       v-for="item in salesStateOptions"> </el-option>
                        </el-select>
                    </el-form-item>
                        <el-form-item label="公司" prop="company_id" style="margin-top: 10px">
                            <el-select placeholder="公司名称" @change="changeCompany(tempTree.company_id)" v-model="tempTree.company_id">
                                <el-option :key="item.id" :label="item.company_name" :value="item.id"
                                           v-for="item in tempTree.companyTree"> </el-option>
                            </el-select>
                        </el-form-item>

                </el-col>
            </el-form>
        </el-col>
        <el-col :span="24" :push="7">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
        </el-col>
    </section>
</template>

<script>
    import {addInsiderInfo, getIinsiderOrganization} from '../../api/sale_api';
    import * as checkFields from "../../common/js/checkFields"
    import dict from '../../common/js/dict';

    export default {
        props: ["params"],
        data() {
            return {
                options: {
                    position: dict.sales_position,
                },
                userForm: {
                    name: '',
                    mobile: '',
                    identity_type: '',
                    identity_no: '',
                    sales_state: 1,
                    company_id: ""
                },



            agcdege:{
                "name":"fullName",
                "identity_type":1,
                "mobile":"123",
                "identity_no":"110",
                "sales_state":1,
                "company_id":"123",
                "sales_no":"1",
            },
            userFormRules: {
                    name: {required: true, message: "销售姓名不能为空!", trigger: 'blur'},
                    identity_type: {required: true, message: "证件类型不能为空!", trigger: 'change'},
                    mobile: {required: true, message: "手机号不能为空!", trigger: 'blur'},
                    identity_no: {validator: checkFields.all_identity_no, required: true, trigger: 'blur'},
                    sales_state: {required: true, message: "在岗状态不能为空", trigger: 'change'}
                },
                positionFormRules: {
                    company_id: {required: true, message: "请选择一个公司"},
                },
                treeData: {},
                tempTree: {
                    companyTree: [],
                    company_id: "",
                    company_name: "",
                    departmentTree: [],
                    department_id: "",
                    department_name: "",
                    teamTree: [],
                    team_id: "",
                    team_name: "",
                    position_type: ""
                },
                salesStateOptions: dict.new_sales_state,
                identityTypeOptions: [{'value': 1, 'key': '身份证'}, {'value': 3, 'key': '护照'}],
            }
        },
        methods: {
            //获取基本信息
            getPersonnelInfo() {
                let item = this.params;
                if (!item || !item.identity_no ) {
                    this.$message.error("没有获取到用户信息，请返回重试");
                    return false;
                }
                this.userForm.name = item.name;
                this.userForm.mobile = item.mobile;
                this.userForm.identity_type = item.identity_type;
                this.userForm.identity_no = item.identity_no;
                this.userForm.sales_no = item.sales_no;
            },
            //提交表单
            submitForm() {
                if (!this.userForm.company_id) {
                    this.$message.error("请选择销售所属公司!");
                    return false;
                }
                this.$refs["userFormRef"].validate((valid) => {
                    if (valid) {
                        this.addOrUpdate();
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            //新增或更新销售
            addOrUpdate: function () {
                addInsiderInfo(this.userForm).then((res) => {
                    if (res.data.status === 200) {
                        this.$message("增加销售成功!");
                        this.$emit('closeAddDiaglog',false);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //返回上级
            cancle() {
                this.$emit('closeAddDiaglog',false);
            },
            //获取公司树
            initTreeData() {     //从 服务器获取数据
                getIinsiderOrganization().then((res) => {
                    if (res.data.status == 200) {
                        this.treeData = JSON.parse(res.data.datas);
                        if (this.treeData) {
                            this.initTempTree();
                        }
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //初始化新增职位信息表单
            initTempTree() {
                this.tempTree = {
                    companyTree: [],
                    company_id: "",
                    company_name: "",
                    departmentTree: [],
                    department_id: "",
                    department_name: "",
                    teamTree: [],
                    team_id: "",
                    team_name: "",
                    position_type: ""
                };
                if (this.treeData && this.treeData.children) {
                    this.tempTree.companyTree = this.treeData.children;
                }

            },
            initTempTreeDepartment() {
                this.tempTree.departmentTree = [];
                this.tempTree.department_id = "";
                this.tempTree.department_name = "";
                this.initTempTreeTeam();
            },
            initTempTreeTeam() {
                this.tempTree.teamTree = [];
                this.tempTree.team_id = "";
                this.tempTree.team_name = "";
                this.initTempTreePosition();
            },
            initTempTreePosition() {
                this.tempTree.position_type = "";
            },
            changeCompany(valid) {
                this.initTempTreeDepartment();
                this.userForm.company_id = valid;
                let key = this.tempTree.company_id;
                for (let i = 0; i < this.tempTree.companyTree.length; i++) {
                    if (this.tempTree.companyTree[i].id === key) {
                        let company = this.tempTree.companyTree[i];
                        this.tempTree.company_name = company.company_name;
                        if (company.children) {
                            this.tempTree.departmentTree = company.children;
                        }
                        return;
                    }
                }

            },
            changeDepartment() {
                this.initTempTreeTeam();
                let key = this.tempTree.department_id;

                for (let i = 0; i < this.tempTree.departmentTree.length; i++) {
                    if (this.tempTree.departmentTree[i].id === key) {
                        let department = this.tempTree.departmentTree[i];
                        this.tempTree.department_name = department.department_name;
                        if (department.children) {
                            this.tempTree.teamTree = department.children;
                        }
                        return;
                    }
                }
            },
            changeTeam() {
                this.initTempTreePosition();
                let key = this.tempTree.team_id;
                for (let i = 0; i < this.tempTree.teamTree.length; i++) {
                    if (this.tempTree.teamTree[i].id === key) {
                        let team = this.tempTree.teamTree[i];
                        this.tempTree.team_name = team.team_name;

                        return;
                    }
                }
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.initTreeData();
                this.getPersonnelInfo();
            })
        }

    }
</script>

<style>
    .dialog-footer {
        padding-top: 50px;
        text-align: center
    }

    .demo-form-inline {
        width: auto;
    }

    .demo-form-inline .el-input {
        width: 150px;
    }
</style>