let express = require('express');
let router =  express.Router();
module.exports = function (app){

    app.use('/common', require('./common'));
    app.use('/login', require('./login'));
    app.use('/auth', require('./auth'));
    app.use('/customers',require('./customers'));  //客服
    app.use('/sale',require('./sale'));           //销售
    app.use('/money',require('./money'));         //资金岗
    app.use('/relation',require('./relation'));         //资金岗
    app.use('/cms',require('./cms'));         //网站设置
    app.use('/wages',require('./wages'));         //工资管理
    app.use('/finance',require('./finance'));         //报表
    app.use('/star',require('./star'));         //标星管理
    app.use('/product',require('./product'));         //标星管理

}