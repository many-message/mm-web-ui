<template>
  <a-card
    hoverable
    :style="{ width: '450px', margin: '0 auto' }"
    title="用户申请加入群聊"
    :bordered="false"
  >
    <a-result :title="groupJoinInviteInfo.groupName">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(groupJoinInviteInfo.groupName)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions layout="vertical" :column="2">
          <a-descriptions-item label="群名称">
            <a-tag color="green">
              {{ groupJoinInviteInfo.groupName }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="群号">
            {{ groupJoinInviteInfo.groupNum }}
          </a-descriptions-item>
          <a-descriptions-item label="群简介">
            {{ groupJoinInviteInfo.groupDesc }}
          </a-descriptions-item>
          <a-descriptions-item label="邀请用户">
            <a-tag color="green">{{ groupJoinInviteInfo.nickname }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-result>
    <a-card-meta
      :title="groupJoinInviteInfo.email"
      :description="
        groupJoinInviteInfo.nickname +
          ' 邀您加入群聊【' +
          groupJoinInviteInfo.groupName +
          '】'
      "
    />
    <template slot="actions" class="ant-card-actions">
      <a-tooltip placement="top">
        <template slot="title">
          <span>果断同意</span>
        </template>
        <a-icon @click="handleAgreeGroupJoinInviteInfo" type="check-circle" />
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title">
          <span>狠心拒绝</span>
        </template>
        <a-icon @click="handleDeleteGroupJoinInviteInfo" type="close-circle" />
      </a-tooltip>
    </template>
  </a-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("notice");

export default {
  props: ["groupJoinInviteId"],
  computed: {
    ...mapState(["groupJoinInviteInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetGroupJoinInviteInfo",
  },
  methods: {
    ...mapActions([
      "getGroupJoinInviteInfo",
      "deleteGroupJoinInviteInfo",
      "agreeGroupJoinInviteInfo",
    ]),
    sliceName(name) {
      return sliceNickname(name);
    },
    handleGetGroupJoinInviteInfo() {
      this.getGroupJoinInviteInfo(this.groupJoinInviteId);
    },
    handleDeleteGroupJoinInviteInfo() {
      this.deleteGroupJoinInviteInfo({
        groupJoinInviteId: this.groupJoinInviteId,
        success: () => {
          this.$router.push("/home/notice/success");
        },
      });
    },
    handleAgreeGroupJoinInviteInfo() {
      this.agreeGroupJoinInviteInfo({
        groupJoinInviteId: this.groupJoinInviteId,
        success: () => {
          this.$router.push("/home/notice/success");
        },
      });
    },
  },
  mounted() {
    this.handleGetGroupJoinInviteInfo();
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
