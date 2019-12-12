/**
 *  Created by cuiyajuan on 2018-02-05
 * */

import axios from 'axios';
let base = 'sale';

/**
 * 产品
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getProductList = params => {  return axios.post(`${base}/product/list`, params).then(res => res.data); };
export const delProduct= params => {  return axios.post(`${base}/product/del`, params).then(res => res.data); };
export const productDetail= params => {  return axios.post(`${base}/product/detail`, params).then(res => res.data); };
export const addProduct= params => {  return axios.post(`${base}/product/add`, params).then(res => res.data); };
export const updateProduct= params => {  return axios.post(`${base}/product/update`, params).then(res => res.data); };

/**
 * 销售列表
 * @params
 *
 * **/
export const getSaleList = params => {                     //列表
    return  axios.post(`${base}/sale/listpage`, params);
};
export const isVerifySale = params => {                         //添加第一步 验证销售是否注册过客户
    return  axios.post(`${base}/sale/add/info`, params);
};
export const addSaleInfo = params => {                     //添加 下一步
    return  axios.post(`${base}/sale/nextAdd`, params);
};
export const getSaleInfo = params => {                     //基本信息(添加 下一步列表详情)
    return  axios.post(`${base}/sale/info`, params);
};
export const editSaleInfo = params => {                     //更新
    return  axios.post(`${base}/sale/info/edit`, params);
};
export const resetPassInfo = params => {                     //重置密码
    return  axios.post(`${base}/sale/info/resetPass`, params);
};
export const getSalesOrganization = params => {                     //职位信息
    return  axios.post(`${base}/sale/info/organization`, params);
};
export const getCommissionInfoList = params => {            //提成信息
    return  axios.post(`${base}/sale/info/commission`, params);
};
export const getCustomerInfoList = params => {              //客户信息
    return  axios.post(`${base}/sale/info/customer`, params);
};

/*******************************************************内勤列表*******************************************************/

/**
 * 内勤列表
 * @params
 *
 * **/

export const getInsiderList = params => {                            //列表
    return  axios.post(`${base}/sale/getInsiderList`, params);

};
export const getInsiderInfo = params => {                            //基本信息
    return  axios.post(`${base}/sale/getInsiderInfo`, params);
};
export const editInsiderInfo = params => {                           //更新内勤详情
    return  axios.post(`${base}/sale/editInsiderInfo`, params);

};
export const isVerifyInsider = params => {                           //添加第一步 验证销售是否注册过客户
    return axios.post(`${base}/sale/insiderSdd/info`, params);
};
export const getIinsiderOrganization = params => {                   //获取公司列表
    return  axios.post(`${base}/sale/info/getIinsiderOrganization`, params);
};
export const addInsiderInfo = params => {                            //添加内勤
    return  axios.post(`${base}/sale/addInsiderInfo`, params);
};
export const getInsiderCommissionInfoList = params => {              //提成信息
    return  axios.post(`${base}/sale/info/getInsiderCommissionInfoList`, params);
};

/*******************************************************机构管理*******************************************************/

/** 资源列表* **/
export const getDepartmentList = params => {
    return  axios.post(`${base}/department/listpage`);
};
/** 添加公司**/
export const  addCompany = params => {
    return  axios.post(`${base}/company/add`, params);
};
/**
 * 添加部门
 * @params
 *      params.lev:
 *      params.parent_id:
 *      params.name:
 *      params.uri:
 *      params.permission:
 *      params.type:
 *      params.code:
 *      params.status:
 *
 * **/
export const addDepartment = params => {
    return  axios.post(`${base}/department/add`, params);
};
//添加组别
export const addTeam = params => {
    return  axios.post(`${base}/team/add`, params);
};
/** 删除公司**/
export const removeCompany = params => {
    return  axios.post(`${base}/company/remove`, params);
};
/** 删除部门**/
export const removeDepartment = params => {
    return  axios.post(`${base}/department/remove`, params);
};
/** 删除组别**/
export const removeTeam = params => {
    return  axios.post(`${base}/team/remove`, params);
};

/**
 * 编辑公司
 * @params
 *      params.id:
 *      params.name:
 *      params.uri:
 *      params.permission:
 *      params.type:
 *      params.code:
 *      params.status:
 *
 * **/
export const editCompany = params => {
    return  axios.post(`${base}/company/edit`, params);
};
/**
 * 编辑部门
 * @params
 *      params.id:
 *      params.name:
 *      params.uri:
 *      params.permission:
 *      params.type:
 *      params.code:
 *      params.status:
 *
 * **/
export const editDepartment = params => {
    return  axios.post(`${base}/department/edit`, params);
};
/**
 * 编辑组别
 * @params
 *      params.id:
 *      params.name:
 *      params.uri:
 *      params.permission:
 *      params.type:
 *      params.code:
 *      params.status:
 *
 * **/
export const editTeam = params => {
    return  axios.post(`${base}/team/edit`, params);
};