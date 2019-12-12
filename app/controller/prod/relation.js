/**
 *  Created by XWang on 2017-01-03
 **/

var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");

//#变更客户上级
exports.customerParent = {
    list: function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = JSON.parse(req.body.data) ;

        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition,
        };


        request.get(`${API.customers.relation_customer_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    submit: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.put(`${API.relations.relation_customer_parent_set}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '变更客户上级'}, req);
                }
                console.log("_res.text",_res.text);
                res.json(JSON.parse(_res.text))
            });
    },
    log: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(`${API.relations.relation_customer_parent_log}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '变更客户上级记录'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    }
};
