import Router from "../router";

const navRouterNameKeyMap = {
  Notice: "1",
  NoticeFriendReq: "1",
  NoticeGroupJoinReq: "1",
  NoticeGroupJoinInvite: "1",
  Message: "2",
  MessageUser: "2",
  MessageGroup: "2",
  Cantact: "3",
  CantactFriend: "3",
  CantactGroup: "3",
  Find: "4",
  FindUser: "4",
  FindGroup: "4",
};

// 根据当前路由获取nav的key
export const getNavKey = () => {
  return navRouterNameKeyMap[getRouterName()];
};

// 获取当前路由名称
export const getRouterName = () => {
  return Router.history.current.name;
};

// 获取当前路由参数值
export const getParam = name => {
  return Router.history.current.params[name];
};
