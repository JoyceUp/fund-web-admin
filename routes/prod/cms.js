/**
 * Created by zlp on 2017-12-10.
 */



let express = require('express');
let router =  express.Router();
let site = require("../../app/controller/prod/cms");

/**
 * 网站设置
 * **/

router.post("/banner/list",site.banner.list);
router.post("/banner/add",site.banner.add);
router.post("/banner/update",site.banner.update);
router.post("/banner/single",site.banner.single);
router.post("/banner/edit/state",site.banner.changeState);


router.post("/article/list",site.article.list);
router.post("/article/add",site.article.add);
router.post("/article/update",site.article.update);
router.post("/article/single",site.article.single);
router.post("/article/edit/state",site.article.changeState);



/* 通知管理 */
router.post("/notice/list",site.notice.list);
router.post("/notice/add",site.notice.add);
router.post("/notice/edit",site.notice.edit);
router.post("/notice/single",site.notice.single);
router.post("/notice/edit/state",site.notice.changeState);


module.exports = router;