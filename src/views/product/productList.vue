<template>
    <section>
        <!--搜索工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" label-width="80px">
                <el-form-item label="" prop="name">
                    <el-input placeholder="产品名称" v-model="filters.name">
                    </el-input>
                </el-form-item>
                <el-form-item prop="dateArr">
                    <el-date-picker
                            v-model="filters.dateArr" type="daterange" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                            placeholder="选择时间范围" value-format="yyyy-MM-dd" @change="handleCreateDateChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" prop="online">
                    <el-select placeholder="产品状态" v-model="filters.online" size="18px">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已发布" value="1"></el-option>
                        <el-option label="未发布" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getProduct">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="addProduct">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('filters')">重置</el-button>
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

            <el-table-column prop="online" align="center" label="产品状态" :formatter="formatterState"></el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.pageSize"
                    :page-sizes="pager.sizes" background :current-page="pager.currentPage" layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>

    import * as api from '../../api/sale_api';
    import * as date from "../../common/js/date"
    export default {
        data() {
            return {
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
            //产品类型
            profitType(val){
                var str ='';
                if (val.profit_type==1){
                    str = '按日计算'
                } else if (val.profit_type==10){
                    str = '到付'
                }
                return str;
            },
            //状态
            formatterState(val){
                var str ='';
                if (val.online==1){
                    str = '已发布'
                } else if (val.online==2){
                    str = '未发布'
                }
                return str;
            },
            handleCreateDateChange(val) {
                this.filters.start_time = val[0];
                this.filters.end_time = val[1];
            },
            //转向销售详情页
            showProductDetails(id) {
                this.$router.push('/productDetail/'+id)
                //alert(id);
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
                    product_name: this.filters.name,
                    online: this.filters.online,
                    start_time: date.dateStart(this.filters.start_time),
                    end_time: date.dateEnd(this.filters.end_time),
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
                this.$router.push('/productDetail/'+'add')
            },
            //删除
            delProduct(id){
                this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dic = {
                         id: id,
                    };

                    api.delProduct(dic).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                        //刷界面
                        this.getProduct();
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下线!'
                    });
                });
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
                let params = {
                    pageSize: this.pager.pageSize,
                    currentPage: this.pager.currentPage
                };
                //默认显示所有销售
                this.getProduct(params);
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.initData();  //初始化页面数据
            })

        }
    }
</script>

<style scoped>

</style>