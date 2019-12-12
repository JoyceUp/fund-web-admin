<template>
    <section>
        <el-col>
            <el-tabs v-model="activeNames" type="card" style="height:110px">
                <el-tab-pane label="用户信息" name="1"><div><customer-base-info></customer-base-info></div></el-tab-pane>
                <el-tab-pane label="入金信息" name="2"><div><customer-deposit-info></customer-deposit-info></div></el-tab-pane>
                <el-tab-pane label="出金信息" name="3"><div><customer-withdraw-info></customer-withdraw-info></div></el-tab-pane>
                <el-tab-pane label="投资信息" name="9"><div><customer-invest-info></customer-invest-info></div></el-tab-pane>
                <el-tab-pane label="余额变动记录" name="8"><div><customer-balance-info></customer-balance-info></div></el-tab-pane>
                <el-tab-pane label="利息" name="4"><div><customer-interest-info></customer-interest-info></div></el-tab-pane>
                <el-tab-pane label="佣金" name="5"><div><customer-commission-info></customer-commission-info></div></el-tab-pane>
                <el-tab-pane label="关系信息" name="6"><div><customer-relation-info></customer-relation-info></div></el-tab-pane>
                <el-tab-pane label="我的合伙人" name="7"><div><customer-partner-info></customer-partner-info></div></el-tab-pane>
                <br/><br/><br/><br/>
            </el-tabs>
        </el-col>
        <el-col :span="1" :push="22" style="margin-top: -8%">
            <el-button type="primary" size="mini" @click="$router.push('/customer/list')">返回</el-button>
        </el-col>
    </section>
</template>
<script>
    import customerBaseInfo from './CustomerBaseInfo'
    import customerDepositInfo from './CustomerDepositInfo';
    import customerWithdrawInfo from './CustomerWithdrawInfo';
    import customerInvestInfo from './CustomerInvestInfo';
    import customerBalanceInfo from './CustomerBalanceInfo';
    import customerInterestInfo from './CustomerInterestInfo';
    import customerCommissionInfo from './CustomerCommissionInfo';
    import customerRelationInfo from './CustomerRelationInfo';
    import customerPartnerInfo from './CustomerPartnerInfo';

    export default {
        data () {
            return {
                activeNames:'1',//tabs 第一个tab展开
            }
        },
        components:{
            'customer-base-info': customerBaseInfo,                 //用户信息
            'customer-deposit-info':customerDepositInfo,            //入金信息
            'customer-withdraw-info':customerWithdrawInfo,          //出金信息
            'customer-invest-info':customerInvestInfo,              //投资信息
            'customer-balance-info':customerBalanceInfo,            //余额变动记录
            'customer-interest-info':customerInterestInfo,          //利息
            'customer-commission-info':customerCommissionInfo,      //佣金
            'customer-relation-info':customerRelationInfo,          //关系信息
            'customer-partner-info':customerPartnerInfo             //我的合伙人
        },
        methods: {},
        mounted(){}
    }
</script>
<style lang="scss" scoped>

</style>
