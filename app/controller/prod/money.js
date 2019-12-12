/**
 * Created by XWang on 2018-01-31.
 */
var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");

//导出excel通用方法，
function exportExcel(req, res, header, params, api, type) {
    request.get(api)
        .set(header)
        .responseType("blob")
        .query({msg: JSON.stringify(params)})
        .end(function (_req, _res) {


            if (_res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '导出' + type + '列表'}, req);
            }
            //导出型api, 返回文件流，在_res.body中, 而不在_res.text中
            //_res.body有可能是文件内容，也可能是错误信息
            var buffer = Buffer.from(_res.body);
            if (_res.header["content-type"]) {
                res.setHeader('Content-Type', _res.header["content-type"]);
            }
            if (_res.header["content-disposition"]) {
                res.setHeader('content-disposition', _res.header["content-disposition"]);
            }

            res.end(buffer);
        });
}

exports.deposit_offline={
    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.deposit_offline)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取线下入金列表'}, req);
                }
                //console.log("_res.text",_res.text);
                res.json(JSON.parse(_res.text));
            });
    },

    details: function (req, res, next) {
        let {id} = req.body;
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.money.deposit_offline+"/" + id)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取线下入金详情'}, req);
                }
                res.json(JSON.parse(_res.text));
            });
    },

    add: function (req, res, next) {
        let {id} = req.body;
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        console.log(params)
        request.post(API.money.deposit_offline)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '添加线下入金'}, req);
                }
                res.json(JSON.parse(_res.text));
            });
    },

    review: function (req, res, next) {
        let {id} = req.body;
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.put(API.money.deposit_offline)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '审核线下入金'}, req);
                }
                res.json(JSON.parse(_res.text));
            });
    },
};


/**
 * 入金
 * **/
exports.deposit = {
    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.deposit_list)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取入金列表'}, req);
                }
                //console.log("_res.text",_res.text);
                res.json(JSON.parse(_res.text));
            });
    },

    details: function (req, res, next) {
        let {order_id} = req.body;
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.money.deposit_details + order_id)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取入金详情'}, req);
                }
                res.json(JSON.parse(_res.text));
            });
    },
    export: function (req, res, next) {
        let params = req.body;
        let header = {
            token: req.cookies.token
        };
        let api = API.money.deposit_export;
        exportExcel(req, res, header, params, api, "入金");
    }
};



/**
 * 出金
 * **/
exports.withdraw = {

    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.withdraw_list)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取出金列表'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },

    details: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.withdraw_details + params.order_id)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取出金详情'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },
    approve: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.put(API.money.withdraw_approve)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '出金-同意出金'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },

    done: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        console.log("withdraw_done",API.money.withdraw_done);

        request.put(API.money.withdraw_done)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '出金-完成'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },

    ignore: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.put(API.money.withdraw_ignore)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '出金-忽略出金'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },



    return: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.put(API.money.withdraw_return)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '出金-银行退回'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },
    export: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let api = API.money.withdraw_export;
        exportExcel(req, res, header, params, api, "出金");
    }
};
/**
 * 利息
 * **/
exports.interest = {

    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.interest_list)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取利息列表'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },

    sum: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        request.get(API.money.interest_list+"/sum")
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status == 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取利息总额统计'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },
    export: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;

        let api = API.money.interest_export;
        exportExcel(req, res, header, params, api, "利息");

    }

}
/**
 * 佣金
 * **/
exports.commission = {

    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.money.commission_list)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取佣金列表'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },
    sum: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.money.commission_list+"/sum")
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取佣金统计'}, req);
                }
                res.json(JSON.parse(_res.text))
            });
    },
    details: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        request.get(API.money.commission_details + params.id)
            .set(header)
            .query({msg: JSON.stringify(params)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取佣金详情列表'}, req);
                }
                res.json(JSON.parse(_res.text));
            });
    },
    export: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let api = API.money.commission_export;
        exportExcel(req, res, header, params, api, "佣金");
    }
}
/**
 * 余额变动
 * **/
exports.balance = {

    list: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let data = req.body.data || req.body

        if(typeof(data) == "string"){
            data = JSON.parse(data);
        }
        console.log(JSON.stringify(data))
        request.get(API.money.balance_list)
            .set(header)
            .query({msg: JSON.stringify(data)})
            .end(function (_req, _res) {
                if (_res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取余额变动列表'}, req);
                }
                console.log(JSON.parse(_res.text))
                console.log("================获取余额变动列表========================")
                res.json(JSON.parse(_res.text))
            });
    },
    export: function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        let params = req.body;
        let api = API.money.balance_export;
        exportExcel(req, res, header, params, api, "余额变动");

    }
};