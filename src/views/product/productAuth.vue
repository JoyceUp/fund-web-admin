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
            <el-table-column prop="gmt_create" align="center" label="创建时间">
                <template slot-scope="scope">
                   {{scope.row.gmt_create.substr(0,10)}}
                </template>
            </el-table-column>

            <el-table-column label="产品名称" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column prop="duration" align="center" label="锁定时长(天)"></el-table-column>

            <el-table-column prop="rate" align="center" label="预计年化率 %">
                <template slot-scope="scope">
                    {{ scope.row.rate /10000 }}%

                    +
                    {{ scope.row.dritf_rate /10000 }}%

                </template>
            </el-table-column>


            <el-table-column label="可见用户">
                <template slot-scope="scope">
                    <el-button type="primary"  @click="editProduct(scope.$index,scope.row) ">配置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.pageSize"
                    :page-sizes="pager.sizes" background :current-page="pager.currentPage" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>




        <el-dialog title="产品权限" :visible.sync="dialogFormVisible" center width="800px" >
            <el-form :model="addForm" label-width="150px">

                <el-form-item label="用户可见产品名称:" >
                   <span>{{addForm.product_name}}</span>
                </el-form-item>



                <el-form-item label="添加可见用户:" prop="">

                    <el-select
                            v-model="addForm.customer_id_list"
                            multiple
                            filterable
                            remote
                            no-data-text=""
                            reserve-keyword
                            placeholder="输入手机号"
                            :remote-method="remoteMethod"
                            @change="handSelect"
                            :loading="loading"
                            auto-complete
                    >
                        <el-option
                                v-for="item in options4"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>

                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save()">提 交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>

    import { getCustomersList } from '../../api/relation';
    import * as api from '../../api/product_api';
    import * as date from "../../common/js/date"
    import {trimBlank} from '../../common/js/commons';

    export default {
        data() {



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
                    product_name:"",
                    product_id:"",
                    customer_id_list:[]
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
            save(){
                api.updateVipCustmer(this.addForm).then(res=>{
                    this.dialogFormVisible=false
                    console.log(res)
                    if(res.status == 200){

                        this.$message({
                            type: 'success',
                            message: "保存成功"
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: "保存失败"
                        });
                    }

                })
            },

            editProduct(index,row){
              this.addForm.product_id=row.id
              this.addForm.product_name=row.name
                this.dialogFormVisible=true
                this.getVipCustomer(row.id)
            },
            getVipCustomer(id){

                let params={
                    page_size: 100,
                    page_no: 1,
                    order_column: "",
                    order_by: "",
                    condition:{
                        product_id:id
                    }
                }

                api.getVipCustmerList(params).then((res) => {

                    this.listLoading = false;  //隐藏loading
                    let resultSale=[]
                    if (res.status == 200) {
                        let data = JSON.parse(res.datas);
                            console.log(data)
                        //this.tableData = data.items;
                        //this.pager.total = data.total;

                        data.forEach((item)=>{
                            var obj = {};
                            obj.value =item.id
                            obj.label = item.full_name + item.mobile;
                            obj.mobile = item.mobile;
                            resultSale.push(obj);
                        })
                        console.log(resultSale)
                      //  this.addForm.customer_id_list = resultSale
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message(res.data.msg);
                    }
                });
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
                if (query !== '') {
                    getCustomersList({data:JSON.stringify(params)}).then((res) => {
                        this.fundCus=false
                        let datas = JSON.parse(res.data.datas).items;
                        var resultSale = [];
                        console.log(datas)
                        console.log(res.data.status)
                        if(res.data.status == 200 && datas.length > 0){

                            datas.forEach((item)=>{
                                var obj = {};
                                obj.value =item.id
                                obj.label = item.name + item.mobile;
                                obj.mobile = item.mobile;
                                resultSale.push(obj);
                            })
                        }

                            this.loading = true;
                            setTimeout(() => {
                                this.loading = false;
                                this.options4 = resultSale.filter(item => {
                                    return item.mobile.toLowerCase()
                                        .indexOf(query.toLowerCase()) > -1;
                                });
                            }, 200);


                    }).catch(_ => {});

                } else {
                    this.options4 = [];
                }


            },
            handSelect(val){

                this.options4 = [];
               // this.addForm.product_auth=[]
              console.log(this.addForm.customer_id_list)
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
                let params = {
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage,
                    order_column: "",
                    order_by: "",

                };
                this.getProductList(params);
            },
            //根据条件搜索销售数据
            getProduct() {
                this.listLoading = true  //显示loading
                this.pager.currentPage = 1;
                let params = {
                    page_size: this.pager.pageSize,
                    page_no: this.pager.currentPage,
                    order_column: "",
                    order_by: "",
                };
                this.getProductList(params);
            },
            //根据条件搜索销售数据-实体方法
            getProductList(params) {
                api.getVipProductList(params).then((res) => {
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
                this.getProduct();  //初始化页面数据
            })

        }
    }
</script>

<style >
    .el-transfer-panel{width:230px;}
</style>