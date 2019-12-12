/**
 *   Created
 * */

let express = require('express');
let router = express.Router();
let star = require("../../app/controller/prod/star");

//根据条件获取标星列表
router.post("/getStarList", star.getStarList);
router.post("/addStar", star.addStar);
router.post("/addStarVerify", star.addStarVerify);
router.post("/cancelStar", star.cancelStar);
router.post("/getStarLog", star.getStarLog);
module.exports = router;