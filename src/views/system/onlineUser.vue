<template>

	<section>
		<el-table
				stripe=""
				:data="tableData"

				style="width: 100%"
				>

			<el-table-column
					prop="user_name"
					label="用户名"
					>
			</el-table-column>
			<el-table-column
					prop="nickname"
					label="昵称"
					>
			</el-table-column>
			<el-table-column
					prop="onlinestatus"
					label="状态"
					width="180"
					:formatter="formatStatus"
					>
			</el-table-column>
			<el-table-column
					prop="option"
					label=" 操作"
					width="180"
					>
				<template slot-scope="scope">
				<el-button v-if="scope.row.onlinestatus != 0 "

						type="danger"
						@click="handleDownLine(scope.$index, scope.row,scope)">下线</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>

</template>
<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import * as api from '../../api/auth_api';

    export default {
        data() {
            return {
                tableData:[],
            }
        },
		methods:{
            formatStatus (row,column){
                return  row.onlinestatus == 0 ? '离线' : '在线';
			},
            handleDownLine: function (index, row, scope) {
                console.log(row.onlinestatus)

                this.$confirm('此操作将下线该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dic = {
                        user_id: row.user_id,
                        user_name:row.user_name
                    };
//                    this.tableData.splice(index,1,);//本地删除

                    api.exitAdminUser(dic).then(res => {
                        if (res.data.status == 200) {

                            this.$message({
                                type: 'success',
                                message: row.nickname + '下线成功!',
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: row.nickname + '下线失败!'
                            });
                        }
                        //刷界面
                        this.getData();
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下线!'
                    });
                });

            },
            getData(){
                let  params={}

                api.getOnlineAdminUserList(params).then((res) => {
					console.log(res)
					if(res.data.status==200){
					    //成功
                        var dataArr  =JSON.parse(res.data.datas) ;
						this.tableData = dataArr.items;
                    }else{
                        if(res.data.status == 401){
                            this.$router.push('/login');
                        }
					}


                });
			},
//            changePageData(val){
//                this.page = val;
//			}

		},
		mounted() {

            this.$nextTick(function () {
                this.getData();
            })

        }
    }
</script>
