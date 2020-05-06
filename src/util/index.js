import Encrypt from "./encrypt";
import Request from "./request";
import Session from "./session";

export { Encrypt, Request, Session };

// 截取昵称的前两位
export const sliceNickname = nickname => {
  if (!nickname) {
    return "none";
  }
  nickname = String(nickname);
  if (nickname.length < 3) {
    return nickname;
  }
  return nickname.substr(0, 2);
};

// websocket 类型码

// 连接
export const CONN = "100";

// 心跳连接
export const IDLE = "200";

// 私聊
export const PRIVATE_CHAT = "300";

// 好友请求通知
export const FRIEND_REQ_NOTICE = "301";

// 删除好友通知
export const DEL_FRIEND_NOTICE = "302";

// 群聊
export const GROUP_CHAT = "400";

// 请求加入群通知
export const REQ_JOIN_GROUP_NOTICE = "401";

// 邀请加入群通知
export const INVITE_JOIN_GROUP_NOTICE = "402";

// 群成员删除通知
export const DEL_GROUP_MEMBER_NOTICE = "403";

// 群解散通知
export const DEL_GROUP_NOTICE = "404";
