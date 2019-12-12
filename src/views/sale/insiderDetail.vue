<template>
    <section>
        <!--销售信息标签-->
        <el-col :span="1" :push="22">
            <el-button @click="cancle">返 回</el-button>
        </el-col>
        <el-col >
            <el-tabs type="card" v-model="activeName">
                <el-tab-pane label="基本信息" name="baseInfo"><insiderBaseInfo :sale_id="sale_id"></insiderBaseInfo></el-tab-pane>
                <el-tab-pane label="提成信息" name="commissionInfo"><commissionInfo :sale_id="sale_id"></commissionInfo></el-tab-pane>
            </el-tabs>
        </el-col>

    </section>
</template>

<script>
    import customerInfo from "./CustomerInfo";
    import commissionInfo from "./CommissionInfo";
    import insiderBaseInfo from "./insiderBaseInfo";

    export default {
        data() {
            return {
                //当前tab的名称
                activeName: "baseInfo",
                //销售id
                sale_id: "",
                //基本信息
                baseInfoData: ''

            };
        },
        components: {
            insiderBaseInfo,
            customerInfo,
            commissionInfo
        },
        methods: {
            //从URL中获取当前销售ID
            getSaleID() {
                return this.$route.params.id;
            },
            cancle(){
                this.$router.push("/insider/list");
            },
            //页面初始化，显示当前销售的基本信息
            initData() {
                this.sale_id = this.getSaleID();
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData(); //初始化页面数据
            });
        }
    };
</script>

<style lang="scss" scoped>

</style>