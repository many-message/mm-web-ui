<template>
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
      </a-descriptions>
    </template>
    <template #extra>
      <a-button type="primary">发送消息</a-button>
      <a-button>移动分组</a-button>
      <a-button>修改备注</a-button>
      <a-button type="danger">删除好友</a-button>
    </template>
  </a-result>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("friend");

export default {
  props: ["friendId"],
  watch: {
    // 监听路由变化
    $route: "handleGetFriendInfo",
  },
  computed: {
    ...mapState(["friendInfo"]),
  },
  methods: {
    ...mapActions(["getFriend"]),
    handleGetFriendInfo() {
      this.getFriend(this.friendId);
    },
    sliceNickname(nickname) {
      return sliceNickname(nickname);
    },
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
