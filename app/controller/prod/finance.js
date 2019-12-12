/**
 * Created by zlp on 2017-12-19.
 */

var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");


//#销售管理
exports.sales_preformance = {
    list : function (req, res, next) {

        let header = {
            token: req.cookies.token
        };
        request.get(`${API.finance.sales_preformance_list}`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (_req, _res) {

                res.json(JSON.parse(_res.text))
            });
    },

    exist : function (req, res, next) {
        let header = {
            token: req.cookies.token
        };
        request.get(`${API.finance.sales_preformance_list}/exist`)
            .query({msg: JSON.stringify(req.body)})
            .set(header)
            .end(function (_req, _res) {
                res.json(JSON.parse(_res.text))
            });
    },

    export:function (req, res, next) {

        let header = {
            token: req.cookies.token
        };
        let api = `${API.finance.sales_preformance_list}/export`
        let params = req.body
        exportExcel(req, res, header, params, api, "销售业绩");
    }
};



//导出excel通用方法，
function exportExcel(req, res, header, params, api, type) {
    request.get(api)
        .set(header)
        .responseType("blob")
        .query({msg: JSON.stringify(params)})
        .end(function (_req, _res) {

            if (_res.status == 200) {
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
