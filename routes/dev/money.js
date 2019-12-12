/**
 * Created by szt 2018.01.03.
 */



let express = require('express');
let router = express.Router();
let money = require("../../app/controller/dev/money");


// 入金
router.post("/deposit/list", money.deposit.list);                   //入金列表
router.post("/deposit/details", money.deposit.details);                   //入金详情
router.post("/deposit/export", money.deposit.export);                   //导出数据

//出金
router.post("/withdraw/list", money.withdraw.list);                 //出金列表
router.post("/withdraw/details", money.withdraw.details);                 //出金详情
router.post("/withdraw/approve", money.withdraw.approve);                 //审核
router.post("/withdraw/done", money.withdraw.done);                 //完成
router.post("/withdraw/ignore", money.withdraw.ignore);                 //退回
router.post("/withdraw/return", money.withdraw.return);                 //银行退回
router.post("/withdraw/export", money.withdraw.export);                 //导出数据

//利息
router.post("/interest/list", money.interest.list);                  //转账列表
router.post("/interest/export", money.interest.export);                  //导出数据

//佣金
router.post("/commission/list", money.commission.list);                  //佣金列表
router.post("/commission/details", money.commission.details);                  //佣金详情
router.post("/commission/export", money.commission.export);                  //导出佣金数据

//余额变动表
router.post("/balance/list", money.balance.list);                      //返利余额变动表
router.post("/balance/export", money.balance.export);                      //导出余额变动表数据


module.exports = router;