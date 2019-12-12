/**
 *   Created by XWang on 2018-01-03
 * */

let express = require('express');
let router = express.Router();
let product = require("../../app/controller/prod/product");


//

router.post("/vip/list",product.vip.list);      //vip产品列表
router.post("/vip/customer_list",product.vip.customer_list);      //vip产品客户列表
router.post("/vip/add",product.vip.add);      //添加vip客户
router.post("/vip/update",product.vip.update);      //更新vip客户

module.exports = router;