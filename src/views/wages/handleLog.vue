<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px; ">
            <el-form :inline="true" :model="filters" ref="filters" size="small">
                <el-form-item prop="operator_name" label="操作人">
                    <el-input
                            placeholder="执行人"
                            v-model.trim="filters.operator_name">
                    </el-input>
                </el-form-item>
                <el-form-item prop="createDate">
                    <div class="block">
                        <el-date-picker
                                :span="3"
                                :clearable="clearable"
                                v-model="filters.createDate" type="daterange" start-placeholder="创建时间"
                                end-placeholder="创建时间"
                                placeholder="选择时间范围" @change="handleCreateDateChange"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList(1)" size="small">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button @click="resetSearch('filters')" size="small">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table
                :data="datas"
                border
                style="width: 100%">
            <el-table-column
                    prop="gmt_modified"
                    label="操作日期" >
            </el-table-column>
            <el-table-column
                    prop="file_title"
                    label="文件主题" >
            </el-table-column>
            <el-table-column
                    prop="operator_name"
                    label="操作人" >
            </el-table-column>
            <el-table-column
                    prop="operation_type"
                    :formatter="magesTypeFormatter"
                    label="操作类型">
            </el-table-column>
            <el-table-column
                    prop="count"
                    label="操作成功条数" >
            </el-table-column>
            <el-table-column
                    prop="operation_state"
                    :formatter="statusFormatter"
                    label="操作结果" >
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination
                    style="text-align: center;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pager.page_size"
                    :current-page="pager.page_no"
                    :page-sizes="pager.sizes"
                    background
                    layout="prev,pager,next,sizes,total"
                    :total="pager.total">
            </el-pagination>
        </el-col>

    </section>
</template>
<script>
    import * as API from '../../api/wages_api';
    import dict from '../../common/js/dict';
    import {dateStart,dateEnd} from '../../common/js/date';

    export default {
        props:["id"],
        data() {
            return {
                wages: {
                    wages_status: dict.wages_status,
                    wages_type: dict.wages_type,
                    wages_err_code: dict.wages_err_code
                },
                clearable:false,
                listLoading: false,
                pager: {
                    sizes: [10, 20, 30, 40, 50],
                    total: 0,
                    page_size: 10,
                    page_no: 1
                },
                datas:[],
                activeName: 'first',
                wages: {
                    wages_status: dict.wages_status,
                    wages_type: dict.wages_type,
                    wages_err_code: dict.wages_err_code
                },
                filters: {
                    start_time: '',
                    end_time: '',
                    operator_name: '',
                    file_title: '',
                    createDate:'',
                },


            }
        },
        methods: {
            //清空筛选表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1)  //1是让列表回到第一页
            },
            //分页pageSize发生改变
            handleSizeChange(val) {
                this.pager.page_no = 1;
                this.pager.page_size = val;
                this.handlePagerChange();
            },
            //分页currentPage发生改变
            handleCurrentChange(val) {
                this.pager.page_no = val;
                this.handlePagerChange();
            },
            //提交时间发生改变
            handleCreateDateChange(val) {
                this.filters.start_time = dateStart(val[0]);
                this.filters.end_time = dateEnd(val[1]);
            },
            //清空查询条件，页面恢复显示两日内数据
            resetSearch(formName) {
                this.filters.start_time = "";
                this.filters.end_time = "";
                this.$refs[formName].resetFields();
                this.filters.page_no = 1;
                this.getList();
            },
            //分页引起的页面数据更改
            handlePagerChange() {
                this.getList();
            },
            handleClick(tab, event) {
            },
            magesTypeFormatter(row, column) {
                return dict.operation_type[row.operation_type];
            },
            statusFormatter(row, column) {
                return dict.operation_state[row.operation_state];
            },
            getList(num) {

                if (num) {
                    this.pager.page_no = 1
                }

                let condition = {
                    "start_time": this.filters.start_time,
                    "end_time": this.filters.end_time,
                    "operator_name": this.filters.operator_name,
                    "file_title": this.filters.file_title,
                };
                let params = {
                    "condition": condition,
                    "page_size": this.pager.page_size,
                    "page_no": this.pager.page_no,
                    "order_column": "",
                    "order_by": ""
                }
                API.getWageslog(params).then((res) => {
                    if (res.data.status == 200) {
                        let datas = JSON.parse(res.data.datas);
                        this.datas = datas.items;
                        this.pager.total = datas.total;
                        console.log(datas);
                    } else {
                        if (res.data.status == 401) {
                        }
                        this.$message.error(res.data.msg);
                    }
                    this.listLoading = false;

                });



            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getList();
            })

        }
    }
</script>

