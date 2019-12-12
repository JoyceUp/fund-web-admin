/**
 *   Created by XWang on 2018-01-05
 * */


let express = require('express');
let router = express.Router();
let relation = require("../../app/controller/prod/relation");

//#变更客户列表
router.post("/customer_list", relation.customerParent.list);
//#变更客户上级
router.post("/customer_parent/submit", relation.customerParent.submit);

//#变更客户上级记录
router.post("/customer_parent/log", relation.customerParent.log);

//客户归属变更-选择销售
// router.post("/customer_sale_list", relation.getCustomerSaleList);
// router.post("/set_customer_sales", relation.setCustomerSales);



//更新代理归属
//更新代理归属-代理列表
// router.post("/proxy_list", relation.getProxyList);
//更新代理归属-选择销售
// router.post("/proxy_sale_list", relation.getProxySaleList);
// router.post("/set_proxy_sales", relation.setProxySales);


// router.post("/proxy_modified", relation.getProxyModifiedLog);
module.exports = router;