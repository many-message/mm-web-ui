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
