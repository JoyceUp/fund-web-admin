/**
 *  Created by XWang on 2017-01-31
 * */

import axios from 'axios';
let base = 'money';


/**
 * 获取入金列表
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const depositList = params => {
    return axios.post(`${base}/deposit/list`, params);
};

/**
 * 获取入金详情
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const depositDetails = params => {
    return axios.post(`${base}/deposit/details`, params);
};
/**
 * 导出数据
 * update by XWang 2018.01.31 创建方法
 * @params
 *      id
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const depositExport = params => {
    return axios.post(`${base}/deposit/export`, params, {responseType: 'arraybuffer'});
};


/**
 * 获取出金列表
 * update by XWang 2018.01.31 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawList = params => {
    return axios.post(`${base}/withdraw/list`, params);
};

/**
 * 获取出金详情
 * update by XWang 2018.02.02 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawDetails = params => {
    return axios.post(`${base}/withdraw/details`, params);
};

/**
 * 审核
 * update by XWang 2018.02.02 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawApprove = params => {
    return axios.post(`${base}/withdraw/approve`, params);
};

/**
 * 完成
 * update by XWang 2018.02.02 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawDone = params => {
    return axios.post(`${base}/withdraw/done`, params);
};

/**
 * 退回
 * update by XWang 2018.02.02 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawIgnore = params => {
    return axios.post(`${base}/withdraw/ignore`, params);
};

/**
 * 银行退回
 * update by XWang 2018.02.02 建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawReturn = params => {
    return axios.post(`${base}/withdraw/return`, params);
};
/**
 * 导出数据
 * update by XWang 2018.01.31 创建方法
 * @params
 *      id
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const withdrawExport = params => {
    return axios.post(`${base}/withdraw/export`, params, {responseType: 'arraybuffer'});
};


/**
 * 获取利息列表
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const interestList = params => {
    return axios.post(`${base}/interest/list`, params);
};

export const interestSum = params => {
    return axios.post(`${base}/interest/sum`, params);
};
/**
 * 获取投资信息
 * **/
export const investList = params => {             //列表
    return  axios.post(`${base}/customer/invest`, params);
};
/**
 * 导出数据
 * update by XWang 2018.01.31 创建方法
 * @params
 *      id
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const interestExport = params => {
    return axios.post(`${base}/interest/export`, params, {responseType: 'arraybuffer'});
};



/**
 * 获取佣金列表
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const commissionList = params => {
    return axios.post(`${base}/commission/list`, params);
};
export const commissionSum = params => {
    return axios.post(`${base}/commission/sum`, params);
};

/**
 * 获取佣金详情
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const commissionDetails = params => {
    return axios.post(`${base}/commission/details`, params);
};
/**
 * 导出数据
 * update by XWang 2018.01.31 创建方法
 * @params
 *      id
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const commissionExport = params => {
    return axios.post(`${base}/commission/export`, params, {responseType: 'arraybuffer'});
};




/**
 * 获取转账列表
 * update by XWang 2018.01.31 创建方法
 * @params
 *
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const balanceList = params => {
    return axios.post(`${base}/balance/list`, params);
};
/**
 * 导出数据
 * update by XWang 2018.01.31 创建方法
 * @params
 *      id
 * @return
 *      status
 *      msg
 *      datas
 *          user_info
 *          resources
 * **/
export const balanceExport = params => {

    return axios.post(`${base}/balance/export`, params, {responseType: 'arraybuffer'});
};



export const offline={

    list:(params)=>{
        return axios.post(`${base}/deposit/offline/list`, params).then(res => res.data);
    },
    detail:(params)=>{
        return axios.post(`${base}/deposit/offline/detail`, params).then(res => res.data);
    },
    add:(params)=>{
        return axios.post(`${base}/deposit/offline/add`, params).then(res => res.data);
    },
    review:(params)=>{
        return axios.post(`${base}/deposit/offline/review`, params).then(res => res.data);
    }

}