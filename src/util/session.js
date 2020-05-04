export default {
  /**
   * 存储token
   * @param {*} token 用户令牌
   */
  setToken(token) {
    window.sessionStorage.setItem("token", token);
  },
  /**
   * 获取token
   */
  getToken() {
    return window.sessionStorage.getItem("token");
  },
  /**
   * 删除token
   */
  removeToken() {
    window.sessionStorage.removeItem("token");
    this.removeUserInfo();
  },
  /**
   * 保存用户信息
   * @param {} userInfo 用户信息
   */
  setUserInfo(userInfo) {
    window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  },
  /**
   * 获取用户信息
   */
  getUserInfo() {
    const userInfo = window.sessionStorage.getItem("userInfo");
    if (!userInfo) {
      return null;
    }
    return JSON.parse(userInfo);
  },
  /**
   * 删除用户信息
   */
  removeUserInfo() {
    window.sessionStorage.removeItem("userInfo");
  },
};
