
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
/**系统管理**/
import Log from './views/system/Log.vue'
import onlineUser from './views/system/onlineUser.vue'
import Role from './views/system/Role.vue'
import sysParam from './views/system/sysParam.vue'
import Resource from './views/system/Resource.vue'
import Users from './views/system/Users.vue'
import setUser from './views/system/setUser'

/**产品管理**/
import productList from './views/product/productList.vue'
import productDetail from './views/product/productDetail.vue'
//产品权限
import productAuth from './views/product/productAuth.vue'

/**资金管理**/
import deposit from './views/money/deposit'
import withdraw from './views/money/withdraw'
import interest from './views/money/interest'
import commission from './views/money/commission'
import balance from './views/money/balance'

/**工资奖金管理**/
import wages from './views/wages/wageList'
import handleLog from './views/wages/handleLog'

/*客户管理*/
import customerList from './views/customers/Customers';
import customerInfo from './views/customers/CustomerDetail';

/*销售管理*/
import saleList from './views/sale/saleList';
import saleDetail from './views/sale/saleDetail';
import addSale from './views/sale/AddSale';
import addInsider from './views/sale/AddInsider';
import department from './views/sale/department';
import insider from './views/sale/insiderList';
import insiderDetail from './views/sale/insiderDetail';

/*关系管理*/
import relaCustomerList from './views/relation/customerList'
import customerModifiedLog from './views/relation/customerModifiedLog'

/*标星客户*/
// import starList from './views/star_customer/list';
// import starLog from './views/star_customer/list';

/*财务报表*/
import financeList from './views/finance/financeList';
import internalList from './views/finance/internalList';



//标星管理
import star from './views/star/starList'
import starLog from './views/star/handleLog'

/**内容管理**/
import Banner from './views/cms/banner.vue'
import Article from './views/cms/article.vue'
import Notice from './views/cms/Notice.vue'

/**线下入金管理**/
import offline_deposit from './views/offline/deposit.vue'
import offline_deposit_review from './views/offline/review.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    {
        path: '/',
        perm: '',
        code: '10210',
        component: Home,
        name: '客户管理',
        iconCls: 'iconfont icon-kehu',
        meta:"/",
        children: [
            {path: '/customer/list', component: customerList, name: '注册客户', code: "30010",meta:"/customer/list"},
            {path: '/customer/info/:id', component: customerInfo, name: '客户详情', code: "30020", hidden: true,meta:"/customer/list"},
        ]
    },
    {
        path: '/',
        perm: '',
        code: '10220',
        component: Home,
        name: '员工管理',
        iconCls: 'iconfont icon-xiaoshourenyuanguanli',
        children: [
            // {path: '/saleInfo', component: sellerInfo, name: '个人信息', code: "200010"},
            // {path: '/sale/customer/list', component: saleCustomerList, name: '客户列表', code: "200110"},
            // {path: '/sale/customer/detail', component:customerDetail, name: '客户详情', code: "201110"},
            // {path: '/sale/deduct/list', component: deductList, name: '销售提成', code: "211110"},
            {path: '/sale/list', component: saleList, name: '销售列表', code: "30010",meta:"/sale/list"},
            {path: '/sale/add', component: addSale, name: '新增销售', code: "300060" , hidden:true,meta:"/sale/list"},
            {path: '/sale/info/:id', component: saleDetail, name: '销售详情', code: "300050" , hidden:true,meta:"/sale/list"},

            {path: '/insider/list', component: insider, name: '内勤列表' ,code:"30020",meta:"/insider/list"},
            {path: '/insider/add', component: addInsider, name: '新增内勤', code: "50030" , hidden:true,meta:"/insider"},
            {path: '/insider/info/:id', component: insiderDetail, name: '内勤详情', code: "50050" , hidden:true,meta:"/insider/list"},

            {path: '/department', component: department, name: '机构管理' ,code:"30020",meta:"/department",meta:"/department"},
        ]
    },
// 标星管理
    {
        path: '/stars',
        perm:'',
        code:'10280',
        component: Home,
        name: '标星管理',
        iconCls: 'iconfont icon-9',
        children: [
            { path: '/star', component: star, name: '标星列表' ,code:"30010",meta:"/star"},
            { path: '/star/log', component: starLog, name: '操作日志' ,code:"30020",meta:"/star/log"},
        ]
    },

    // {
    //     path: '/',
    //     perm: '',
    //     code: '10270',
    //     component: Home,
    //     name: '标星管理',
    //     iconCls: 'iconfont icon-xingxing1',
    //     children: [
    //
    //         {path: '/star/list', component: starList, name: '标星列表', code: "30010",meta:"/star/list"},
    //         {path: '/star/log', component: starLog, name: '标星日志', code: "300060" , hidden:true,meta:"/star/log"},
    //
    //     ]
    // },
    {
        path: '/relation',
        perm: '',
        code: '10230',
        component: Home,
        name: '关系管理',
        iconCls: 'iconfont icon-duocengjiegou',
        children: [
            {path: '/relation/customer_list', component: relaCustomerList, name: '变更客户上级', code: "30010",meta:"/relation/customer_list"},
            {path: '/relation/customer_modified', component: customerModifiedLog, name: '变更客户归属记录', code: "30020",meta:"/relation/customer_list"},
        ]
    },
    {
        path: '/money',
        perm:'',
        code:'10010',
        component: Home,
        name: '资金管理',
        iconCls: 'iconfont icon-9',
        children: [
            { path: '/deposit', component: deposit, name: '入金管理' ,code:"30010",meta:"/deposit"},
            { path: '/withdraw', component: withdraw, name: '出金管理',code:"30020",meta:"/withdraw"},
            { path: '/interest', component: interest, name: '利息' ,code:"30060",meta:"/interest"},
            { path: '/commission', component: commission, name: '佣金' ,code:"30070",meta:"/commission"},
            { path: '/balance', component: balance, name: '余额变动表' ,code:"30080",meta:"/balance"}
        ]
    },
    {
        path: '/offline',
        perm:'',
        code:'10120',
        component: Home,
        name: '线下入金',
        iconCls: 'iconfont icon-9',
        children: [
            { path: '/offline/deposit', component: offline_deposit, name: '线下入金申请' ,code:"30010",meta:"/offline/deposit"},
            { path: '/offline/deposit/review', component: offline_deposit_review, name: '线下入金审核' ,code:"30020",meta:"/offline/deposit/review"},

        ]
    },
    {
        path:'/wages',
        perm:'',
        code:'10270',
        component :Home,
        name:'奖金管理',
        iconCls: 'iconfont icon-qianbao',
        children:[
            { path:'/wage', component: wages, name:'工资奖金发放管理', code:"30010", meta:'/wage'},
            { path:'/handleLog', component: handleLog, name:'操作日志', code:"30010", meta:'/handleLog'},
        ]
    },
    {
        path: '/',
        perm: '',
        code: '10290',
        component: Home,
        name: '财务报表',
        iconCls: 'iconfont icon-9',
        children: [

            {path: '/finance/list', component: financeList, name: '销售业绩表', code: "30010",meta:"/finance/list"},
            {path: '/internal/list', component: internalList, name: '内勤业绩表', code: "30020",meta:"/internal/list"},

        ]
    },
    {
        path: '/',
        perm: '',
        code: '10200',
        component: Home,
        name: '产品管理',
        iconCls: 'iconfont icon-licai',
        children: [

            {path: '/productList', component: productList, name: '产品列表', code: "30010",meta:"/productList"},
            {path: '/productAuth', component: productAuth, name: '产品权限', code: "30020",meta:"/productAuth"},
            {path: '/productDetail/:id', component: productDetail, name: '产品信息', code: "30010",hidden: true,meta:"/productList"}
        ]
    },

    /**
     * 网站管理
     * wangyusen
     * **/
     {
          path: '/',
          perm: '',
          code: '10150',
          component: Home,
          name: '内容管理',
          iconCls: 'iconfont icon-xitongshezhi',
          children: [
              {path: '/site/banner', component: Banner, name: 'banner管理', code: "30010",meta:"/site/banner"},
              {path: '/site/article', component: Article, name: '文章管理', code: "30020",meta:"/site/article"},
              {path: '/site/notice', component: Notice, name: '通知管理', code: "30030",meta:"/site/notice"},
          ]
      },


    {
        path: '/',
        perm: '',
        code: '100000',
        component: Home,
        name: '系统管理',
        iconCls: 'iconfont icon-xitongshezhi',
        children: [
            {path: '/users', component: Users, name: '用户管理', code: "103500",meta:'/users'},
            {path: '/resource', component: Resource, name: '资源管理', code: "103000",meta:'/resource'},
            {path: '/role', component: Role, name: '角色管理', code: "102500",meta:'/role'},
            {path: '/onlineuser', component: onlineUser, name: '在线用户', code: "102000",meta:'/onlineuser'},
            {path: '/log', component: Log, name: '行为日志', code: "100500",meta:'/log'},
            {path: '/sysparam', component: sysParam, name: '系统参数', code: "101000",meta:'/sysparam'},
            {path: '/setuser', component: setUser, name: '个人设置', hidden: true,},
        ]
    },


    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];


export default routes;