<template>
    <section>
        <el-table :data="relations" stripe style="width: 100%" size="small">
            <el-table-column label="邀请人姓名"><template slot-scope="scope"> <span>{{isNull(scope.row.parent_name)}}</span></template></el-table-column>
            <el-table-column label="邀请人编号"><template slot-scope="scope"> <span>{{isNull(scope.row.parent_no)}}</span></template></el-table-column>
            <el-table-column label="销售编号"><template slot-scope="scope"> <span>{{ isNull(scope.row.sales_no) }}</span></template></el-table-column>
            <el-table-column label="销售姓名"><template slot-scope="scope"> <span>{{isNull(scope.row.sales_name)}}</span></template></el-table-column>
        </el-table>

    </section>
</template>
<script>
    import {getCustomersRelationList,getCustomersInfo} from '../../api/customers_api';
    import {isBirthDate, isNull} from '../../common/js/commons';
    import dict from '../../common/js/dict';

    export default {
        data() {
            return {
                listLoading:false,
                order_column: "",
                order_by: "",
                relations: [],
            }
        },
        methods: {
            getItems() {
                this.listLoading = true;
                let params = {
                    id: this.$route.params.id,
                };
                getCustomersInfo(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if(res.data.status === 200) {
                        this.listLoading = false;
                        this.relations.push(result);
                    }else{
                        if(res.data.status === 401){
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });
                /*getCustomersRelationList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {
                        if(result != null){
                            this.relations.push(result);
                        }
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });*/
            },
            isNull(val){
                return isNull(val);
            }
        },
        mounted()
        {
            this.$nextTick(function(){
                this.getItems();
            })
        }
    }
</script>
<style lang="scss" scoped>
    .el-row {
        text-align: right;
    }
    .el-row {
        margin-bottom: 2px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

</style>
