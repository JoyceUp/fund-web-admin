import axios from 'axios';

let base = 'cms';

//文章管理
export const getArticleList = params => {
    return axios.post(`${base}/article/list`, params).then(res => res.data);
};

export const getArticleAdd = params => {
    if(params.id == ""){
        console.log(1111)
        return axios.post(`${base}/article/add`, params).then(res => res.data);
    }else{
        console.log(222)
        return axios.post(`${base}/article/update`, params).then(res => res.data);
    }

};

export const getArticleUpdate = params => {

};

export const getArticleSingle = params => {
    return axios.post(`${base}/article/single`, params).then(res => res.data);
};
export const changeArticleState = params => {                //更新通告状态
    return axios.post(`${base}/article/edit/state`, params);
};




//banner管理
export const getBannerList = params => {
    return axios.post(`${base}/banner/list`, params).then(res => res.data);
};
export const getBannerAdd = params => {

    if(params.id == ""){

        return axios.post(`${base}/banner/add`, params).then(res => res.data);

    }else{

        return axios.post(`${base}/banner/update`, params).then(res => res.data);
    }

};

export const showBanner = params => {                       //查看详情
    return axios.post(`${base}/banner/single`, params);
};

export const changeBannerState = params => {                //更新通告状态
    return axios.post(`${base}/banner/edit/state`, params);
};




//# 通知管理
export const getNoticeList = params => {                    //列表
    return  axios.post(`${base}/notice/list`, params);
};
export const addNotice = params => {                        //新增
    return axios.post(`${base}/notice/add`, params);
};
export const showNotice = params => {                       //查看详情
    return axios.post(`${base}/notice/single`, params);
};
export const editNotice = params => {                       //更新
    return axios.post(`${base}/notice/edit`, params);
};
export const changeNoticeState = params => {                //更新通告状态
    return axios.post(`${base}/notice/edit/state`, params);
};
