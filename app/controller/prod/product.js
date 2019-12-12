/**
 * Created by zlp on 2017-12-19.
 */

var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");


//#VIP产品
exports.vip = {
    list : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };

        request.get(`${API.product.product_vip}`)
            .query({msg: JSON.stringify( req.body)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取vip产品列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },

    customer_list:function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };

        request.get(`${API.product.vip_customer_list}`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (req, res) {
                console.log("ssss",res.text)
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取vip用户列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },


    add : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {identity_no,name} = req.body;
        let params = {
            "name": name,
            "identity_no": identity_no
        };

        request.post(`${API.product.add_vip}`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '添加VIP产品客户'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    update : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let params = req.body;
        console.log(params )
        request.put(`${API.product.update_vip}`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (req, res) {
                if (res.status == 200) {
                    service.save_user_log({'type': 'add', 'msg': '更新VIP产品客户'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },

};
