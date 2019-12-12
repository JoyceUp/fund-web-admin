/**
 * Created by zlp on 2017-12-19.
 */

var request = require("superagent");
var API = require("./support/const")
var service = require("../../service/log")
/**
 * 标星列表
 */
//标星列表
exports.getStarList = function (req, res) {

    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let {note_time, customer_no, customer_name,mobile,identity_no,pageSize,currentPage} = req.body;
    let params = {
        "page_size": pageSize,
        "page_no": currentPage,
        "order_by": "DESC",
        "order_column":'gmt_create',
        "condition":{
            "note_time": note_time,
            "customer_no": customer_no,
            "customer_name": customer_name,
            "mobile": mobile,
            "identity_no": identity_no,
        }
    };
    request.get(`${API.star.star_list}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '标星列表'}, _req);
                _res.json(JSON.parse(res.text))
            }else{
                _res.json(res)
            }

        });
};
//新增标星
exports.addStar = function (req, res) {

    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let customer_list = req.body;
    let params = {
        "customer_list":customer_list
    }
    request.post(`${API.star.add_star}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '新增标星客户'}, _req);
                _res.json(JSON.parse(res.text))
            }else{
                _res.json(res)
            }

        });
};
//新增标星校验
exports.addStarVerify = function (req, res) {

    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };

    let params = req.body;
    request.get(`${API.star.add_star_erify}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'add', 'msg': '新增标星客户'}, _req);
                _res.json(JSON.parse(res.text))
            }else{
                _res.json(res)
            }

        });
};
//取消标星
exports.cancelStar = function (req, res) {

    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let {id} = req.body;
    request.delete(`${API.star.cancel_star}/$${id}`)
        .query({})
        .query({})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'add', 'msg': '取消标星'}, _req);
                _res.json(JSON.parse(res.text))
            }else{
                _res.json(res)
            }

        });
};
//标星操作日志
exports.getStarLog = function (req, res) {

    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let { customer_no, full_name,mobile,identity_no,pageSize,currentPage,end_time,start_time} = req.body;
    let params = {
        "page_size": pageSize,
        "page_no": currentPage,
        "condition":{
            "full_name": full_name,
            "customer_no": customer_no,
            "mobile": mobile,
            "identity_no": identity_no,
            "start_time": start_time,
            "end_time": end_time,
            "order_column":"",
            "order_by":""
        }

    };
    request.get(`${API.star.log}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '标星操作日志列表'}, _req);
                _res.json(JSON.parse(res.text))
            }else{
                _res.json(res)
            }

        });
};