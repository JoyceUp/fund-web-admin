<template>
    <section v-loading="loading">
        <!--产品详情查看-->
        <div>
            <el-col :span="6" style="font-size: 14px;font-weight: bold;margin-top: 15px;margin-bottom: 18px">产品信息
            </el-col>
            <el-col :span="21" :push="2" class="toolbar" style="padding-bottom: 0px; ">
                <el-form :model="ruleForm" :rules="productRules" ref="product" label-width="135px"
                         class="demo-ruleForm">
                    <div class="product-row">
                        <!--<el-col :span="7" v-if="this.$route.params.id !='add'" :push="1">-->
                        <el-col :span="7" :push="1">
                            <el-form-item label="创建时间" prop="gmt_create">
                                <el-input v-model="ruleForm.gmt_create" disabled></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7" v-if="this.$route.params.id !='add'" :push="2">
                            <el-form-item label="产品名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" v-if="this.$route.params.id !='add'" :push="3">
                            <el-form-item label="产品简介" prop="intro">
                                <el-input v-model="ruleForm.intro"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7" v-if="this.$route.params.id =='add'" :push="2">
                            <el-form-item label="产品名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" v-if="this.$route.params.id =='add'" :push="3">
                            <el-form-item label="产品简介" prop="intro">
                                <el-input v-model="ruleForm.intro"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>

                    <div class="product-row">
                        <el-col :span="23" :push="1">
                            <el-form-item label="产品描述" prop="desc">
                                <el-input type="textarea" :rows="4" v-model="ruleForm.desc"
                                          style="min-height: 100px"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>

                    <div class="product-row">
                        <!--<el-col :span="7" v-if="this.$route.params.id !='add'" :push="1">-->
                        <el-col :span="7" :push="1">
                            <el-form-item label="对所有客户可见" prop="vip">
                                <el-select placeholder="请选择" v-model="ruleForm.vip" >
                                    <el-option :key="0" label="是" :value="0"></el-option>
                                    <el-option :key="1" label="否" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </div>

                    <div class="product-row">
                        <!--<el-col :span="7" v-if="this.$route.params.id !='add'" :push="1">-->
                        <el-col :span="7" :push="1">
                            <el-form-item label="是否推荐产品" prop="is_recommend">
                                <el-select placeholder="请选择" v-model="ruleForm.is_recommend" >
                                    <el-option :key="1" label="是" :value="1"></el-option>
                                    <el-option :key="2" label="否" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7" :push="2">
                            <el-form-item label="推荐位置" prop="recommend_no">
                                <el-select placeholder="请选择" v-model="ruleForm.recommend_no" :disabled="ruleForm.is_recommend == 2">
                                    <el-option :key="1" label="1" :value="1"></el-option>
                                    <el-option :key="2" label="2" :value="2"></el-option>
                                    <el-option :key="3" label="3" :value="3"></el-option>
                                    <el-option :key="4" label="4" :value="4"></el-option>
                                    <el-option :key="5" label="5" :value="5"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7" :push="3">
                            <el-form-item label="产品类型" prop="is_recommend">
                                <el-select placeholder="请选择" v-model="ruleForm.product_type" >
                                    <el-option :key="1" label="新手标" :value="1"></el-option>
                                    <el-option :key="2" label="活期" :value="2"></el-option>
                                    <el-option :key="3" label="定期" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>


                    </div>


                    <div class="product-row">
                        <el-col :span="7" :push="1">
                            <el-form-item label="是否固定利率" prop="fixed">
                                <el-select placeholder="请选择" v-model="ruleForm.fixed">
                                    <el-option :key="1" label="是" :value="1"></el-option>
                                    <el-option :key="2" label="否" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="2">
                            <el-form-item label="预计年利率(%)" prop="rate">
                                <el-input v-model="ruleForm.rate"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="3">
                            <el-form-item label="增加利率(%)" prop="dritf_rate">
                                <el-input v-model="ruleForm.dritf_rate"></el-input>
                            </el-form-item>
                        </el-col>

                    </div>
                    <div class="product-row">

                        <el-col :span="7" :push="1">
                            <el-form-item label="起投金额(元)" prop="min_amount">
                                <el-input v-model="ruleForm.min_amount"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="7" :push="2">
                            <el-form-item label="最大投资金额" prop="max_amount">
                                <el-input v-model="ruleForm.max_amount"></el-input>
                            </el-form-item>
                        </el-col>

                    </div>
                    <div class="product-row">
                        <el-col :span="7" :push="1">
                            <el-form-item label="是否有锁定期" prop="lock">
                                <el-select placeholder="请选择" v-model="ruleForm.lock" @change="lockChange">
                                    <el-option :key="1" label="是" :value="1"></el-option>
                                    <el-option :key="2" label="否" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="2">
                            <el-form-item label="锁定时长(天)" prop="duration">
                                <el-input v-model="ruleForm.duration"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="3">
                            <el-form-item label="产品状态" prop="online">
                                <el-select placeholder="选择产品状态" v-model="ruleForm.online">
                                    <el-option :key="1" label="已发布" :value="1"></el-option>
                                    <el-option :key="2" label="未发布" :value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </div>

                    <div class="product-row">
                        <el-col :span="7" :push="1">
                            <el-form-item label="销售提成(%)" prop="reward_percentage">
                                <el-input v-model="ruleForm.reward_percentage"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="2">
                            <el-form-item label="投资回报方式" prop="profit_type">
                                <el-select placeholder="请选择" v-model="ruleForm.profit_type">
                                    <el-option :key="1" label="按日计息" :value="1"></el-option>
                                    <el-option :key="10" label="到期还本付息" :value="10"></el-option>
                                    <el-option :key="5" label="按月付息" :value="5"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" :push="3">
                            <el-form-item label="回报方式说明" prop="profit_type_desc">
                                <el-input v-model="ruleForm.profit_type_desc"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>

                </el-form>
            </el-col>

            <el-col :span="23">
                <el-row type="flex" justify="space-between">
                    <el-col :span="6" style="font-size: 14px;font-weight: bold;margin-top: 15px;">
                        基金概况
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="21" :push="2" class="toolbar" style="padding-bottom: 0px; ">
                <el-form :model="ruleForm" :rules="fundRules" ref="fund" label-width="135px" class="demo-ruleForm">
                    <el-col :span="7" :push="1">
                        <el-form-item label="基金全称" prop="fund_name">
                            <el-input v-model="ruleForm.fund_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="2">
                        <el-form-item label="基金管理人" prop="fund_admin">
                            <el-input v-model="ruleForm.fund_admin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="3">
                        <el-form-item label="基金种类" prop="fund_type">
                            <el-input v-model="ruleForm.fund_type"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="1">
                        <el-form-item label="成立日期" prop="fund_establish_date">
                            <el-date-picker
                                    v-model="ruleForm.fund_establish_date"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="2">
                        <el-form-item label="监管机构" prop="fund_regulator">
                            <el-input v-model="ruleForm.fund_regulator"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="3">
                        <el-form-item label="募集方式" prop="fund_raise_type">
                            <el-input v-model="ruleForm.fund_raise_type"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="1">
                        <el-form-item label="基金规模" prop="fund_size">
                            <el-input v-model="ruleForm.fund_size"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="2">
                        <el-form-item label="投资目标" prop="fund_target">
                            <el-input v-model="ruleForm.fund_target"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="3">
                        <el-form-item label="投资策略" prop="fund_strategy">
                            <el-input v-model="ruleForm.fund_strategy"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" :push="1">
                        <el-form-item label="投资范围" prop="fund_scope">
                            <el-input v-model="ruleForm.fund_scope"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23" :push="1">
                        <el-form-item label="基金经理" prop="fund_manager">
                            <el-input type="textarea" :rows="4" v-model="ruleForm.fund_manager"
                                      style="min-height: 100px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23" :push="1">
                        <el-form-item label="信息披露" prop="fund_disclose">
                            <el-input type="textarea" :rows="4" v-model="ruleForm.fund_disclose"
                                      style="min-height: 100px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="23">
                <el-row type="flex" justify="space-between">
                    <el-col :span="6" style="font-size: 14px;font-weight: bold;margin-top: 15px">佣金计算规则</el-col>
                    <el-button :type="switcher.commission.type" @click="toggleDisplay('commission')">
                        {{switcher.commission.text}}
                    </el-button>
                </el-row>
            </el-col>
            <el-col v-if="switcher.commission.display" :span="21" :push="2" class="toolbar"
                    style="padding-bottom: 0px;">
                <div class="product-row">
                    <el-form :rules="commissionRules" :model="tempCommission" ref="commissionForm" label-width="180px"
                             class="demo-ruleForm">
                        <el-col :span="6" :push="1">
                            <el-form-item label="最低金额(万元，包含)" prop="amount_from">
                                <el-input v-model="tempCommission.amount_from"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :push="2">
                            <el-form-item label="最高金额(万元，不包含)" prop="amount_to">
                                <el-input v-model="tempCommission.amount_to"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :push="3">
                            <el-form-item label="佣金百分比(%)" prop="customer_commission_percentage">
                                <el-input v-model="tempCommission.customer_commission_percentage"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <el-form-item>
                                <el-button type="primary" @click="addCommissionDom('commissionForm')">新建
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>

                <div class="product-row" v-for="(commission, index) in ruleForm.commission_rules" :key="index">
                    <el-form label-width="180px" class="demo-ruleForm">

                        <el-col :span="6" :push="1">
                            <el-form-item label="最低金额(万元，包含)">
                                <el-input disabled v-model="commission.amount_from"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :push="2">
                            <el-form-item label="最高金额(万元，不包含)">
                                <el-input disabled v-model="commission.amount_to"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :push="3">
                            <el-form-item label="佣金百分比(%)">
                                <el-input disabled v-model="commission.customer_commission_percentage"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <el-form-item>
                                <el-button @click="removeCommissionDom(commission)">删除
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>

            </el-col>
            <el-col :span="23">
                <el-row type="flex" justify="space-between">
                    <el-col :span="6" style="font-size: 14px;font-weight: bold;margin-top: 15px">常见问题</el-col>
                    <el-button :type="switcher.qas.type" @click="toggleDisplay('qas')">{{switcher.qas.text}}</el-button>
                </el-row>
            </el-col>
            <el-col v-if="switcher.qas.display" :span="21" :push="2" class="toolbar"
                    style="padding-bottom: 0px;">
                <div class="product-row">
                    <el-form :rules="questionRules" :model="tempQas" ref="qasForm"
                             label-width="63px" class="demo-ruleForm">
                        <el-col :span="9" :push="1">
                            <el-form-item :label="'问题:'" prop="question">
                                <el-input v-model="tempQas.question"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :push="2">
                            <el-form-item label="答案:" prop="answer">
                                <el-input v-model="tempQas.answer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" :push="2">
                        <span style="margin-left: 4px">
                        <el-button type="primary" @click="addQuestionDom('qasForm')">新建</el-button>
                        </span>
                        </el-col>
                    </el-form>
                </div>
                <div class="product-row" v-for="(question, index) in ruleForm.qas" :key="index">
                    <el-form label-width="63px"
                             class="demo-ruleForm">
                        <el-col :span="9" :push="1">
                            <el-form-item :label="'问题'+(index*1+1)+':'" prop="question">
                                <el-input disabled v-model="question.question"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :push="2">
                            <el-form-item label="答案:" prop="answer">
                                <el-input disabled v-model="question.answer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" :push="2">
                        <span style="margin-left: 4px">
                            <el-button @click="removeQuestionDom(question)">删除</el-button>
                         </span>
                        </el-col>
                    </el-form>
                </div>
            </el-col>
            <el-col align="center">
                <el-button type="primary" @click="submitForm('product','fund')">确定
                </el-button>
                <el-button @click="$router.push('/productList')">返回</el-button>
            </el-col>
        </div>

    </section>
</template>

<script>
    //    import * as api from "../../api/sale";
    import * as api from "../../api/sale_api";
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import dic from "../../common/js/dict"
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElOption from "element-ui/packages/select/src/option";

    export default {

        components: {
            ElOption,
            ElFormItem,
            ElCol
        },
        data() {
            var recommendNo = (rule, value, callback) => {

                if (value=="" && this.ruleForm.is_recommend == 1) {
                    callback(new Error('请选择'));
                } else {
                    callback();
                }
            };
            var validGt = (rule, value, callback) => {
                let n = parseFloat(value);
                let min = parseFloat(rule.min);
                if (n <= min) {
                    callback(new Error('应大于' + rule.min));
                } else {
                    callback();
                }
            };
            var validFloat = (rule, value, callback) => {
                if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
                    callback(new Error('正数, 最多两位小数'));
                } else {
                    callback();
                }
            };
            var validInt = (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                    callback(new Error('数值应为0或正整数'));
                } else {
                    callback();
                }
            };
            var validMin = (rule, value, callback) => {
                let n = parseInt(value);
                if (n < rule.min) {
                    callback(new Error('最低' + rule.min));
                } else {
                    callback();
                }
            };
            var validRange = (rule, value, callback) => {
                let n = parseInt(value);
                if (n < rule.min || n > rule.max) {
                    callback(new Error(rule.min + '-' + rule.max));
                } else {
                    callback();
                }
            };
            var validFloatRange = (rule, value, callback) => {
                let n = parseFloat(value);
                if (n < rule.min || n > rule.max) {
                    callback(new Error(rule.min + '-' + rule.max));
                } else {
                    callback();
                }
            };
            var validLength = (rule, value, callback) => {
                let n = value.length;
                if (n < rule.min || n > rule.max) {
                    callback(new Error(rule.min + '-' + rule.max + '字符'));
                } else {
                    callback();
                }
            };
            var validDuration = (rule, value, callback) => {
                let n = parseInt(value);
                if (this.ruleForm.lock == 2 && n != "0") {
                    callback(new Error('没有锁定期时, 锁定时长只能为0'));
                } else {
                    callback();
                }
            };
            var validCommissionRuleFrom = (rule, value, callback) => {
                if (this.ruleForm.commission_rules.length === 0) {
                    callback();
                } else {
                    let n = parseFloat(value.trim());
                    let last2 = parseFloat(this.ruleForm.commission_rules[this.ruleForm.commission_rules.length - 1].amount_to);
                    if (n < last2) {
                        callback(new Error('最低金额应大于等于上一档的最高金额'));
                    } else {
                        callback();
                    }
                }

            };
            var validCommissionRuleTo = (rule, value, callback) => {
                if (this.tempCommission.amount_from.toString().length > 0) {
                    let n = parseFloat(value.trim());
                    if (n < parseFloat(this.tempCommission.amount_from)) {
                        callback(new Error('最高金额应大于最低金额'));
                    } else {
                        callback();
                    }
                }
                else {
                    callback();
                }
            };
            return {
                switcher: {
                    commission: {
                        text: "展开",
                        type: "primary",
                        display: false
                    },
                    qas: {
                        text: "展开",
                        type: "primary",
                        display: false
                    },
                },
                show: {
                    text: "展开",
                    type: "primary",
                    display: false
                },
                hide: {
                    text: "折叠",
                    type: "warning",
                    display: true
                },
                loading: false,
                pudict_status: dic.puroduct_status,
                profit_type: dic.profit_type,
                //当前tab的名称
                activeName: "baseInfo",
                //产品id
                sale_id: "",
                //基本信息
                ruleForm: {
                    name: "",

                    is_recommend:2,
                    recommend_no:"",
                    dritf_rate:"0",
                    max_amount:"",
                    vip:"0",
                    product_type:3,

                    fixed: "",
                    rate: "",
                    lock: "",
                    duration: "",
                    intro: "",
                    desc: "",
                    online: "",
                    state: "",
                    profit_type: "",
                    min_amount: "",
                    reward_percentage: "",
                    profit_type_desc: "",
                    fund_name: "Thank Fund SPC",
                    fund_admin: "MDF Fund Management Co., Ltd ",
                    fund_type: "开放式基金",
                    fund_establish_date: "",
                    fund_regulator: "开曼金融管理局",
                    fund_raise_type: "公开募集",
                    fund_size: "不设限",
                    fund_target: "在有效控制风险的前提下，力争为投资者创造长期稳定的资本增值",
                    fund_strategy: "在有效控制风险的前提下，力争为投资者创造长期稳定的资本增值",
                    fund_scope: "股权,外汇,证券,期货,理财,基金",
                    fund_manager: "王学伟先生：西安交通大学金融学博士，多年证券行业投资经验，慢点富投资的首席基金经理。",
                    fund_disclose: "公司灵活投资于多种工具，包括上市和非上市股票、优先股、可转换证券、与股票有关的工具， 债务证券和债务(可能低于投资级别)、货币、商品、期货、期权、认股权证、互换和其他衍生工具。其他衍生工具为通用电气交易或场外交易。公司还从事外汇交易、保证金交易、套期保值等投资策略。此外，公司还保留现金或现金等价物待再投资、用作抵押品或其他认为适合投资目标的基金",
                    commission_rules: [],
                    qas: [],
                },

                commissionForm: {},
                questionForm: {},
                productRules: {
                    gmt_create: [
                        {required: false, message: '请选择日期', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入产品名称', trigger: 'blur'},
                        {validator: validLength, min: 2, max: 12, trigger: 'blur'},
                    ],
                    intro: [
                        {required: true, message: '请输入产品简介', trigger: 'blur'},
                        {validator: validLength, min: 2, max: 50, trigger: 'blur'},
                    ],
                    desc: [
                        {required: true, message: '请输入产品描述', trigger: 'blur'},
                        {validator: validLength, min: 2, max: 300, trigger: 'blur'},
                    ],
                    fixed: [
                        {required: true, message: '请选择!', trigger: 'change'}
                    ],
                    recommend_no: [
                        {validator: recommendNo, trigger: 'blur'},
                    ],
                    rate: [
                        {required: true, message: '请输入年利率', trigger: 'blur'},
                        {validator: validFloat, trigger: 'blur'},
                        {validator: validGt, min: 0, trigger: 'blur'},
                        {validator: validFloatRange, min: 0, max: 100, trigger: 'blur'},
                    ],
                    dritf_rate: [
                        {required: true, message: '请输入增加利率', trigger: 'blur'},
                        {validator: validFloat, trigger: 'blur'},
                        {validator: validGt, min: -1, trigger: 'blur'},
                        {validator: validFloatRange, min: 0, max: 100, trigger: 'blur'},
                    ],
                    min_amount: [
                        {required: true, message: '请输入起投金额', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validMin, min: 100, trigger: 'blur'},
                    ],
                    max_amount: [
                        {required: false, message: '请输入起投金额', trigger: 'blur'},

                    ],
                    lock: [
                        {required: true, message: '请选择!', trigger: 'change'},
                    ],
                    duration: [
                        {required: true, message: '请输入时长', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validDuration, trigger: 'blur'},
                        {validator: validRange, min: 0, max: 10000, trigger: 'blur'},
                    ],
                    online: [
                        {required: true, message: '请选择!', trigger: 'change'}
                    ],
                    reward_percentage: [
                        {required: true, message: '请输入销售提成', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validRange, min: 0, max: 100, trigger: 'blur'},
                    ],
                    profit_type: [
                        {required: true, message: '请选择!', trigger: 'change'}
                    ],
                    profit_type_desc: [
                        {required: true, message: '请输入回报说明', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 30, trigger: 'blur'}
                    ]
                },
                fundRules: {
                    fund_name: [
                        {required: true, message: '请输入基金全称', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 50, trigger: 'blur'}
                    ],
                    fund_admin: [
                        {required: true, message: '请输入基金管理人', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 50, trigger: 'blur'}
                    ],
                    fund_type: [
                        {required: true, message: '请输入基金种类', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 50, trigger: 'blur'}
                    ],
                    fund_establish_date: [
                        {required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    fund_regulator: [
                        {required: true, message: '请输入监管机构', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_raise_type: [
                        {required: true, message: '请输入募集方式', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_size: [
                        {required: true, message: '请输入基金规模', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_target: [
                        {required: true, message: '请输入投资目标', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_strategy: [
                        {required: true, message: '请输入投资策略', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_scope: [
                        {required: true, message: '请输入投资范围', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_manager: [
                        {required: true, message: '请输入基金经理信息', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ],
                    fund_disclose: [
                        {required: true, message: '请输入信息披露', trigger: 'blur'}
                        , {validator: validLength, min: 2, max: 200, trigger: 'blur'}
                    ]
                },
                commissionRules: {
                    amount_from: [
                        {required: true, message: '请输入最低金额!', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validRange, min: 0, max: 10000, trigger: 'blur'},
                        {validator: validCommissionRuleFrom, trigger: 'blur'},
                    ],
                    amount_to: [
                        {required: true, message: '请输入最高金额!', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validRange, min: 0, max: 10000, trigger: 'blur'},
                        {validator: validCommissionRuleTo, trigger: 'blur'},
                    ],
                    customer_commission_percentage: [
                        {required: true, message: '请输入佣金比例!', trigger: 'blur'},
                        {validator: validInt, trigger: 'blur'},
                        {validator: validRange, min: 0, max: 100, trigger: 'blur'},
                        {validator: validGt, min: 0, trigger: 'blur'},
                    ],
                },
                questionRules: {
                    question: [
                        {required: true, message: '请输入问题!', trigger: 'blur'},
                        {validator: validLength, min: 2, max: 30, trigger: 'blur'}
                    ],
                    answer: [
                        {required: true, message: '请输入答案!', trigger: 'blur'},
                        {validator: validLength, min: 2, max: 100, trigger: 'blur'}
                    ],
                },
                tempCommission: {
                    amount_from: "",
                    amount_to: "",
                    customer_commission_percentage: ""
                },
                tempQas: {
                    question: "",
                    answer: ""
                },
                updateQas: []
            };
        },
        methods: {

            //移除计算规则
            removeCommissionDom(item) {
                if (this.ruleForm.commission_rules.length >= 1) {
                    var index = this.ruleForm.commission_rules.indexOf(item);
                    if (index !== -1) {
                        this.ruleForm.commission_rules.splice(index, 1);
                    }
                }
                /*else {
                    this.$message.error("请至少填写一条佣金计算规则");
                }*/
            },
            //移除问题
            removeQuestionDom(item) {
                if (this.ruleForm.qas.length >= 1) {
                    var index = this.ruleForm.qas.indexOf(item);
                    if (index !== -1) {
                        this.ruleForm.qas.splice(index, 1);
                    }
                }

                if (item.id && item.id.length > 0) {
                    let updateItem = item;
                    this.updateQas.push(updateItem);
                }
                else {
                    var index = this.updateQas.indexOf(item);
                    if (index !== -1) {
                        this.updateQas.splice(index, 1);
                    }
                }

            },
            productDetail() {
                api.productDetail({id: this.$route.params.id}).then((res) => {

                    if (res.status == 200) {
                        let data = JSON.parse(res.datas);
                        this.ruleForm = data;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },
            //确定新增
            submitForm(product, fund) {
                this.$refs[product].validate((valid) => {
                    if (valid) {
                        this.$refs[fund].validate((valid) => {
                            if (valid) {
                                if (this.ruleForm.commission_rules.length > 0 && this.ruleForm.commission_rules.length <= 6) {

                                    if (this.ruleForm.qas.length > 0 && this.ruleForm.qas.length <= 10) {
                                        this.loading = true;


                                        if (this.$route.params.id == "add") {
                                            api.addProduct(this.ruleForm).then((res) => {
                                                this.loading = false;
                                                if (res.status == 200) {
                                                    this.$message("添加成功!");
                                                    this.$router.push('/productList');
                                                } else {
                                                    if (res.status == 401) {
                                                        this.$router.push('/login');
                                                    }
                                                    this.$message.error(res.data.msg);
                                                }
                                            });
                                        } else {
                                            this.ruleForm.updateQas = this.updateQas;
                                            api.updateProduct(this.ruleForm).then((res) => {
                                                this.loading = false;
                                                if (res.status == 200) {
                                                    this.$message("更新成功!");
                                                    this.$router.push('/productList');
                                                } else {
                                                    if (res.status == 401) {
                                                        this.$router.push('/login');
                                                    }
                                                    this.$message(res.msg);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        this.$message.error("常见问题数量为1-10条");
                                        this.loading = false;
                                    }


                                }
                                else {
                                    this.$message.error("佣金计算规则数量为1-6条");
                                    this.loading = false;
                                }
                            }
                            else {
                                this.loading = false;
                            }

                        });
                    }
                    else {
                        this.loading = false;
                    }
                });
            },
            initTempCommission() {
                this.tempCommission = {
                    amount_from: "",
                    amount_to: "",
                    customer_commission_percentage: ""
                };
            },
            //增加计算规则
            addCommissionDom(form) {

                if (this.ruleForm.commission_rules.length >= 6) {
                    this.$message.error("最多6条佣金计算规则");
                    return false;
                }

                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let item = this.tempCommission;
                        this.ruleForm.commission_rules.push(item);
                        this.initTempCommission();
                    }
                });
            },
            initTempQas() {
                this.tempQas = {
                    question: "",
                    answer: ""
                }
            },
            addQuestionDom(form) {

                if (this.ruleForm.qas.length >= 10) {
                    this.$message.error("最多10条常见问题");
                    return false;
                }

                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let item = this.tempQas;
                        this.ruleForm.qas.push(item);
                        this.initTempQas();
                        this.updateQas.push(item);
                    }
                });
            },
            lockChange() {
                if (this.ruleForm.lock == 2) {
                    this.ruleForm.duration = 0;
                }
            },
            toggleDisplay(section) {
                switch (section) {
                    case 'commission':
                        this.switcher.commission = (this.switcher.commission.display ? this.show : this.hide);
                        break;
                    case 'qas':
                        this.switcher.qas = (this.switcher.qas.display ? this.show : this.hide);
                        break;
                    default:
                        break;
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$router.back(-1);
            },
            //页面初始化，显示当前销售的基本信息
            initData() {
                if (this.$route.params.id != "add") {
                    this.productDetail();
                }

            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData(); //初始化页面数据
            });
        }
    };
</script>
<style>
    .demo-ruleForm {
        margin-top: 10px;
    }

    .demo-ruleForm .el-form-item__lable {
        text-align: left;

    }

    .product-row {
        width: 100%;
        float: left;
    }

    .toolbar .el-form-item {
        margin-bottom: 20px !important;
    }
</style>