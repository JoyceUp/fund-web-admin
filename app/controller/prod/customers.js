/**
 * author:cuiyajuam
 * created date :2018-01-24
 */

var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");

//#注册用户
exports.customers = {
    update:function (req, res, next) {

        let header = {
            token: req.cookies.token
        };
        request.put(`${API.customers.customer_info}`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'edit', 'msg': '更新客户信息'}, req);
                    res.json(JSON.parse(_res.text))
                }else{
                    res.json(_res)
                }

            });

    },
    list : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let data = req.body.data || req.body

        if(typeof(data) == "string"){
            data = JSON.parse(data);
        }


        let {page_size, page_no, order_column, order_by, condition} = data;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition,
        };
        console.log(params)
        request.get(`${API.customers.customer_list}/info`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {

                if (res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户列表'}, _req);
                    _res.json(JSON.parse(res.text))
                }else{
                    _res.json(res)
                }

            });
    },
    info : function (_req, _res, next) {
        let header = {
            token: _req.cookies.token
        };

        let {id} = _req.body;
        let params = {
            "customer_id": id
        };

        request.get(`${API.customers.customer_list}/info/basic`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '注册客户详情'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    bankcard : function (_req, _res, next) {
        let header = {
            token: _req.cookies.token
        };
        let {id} = _req.body;
        let params = {
          "customer_id":id
        };

        request.get(`${API.customers.customer_list}/info/bankcard`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情银行信息'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    deposit : function (_req, _res, next) {
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = _req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/fund/deposit`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情入金列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    withdraw : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/fund/withdraw`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情出金列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    interest : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/fund/interest`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户利息列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    update_contract : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        request.put(`${API.customers.customer_list}/invest/contract`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (req, res) {
                _res.json(JSON.parse(res.text))
            });
    },
    invest : function (req, res, next) { let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/invest`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户投资列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    commission : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/fund/commission`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情佣金列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    relation : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "customer_id": id
        };
        request.get(`${API.customers.customer_list}/parent`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情关系列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    partner : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {page_size, page_no, order_column, order_by, condition} = req.body;
        let params = {
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by,
            "condition": condition
        };
        request.get(`${API.customers.customer_list}/child`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '注册客户详情我的合伙人列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
};