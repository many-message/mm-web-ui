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
        <a-button v-else type="primary">添加好友</a-button>
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
      <a-input
        v-model="friendName"
        @change="handleFriendNameChange"
        placeholder="请输入备注名"
      />
    </a-modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("find");

export default {
  props: ["userId"],
  computed: {
    ...mapState(["userInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetUserInfo",
  },
  data() {
    return {
      addFriendVisible: false,
      addFriendConfirmLoadding: false,
      friendName: null,
    };
  },
  methods: {
    ...mapActions(["getUser"]),
    handleGetUserInfo() {
      this.getUser(this.userId);
    },
    sliceName(name) {
      return sliceNickname(name);
    },
    showAddFriendModal() {
      this.friendName = this.userInfo.nickname;
      this.addFriendVisible = true;
    },
    handleFriendNameChange() {
      if (this.friendName) {
        this.friendName = this.friendName.trim();
      }
    },
    handleAddFriendOk() {
      if (!this.friendName) {
        this.$message.error("请输入备注名！");
        return;
      }
      this.addFriendConfirmLoadding = true;
      // TODO 发送请求
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
