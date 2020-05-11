<template>
  <a-card
    :bordered="false"
    :hoverable="true"
    :bodyStyle="{ width: '100%', height: '400px', overflowY: 'scroll' }"
  >
    <template slot="title">
      <a-avatar class="photo">{{ sliceName(chatInfo.chatName) }}</a-avatar>
      <span :style="{ marginLeft: '10px' }">{{ chatInfo.chatTitle }}</span>
    </template>
    <div>
      <div
        v-for="(msg, index) in currentChatMsgList"
        :key="index"
        :class="{
          left: msg.sendUserId !== userInfo.userId,
          right: msg.sendUserId === userInfo.userId,
        }"
      >
        <a-avatar v-if="msg.sendUserId !== userInfo.userId" class="photo">{{
          sliceName(chatInfo.chatName)
        }}</a-avatar>
        <a-tag color="green">
          {{ msg.createTime }}
        </a-tag>
        <a-avatar v-if="msg.sendUserId === userInfo.userId" class="photo">{{
          sliceName(userInfo.nickname)
        }}</a-avatar>
        <div :class="{ 'div-left': msg.msgContent.length > 20 }">
          <img
            v-if="msg.msgAddition"
            :src="getMsgAdditionInfo(msg.msgAddition).smallUrl"
            @click="showPreviewImg(msg.msgAddition)"
          />
          <span v-else>
            {{ msg.msgContent }}
          </span>
        </div>
      </div>
    </div>
    <template slot="actions">
      <div>
        <a-upload
          name="file"
          accept="image/*"
          :action="uploadImgUrl"
          :headers="{ 'X-User-Access-Token': token }"
          :showUploadList="false"
          :disabled="uploadImgDisabled"
          @change="handleSendImgChange"
          :style="{ float: 'left', marginLeft: '10px' }"
        >
          <a-button> <a-icon type="upload" />发送图片</a-button>
        </a-upload>
        <a-button
          @click="handleSendMsg"
          type="primary"
          :style="{ float: 'right', right: '10px' }"
        >
          发送
        </a-button>
        <a-textarea
          placeholder="Basic usage"
          :rows="2"
          :autoSize="{ minRows: 2, maxRows: 2 }"
          :allowClear="true"
          :maxLength="255"
          :style="{ marginTop: '5px' }"
          v-model="msg"
          @change="handleChangeMsg"
          @pressEnter="handleSendMsg"
        />
      </div>
    </template>
    <a-modal
      v-model="imgPreviewVisible"
      :footer="null"
      :centered="true"
      :bodyStyle="{}"
      width=""
    >
      <img :src="imgPreviewUrl" />
    </a-modal>
  </a-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { sliceNickname, MsgType, getCurrentDate, Config } from "@/util";

export default {
  props: ["chatId"],
  data() {
    return {
      chatInfo: {},
      msg: null,
      uploadImgUrl: Config.baseUrl + "/images",
      imgInfo: {},
      uploadImgDisabled: false,
      imgPreviewVisible: false,
      imgPreviewUrl: null,
    };
  },
  computed: {
    ...mapState("chat", ["currentChatMsgList"]),
    ...mapState("user", ["userInfo", "token"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetChatInfo",
    imgInfo: "handleSendImg",
  },
  updated() {
    this.handleScrollToBottom();
  },
  methods: {
    ...mapActions("chat", ["recvMessage", "getChat", "getMessages"]),
    ...mapMutations("chat", ["pushChatMsg"]),
    ...mapMutations("socket", ["sendMsg"]),
    handleScrollToBottom() {
      this.$nextTick(() => {
        const div = this.$el.querySelector(".ant-card-body");
        div.scrollTop = div.scrollHeight;
      });
    },
    handleGetChatInfo() {
      this.getChat({
        chatId: this.chatId,
        success: data => {
          this.chatInfo = data;
          this.getMessages({
            userId: data.chatObjId,
            currentIndex: 0,
          });
          if (data.hasMsg) {
            this.recvMessage({
              chatId: this.chatId,
              userId: data.chatObjId,
            });
          }
        },
      });
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    getMsgAdditionInfo(msgAddition) {
      return JSON.parse(msgAddition);
    },
    handleChangeMsg() {
      if (this.msg) {
        this.msg = this.msg.trim();
      }
    },
    showPreviewImg(msgAddition) {
      this.imgPreviewUrl = JSON.parse(msgAddition).url;
      this.imgPreviewVisible = true;
    },
    handleSendMsg() {
      if (this.msg) {
        this.sendMsg({
          msgType: MsgType.PRIVATE_CHAT,
          content: {
            recvUserId: this.chatInfo.chatObjId,
            msgContent: this.msg,
            msgAddition: "",
          },
        });
        this.pushChatMsg({
          sendUserId: this.userInfo.userId,
          nickname: this.userInfo.nickname,
          friendName: this.userInfo.nickname,
          msgContent: this.msg,
          msgAddition: "",
          createTime: getCurrentDate(),
        });
        this.msg = null;
      }
    },
    // 处理发送图片
    handleSendImgChange(info) {
      if (info.file.status !== "uploading") {
        this.uploadImgDisabled = true;
      }
      if (info.file.status === "done") {
        this.uploadImgDisabled = false;
        const resp = info.file.response;
        if (["200"].includes(resp.code)) {
          this.imgInfo = resp.data;
          this.$message.success("发送成功！");
        } else {
          this.$message.error(resp.message);
        }
      } else if (info.file.status === "error") {
        this.uploadImgDisabled = false;
        this.$message.error("网络繁忙，发送文件失败，请稍后再试！");
      }
    },
    handleSendImg() {
      if (this.imgInfo && Object.keys(this.imgInfo).length > 0) {
        this.sendMsg({
          msgType: MsgType.PRIVATE_CHAT,
          content: {
            recvUserId: this.chatInfo.chatObjId,
            msgContent: "",
            msgAddition: JSON.stringify(this.imgInfo),
          },
        });
        this.pushChatMsg({
          sendUserId: this.userInfo.userId,
          nickname: this.userInfo.nickname,
          friendName: this.userInfo.nickname,
          msgContent: "",
          msgAddition: JSON.stringify(this.imgInfo),
          createTime: getCurrentDate(),
        });
        this.imgInfo = {};
      }
    },
  },
  mounted() {
    this.handleGetChatInfo();
    this.handleScrollToBottom();
  },
};
</script>

<style lang="less" scoped>
.photo {
  background: #1da57a;
}
.left {
  margin-bottom: 20px;
  span {
    margin-right: 10px;
  }
  div {
    margin-left: 40px;
    margin-right: 50%;
    margin-top: 10px;
    font-size: 16px;
  }
}
.right {
  text-align: right;
  margin-bottom: 20px;
  div {
    margin-left: 50%;
    margin-right: 40px;
    margin-top: 10px;
    font-size: 16px;
    text-align: right;
  }
  .div-left {
    text-align: left !important;
  }
}
</style>
