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
        <a-button v-else type="primary">加入群聊</a-button>
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
        v-model="groupMemberName"
        @change="handleGroupMemberNameChange"
        placeholder="请输入群名片"
      />
    </a-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

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
      groupMemberName: null,
    };
  },
  methods: {
    ...mapActions(["getGroup"]),
    handleGetGroupInfo() {
      this.getGroup(this.groupId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    showJoinGroupModal() {
      this.groupMemberName = null;
      this.joinGroupVisible = true;
    },
    handleGroupMemberNameChange() {
      if (this.groupMemberName) {
        this.groupMemberName = this.groupMemberName.trim();
      }
    },
    handleJoinGroupOk() {
      if (!this.groupMemberName) {
        this.$message.error("请输入群名片！");
        return;
      }
      this.joinGroupConfirmLoadding = true;
      // TODO
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
