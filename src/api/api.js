import axios from 'axios';
axios.defaults.timeout = 600000;
let base = 'login';

export const requestLogin = params => {
    return axios.post(`${base}/signup`, params  ).then(res => res.data);
};



export const logout = params => {
    return axios.post(`${base}/logout`, params).then(res => res.data);
};
