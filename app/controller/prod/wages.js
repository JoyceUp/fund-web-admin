/**
 * Created by XWang on 2018-01-31.
 */
var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");
/**
 * 获取工资奖金列表
 * **/
exports.wages_list = {
    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        if(params.condition.start_time.length>0){
            params.condition.start_time +=" 00:00:00.000"
            params.condition.end_time +=" 23:59:59.999"
        }


        console.log(JSON.stringify(params))
        request.get(API.wages.wages_list)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取工资奖金列表'}, req);
                    res.json(JSON.parse(_res.text));
                }else{
                    res.json(_res);
                }

            });
    },

    log:function(req,res){
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.wages.log)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getId', 'msg': '操作日志'}, req);
                    res.json(JSON.parse(_res.text));
                }else{
                    res.json(_res);
                }

            });

    },

    info:function(req,res){
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let url = API.wages.handle+req.body.id;
        request.get(url)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getId', 'msg': '查询发放详情'}, req);
                    res.json(JSON.parse(_res.text));
                }else{
                    res.json(_res);
                }

            });

    },


    payment_send_accept: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let url = API.wages.payment_send_accept+req.body.id;
        request.put(url)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '执行发放受理'}, req);
                    res.json(JSON.parse(_res.text));
                }else{

                    res.json(_res);
                }

            });
    },
    payment_send_accept_result: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let url = API.wages.payment_send_accept_result+req.body.id;
        console.log(url)
        request.put(url)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                console.log(_res.status)
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '查询执行发放结果'}, req);
                    res.json(JSON.parse(_res.text));
                }else{

                    res.json(_res);
                }

            });
    },
    payment_accept: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.post(API.wages.payment_accept)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '导入数据受理'}, req);
                    res.json(JSON.parse(_res.text));
                }else{

                    res.json(_res);
                }

            });
    },
    payment_accept_result: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.post(API.wages.payment_accept_result)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '导入数据成功'}, req);
                    res.json(JSON.parse(_res.text));
                }else{

                    res.json(_res);
                }

            });
    },

};


