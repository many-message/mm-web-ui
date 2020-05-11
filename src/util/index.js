import Encrypt from "./encrypt";
import Request from "./request";
import Session from "./session";
import * as MsgType from "./msgType";
import * as RouterName from "./routerName";
import * as Config from "./config";

export { Encrypt, Request, Session, MsgType, RouterName, Config };

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

// 获取当前时间 yyyy-MM-dd HH:mm:ss
export const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  } ${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}:${
    second < 10 ? "0" + second : second
  }`;
};
