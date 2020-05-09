<template>
  <div>
    <a-result :title="userInfo.nickname">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(userInfo.nickname)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions>
          <a-descriptions-item label="昵称">
            {{ userInfo.nickname }}
          </a-descriptions-item>
          <a-descriptions-item label="邮箱">
            {{ userInfo.email }}
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            {{ userInfo.sex === "1" ? "男" : "女" }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <template #extra>
        <a-button v-if="userInfo.friend" type="primary">发送消息</a-button>
        <a-button v-else @click="showAddFriendModal" type="primary">
          添加好友
        </a-button>
      </template>
    </a-result>
    <!-- 添加好友 -->
    <a-modal
      title="发送好友请求"
      :visible="addFriendVisible"
      :confirm-loading="addFriendConfirmLoadding"
      @ok="handleAddFriendOk"
      @cancel="handleAddFriendCancel"
    >
      <a-select v-model="addFriendGroupId" style="width: 100%">
        <a-select-option
          v-for="friendGroup in friendGroups"
          :key="friendGroup.friendGroupId"
          :value="friendGroup.friendGroupId"
        >
          {{ friendGroup.friendGroupName }}
        </a-select-option>
      </a-select>
      <a-input
        v-model="addFriendReqMsg"
        @change="handleAddFriendReqMsgChange"
        placeholder="请输入请求信息"
        :style="{ marginTop: '20px' }"
      />
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { sliceNickname, MsgType } from "@/util";

export default {
  props: ["userId"],
  computed: {
    ...mapState("find", ["userInfo"]),
    ...mapState("friend", ["friendGroups"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetUserInfo",
  },
  data() {
    return {
      addFriendVisible: false,
      addFriendConfirmLoadding: false,
      addFriendGroupId: null,
      addFriendReqMsg: null,
    };
  },
  methods: {
    ...mapActions("find", ["getUser", "sendFriendReq"]),
    ...mapActions("friend", ["getFriendGroups"]),
    ...mapMutations("socket", ["sendMsg"]),
    handleGetUserInfo() {
      this.getUser(this.userId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    // 添加好友
    showAddFriendModal() {
      this.getFriendGroups(() => {
        this.addFriendGroupId = null;
        this.addFriendReqMsg = null;
        this.addFriendVisible = true;
      });
    },
    handleAddFriendReqMsgChange() {
      if (this.addFriendReqMsg) {
        this.addFriendReqMsg = this.addFriendReqMsg.trim();
      }
    },
    handleAddFriendOk() {
      if (!this.addFriendGroupId) {
        this.$message.error("请选择分组！");
        return;
      }
      if (!this.addFriendReqMsg) {
        this.$message.error("请输入请求信息！");
        return;
      }
      this.addFriendConfirmLoadding = true;
      // 发送请求
      this.sendFriendReq({
        friendReqInfo: {
          recvUserId: this.userInfo.userId,
          friendGroupId: this.addFriendGroupId,
          reqMsg: this.addFriendReqMsg,
        },
        success: () => {
          this.addFriendConfirmLoadding = false;
          this.addFriendVisible = false;
          // websocket同步发送消息
          this.sendMsg({
            msgType: MsgType.FRIEND_REQ_NOTICE,
            content: {
              recvUserId: this.userInfo.userId,
            },
          });
          this.$message.success("请求已发送！");
        },
        error: () => {
          this.addFriendConfirmLoadding = false;
        },
      });
    },
    handleAddFriendCancel() {
      this.addFriendVisible = false;
    },
  },
  mounted() {
    this.handleGetUserInfo();
  },
};
</script>

<style lang="less" scoped>
.photo {
  font-size: 20px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: #1da57a;
}
</style>
