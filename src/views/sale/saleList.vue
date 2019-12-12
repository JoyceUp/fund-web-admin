<template xmlns:el-col="http://www.w3.org/1999/html">
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" ref="filters" :model="filters">
                <el-form-item prop="sales_no">
                    <el-input placeholder="销售编号" v-model="filters.sales_no"></el-input>
                </el-form-item>
                <el-form-item prop="sales_name">
                    <el-input placeholder="销售姓名" v-model="filters.sales_name"></el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input placeholder="手机号码" v-model="filters.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="identity_no">
                    <el-input placeholder="证件号码" v-model="filters.identity_no"></el-input>
                </el-form-item>
                <el-form-item prop="sales_state">
                    <el-select placeholder="在岗状态" v-model="filters.sales_state">
                        <el-option value="" label="全部"></el-option>
                        <el-option :key="item.value" :label="item.key" :value="item.value"
                                   v-for="item in salesStateOptions"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getItems(1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetSearch('filters')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true">
                <!--<el-form-item><el-button type="primary" @click="$router.push('info/add')">新增</el-button></el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="alertDialog('addSaleInfo')">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--数据列表-->
        <el-table stripe v-loading="listLoading" :data="items" style="width: 100%">
            <el-table-column width="55"></el-table-column>
            <el-table-column prop="sales_no" label="销售编号">
                <template slot-scope="scope">
                    <el-button type="text" @click="$router.push('info/'+scope.row.id)">{{scope.row.sales_no}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="销售姓名"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="identity_no" label="证件号码"></el-table-column>
            <el-table-column prop="gmt_create" label="创建时间"></el-table-column>
            <el-table-column prop="gmt_modified" label="更新时间"></el-table-column>
            <el-table-column label="在岗状态">
                <template slot-scope="scope"><span>{{salesStateMapOptions[scope.row.sales_state]}}</span></template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pager.page_size"
                           :current-page="pager.currentPage" :page-sizes="pager.sizes" background layout="prev,pager,next,sizes,total" :total="pager.total">
            </el-pagination>
        </el-col>

        <el-dialog title="验证销售是否开通ThankFund账户" :visible.sync="dialogFormVisible" width="400px">
            <el-form ref="addSaleInfo" :model="addSaleInfo" :rules="rules" label-width="80px" size="small">
                <el-form-item label="销售姓名" prop="name">
                    <el-input v-model="addSaleInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="identity_no">
                    <el-input v-model="addSaleInfo.identity_no"></el-input>
                </el-form-item>
                <br/>
                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="nextStep('addSaleInfo')">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </section>

</template>

<script>
    import {getSaleList, isVerifySale} from '../../api/sale_api';
    import dict from '../../common/js/dict';
    import {all_identity_no} from '../../common/js/checkFields';

    export default {
        data() {
            return {
                listLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                items: [],
                //搜索条件
                filters: {
                    sales_no: "",
                    sales_name: "",
                    mobile: "",
                    identity_no: "",
                    sales_state: ""
                },
                dialogFormVisible: false,   //打开新增销售的弹框
                addSaleInfo: {
                    identity_no: '',
                    name:''
                },
                rules: {
                    identity_no: [
                        {required: true, message: '证件号码不能为空', trigger: 'blur'},
                        {validator: all_identity_no, message: '证件号码格式错误', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '销售姓名不能为空', trigger: 'blur'},
                    ]
                },
                salesStateOptions: dict.sales_state,
                //列表
                salesStateMapOptions: dict.sales_state_map
            }
        },
        methods: {
            // 分页page_size改变
            handleSizeChange(val) {
                this.pager.currentPage = 1;
                this.pager.pageSize = val;
                this.handlePagerChange();
            },
            // 分页page_no改变
            handleCurrentChange(val) {
                this.pager.currentPage = val;
                this.handlePagerChange();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getItems();
            },
            getItems(num) {
                //查询列表
                this.listLoading = true;
                if (num) {
                    this.pager.currentPage = 1;
                }

                // let paras = Object.assign(this.positionDic, this.filters);
                let condition = Object.assign(this.filters);
                let paras = {};
                paras.condition = condition;
                paras.page_no = this.pager.currentPage;
                paras.page_size = this.pager.pageSize;
                getSaleList(paras).then((res) => {
                    let result = JSON.parse(res.data.datas);
                    if (res.data.status === 200) {
                        this.listLoading = false;
                        this.items = result.items;
                        this.pager.total = result.total;
                    } else {
                        if (res.data.status == 401) {
                            this.$router.push('/login');
                        }
                        this.$message.error(res.data.msg);
                    }

                });
            },
            resetSearch(formName) {
                this.$refs[formName].resetFields();
                this.getItems(1);
            },
            tableStatusFormatter(row) {
                switch (row.sales_state) {
                    case 1:
                        return '在职';
                    case 2:
                        return '离职';
                    case 3:
                        return '兼职';
                    default:
                        return ' - - ';
                }
            },
            alertDialog(formName) {
                this.dialogFormVisible = true;
                this.addSaleInfo.identity_no = '';
            },
            nextStep(formName) {             //添加销售信息
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            identity_no: this.addSaleInfo.identity_no,
                            name: this.addSaleInfo.name
                        };

                        isVerifySale(params).then((res) => {
                            let result = JSON.parse(res.data.datas);
                            if (res.data.status === 200) {
                                this.$store.dispatch("save_sale_info", result);//vuex传接对象
                                this.$router.push({name: '新增销售'});
                            } else {
                                if (res.data.status === 401) {
                                    this.$router.push('/login');
                                }
                                this.$refs[formName].resetFields();
                                this.$message.error(res.data.msg);
                            }
                        });

               /*         this.$store.dispatch("save_sale_info", this.addSaleInfo.identity_no);//vuex传接对象
                        this.$router.push({name: '新增销售'});*/
                    }
                });
            },

        },
        mounted() {
            this.$nextTick(function () {
                this.getItems();
            })
        }

    }
</script>