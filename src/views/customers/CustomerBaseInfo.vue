<template>
    <section>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <div class="div-padd">
                    <el-form :model="custInfo" :rules="rules" ref="custInfo" label-width="105px" size="small">
                        <el-input type="hidden" v-model="custInfo.customer_id" ></el-input>
                        <el-form-item>
                            <el-col :span="7" :pull="2"><el-form-item label="注册时间:"><span>{{custInfo.gmt_create}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="1"><el-form-item label="客户编号:"><span>{{custInfo.customer_no}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="0"><el-form-item label="客户姓名:"><span>{{custInfo.name}}</span></el-form-item></el-col>
                        </el-form-item>
                        <el-form-item>
                            <!--<el-col :span="7" :pull="2"><el-form-item label="资产总额(元):"><span>{{centToDollar(custInfo.balance)}}</span></el-form-item></el-col>-->
                            <el-col :span="7" :pull="2"><el-form-item label="证件类型:"><span>{{identityTypeMapOptions[custInfo.identity_type]}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="1"><el-form-item label="证件号码:"><span>{{custInfo.identity_no}}</span></el-form-item></el-col>
                        </el-form-item>
                        <el-form-item>
                            <!--<el-col :span="7" :pull="2"><el-form-item label="手机号码:"><span>{{custInfo.mobile}}</span></el-form-item></el-col>-->
                            <el-col :span="7" :pull="2">

                                <el-form-item  label="手机号" prop="mobile">
                                    <el-input  v-model="custInfo.mobile" auto-complete="off" ></el-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="7" :pull="1"><el-form-item label="认证状态:"><span>{{authStateMapOptions[custInfo.auth_state]}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="0"><el-form-item label="资产总额(元):"><span>{{centToDollar(custInfo.total_asset)}}</span></el-form-item></el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="7" :pull="2"><el-form-item label="活期资产(元):"><span>{{centToDollar(custInfo.invest_current)}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="1"><el-form-item label="定期资产(元):"><span>{{centToDollar(custInfo.invest_fixed)}}</span></el-form-item></el-col>
                            <el-col :span="7" :pull="0"><el-form-item label="账户余额(元):"><span>{{centToDollar(custInfo.balance)}}</span></el-form-item></el-col>
                        </el-form-item>
                    </el-form>

                    <div slot="footer" class="dialog-footer" style="text-align: left">

                        <el-button type="primary" @click="update()">更新信息</el-button>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="银行信息" name="2">
                <el-table :data="brand_cards" stripe style="width: 100%" >
                    <el-table-column prop="bank_country" label="银行国家"></el-table-column>
                    <el-table-column prop="bank_province" label="银行省"></el-table-column>
                    <el-table-column prop="bank_city" label="银行城市"></el-table-column>
                    <el-table-column prop="bank_name" label="银行名称"></el-table-column>
                    <el-table-column prop="branch_name" label="支行名称"></el-table-column>
                    <el-table-column prop="card_no" label="银行帐号"></el-table-column>
                    <el-table-column prop="bank_mobile" label="预留手机号"></el-table-column>
                    <!--<el-table-column prop="is_default" label="是否默认"></el-table-column>-->
                    <el-table-column label="状态"><template slot-scope="scope"> <span>{{brandStateOptions[scope.row.state]}}</span></template></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>
<script>
    import {getCustomersInfo, getCustomersBankcardList,updateCustomersInfo} from '../../api/customers_api';
    import dict from '../../common/js/dict';
    import {centToDollar} from '../../common/js/commons';
    import * as checkFields from '../../common/js/checkFields';

    export default {
        data() {
            return {
                activeNames:['1'],
                checkFields:checkFields,
                listLoading:false,
                custInfo: {
                    customer_id: '',
                    gmt_create: '',  //注册时间
                    customer_no: '', //客户编号
                    name: '',        //客户姓名
                    balance_total: '',//资产总额(元)
                    identity_type:'',//证件类型
                    identity_no:'',  //证件号码
                    mobile:'',       //手机号码
                    auth_state:'',   //认证状态
                },
                // info_rules: {
                //     gmt_create: [
                //         { required: true, message: '注册时间不能为空', trigger: 'blur' },
                //         { type: 'date', message: '注册时间格式错误', trigger: 'blur' }
                //     ],
                //     customer_no: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
                //     amount: [
                //         { required: true, message: '金额不能为空', trigger: 'blur' },
                //         { type: 'number', message: '请填写数字', trigger: 'blur' }
                //     ],
                //     identity_type: [{ required: true, message: '证件类型请选择', trigger: 'change' }],
                //     name: { required: true, message: '客户姓名不能为空', trigger: 'blur' },
                //     mobile: [
                //         { required: true, message: '手机号不能为空', trigger: 'blur' },
                //         { validator: checkFields.phone, message: '手机号格式错误', trigger: 'blur' },
                //
                //     ],
                //     auth_state: { required: true, message: '认证状态请选择', trigger: 'change' },
                // },
                brand_cards:[{
                    id:'',
                    bank_country:'', //银行国家
                    bank_province:'',//银行省
                    bank_city :'',   //银行城市
                    bank_name:'',    //银行名称
                    bank_branch_name:'',//支行名称
                    card_no:'',     //银行账号
                    bank_mobile:'', //预留手机号
                    is_default:'',  //是否默认
                    state:'',       //状态
                }],
                rules: {


                    mobile: [
                        { required: true,validator: checkFields.phone, trigger: 'blur' }
                    ],


                },
                authStateMapOptions: dict.auth_state_map,
                identityTypeMapOptions: dict.identity_type_map,
                isDefaultMapOptions: dict.is_default_map,
                brandStateOptions: dict.band_state_map  //银行状态

            }
        },

        methods: {

            update(){
                this.$refs['custInfo'].validate((valid) => {
                    if (valid) {

                        let params = {
                            id: this.$route.params.id,
                            mobile: this.custInfo.mobile
                        };
                        updateCustomersInfo(params).then(res=>{

                            if(res.data.status == 200){
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg || "操作失败"
                                });
                            }
                        })

                    }
                })
            },

            getUserInfoDetail() {
                let params = {
                    id: this.$route.params.id,
                };
                getCustomersInfo(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if(res.data.status === 200) {
                        this.custInfo = result;
                    }else{
                        if(res.data.status === 401){
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
            },
            customerBankcardList() {
                let params = {
                    id: this.$route.params.id,
                };

                getCustomersBankcardList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if(res.data.status === 200) {
                        if(result != null){
                            this.brand_cards = result;
                        }
                    }else{
                        if(res.data.status === 401){
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                })
            },
            centToDollar(val){
                return centToDollar(val);
            }

        },
        mounted(){
            this.$nextTick(function(){
                this.getUserInfoDetail();
                this.customerBankcardList();
            });
        }
    }
</script>
<style lang="scss" scoped>
    .div-padd{
        padding: 10px 180px;
    }
    .row-bg {
        text-align: right;
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
