<template>
  <div>
    <a-result :title="groupInfo.groupName">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(groupInfo.groupName)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions>
          <a-descriptions-item label="群名称">
            {{ groupInfo.groupName }}
          </a-descriptions-item>
          <a-descriptions-item label="群号">
            {{ groupInfo.groupNum }}
          </a-descriptions-item>
          <a-descriptions-item label="群人数">
            {{ groupInfo.groupMemberNum }}
          </a-descriptions-item>
          <a-descriptions-item label="群简介">
            {{ groupInfo.groupDesc }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <template #extra>
        <a-button v-if="groupInfo.join" type="primary">发送消息</a-button>
        <a-button v-else @click="showJoinGroupModal" type="primary">
          加入群聊
        </a-button>
      </template>
    </a-result>
    <!-- 加入群聊 -->
    <a-modal
      title="加入群聊"
      :visible="joinGroupVisible"
      :confirm-loading="joinGroupConfirmLoadding"
      @ok="handleJoinGroupOk"
      @cancel="handleJoinGroupCancel"
    >
      <a-input
        v-model="joinGroupReqMsg"
        @change="handleJoinGroupReqMsgChange"
        placeholder="请输入群请求信息"
      />
    </a-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapMutations } from "vuex";
import { sliceNickname, MsgType } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("find");

export default {
  props: ["groupId"],
  computed: {
    ...mapState(["groupInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetGroupInfo",
  },
  data() {
    return {
      joinGroupVisible: false,
      joinGroupConfirmLoadding: false,
      joinGroupReqMsg: null,
    };
  },
  methods: {
    ...mapActions(["getGroup", "sendJoinGroupReq"]),
    ...mapMutations("socket", ["sendMsg"]),
    handleGetGroupInfo() {
      this.getGroup(this.groupId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    // 加入群
    showJoinGroupModal() {
      this.joinGroupReqMsg = null;
      this.joinGroupVisible = true;
    },
    handleJoinGroupReqMsgChange() {
      if (this.joinGroupReqMsg) {
        this.joinGroupReqMsg = this.joinGroupReqMsg.trim();
      }
    },
    handleJoinGroupOk() {
      if (!this.joinGroupReqMsg) {
        this.$message.error("请输入群请求信息！");
        return;
      }
      this.joinGroupConfirmLoadding = true;
      // 发送入群请求
      this.sendJoinGroupReq({
        joinGorupInfo: {
          groupId: this.groupId,
          reqMsg: this.joinGroupReqMsg,
        },
        success: userIds => {
          this.joinGroupConfirmLoadding = false;
          this.joinGroupVisible = false;
          // 同步发送websocket消息
          this.sendMsg({
            msgType: MsgType.REQ_JOIN_GROUP_NOTICE,
            content: {
              recvUserIds: userIds,
            },
          });
          this.$message.success("请求已发送！");
        },
        error: () => {
          this.joinGroupConfirmLoadding = false;
        },
      });
    },
    handleJoinGroupCancel() {
      this.joinGroupVisible = false;
    },
  },
  mounted() {
    this.handleGetGroupInfo();
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
