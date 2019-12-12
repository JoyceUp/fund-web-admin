/**
 *  Created by cuiyajuan on 2018-02-05
 * */

import axios from 'axios';
let base = 'finance';

/**
 * 销售业绩表
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getFinanceList = params => {
    return axios.post(`${base}/sales_preformance/list`, params).then(res => res.data);
};
export const getFinanceExport = params => {
    return axios.post(`${base}/sales_preformance/export`, params,{responseType: 'arraybuffer'})
};

export const getFinanceExist = params => {
    return axios.post(`${base}/sales_preformance/exist`, params).then(res => res.data);
};

/**
 * 内勤业绩表
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getInternalList = params => {
    return axios.post(`${base}/internal/list`, params).then(res => res.data);
};
export const getInternalExport = params => {
    return axios.post(`${base}/internal/export`, params,{responseType: 'arraybuffer'})
};

