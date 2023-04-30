import axios from "axios";
import qs from 'qs';
import { ElMessage } from "element-plus";
 
import config from '../config/index'
const errorHandle = (status, info) => {
    switch (status) {
        case 400: ElMessage.error("语义有误");
            break;
        case 401: ElMessage.error("服务器认证失败");
            break;
        case 403: ElMessage.error("服务器拒绝访问");
            break;
        case 404: ElMessage.error("地址错误");
            break;
        case 500: ElMessage.error("服务器遇到意外");
            break;
        case 502: ElMessage.error("服务器无响应");
            break;
        default: console.log(info);
            break;
    }
}

const instance = axios.create({
    timeout: 5000,
    baseURL:config.baseApi
})

//请求拦截
instance.interceptors.request.use(
    config => config,
    error => {
        return Promise.reject(error)
    }
)

//响应拦截
instance.interceptors.response.use(
    response => response.status === 200 ?
        Promise.resolve(response) : Promise.reject(response),
    error => {
        const { response } = error
        errorHandle(response.status, response.info)
    }
)


function request(options) {


    // 统一传参，在data对象中
    options.method = options.method || 'get'
    if (options.method.toLocaleLowerCase() === 'get') {
        options.params = options?.data || {}
    }
    else if (options.method.toLocaleLowerCase === 'post') {
        options.data = qs.stringify(config.data)
    }

    return instance(options)

}


// 扩展requet.get(),request.post()等

['get', 'post'].forEach(method => {
    request[method] = (url, data) => request({
        url,
        method,
        data
    })
}
)

export default request