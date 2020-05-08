<template>
  <a-card
    hoverable
    :style="{ width: '450px', margin: '0 auto' }"
    title="用户申请加入群聊"
    :bordered="false"
  >
    <a-result :title="groupJoinReqInfo.groupName">
      <template #icon>
        <a-avatar slot="avatar" class="photo">{{
          sliceName(groupJoinReqInfo.groupName)
        }}</a-avatar>
      </template>
      <template #subTitle>
        <a-descriptions layout="vertical" :column="2">
          <a-descriptions-item label="群名称">
            <a-tag color="green">
              {{ groupJoinReqInfo.groupName }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="群号">
            {{ groupJoinReqInfo.groupNum }}
          </a-descriptions-item>
          <a-descriptions-item label="群简介">
            {{ groupJoinReqInfo.groupDesc }}
          </a-descriptions-item>
          <a-descriptions-item label="用户昵称">
            <a-tag color="green">
              {{ groupJoinReqInfo.nickname }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户邮箱">
            <a-tag color="green">
              {{ groupJoinReqInfo.email }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户性别">
            <a-tag color="green">
              {{ groupJoinReqInfo.sex === "1" ? "男" : "女" }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-result>
    <a-card-meta
      :title="
        groupJoinReqInfo.nickname +
          ' 申请加入群聊【' +
          groupJoinReqInfo.groupName +
          '】'
      "
      :description="groupJoinReqInfo.reqMsg"
    />
    <template slot="actions" class="ant-card-actions">
      <a-tooltip placement="top">
        <template slot="title">
          <span>果断同意</span>
        </template>
        <a-icon @click="handleAgreeGropuJoinReqInfo" type="check-circle" />
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title">
          <span>狠心拒绝</span>
        </template>
        <a-icon @click="handleDeleteGorupJoinReqInfo" type="close-circle" />
      </a-tooltip>
    </template>
  </a-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("notice");

export default {
  props: ["groupJoinReqId"],
  computed: {
    ...mapState(["groupJoinReqInfo"]),
  },
  watch: {
    // 监听路由变化
    $route: "handleGetGroupJoinReqInfo",
  },
  methods: {
    ...mapActions([
      "getGroupJoinReqInfo",
      "deleteGroupJoinReqInfo",
      "agreeGroupJoinReqInfo",
    ]),
    sliceName(name) {
      return sliceNickname(name);
    },
    handleGetGroupJoinReqInfo() {
      this.getGroupJoinReqInfo(this.groupJoinReqId);
    },
    handleDeleteGorupJoinReqInfo() {
      this.deleteGroupJoinReqInfo({
        groupJoinReqId: this.groupJoinReqId,
        success: () => {
          this.$router.push("/home/notice/success");
        },
      });
    },
    handleAgreeGropuJoinReqInfo() {
      this.agreeGroupJoinReqInfo({
        groupJoinReqId: this.groupJoinReqId,
        success: () => {
          this.$router.push("/home/notice/success");
        },
      });
    },
  },
  mounted() {
    this.handleGetGroupJoinReqInfo();
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
