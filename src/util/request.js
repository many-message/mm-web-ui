import Axios from "axios";
import router from "../router";
import { message } from "ant-design-vue";
import Session from "./session";
import { baseUrl } from "./config";

const messageTip = message;

// 请求实例
const instance = Axios.create({
  baseURL: baseUrl,
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
  const token = Session.getToken();

  if (!config.ignoreToken && !token) {
    // 接口需要token作为请求头令牌，但token不存在
    router.push("/user/login");
  }

  config.headers["X-User-Access-Token"] = token;
  config.headers["Content-Type"] = "application/json;Charset=UTF-8";

  return config;
});

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    if (code !== "200") {
      messageTip.error(message);
      if (code === "401") {
        Session.removeToken();
        router.push("/user/login");
      }
      return Promise.reject(data);
    }
    return data;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      messageTip.error(data.message);
      if (status === 401) {
        Session.removeToken();
        router.push("/user/login");
      }
    } else {
      messageTip.error("网络繁忙！");
    }
    return Promise.reject(error);
  },
);

export default instance;
