import JsEncrypt from "jsencrypt";

// rsa 公钥
const RSA_PUBLIC_KEY =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAVWBbicHAiQ4Z7ktCm8Ui4fqbGhKfw9ZKbkhtR7VeugGO9Bo9Z31KCwefrLoD/iIO29sAVn973u1KXil93B01Wd3zK5kNiGb+I3ubB1QzGivnpGPjbLGaeruau6aG7WtaO861KSo7U0AvBAfG3ZmqrsT63HOCjJMc2TdxlIBEOwIDAQAB";

class Encrypt {
  constructor() {
    this.encrypt = new JsEncrypt();
    this.encrypt.setPublicKey(RSA_PUBLIC_KEY);
  }

  /**
   * RSA 公钥加密
   * @param {*} pwd 加密前的密码
   * @returns 加密后的密码
   */
  rsaEncrypt(pwd) {
    return this.encrypt.encrypt(pwd);
  }
}

const encrypt = new Encrypt();

export default encrypt;
