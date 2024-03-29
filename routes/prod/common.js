/**
 * Created by zlp on 2017-12-10.
 */



let express = require('express');
let router = express.Router();

let common = require("../../app/controller/prod/common/common");
let upload = require("../../app/controller/prod/common/fileupload");

//发送手机验证码
router.post("/send_sms", common.sendSMS);

//发送邮箱验证码
router.post("/send_mail", common.sendMail);
router.post("/unique_mail", common.emailUnique);

//获取汇率
router.post("/rate", common.getRate);

//上传文件
router.post("/upload", upload.single('file'), common.upload);
router.post("/file/upload", upload.single('file'),  common.uploadFile);

router.post("/editor/upload", upload.single('file'), common.editorUpload);

//获取图形验证码
router.get("/captcha/get", common.captcha.get);

//校验图形验证码
router.post("/captcha/check", common.captcha.check);

//获取图片地址
router.post("/images", common.images);
router.get("/images/:id", common.showImages);

module.exports = router;