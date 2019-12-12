/**
 * Created by szt 2018.01.03.
 */



let express = require('express');
let router = express.Router();
let finance = require("../../app/controller/prod/finance");
let internal = require("../../app/controller/prod/internal");


// 销售业绩表
router.post("/sales_preformance/list", finance.sales_preformance.list);                   //销售业绩列表
router.post("/sales_preformance/export", finance.sales_preformance.export);               //导出业绩列表
router.post("/sales_preformance/exist", finance.sales_preformance.exist);               //查询是否有数据

// 内勤业绩表
router.post("/internal/list", internal.internal.list);                   //内勤业绩表
router.post("/internal/export", internal.internal.export);               //导出内勤业绩表
// router.post("/internal/exist", internal.internal.exist);               //查询是否有数据

module.exports = router;