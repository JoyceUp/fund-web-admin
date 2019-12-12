/**
 * 服务端API请求地址
 * Created by zlp on 2017-12-25.
 */

// const base_url = "http://10.202.1.41:8080/tf-api-admin/";
// const base_url = "http://10.202.1.37:8080/tf-api-admin/";//上线

const base_url = "http://172.7.1.178:8081/"; // 宋
// const base_url = "http://172.7.1.219:8081/";//雪润佳
// const base_url = "http://172.5.1.31:8080/";
// const base_url = "http://172.7.1.91:8081/";//候佳伟
// const base_url = "http://172.5.1.52:8080/"; //明星
// const base_url = "http://172.7.1.176:8080/"; // 薛润佳
// const base_url = "http://172.7.1.88:8080/"; // 薛润佳
// const base_url = "http://172.7.1.125:8081/";// 张宏伟
// const base_url = "http://172.7.0.77:8080/"; //郭杰

const version = "api/v1/cn/";
module.exports = {

    //<公共接口>
    common: {
        email_unique: base_url + "common/v1/email_unique",             //验证email唯一性 get
        send_email_verify_code: base_url + "common/v1/verify_code",    //获取验证码到邮箱 get
        get_rate: base_url + "common/v1/rate",                         //获取汇率 get
        upload_img: base_url + "common/v1/images",                     //上传图片 post
        get_img: base_url + "common/v1/images/",                       //获取图片 get
        get_img_liu: base_url + "common/v1/images/",                       //获取图片 get
        upload_file: base_url + "common/v1/files",                       //上传文件
    },
    //#登录
    login: {
        login: base_url + "login/admin/mobile",                          //登入
        logout: base_url + "logout",                        //登出
        setting: base_url + version + "setting"             //设置
    },

    //#资金管理
    money: {

        //线下入金管理
        deposit_offline: base_url + version + "admin/deposit/offline",


        //入金
        deposit_list: base_url + version + "admin/fund/deposit",                  //入金列表 get
        deposit_details: base_url + version + "admin/fund/deposit/",                  //入金详情 get
        deposit_export: base_url + version + "admin/fund/deposit/report",                  //入金列表导出 get

        //出金
        withdraw_list: base_url + version + "admin/fund/withdraw",                  //出金列表 get
        withdraw_details: base_url + version + "admin/fund/withdraw/",                  //出金详情 get
        withdraw_approve: base_url + version + "admin/fund/withdraw/approve",                  //同意出金 put
        withdraw_ignore: base_url + version + "admin/fund/withdraw/ignore",                  //忽略出金 put
        withdraw_return: base_url + version + "admin/fund/withdraw/return",                  //退回出金 put
        withdraw_done: base_url + version + "admin/fund/withdraw/done",                  //完成出金 put
        withdraw_export: base_url + version + "admin/fund/withdraw/report",                  //出金列表导出 get

        //利息
        interest_list: base_url + version + "admin/fund/interest",                  //利息列表 get
        interest_list: base_url + version + "admin/fund/interest",                  //利息列表 get
        interest_export: base_url + version + "admin/fund/interest/report",                  //利息列表导出 get

        //佣金
        commission_list: base_url + version + "admin/fund/commission",                  //佣金列表 get
        commission_details: base_url + version + "admin/fund/commission/$",                  //获取佣金详情列表 get
        commission_export: base_url + version + "admin/fund/commission/report",                  //佣金列表导出 get

        //余额变动
        balance_list: base_url + version + "admin/fund/invest_balance_update_log",                  //余额变动列表 get
        balance_export: base_url + version + "admin/fund/invest_balance_update_log/report",                  //余额变动列表导出 get
    },
    //系统管理
    auth: {
        user: base_url + version + "user",                  //用户管理
        resource: base_url + version + "resource",          //资源管理
        role: base_url + version + "role",                  //角色管理
        online: base_url + version + "online",              //在线用户
        operation: base_url + version + "log/operation",    //行为日志
        parameter: base_url + version + "parameter",        //系统参数
    },

    //内容管理
    cms: {
        article: base_url + version + "admin/content/article",                 //列表/添加/更新/获取
        banner: base_url + version + "admin/content/banner",                  //列表/添加/更新/获取
        notice: base_url + version + "admin/content/notice",                  //列表/添加/更新/获取
    },


    //#销售
    sales: {
        sale_list: base_url + version + "admin/sales",                                   //销售列表
        product:base_url + version + "admin/product",                                    //产品管理
        sales_organization: base_url + version + 'admin/organization',                   //获取资源树
        insider_list: base_url + version + "admin/sales/inside",                         //内勤列表
        insider_updata_info: base_url + version + "admin/sales/inside",                  //更新内勤信息
        insider_verify: base_url + version + "admin/sales/inside/verify",                //验证内勤是否注册过客户
        insider_info: base_url + version + "admin/sales/inside/info",                    //获取内勤基本信息
        add_insider: base_url + version + "admin/sales/inside",                          //添加内勤
        insider_commission_list: base_url + version + "admin/sales/inside/fund/rewad",  //提成信息
        organization: {
            list: base_url + version + 'admin/organization',                        // 获取资源树
            company : base_url + version + 'admin/organization/company',            // 添加/删除/修改  公司
            department : base_url + version + 'admin/organization/department',      // 添加/删除/修改  部门
            team : base_url + version + 'admin/organization/team',                  // 添加/删除/修改  组别
        },

    },

    product:{
        product_vip:base_url + version + "admin/product_vip" ,                                 //获取vip产品列表   GET
            add_vip:base_url + version + "admin/product_vip/add_vip"  ,             //添加VIP           POST
         update_vip:base_url + version + "admin/product_vip/update_vip"  ,           //更新VIP          PUT
        vip_customer_list:base_url + version + "admin/product_vip/vip_customer_list"       //获取vip用户列表  GET
    },

    finance:{
        sales_preformance_list:base_url + version +"admin/report/sale/performance",   //销售业绩列表   GET
        sales_preformance_export:base_url + version +"admin/report/sale/performance/export"   //销售业绩列表   GET
    },

    //#内勤
    internal:{
        internal_list:base_url + version +"admin/report/sale/inside/performance",   //内勤业绩列表   GET
        internal_export:base_url + version +"admin/report/sale/inside/performance/export"   //内勤业绩列表导出   GET
    },

    //#客服
    customers: {
        customer_list: base_url + version + "admin/customer", //客户列表
        relation_customer_list: base_url + version + "admin/customer/info/relation_customer", //客户列表
        customer_info:base_url +version+"admin/customer/info"   //更新客户信息
    },

    //#关系
    relations: {
        relation_customer_parent_set: base_url + version + "admin/relation/customer_parent", //变更客户上级 put
        relation_customer_parent_log: base_url + version + "admin/relation/customer_parent/log", //变更客户上级记录 get
    },

    //网站设置
    site:{
        banner:base_url + version+"/api/v1/cn/admin/banner/"
    },

    //工资奖金管理
    wages:{
        wages_list:base_url + version+"admin/fund/company_payment",  //获取列表

        handle:base_url + version+"admin/fund/company_payment/",  //执行发放或查询发放详情
        //  Upload:base_url + version+"admin/fund/company_payment",  //上传文件

        payment_accept:base_url + version+"admin/fund/company_payment_accept",  //导入(受理)文件
        payment_accept_result:base_url + version+"admin/fund/company_payment_accept_result",  //查询导入文件结果

        payment_send_accept:base_url + version+"admin/fund/company_pay_send_accept/",  //执行(受理)发放
        payment_send_accept_result:base_url + version+"admin/fund/company_pay_send_accept_result/",  //查询发放结果


        log:base_url + version+"admin/fund/operation_log"   //操作日志
    },

    //标星管理
    star: {
        star_list: base_url + version + "admin/customer/notestar",                   //获取标星列表
        add_star: base_url + version + "admin/customer/notestar/",                   //添加标星
        add_star_erify: base_url + version + "admin/customer/notestar/verify",       //添加标星列表校验
        cancel_star: base_url + version + "admin/customer/notestar",                 //取消标星
        log: base_url + version + "admin/customer/notestar/log",                     //获取操作日志
    },

};


