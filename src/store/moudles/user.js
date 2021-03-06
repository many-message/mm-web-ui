import router from "../../router";
import { Request, Encrypt, Session, sliceNickname } from "../../util";
import { message } from "ant-design-vue";

const state = {
  userInfo: {},
  token: null,
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
  /**
   * 修改用户信息
   * @param {*} param0
   * @param { updateInfo, success, error } payload
   */
  updateUserInfo({ commit }, payload) {
    Request.put("/users", payload.updateInfo)
      .then(data => {
        commit("updateUserInfo", data);
        message.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
  /**
   * 修改密码
   * @param content
   * @param { pwdInfo, success, error } payload
   */
  updatePwd(content, payload) {
    const { oldPwd, newPwd } = payload.pwdInfo;
    Request.patch("/users/passwords", {
      oldPwd: Encrypt.rsaEncrypt(oldPwd),
      newPwd: Encrypt.rsaEncrypt(newPwd),
    })
      .then(() => {
        message.success("修改成功！");
        payload.success();
      })
      .catch(() => payload.error());
  },
};

const mutations = {
  updateUserInfo(state, payload) {
    state.userInfo = payload;
    Session.setUserInfo(payload);
  },
  loadUserInfo(state) {
    state.userInfo = Session.getUserInfo();
    state.token = Session.getToken();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
