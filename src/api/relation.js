/**
 *  Created by cuiyajuan on 2018-02-05
 * */

import axios from 'axios';
let base = 'relation';

//客户归属变更

// 客户归属变更-客户列表
export const getCustomersList = params => {
    return  axios.post(`${base}/customer_list`, params);
};
// //客户归属变更-选择代理
// export const getCustomerProxyList = params => {
//     return  axios.post(`${base}/customer_proxy_list`, params);
// };
// export const setCustomerProxy = params => {
//     return  axios.post(`${base}/set_customer_proxy`, params);
// };
// //客户归属变更-选择销售
// export const getCustomerSaleList = params => {
//     return  axios.post(`${base}/customer_sale_list`, params);
// };
// export const setCustomerSales = params => {
//     return  axios.post(`${base}/set_customer_sales`, params);
// };

//#变更客户上级
export const customersParentSubmit = params => { //提交
    return  axios.post(`${base}/customer_parent/submit`, params);
};

//#变更客户上级记录
export const getCustomerParentLog = params => {
    return  axios.post(`${base}/customer_parent/log`, params);
};

// //变更代理归属记录
// export const getProxyModifiedLog = params => {
//     return  axios.post(`${base}/proxy_modified`, params);
// };