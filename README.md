# ThankFund-admin


API

http://10.202.1.41:8080/tf-api-admin/swagger-ui.html#!/

原型


基金原型地址：


后台-客服管理原型 ：https://nzjxnp.axshare.com
后台-资金管理原型 ：https://spogyl.axshare.com
后台-工资管理 ：https://spogyl.axshare.com/#g=1&p=%E5%B7%A5%E8%B5%84%E5%A5%96%E9%87%91%E7%AE%A1%E7%90%86

所有列表带上默认排序参数
{
    "order_column":gmt_create,
    "order_by":desc
 }

## 搭建开发环境

统一用yarn来管理第三方依赖

1. yarn start 启动项目
2. 发现package.json有变化的时候，执行yarn install
3. 更新下来，将nodemon.default.json copy 一份，更名为 nodemon.json 系统执行依赖于nodemon.json，这样做的目的是防止配制文件互相影响。
其中文件中的配置项execMap 对应的命令需要根据node的版本做修改。如果自己电脑的node 版本为8以上则将--debug 两个都修改为--inspect。否则不用修改。
4. mocha or mocha **.js执行单元测试


## 接口约定(已确定)

接口返回格式统一为对象，格式如下：

{
    status:Number
    msg:String
    datas:{}
}

status
    200;  //  成功
    401;  // 表示用户没有权限（令牌、用户名、密码错误）。
    403;  // 表示用户得到授权（与401错误相对），但是访问是被禁止的。
    404;  // 表示用户得到授权（与401错误相对），但是访问是被禁止的。
    505;  // 服务端未知错误
    510;  // 参数验证不通过
    511;  // 传递的json格式有误
    512;  // 结果错误

自定义状态
    0; // 状态：生效
    1; // 状态：未生效