/**
 * Created by szt 2018.01.03.
 */



let express = require('express');
let router = express.Router();
let wages = require("../../app/controller/prod/wages");


// 工资奖金管理
router.post("/list", wages.wages_list.list);                   //工资列表

router.post("/payment_send_accept", wages.wages_list.payment_send_accept);               //执行发放受理
router.post("/payment_send_accept_result", wages.wages_list.payment_send_accept_result);               //执行发放结果

router.post("/payment_accept", wages.wages_list.payment_accept);               //导入数据受理
router.post("/payment_accept_result", wages.wages_list.payment_accept_result);  //导入数据结果

router.post("/info", wages.wages_list.info);//详情
router.post("/log", wages.wages_list.log);//发放日志



module.exports = router;