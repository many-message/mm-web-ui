import router from "../../router";
import { Request, Encrypt, Session, sliceNickname } from "../../util";
import { message } from "ant-design-vue";

const state = {
  userInfo: {},
};

const getters = {
  photoName: state => sliceNickname(state.userInfo.nickname),
};

const actions = {
  /**
   * 登录请求接口
   * @param {*} param0 context
   * @param {*} payload 提交负载
   */
  login({ commit }, payload) {
    const { email, pwd } = payload;
    Request.post(
      "/login",
      {
        email,
        // 对密码进行rsa公钥加密
        pwd: Encrypt.rsaEncrypt(pwd),
      },
      {
        ignoreToken: true,
      },
    ).then(data => {
      Session.setToken(data.token);
      commit("updateUserInfo", data.userInfo);
      message.success("登录成功！");
      // 跳转到首页
      router.push("/");
    });
  },
  /**
   * 发送验证码接口
   * @param {*} context 上下文对象
   * @param {email, callback} email 邮箱
   */
  sendCode(context, { email, callback }) {
    Request.get(`/codes/${email}`, {
      ignoreToken: true,
    }).then(() => callback());
  },
  /**
   * 注册接口
   * @param {} param0 上下文
   * @param {*} payload 提交负载
   */
  register(context, payload) {
    const { pwd, ...rest } = payload;
    Request.post(
      "/register",
      {
        pwd: Encrypt.rsaEncrypt(pwd),
        ...rest,
      },
      {
        ignoreToken: true,
      },
    ).then(() => {
      message.success("注册成功！");
      router.push("/user/login");
    });
  },
};

const mutations = {
  updateUserInfo(state, payload) {
    state.userInfo = payload;
    Session.setUserInfo(payload);
  },
  loadUserInfo(state) {
    state.userInfo = Session.getUserInfo();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
