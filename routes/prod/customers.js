
/**
 *created by yuyz  date:2017-01-03
 */
let express = require("express");
let router = express.Router();
let customers = require('../../app/controller/prod/customers');

//#注册客户
router.post('/customers/listpage',customers.customers.list);    //列表
router.post('/customers/info',customers.customers.info);        //详情
router.post('/customers/info/update',customers.customers.update);        //更新客户信息
router.post('/customers/info/bankcard',customers.customers.bankcard);           //银行列表
router.post('/customers/info/fund/deposit',customers.customers.deposit);        //入金列表
router.post('/customers/info/fund/withdraw',customers.customers.withdraw);      //出金列表
router.post('/customers/invest',customers.customers.invest);                    //投资列表
router.post('/customers/invest/contract',customers.customers.update_contract);                    //投资列表

router.post('/customers/info/fund/interest',customers.customers.interest);      //利息列表
router.post('/customers/info/fund/commission',customers.customers.commission);  //佣金列表
router.post('/customers/info/fund/relation',customers.customers.relation);      //关系列表
router.post('/customers/info/fund/partner',customers.customers.partner);        //我的合伙人

module.exports=router;