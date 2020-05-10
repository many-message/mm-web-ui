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
          sliceName(msg.nickname)
        }}</a-avatar>
        <span
          v-if="msg.sendUserId !== userInfo.userId"
          :style="{ fontWeight: 'bold' }"
        >
          {{ msg.groupMemberName }}
        </span>
        <a-tag color="green">
          {{ msg.createTime }}
        </a-tag>
        <span
          v-if="msg.sendUserId === userInfo.userId"
          :style="{ marginRight: '10px', fontWeight: 'bold' }"
        >
          {{ msg.groupMemberName }}
        </span>
        <a-avatar v-if="msg.sendUserId === userInfo.userId" class="photo">{{
          sliceName(userInfo.nickname)
        }}</a-avatar>
        <div :class="{ 'div-left': msg.msgContent.length > 20 }">
          {{ msg.msgContent }}
        </div>
      </div>
    </div>
    <template slot="actions">
      <div>
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
          @change="handleMsgChange"
          @pressEnter="handleSendMsg"
        />
      </div>
    </template>
  </a-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { sliceNickname, MsgType, getCurrentDate } from "@/util";

export default {
  props: ["chatId"],
  data() {
    return {
      chatInfo: {},
      memberInfo: {},
      groupMemberUserIds: [],
      msg: null,
    };
  },
  computed: {
    ...mapState("chat", ["currentChatMsgList"]),
    ...mapState("user", ["userInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetChatInfo",
  },
  updated() {
    this.handleScrollToBottom();
  },
  methods: {
    ...mapActions("chat", [
      "getChat",
      "getGroupMessages",
      "getGroupMember",
      "getGroupMemberIds",
    ]),
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
          this.getGroupMember({
            groupId: data.chatObjId,
            success: member => {
              this.memberInfo = member;
            },
          });
          this.getGroupMemberIds({
            groupId: data.chatObjId,
            success: userIds => {
              this.groupMemberUserIds = userIds;
            },
          });
          this.getGroupMessages({
            groupId: data.chatObjId,
            currentIndex: 0,
          });
        },
      });
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    handleMsgChange() {
      if (this.msg) {
        this.msg = this.msg.trim();
      }
    },
    handleSendMsg() {
      if (this.msg) {
        this.sendMsg({
          msgType: MsgType.GROUP_CHAT,
          content: {
            groupId: this.chatInfo.chatObjId,
            sendGroupMemberId: this.memberInfo.groupMemberId,
            groupMemberName: this.memberInfo.groupMemberName,
            nickname: this.userInfo.nickname,
            recvUserIds: this.groupMemberUserIds,
            msgContent: this.msg,
            msgAddition: "",
          },
        });
        this.pushChatMsg({
          groupId: this.chatInfo.chatObjId,
          sendUserId: this.userInfo.userId,
          sendGroupMemberId: this.memberInfo.groupMemberId,
          groupMemberName: this.memberInfo.groupMemberName,
          nickname: this.userInfo.nickname,
          msgContent: this.msg,
          msgAddition: "",
          createTime: getCurrentDate(),
        });
        this.msg = null;
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
