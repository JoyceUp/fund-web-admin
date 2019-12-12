/**
 * Created by zlp on 2017-12-10.
 */
//var Promise = require("bluebird");
var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");


exports.banner = {
    list: function (req, res) {
        let {page_size,page_no,condition,order_column,order_by} = req.body
        let header = {
            token:req.cookies.token
        }
        let params = {
            "condition": condition,
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column || "",
            "order_by": order_by || ""
        }
        request.get(API.cms.banner)
            .query({msg:JSON.stringify(params)})
            .set(header)
            .end(function (_req,_res) {
                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })

    },
    add: function (req, res) {
        let header = {
            token:req.cookies.token
        }

        request.post(API.cms.banner)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {

                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })

    },
    update: function (req, res) {
        let header = {
            token:req.cookies.token
        }

        request.put(API.cms.banner)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {

                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })

    },
    single: function (req, res) {
        let {id} = req.body;
        let header = {
            token:req.cookies.token
        };
        request.get(API.cms.banner + "/" + id)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取Banner详情'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    },
    delete: function (req, res) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;

        request.delete(API.cms.banner + "/" + id)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '删除这行'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });

    },
    changeState: function (req, res) {
        let {id, state} = req.body;
        let header = {
            token:req.cookies.token
        };
        let paras = {
            state: state,
            id: id
        };
        request.put(API.cms.banner + "/" + id)
            .query({msg:JSON.stringify(paras)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '更新通知状态'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    }

}



exports.article = {
    list: function (req, res) {
        let {page_size,page_no,condition,order_column,order_by} = req.body
        console.log(req.cookies.token)
        let header = {
            token:req.cookies.token
        }
        let params = {
            "condition": condition,
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by
        }
        request.get(API.cms.article)
            .query({msg:JSON.stringify(params)})
            .set(header)
            .end(function (_req,_res) {

                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })

    },
    add: function (req, res) {
        let header = {
            token:req.cookies.token
        }
        console.log(req.body)
        request.post(API.cms.article)
            .type('form')
            .send({"msg":JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {

                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })
    },
    update: function (req, res) {
        let header = {
            token:req.cookies.token
        }
        console.log(req.body)
        request.put(API.cms.article)
            .type('form')
            .send({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {

                if(_res.status == 200){
                    res.json(JSON.parse(_res.text))
                }
            })

    },
    single: function (req, res) {
        let {id} = req.body;
        let header = {
            token:req.cookies.token
        };
        request.get(API.cms.article + "/" + id)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取文章详情'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    },
    delete: function (req, res) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;

        request.delete(API.cms.article + "/" + id)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '删除这行'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });

    },
    changeState: function (req, res) {
        console.log(111)
        let {id, state} = req.body;
        let header = {
            token:req.cookies.token
        };
        let paras = {
            state: state,
            id: id
        };
        console.log(paras)
        request.put(API.cms.article + "/" + id)
            .query({msg:JSON.stringify(paras)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '更新通知状态'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    }
}





exports.notice = {
    list: function (req, res) {
        let {page_size,page_no,condition,order_column,order_by} = req.body
        let header = {
            token:req.cookies.token
        };
        let params = {
            "condition": condition,
            "page_size": page_size,
            "page_no": page_no,
            "order_column": order_column,
            "order_by": order_by
        };
        request.get(API.cms.notice)
            .query({msg:JSON.stringify(params)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '内容管理 -- 通知列表'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })

    },
    add: function (req, res) {
        let header = {
            token:req.cookies.token
        };
        request.post(API.cms.notice)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '新增通知数据'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    },
    single: function (req, res) {
        let {id} = req.body;
        let header = {
            token:req.cookies.token
        };
        request.get(API.cms.notice + "/" + id)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '获取通知详情'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    },
    edit: function (req, res) {
        let header = {
            token:req.cookies.token
        };
        request.put(API.cms.notice)
            .query({msg:JSON.stringify(req.body)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '更新通知数据'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    },
    changeState: function (req, res) {
        let {id, state} = req.body;
        let header = {
            token:req.cookies.token
        };
        let paras = {
            state: state,
            id: id
        };
        console.log(paras)
       request.put(API.cms.notice + "/" + id)
            .query({msg:JSON.stringify(paras)})
            .set(header)
            .end(function (_req,_res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '更新通知状态'}, _req);
                }
                res.json(JSON.parse(_res.text))
            })
    }
}
