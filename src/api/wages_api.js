import axios from 'axios';

let base = 'wages';


/**
 * 获取入工资奖金列表
 * update by wangyusen 2018.03.13
 *
 * **/
export const getWagesList = params => {
    return axios.post(`${base}/list`, params);
};
//发放详情
export const getWagesInfo = params => {
    return axios.post(`${base}/info`, params);
};
//操作日志
export const getWageslog = params => {
    return axios.post(`${base}/log`, params);
};


//导入数据受理
export const flieUpload = params => {
    return axios.post(`${base}/payment_accept`, params);
};
//导入数据结果
export const flieUploadResult = params => {
    return axios.post(`${base}/payment_accept_result`, params);
};


//执行发放
export const handlePerform = params => {
    return axios.post(`${base}/payment_send_accept`, params);
};
//执行发放结果
export const handlePerformResult = params => {
    return axios.post(`${base}/payment_send_accept_result`, params);
};


