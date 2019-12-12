/**
 *  Created by XWang on 2017-01-03
 * */

import axios from 'axios';
let base = 'star';

//标星列表
export const getStarList = params => {
    return  axios.post(`${base}/getStarList`, params);
};

//添加标星
export const addStar = params => {
    return  axios.post(`${base}/addStar`, params);
};
//添加标星校验
export const addStarVerify = params => {
    return  axios.post(`${base}/addStarVerify`, params);
};

//添加标星校验
export const cancelStar = params => {
    return  axios.post(`${base}/cancelStar`, params);
};

//操作日志
export const getStarLog = params => {
    return  axios.post(`${base}/getStarLog`, params);
};
