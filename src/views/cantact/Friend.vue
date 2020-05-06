<template>
  <div>
    <a-result :title="friendInfo.friendName">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceNickname(friendInfo.nickname)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions>
          <a-descriptions-item label="昵称">
            {{ friendInfo.nickname }}
          </a-descriptions-item>
          <a-descriptions-item label="邮箱">
            {{ friendInfo.email }}
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            {{ friendInfo.sex === "1" ? "男" : "女" }}
          </a-descriptions-item>
          <a-descriptions-item label="分组">
            {{ friendInfo.friendGroupName }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <template #extra>
        <a-button type="primary">发送消息</a-button>
        <a-button @click="showMoveFriendGroupModal">移动分组</a-button>
        <a-button @click="showUpdateFriendName">修改备注</a-button>
        <a-button type="danger">删除好友</a-button>
      </template>
    </a-result>
    <!-- 修改备注 -->
    <a-modal
      title="修改备注"
      :visible="updateFriendNameVisible"
      :confirm-loading="updateFriendNameConfirmLoading"
      @ok="handleUpdateFriendNameOk"
      @cancel="handleUpdateFriendNameCancel"
    >
      <a-input
        v-model="friendName"
        @change="handleUpdateFriendNameChange"
        placeholder="请输入备注名"
      />
    </a-modal>
    <!-- 修改分组 -->
    <a-modal
      title="移动分组"
      :visible="moveFriendGroupVisible"
      :confirm-loading="moveFriendGroupConfirmLoading"
      @ok="handleMoveFriendGroupOk"
      @cancel="handleMoveFriendGroupCancel"
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
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("friend");

export default {
  props: ["friendId"],
  data() {
    return {
      // 修改备注
      updateFriendNameVisible: false,
      updateFriendNameConfirmLoading: false,
      friendName: null,
      // 移动分组
      moveFriendGroupVisible: false,
      moveFriendGroupConfirmLoading: false,
      friendGroupId: null,
    };
  },
  watch: {
    // 监听路由变化
    $route: "handleGetFriendInfo",
  },
  computed: {
    ...mapState(["friendInfo", "friendGroups"]),
  },
  methods: {
    ...mapActions([
      "getFriend",
      "updateFriendName",
      "getFriendGroups",
      "moveFriendGroup",
    ]),
    handleGetFriendInfo() {
      this.getFriend(this.friendId);
    },
    sliceNickname(nickname) {
      return sliceNickname(nickname);
    },
    // 修改备注
    showUpdateFriendName() {
      this.friendName = this.friendInfo.friendName;
      this.updateFriendNameVisible = true;
    },
    handleUpdateFriendNameChange() {
      if (this.friendName) {
        this.friendName = this.friendName.trim();
      }
    },
    handleUpdateFriendNameOk() {
      if (!this.friendName) {
        this.$message.error("请输入备注名！");
        return;
      }
      this.updateFriendNameConfirmLoading = true;
      // 修改备注名
      this.updateFriendName({
        friendInfo: {
          friendId: this.friendInfo.friendId,
          friendName: this.friendName,
        },
        success: () => {
          this.updateFriendNameConfirmLoading = false;
          this.updateFriendNameVisible = false;
        },
        error: () => {
          this.updateFriendNameVisible = false;
        },
      });
    },
    handleUpdateFriendNameCancel() {
      this.updateFriendNameVisible = false;
    },
    // 移动分组
    showMoveFriendGroupModal() {
      this.getFriendGroups(() => {
        this.friendGroupId = null;
        this.moveFriendGroupVisible = true;
      });
    },
    handleMoveFriendGroupOk() {
      if (!this.friendGroupId) {
        this.$message.error("请选择好友分组！");
        return;
      }
      this.moveFriendGroupConfirmLoading = true;
      // 修改分组
      this.moveFriendGroup({
        friendId: this.friendInfo.friendId,
        friendGroupId: this.friendGroupId,
        success: () => {
          this.moveFriendGroupConfirmLoading = false;
          this.moveFriendGroupVisible = false;
          this.handleGetFriendInfo();
        },
        error: () => {
          this.moveFriendGroupConfirmLoading = false;
        },
      });
    },
    handleMoveFriendGroupCancel() {
      this.moveFriendGroupVisible = false;
    },
  },
  mounted() {
    this.getFriend(this.friendId);
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
