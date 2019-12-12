/**
 * Created by zlp on 2017-12-19.
 */

var request = require("superagent");
var API = require("./support/const");
var service = require("../../service/log");


//#销售管理
exports.sales = {
    list : function (req, res, next) {
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
        request.get(`${API.sales.sale_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '销售列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    addIsVerify : function (req, res, next) {
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

        request.get(`${API.sales.sale_list}/info`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '销售新增验证销售是否注册过客户'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    nextAdd : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let params = req.body;
        console.log(params )
        request.post(`${API.sales.sale_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status == 200) {
                    service.save_user_log({'type': 'add', 'msg': '销售列表添加'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    info : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "id": id
        };

        request.get(`${API.sales.sale_list}/info/basic`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '销售基本信息'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    edit : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let params = req.body;

        request.put(`${API.sales.sale_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '更新销售'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    resetPass : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "id": id,
            "password": '123456'
        };

        request.put(`${API.sales.sale_list}/password/login/reset`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '重置销售登录密码'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    organization : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };

        request.get(`${API.sales.sales_organization}`)
            // .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '组织机构管理'}, _req);
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

        request.get(`${API.sales.sale_list}/fund/reward`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '销售提成列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    customer : function (req, res, next) {
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
        console.log('============================ 销售客户列表 ====================================');
        console.log(JSON.stringify(params));
        console.log(`${API.sales.sale_list}/customer`);
        console.log(header);
        console.log('================================================================');

        request.get(`${API.sales.sale_list}/customer`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '销售客户列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    getInsiderList : function (req, res, next) {
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
        request.get(`${API.sales.insider_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '内勤列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    getInsiderInfo : function (req, res, next) {
    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let {id} = req.body;
    let params = {
        "id": id
    };

    request.get(`${API.sales.insider_info}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getId', 'msg': '销售基本信息'}, _req);
            }
            _res.json(JSON.parse(res.text))
        });
    },
    addInsiderVerify : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {identity_no, name} = req.body;
        let params = {
            "identity_no": identity_no,
            "name": name
        };
        request.get(`${API.sales.insider_verify}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getId', 'msg': '内勤新增验证是否注册过客户'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    addInsiderInfo : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let { sales_no,company_id,sales_state,identity_no,mobile,identity_type,name } = req.body;
        let params = {
            "name":name,
            "identity_type":identity_type,
            "mobile":mobile,
            "identity_no":identity_no,
            "sales_state":sales_state,
            "company_id":company_id,
            "sales_no":sales_no,
        };
        console.log(params);
        request.put(`${API.sales.add_insider}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'add', 'msg': '添加内勤基本信息'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    editInsiderInfo : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let { id,company_id,sales_state,identity_no,mobile,identity_type,name } = req.body;
        let params = {
            "name":name,
            "identity_type":identity_type,
            "mobile":mobile,
            "identity_no":identity_no,
            "sales_state":sales_state,
            "company_id":company_id,
            "id":id,
        };
        console.log(params);
        request.post(`${API.sales.insider_updata_info}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'edit', 'msg': '更新内勤信息'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    getInsiderCommissionInfoList : function (req, res, next) {
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
        request.get(`${API.sales.insider_commission_list}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '销售提成列表'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    }
};

//#获取组织机构树
exports.resources = {
    departmentList : function (req, res, next) {
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        request.get(`${API.sales.organization.list}`)
            .query({})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '获取组织机构树'}, _req);
                    _res.json(JSON.parse(res.text))
                }else{
                    _res.json(res.text)
                }

            });
    },
    addCompany : function (req, res, next) {            //添加公司
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {name} = req.body;
        let params = {
            "company_name": name,
        };
        request.post(`${API.sales.organization.company}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '添加公司'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });

    },
    addDepartment : function (req, res, next) {                         //添加部门
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {name,company_id} = req.body;
        let params = {
            "department_name": name,
            "company_id":company_id,
        };
        request.post(`${API.sales.organization.department}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '添加部门'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    addTeam : function (req, res, next) {                       //添加组别
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {company_id,department_id,name} = req.body;
        let params = {
            "team_name": name,
            "company_id":company_id,
            "department_id":department_id
        };
        request.post(`${API.sales.organization.team}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '添加组别'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },

    removeCompany : function (req, res, next) {                        //删除公司
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "company_id": id,
        };
        request.delete(`${API.sales.organization.company}/$${id}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '删除公司'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    removeDepartment : function (req, res, next) {                  //删除部门
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "id": id,
        };
        request.delete(`${API.sales.organization.department}/$${id}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '删除部门'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    removeTeam : function (req, res, next) {                //删除组别
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {id} = req.body;
        let params = {
            "id": id,
        };
        request.delete(`${API.sales.organization.team}/$${id}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '删除组别'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    editCompany : function (req, res, next) {                   //编辑公司
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {name,id} = req.body;
        let params = {
            "company_name": name,
            "id":id,
        };
        request.put(`${API.sales.organization.company}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '编辑公司'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    editDepartment : function (req, res, next) {                    //编辑部门
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {name,id} = req.body;
        let params = {
            "department_name": name,
            "id":id
        };
        request.put(`${API.sales.organization.department}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '编辑部门'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    },
    editTeam : function (req, res, next) {                      //编辑组别
        let _res = res;
        let _req = req;
        let header = {
            token: _req.cookies.token
        };
        let {name,id} = req.body;
        let params = {
            "team_name": name,
            "id":id
        };
        request.put(`${API.sales.organization.team}`)
            .query({msg: JSON.stringify(params)})
            .set(header)
            .end(function (req, res) {
                if (res.status === 200) {
                    service.save_user_log({'type': 'getList', 'msg': '编辑组别'}, _req);
                }
                _res.json(JSON.parse(res.text))
            });
    }
};




/**
 * 产品管理
 * **/

//获取列表
exports.productList = function (req, res, next) {
    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let {page_no,page_size,product_name,online,start_time,end_time} = req.body;
    let params = {
        "page_no": page_no,
        "page_size": page_size,
        "condition":{
            "product_name": product_name,
            "online": online,
            "start_time": start_time,
            "end_time": end_time,
        }

    };
    request.get(`${API.sales.product}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '获取人员管理列表'}, _req);
            }
            _res.json(JSON.parse(res.text))
        });
}
// 新增销售
exports.addProduct = function (req, res, next) {
    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };

    let params = formatPostProductData(req.body);

    request.post(`${API.sales.product}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '新增产品'}, _req);
            }
            _res.json(JSON.parse(res.text))
        });
}
//获取单个销售信息
exports.productSingle = function (req, res, next) {
    let _res = res;
    let _req = req;
    let {id} = req.body;
    let header = {
        token: _req.cookies.token
    };

    request.get(`${API.sales.product}/${id}`)
        .query({})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '获取单个销售信息'}, _req);
            };
            let result = formatGetProductData(JSON.parse(res.text));

            _res.json(result);
        });
}

//删除
exports.delProduct = function (req, res, next) {
    let _res = res;
    let _req = req;
    let {id} = req.body;
    let header = {
        token: _req.cookies.token
    };

    request.delete(`${API.sales.product}/${id}`)
        .query({})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '删除产品'}, _req);
            }
            _res.json(JSON.parse(res.text))
        });
};
//更新产品
exports.updateProduct = function (req, res, next) {
    let _res = res;
    let _req = req;
    let header = {
        token: _req.cookies.token
    };
    let params = formatPostProductData(req.body);

    params.qas = params.updateQas;
    delete params.updateQas;

    request.put(`${API.sales.product}`)
        .query({msg: JSON.stringify(params)})
        .set(header)
        .end(function (req, res) {
            if (res.status === 200) {
                service.save_user_log({'type': 'getList', 'msg': '更新产品'}, _req);
            }
            _res.json(JSON.parse(res.text))
        });
};

// 处理要提交的产品数据
function formatPostProductData(data) {
    let product = data;
    if(product.rate){
        product.rate = product.rate * 10000;
    }
    if(product.dritf_rate){
        product.dritf_rate = product.dritf_rate * 10000;
    }
    if(product.min_amount){
        product.min_amount = product.min_amount * 100;
    }
    if(product.max_amount){
        product.max_amount = product.max_amount * 100;
    }
    if(product.reward_percentage){
        product.reward_percentage = product.reward_percentage * 10000;
    }
    if(product.commission_rules && product.commission_rules.length > 0)
    {
        for(let i = 0; i < product.commission_rules.length; i++)
        {
            let rule = product.commission_rules[i];
            if(rule.amount_from){
                product.commission_rules[i].amount_from = rule.amount_from * 1000000;
            }
            if(rule.amount_to){
                product.commission_rules[i].amount_to = rule.amount_to * 1000000;
            }
            if(rule.customer_commission_percentage){
                product.commission_rules[i].customer_commission_percentage = rule.customer_commission_percentage * 10000;
            }
        }
    }
    return product;
}
// 处理回显的产品数据
function  formatGetProductData(data) {

    let result = data;
    if(data.datas) {
        let product = JSON.parse(result.datas);
        if(product) {
            if (product.rate) {
                product.rate = product.rate / 10000;
            }
            if(product.dritf_rate){
                product.dritf_rate = product.dritf_rate / 10000;
            }
            if (product.min_amount) {
                product.min_amount = product.min_amount / 100;
            }
            if(product.max_amount){
                product.max_amount = product.max_amount / 100;
            }
            if (product.reward_percentage) {
                product.reward_percentage = product.reward_percentage / 10000;
            }
            if (product.commission_rules && product.commission_rules.length > 0) {
                for (let i = 0; i < product.commission_rules.length; i++) {
                    let rule = product.commission_rules[i];
                    if (rule.amount_from) {
                        product.commission_rules[i].amount_from = rule.amount_from / 1000000;
                    }
                    if (rule.amount_to) {
                        product.commission_rules[i].amount_to = rule.amount_to / 1000000;
                    }
                    if (rule.customer_commission_percentage) {
                        product.commission_rules[i].customer_commission_percentage = rule.customer_commission_percentage / 10000;
                    }
                }
            }


            result.datas = JSON.stringify(product);
        }
    }
    return result;
}
