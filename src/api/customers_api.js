/**
 *  Created by cuiyajuan on 2018-02-02
 * */

import axios from 'axios';
let base = 'customers';

/**
 * 注册客户
 * @params
 *
 * **/
export const getCustomersList = params => {                     //列表
    return  axios.post(`${base}/customers/listpage`, params);
};
/**
 * 注册详情
 * */
export const getCustomersInfo = params => {                     //详情
    return  axios.post(`${base}/customers/info`, params);
};
export const getCustomersBankcardList = params => {             //银行卡信息  列表
    return  axios.post(`${base}/customers/info/bankcard`, params);
};

/**
 * 更新客户信息
 * **/

export const updateCustomersInfo = params => {                     //详情
    return  axios.post(`${base}/customers/info/update`, params);
};
/**
 * 入金信息
 * */
export const getCustomersDepositList = params => {              //列表
    return  axios.post(`${base}/customers/info/fund/deposit`, params);
};
export const getCustomersStatistics = params => {               //统计
    return  axios.post(`${base}/customers/info/statistics/list`, params);
};
/**
 * 出金信息
 * */
export const getCustomersWithdrawList = params => {             //列表
    return  axios.post(`${base}/customers/info/fund/withdraw`, params);
};
/**
 * 投资信息
 * */
export const getCustomersInvestList = params => {             //列表
    return  axios.post(`${base}/customers/invest`, params);
};

/**
 * 上传合同
 * */
export const updateContract = params => {             //列表
    return  axios.post(`${base}/customers/invest/contract`, params);
};

/**
 * 利息
 * */
export const getCustomersInterestList = params => {             //列表
    return  axios.post(`${base}/customers/info/fund/interest`, params);
};
/**
 * 佣金
 * */
export const getCustomersCommissionList = params => {             //列表
    return  axios.post(`${base}/customers/info/fund/commission`, params);
};
/**
 * 关系
 * */
export const getCustomersRelationList = params => {             //列表
    return  axios.post(`${base}/customers/info/fund/relation`, params);
};
/**
 * 我的合伙人
 * */
export const getCustomersPartnerList = params => {             //列表
    return  axios.post(`${base}/customers/info/fund/partner`, params);
};
