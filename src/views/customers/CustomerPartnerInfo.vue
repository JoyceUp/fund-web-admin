<template>
    <section>
        <el-table :data="items" stripe style="width: 100%" size="small">
            <el-table-column prop="gmt_create" label="注册时间"> </el-table-column>
            <el-table-column prop="customer_no" label="客户编号"> </el-table-column>
            <el-table-column label="客户姓名">
                <template slot-scope="scope">
                    <el-button  type="text" @click="showDetail(scope.row.id)">
                        {{isNull(scope.row.name)}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号码"> </el-table-column>
            <el-table-column prop="identity_no" label="证件号码"> </el-table-column>
            <el-table-column label="认证状态"><template slot-scope="scope"><span>{{authStateOptions[scope.row.auth_state]}}</span></template></el-table-column>
            <el-table-column prop="total_asset" label="资产总额" :formatter="centToDollar"> </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
    import {getCustomersPartnerList} from '../../api/customers_api';
    import dict from '../../common/js/dict';
    import {isNull,centToDollar} from '../../common/js/commons';

    export default {
        props: ["datas"],
        data() {
            return {
                order_column: "",
                order_by: "",
                listLoading:false,
                items:[],
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                authStateOptions: dict.auth_state_map
            }
        },
        methods: {
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.handlePagerChange();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getItems();
            },
            getItems() {
                this.listLoading = true;
                let condition = {};
                condition.customer_id = this.$route.params.id;
                let params = {
                    condition: condition,
                    order_column: "",
                    order_by: "",
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage
                };
                getCustomersPartnerList(params).then((res) => {
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
                });
            },
            changeStatus(row,options){
                let val = '';
                options.forEach((item)=>{
                    if(item.value == row){
                        val = item.key;
                    }
                });
                return val;
            },
            showDetail(iid){
                this.$router.push({name:'客户详情',params:{id: iid}});
                window.location.reload();
            },
            isNull(val){
                return isNull(val);
            },
            centToDollar(row,column){
                if(column){
                    return centToDollar(row[column.property]);
                }
                return centToDollar(column);
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

    .dialog-footer{
        text-align: center;
    }
    .el-dialog__body{
        text-align: center;
    }

</style>
