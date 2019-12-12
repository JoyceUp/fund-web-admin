/**
 *   Created by XWang on 2018-01-03
 * */

let express = require('express');
let router = express.Router();
let sale = require("../../app/controller/prod/sale");

//#注册客户
router.post('/sale/listpage',sale.sales.list);                  //列表
router.post('/sale/add/info',sale.sales.addIsVerify);           //添加第一步
router.post('/sale/nextAdd',sale.sales.nextAdd);                //添加第二步
router.post('/sale/info',sale.sales.info);                      //详情(添加 下一步列表详情)
router.post('/sale/info/edit',sale.sales.edit);                 //更新
router.post('/sale/info/resetPass',sale.sales.resetPass);       //重置密码
router.post('/sale/info/organization',sale.sales.organization); //职位信息
router.post('/sale/info/commission',sale.sales.commission);     //提成信息
router.post('/sale/info/customer',sale.sales.customer);         //客户信息

//

router.post("/product/list",sale.productList);      //产品列表
router.post("/product/del",sale.delProduct);        //删除产品
router.post("/product/detail",sale.productSingle);  //产品详情
router.post("/product/add",sale.addProduct);        //添加
router.post("/product/update",sale.updateProduct);  //更新

//#内勤管理
router.post('/sale/getInsiderList',sale.sales.getInsiderList);              //列表
router.post('/sale/getInsiderInfo',sale.sales.getInsiderInfo);              //获取内勤信息
router.post('/sale/editInsiderInfo',sale.sales.editInsiderInfo);            //更新详情
router.post('/sale/insiderSdd/info',sale.sales.addInsiderVerify);           //添加验证内勤是否注册用户
router.post('/sale/info/getIinsiderOrganization',sale.sales.organization);  //获取公司树
router.post('/sale/addInsiderInfo',sale.sales.addInsiderInfo);              //添加内勤
router.post('/sale/info/getInsiderCommissionInfoList',sale.sales.getInsiderCommissionInfoList);     //提成信息


//#机构管理
router.post("/department/listpage",sale.resources.departmentList);     //获取组织树
router.post("/company/add",sale.resources.addCompany);                 //添加公司
router.post("/department/add",sale.resources.addDepartment);           //添加部门
router.post("/team/add",sale.resources.addTeam);                       //添加组别

router.post("/company/edit",sale.resources.editCompany);               //编辑公司
router.post("/department/edit",sale.resources.editDepartment);         //编辑部门
router.post("/team/edit",sale.resources.editTeam);                     //编辑组别

router.post("/company/remove",sale.resources.removeCompany);           //删除公司
router.post("/department/remove",sale.resources.removeDepartment);     //删除部门
router.post("/team/remove",sale.resources.removeTeam);                 //删除组别
module.exports = router;