<template>
    <section>
        <el-col :span="2" :push="22">
            <!--<el-button @click="resetPass()">重置密码</el-button>-->
            <el-button type="primary" @click="editSaleInfo('userFormRef')">更 新</el-button>
        </el-col>
        <el-col :push="1">
            <el-form :model="userForm" :inline="true" :rules="userFormRules" ref="userFormRef" label-position="left"
                     label-width="95px">
                <el-col><h4>基本信息</h4></el-col>
                <el-col :span="15" :push="2" class="toolbar" style="padding-bottom: 0px; ">
                    <el-form-item label="销售编号" prop="sales_no" style="margin-top: 10px">
                        <el-input disabled placeholder="销售编号" v-model="userForm.sales_no"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="销售姓名" prop="name" style="margin-top: 10px">
                        <el-input disabled placeholder="销售姓名" v-model="userForm.name" auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="start_time" style="margin-top: 10px">
                        <el-input disabled placeholder="创建时间" v-model="userForm.start_time"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="更新时间" prop="end_time" style="margin-top: 10px">
                        <el-input disabled placeholder="更新时间" v-model="userForm.end_time"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="identity_type" style="margin-top: 10px">
                        <el-select disabled placeholder="证件类型" v-model="userForm.identity_type">
                            <el-option :key="item.value" :label="item.key" :value="item.value"
                                       v-for="item in identityTypeOptions"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码" prop="identity_no" style="margin-top: 10px">
                        <el-input disabled placeholder="请输入证件号" v-model="userForm.identity_no"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile" style="margin-top: 10px">
                        <el-input disabled placeholder="请输入手机号" v-model.number="userForm.mobile"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                    <el-form-item label="在岗状态" prop="sales_state" style="margin-top: 10px">
                        <el-select placeholder="在岗状态" v-model="userForm.sales_state">
                            <el-option :key="item.value" :label="item.key" :value="item.value"
                                       v-for="item in salesStateOptions"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公司" prop="company_id" style="margin-top: 10px">
                        <el-select placeholder="公司名称" @change="changeCompany" v-model="userForm.company_id">
                            <el-option :key="item.id" :label="item.company_name" :value="item.id"
                                       v-for="item in tempTree.companyTree"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职时间" prop="work_time" style="margin-top: 10px">
                        <el-input disabled  v-model="userForm.work_time"
                                  auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="userForm.leave_time" label="离职时间" prop="leave_time" style="margin-top: 10px">
                        <el-input disabled v-model="userForm.leave_time"
                                  auto-complete="off"> </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>
    </section>
</template>

<script>
    import {getSaleInfo, editInsiderInfo, resetPassInfo, getIinsiderOrganization} from "../../api/sale_api";
    import * as checkFields from "../../common/js/checkFields";
    import dict from '../../common/js/dict';
    import {isBirthDate} from '../../common/js/commons'


    export default {
        data() {
            return {
                options: {
                    position: dict.sales_position,
                    position_dic: dict.sales_position_dic,
                },
                //基本信息
                userForm: {
                    name: '',
                    mobile: '',
                    identity_type: '',
                    identity_no: '',
                    leave_time: '',
                    work_time: '',
                    sales_state: 1,
                    positions: [{
                        company_name: '',
                        department_name: '',
                        team_name: '',
                        position_type: ''
                    }]
                },
                userFormRules: {
                    sales_name: {required: true, message: "销售姓名不能为空!", trigger: 'blur'},
                    identity_type: {required: true, message: "证件类型不能为空!", trigger: 'change'},
                    mobile: {required: true, message: "手机号不能为空!", trigger: 'blur'},
                    identity_no: {validator: checkFields.all_identity_no, required: true, trigger: 'blur'},
                    sales_state: {required: true, message: "在岗状态不能为空", trigger: 'change'}
                },
                positionFormRules:{
                    company_id: {required: true, message: "请选择一个公司"}
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
                // sales_id: '',
                salesStateOptions: dict.sales_state,
                identityTypeOptions: [{'value': 1, 'key': '身份证'}, {'value': 3, 'key': '护照'}]
            };
        },
        methods: {
            //获取基本信息
            getItemsInfo() {
                let customer_id = this.$route.params.id;
                if(!customer_id || customer_id.length ===0)
                {
                    this.$message.error("没有获取到用户信息，请返回重试");
                    return false;
                }
                getSaleInfo({"id": customer_id}).then((res) => {
                    if (res.data.status == 200) {
                        this.userForm = JSON.parse(res.data.datas);
                        this.userForm.work_time = this.isBirthDate(this.userForm.work_time);
                        this.userForm.leave_time = this.isBirthDate(this.userForm.leave_time);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //提交表单
            editSaleInfo() {
                if (!this.userForm.company_id) {
                    this.$message.error("请选择销售所属公司!");
                    return false;
                }
                this.$refs["userFormRef"].validate((valid) => {
                    if (valid) {
                        this.addOrUpdate();
                    } else {
                        return false;
                    }
                });
            },
            //更新销售
            addOrUpdate: function () {
                editInsiderInfo(this.userForm).then((res) => {
                    if (res.data.status === 200) {
                        this.$message("编辑成功!");
                        this.$router.push('/insider/list');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //返回上级
            cancle() {
                this.$router.push('/insider/list');
            },
            restForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogFormVisible = false;
            },
            //获取公司树
            initTreeData() {     //从 服务器获取数据
                getIinsiderOrganization().then((res) => {
                    if (res.data.status == 200) {
                        this.treeData = JSON.parse(res.data.datas);
                        if (this.treeData) {
                            this.initTempTree();
                            this.getItemsInfo();
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
            changeCompany() {
                this.initTempTreeDepartment();
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
            //重置密码
            resetPass() {
                this.$confirm('确认要重置该销售密码为初始密码吗？','重置密码确认',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetPassInfo({"id": this.$route.params.id}).then((res) => {
                        if (res.data.status == 200) {
                            this.$message('密码已重置成功，初始密码 123456');
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                }).catch(() => {});

            },
            //格式化日期
            isBirthDate(row) {
                return isBirthDate(row);
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.initTreeData(); //初始化页面数据
            });
        }
    };
</script>

<style lang="scss" scoped>
    /*.base-Info {*/
    /*margin-top: 20px;*/
    /*}*/

    /*.el-row {*/
    /*margin-bottom: 20px;*/
    /*&:last-child {*/
    /*margin-bottom: 0;*/
    /*}*/
    /*}*/

    /*.grid-content {*/
    /*border-radius: 4px;*/
    /*min-height: 16px;*/
    /*}*/

    /*.grid-right {*/
    /*text-align: right;*/
    /*}*/
</style>
