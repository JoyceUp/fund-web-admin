 <script src="../../../routes/prod/wages.js"></script>
 <template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="customer_no">
                    <el-input placeholder="客户编号" v-model="filters.customer_no"></el-input>
                </el-form-item>
                <el-form-item prop="customer_name">
                    <el-input placeholder="客户姓名" v-model="filters.customer_name"></el-input>
                </el-form-item>
                <el-form-item prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no"></el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input placeholder="手机号码" v-model="filters.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="parent_name">
                    <el-input placeholder="邀请人姓名" v-model="filters.parent_name"></el-input>
                </el-form-item>
                <el-form-item prop="parent_no">
                    <el-input placeholder="邀请人编号" v-model="filters.parent_no"></el-input>
                </el-form-item>

                <el-form-item prop="sales_no">
                    <el-input placeholder="销售编号" v-model="filters.sales_no"></el-input>
                </el-form-item>
                <el-form-item prop="sales_name">
                    <el-input placeholder="销售姓名" v-model="filters.sales_name"></el-input>
                </el-form-item>

                <el-form-item prop="customer_state">
                    <el-select placeholder="认证状态" v-model="filters.auth_state">

                        <el-option :key="item.value" :label="item.key" :value="item.value"
                                   v-for="item in stateOptions"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="data_range">
                    <el-date-picker

                            v-model="filters.data_range" type="daterange" start-placeholder="注册时间" end-placeholder="注册时间" range-separator="至"
                            placeholder="选择时间范围" @change="handleCreateDateChange"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>

<!--                    <el-date-picker v-model="filters.data_range" type="daterange" @change="handleCreateDateChange"  range-separator="至" start-placeholder="注册时间"
                                    end-placeholder="注册时间"></el-date-picker>-->
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">清空</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- table -->
        <el-table :data="items" v-loading="listLoading" stripe style="width: 100%" tooltip-effect="dark">
            <el-table-column prop="gmt_create" label="注册时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="customer_no" label="客户编号"></el-table-column>
            <el-table-column label="客户姓名">
                <template slot-scope="scope">
                    <el-button  type="text" @click="showDetail(scope.row.id)">
                        {{isNull(scope.row.name)}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="手机号码">  <template slot-scope="scope"> <span>{{isNull(scope.row.mobile)}}</span></template>     </el-table-column>
            <el-table-column label="证件号码" show-overflow-tooltip>  <template slot-scope="scope"> <span>{{isNull(scope.row.identity_no)}}</span></template></el-table-column>
            <el-table-column label="认证状态">  <template slot-scope="scope"> <span>{{authStateOptions[scope.row.auth_state]}}</span></template>      </el-table-column>
            <el-table-column label="资金总额"><template slot-scope="scope">   <span>{{centToDollars(scope.row.balance)}} </span></template></el-table-column>
            <el-table-column prop="parent_name" label="邀请人姓名"></el-table-column>
            <el-table-column prop="parent_no" label="邀请人编号"></el-table-column>
            <el-table-column prop="sales_no" label="销售编号"></el-table-column>
            <el-table-column prop="sales_name" label="销售姓名"></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>
        <!-- 入金统计 -->

        <el-row class="money-total">
            <el-col :span="8"><div class="grid-content bg-purple">&nbsp;</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple total_amount">资金总计：<span>{{ this.total_balance | moneyFormat }}</span> 元</div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple"> </div></el-col>
        </el-row>
    </section>
</template>

<script>
    import {getCustomersList} from '../../api/customers_api';
    import {formatDate} from '../../common/js/date';
    import {isNull,centToDollar,trimBlank,getNowFormatDate} from "../../common/js/commons";
    import dict from '../../common/js/dict';
    import * as date from "../../common/js/date"

    export default {
        data() {
            return {
                stateOptions:dict.auth_state,
                listLoading:false,
                items: [],
                total_balance:'',
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                filters: {
                    customer_no: '',  //客户编号
                    customer_name: '',//客户姓名
                    identity_no: '',  //证件号码
                    mobile: '',       //手机号码
                    parent_name: '',  //邀请人姓名
                    parent_no: '',    //邀请人编号
                    sales_no: '',     //销售编号
                    sales_name: '',   //销售姓名
                    data_range:'',     //时间范围
                    auth_state:''
                },
                authStateOptions: dict.auth_state_map
            }
        },
        methods: {
            initData(){
                let now = getNowFormatDate()
                this.filters.data_range=[now,now]
                this.handleCreateDateChange(this.filters.data_range)
            },
            handleCreateDateChange(val) {
                console.log(val)
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
            },
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
            getItems(num) {//获取客户列表
                this.listLoading=true;
                if(num){
                    this.pager.currentPage = 1;
                }

                let flag = false;
                if(this.filters.data_range == '' || this.filters.data_range == null){
                    flag = true;
                }
                let condition = {
                    auth_state : trimBlank(this.filters.auth_state),
                    customer_no : trimBlank(this.filters.customer_no),
                    customer_name : trimBlank(this.filters.customer_name),
                    identity_no : trimBlank(this.filters.identity_no),
                    mobile : trimBlank(this.filters.mobile),
                    parent_name : trimBlank(this.filters.parent_name),
                    parent_no : trimBlank(this.filters.parent_no),
                    sales_no : trimBlank(this.filters.sales_no),
                    sales_name : trimBlank(this.filters.sales_name),
                    start_time :date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.start_time)
                };
                let params = {
                    "page_size": this.pager.pageSize,
                    "page_no": this.pager.currentPage,
                    "order_column": "",
                    "order_by": "",
                    condition: condition
                };

                    let _this = this
                $.ajax({
                    type : "POST",
//                  contentType:'application/json;charset=utf-8, charset=UTF-8',
                    timeout : 200000, //超时时间设置，单位毫秒
                    url : "customers/customers/listpage",

                    data : {data:JSON.stringify(params)},
                    success : function(res) {
                        if (res.status == 200) {
                            _this.listLoading = false;
                            let data = JSON.parse(res.datas);
                            _this.items = data.items;
                            _this.total_balance = data.statistics.total_balance;

                            _this.pager.total = data.total;
                        } else{
                            _this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                        _this.listLoading = false;
                    },
                    error : function(){
                        // alert("错误");
                    }

                });

                /*getCustomersList(params).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status == 200) {
                        this.items = result.items;
                        this.total_balance = result.statistics.total_balance;
                        this.listLoading = false;
                        this.pager.total = result.total;
                    } else {
                        if (res.data.status === 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }
                });*/
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.filters.start_time = ""
                this.filters.end_time = ""
                this.getItems(1);
            },
            isNull(val){
                return isNull(val);
            },
            centToDollars(val){

                return centToDollar(val);
            },
            showDetail(iid){
                this.$router.push({name:'客户详情',params:{id: iid}});
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData()
               this.getItems()

            })
        }
    }
</script>
<style scoped="">
    .container .main .content-container{
        background:#f7f7f7;
    }
    .form .form-left {
        width: 10%;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 1rem;
        margin-bottom: 2px;
    }

    .el-form-item {
        margin-bottom: 2px;
    }
    .money-total{
        display: table;
        width: 100%;
    }
</style>