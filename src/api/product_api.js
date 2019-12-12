/**
 *  Created by cuiyajuan on 2018-02-05
 * */

import axios from 'axios';
let base = 'product';

/**
 * VIP产品
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getVipProductList = params => {  return axios.post(`${base}/vip/list`, params).then(res => res.data); };
export const getVipCustmerList = params => {  return axios.post(`${base}/vip/customer_list`, params).then(res => res.data); };
export const addVipCustmer= params => {  return axios.post(`${base}/vip/add`, params).then(res => res.data); };
export const updateVipCustmer= params => {  return axios.post(`${base}/vip/update`, params).then(res => res.data); };

