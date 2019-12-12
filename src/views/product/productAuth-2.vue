<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" label-width="80px">
                <el-form-item label="" prop="name">
                    <el-input placeholder="产品名称" v-model="filters.name">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getProduct">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button @click="resetForm('filters')">重置</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="addProduct">新增</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--搜索结果表格-->
        <el-table :header-row-style="headerRowStyle" :data="tableData" stripe v-loading="listLoading" style="width: 100%;" tooltip-effect="dark">
            <el-table-column prop="gmt_create" align="center" label="创建时间"></el-table-column>
            <el-table-column label="产品名称" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button @click="showProductDetails(scope.row.id)" type="text" size="small">{{ scope.row.name }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="duration" align="center" label="锁定时长(天)"></el-table-column>
            <el-table-column prop="recommend_no" align="center" label="首页推荐位置">

                <template slot-scope="scope">

                    <span v-if="scope.row.recommend_no > 0">{{scope.row.recommend_no}}</span>
                </template>

            </el-table-column>
            <el-table-column prop="rate" align="center" label="预计年化率 %">
                <template slot-scope="scope">
                    {{ scope.row.rate /10000 }}%

                    +
                    {{ scope.row.dritf_rate /10000 }}%

                </template>
            </el-table-column>
            <el-table-column prop="min_amount" align="center" label="起投金额(元)">

                <template slot-scope="scope">
                    {{ scope.row.min_amount /100 }}
                </template>
            </el-table-column>

            <el-table-column prop="online" align="center" label="产品状态" ></el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.pageSize"
                    :page-sizes="pager.sizes" background :current-page="pager.currentPage" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>




        <el-dialog title="产品权限" :visible.sync="dialogFormVisible" center width="800px">
            <el-form :model="addForm">

                <el-form-item label="" >
                    <el-select v-model="addForm.product_id" placeholder="请选择产品"  style="width:300px">
                        <el-option label="区域一" value="shanghai"></el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="" >

                </el-form-item>

                <el-form-item label="" prop="">

                    <el-transfer
                            filterable

                            :filter-method="filterMethod"
                            filter-placeholder="请输入城市拼音"
                            v-model="value2"
                            :data="data2">
                    </el-transfer>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="">提 交</el-button>
            </div>
        </el-dialog>




    </section>
</template>

<script>

    import { getCustomersList } from '../../api/relation';
    import * as api from '../../api/sale_api';
    import * as date from "../../common/js/date"
    import {trimBlank} from '../../common/js/commons';

    export default {
        data() {

            const generateData2 = _ => {
                const data = [];
                const cities = ['郑林平 1851603577', '北京', '广州', '深圳', '南京', '西安', '成都'];
                const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
                cities.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        pinyin: pinyin[index]
                    });
                });
                return data;
            };

            return {
                loading:false,
                data2: [{}],
                value2: [],
                options4:[],


                fundCus:false,
                formLabelWidth:"200px",
                dialogFormVisible:false,
                //表单header样式
                headerRowStyle: {
                    backgroundColor: "#ddd",
                    color:"#333",
                    textAlign: "center"
                },
                //搜索条件
                filters: {
                    name:"",
                    online:'',
                    dateArr:[],
                    start_time: '',
                    end_time: ''
                },
                addForm:{
                    product_id:"",
                    product_auth:[]
                },

                //分页设置
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                //表格数据
                tableData: [],
                listLoading:false
            };
        },
        methods: {

            filterMethod(query, item) {


                console.log(this.data2)
                                //return item.pinyin.indexOf(query) > -1;
                                if(trimBlank(query).length!=11 || this.fundCus==true){return false}

                               // return item.pinyin.indexOf(query) > -1

                                this.fundCus=true
                                let params={
                                    page_size: 10,
                                    page_no: 1,
                                    order_column: "",
                                    order_by: "",
                                    condition:{
                                        mobile:trimBlank(query)
                                    }
                                }
                                getCustomersList({data:JSON.stringify(params)}).then(res =>{
                                    this.fundCus=false
                                        let cus = JSON.parse(res.data.datas).items[0]

                                        let label = cus.name+""+cus.mobile

                             this.data2.push({
                                        label: label,
                                        key: 2,
                                        pinyin:cus.mobile
                                    })


                                })
                return item.pinyin.indexOf(query) > -1;

            },

            querySearchAsyncSale(queryString, cb) {
                if(trimBlank(queryString).length!=11 || this.fundCus==true){return}
                this.fundCus=true
                let params={
                    page_size: 10,
                    page_no: 1,
                    order_column: "",
                    order_by: "",
                    condition:{
                        mobile:trimBlank(queryString)
                    }
                }

                if (queryString) {

                    getCustomersList({data:JSON.stringify(params)}).then((res) => {
                        let datas = JSON.parse(res.data.datas);
                        var resultSale = [];
                        if(res.data.status == 200 && datas.length > 0){
                            datas.forEach((item)=>{
                                var obj = {};
                                obj.uuid = 2;
                                obj.value = item.name + item.mobile

                                obj.id = item.id;
                                resultSale.push(obj);
                            })
                        }else{
                            resultSale.push({
                                uuid: '-1',
                                value: '未搜索到结果！'
                            })
                        }
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            cb(resultSale);
                        }, 100 * Math.random());
                    }).catch(_ => {});
                }
            },


            remoteMethod(query) {


                if(trimBlank(query).length!=11 || this.fundCus==true){return}
                this.fundCus=true
                let params={
                    page_size: 10,
                    page_no: 1,
                    order_column: "",
                    order_by: "",
                    condition:{
                        mobile:trimBlank(query)
                    }
                }



                    getCustomersList({data:JSON.stringify(params)}).then((res) => {
                        let datas = JSON.parse(res.data.datas);
                        var resultSale = [];
                        if(res.data.status == 200 && datas.length > 0){
                            datas.forEach((item)=>{
                                var obj = {};
                                obj.uuid = 2;
                                obj.value = item.name + item.mobile

                                obj.id = item.id;
                                resultSale.push(obj);
                            })
                        }

                    }).catch(_ => {});




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
            handlePagerChange()
            {

                this.getProductList(params);
            },
            //根据条件搜索销售数据
            getProduct() {
                this.listLoading = true  //显示loading
                this.pager.currentPage = 1;
                let params = {
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage,
                    product_name: this.filters.name,
                    online: this.filters.online,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time),
                };
                this.getProductList(params);
            },
            //根据条件搜索销售数据-实体方法
            getProductList(params) {
                api.getProductList(params).then((res) => {
                    this.listLoading = false;  //隐藏loading
                    if (res.status == 200) {
                        let data = JSON.parse(res.datas);
                        this.tableData = data.items;
                        this.pager.total = data.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
            },
            addProduct(){
                this.dialogFormVisible=true
                //this.$router.push('/productDetail/'+'add')
            },

            //重置搜索表彰
            resetForm(formName) {
                this.filters.start_time="";
                this.filters.end_time="";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.initData();
            },
            //初始化页面
            initData() {

            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style >
    .el-transfer-panel{width:230px;}
</style>