<template>
  <a-card
    hoverable
    :style="{ width: '450px', margin: '0 auto' }"
    title="好友请求"
    :bordered="false"
  >
    <a-result :title="friendReqInfo.nickname">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(friendReqInfo.nickname)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions layout="vertical">
          <a-descriptions-item label="昵称">
            <a-tag color="green">
              {{ friendReqInfo.nickname }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="邮箱">
            <a-tag color="green">
              {{ friendReqInfo.email }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            <a-tag color="green">
              {{ friendReqInfo.sex === "1" ? "男" : "女" }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-result>
    <a-card-meta
      :title="friendReqInfo.nickname + ' 对你说：'"
      :description="friendReqInfo.reqMsg"
    />
    <template slot="actions" class="ant-card-actions">
      <a-tooltip placement="top">
        <template slot="title">
          <span>果断同意</span>
        </template>
        <a-icon @click="showAgreeFriendReqModal" type="check-circle" />
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title">
          <span>狠心拒绝</span>
        </template>
        <a-icon @click="handleDeleteFriendReq" type="close-circle" />
      </a-tooltip>
    </template>
    <a-modal
      title="添加好友"
      :visible="agreeFriendReqVisible"
      :confirm-loading="agreeFriendReqConfirmLoadding"
      @ok="handleAgreeFriendReqOk"
      @cancel="handleAgreeFriendReqCancel"
    >
      <a-select v-model="friendGroupId" style="width: 100%">
        <a-select-option
          v-for="friendGroup in friendGroups"
          :key="friendGroup.friendGroupId"
          :value="friendGroup.friendGroupId"
        >
          {{ friendGroup.friendGroupName }}
        </a-select-option>
      </a-select>
    </a-modal>
  </a-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { sliceNickname } from "@/util";

export default {
  props: ["friendReqId"],
  computed: {
    ...mapState("notice", ["friendReqInfo"]),
    ...mapState("friend", ["friendGroups"]),
  },
  data() {
    return {
      agreeFriendReqVisible: false,
      agreeFriendReqConfirmLoadding: false,
      friendGroupId: null,
    };
  },
  watch: {
    // 监听路由变化
    $route: "handleGetFriendReqInfo",
  },
  methods: {
    ...mapActions("notice", [
      "getFriendReqInfo",
      "deleteFriendReqInfo",
      "agreeFriendReq",
    ]),
    ...mapActions("friend", ["getFriendGroups"]),
    handleGetFriendReqInfo() {
      console.log(this.friendReqId);
      this.getFriendReqInfo(this.friendReqId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    // 删除好友请求
    handleDeleteFriendReq() {
      this.deleteFriendReqInfo({
        friendReqId: this.friendReqId,
        success: () => {
          this.$router.push("/home/notice");
        },
      });
    },
    // 同意好友请求
    showAgreeFriendReqModal() {
      this.getFriendGroups(() => {
        this.agreeFriendReqVisible = true;
        this.friendGroupId = null;
      });
    },
    handleAgreeFriendReqOk() {
      if (!this.friendGroupId) {
        this.$message.error("请选择分组！");
        return;
      }
      this.agreeFriendReqConfirmLoadding = true;
      this.agreeFriendReq({
        agreeFriendReqInfo: {
          friendReqId: this.friendReqId,
          friendGroupId: this.friendGroupId,
        },
        success: () => {
          this.agreeFriendReqConfirmLoadding = false;
          this.agreeFriendReqVisible = false;
          this.$router.push("/home/notice");
        },
        error: () => {
          this.agreeFriendReqConfirmLoadding = false;
        },
      });
    },
    handleAgreeFriendReqCancel() {
      this.agreeFriendReqVisible = false;
    },
  },
  mounted() {
    this.handleGetFriendReqInfo();
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
