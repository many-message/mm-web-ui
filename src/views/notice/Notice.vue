<template>
  <a-layout>
    <a-layout-sider
      width="300"
      :style="{ background: '#FAFAFA', overflowY: 'scroll' }"
    >
      <a-menu :style="{ background: '#FAFAFA' }">
        <a-menu-item-group key="g1">
          <template slot="title">
            <a-icon type="user-add" /><span>好友请求</span>
          </template>
          <a-list item-layout="horizontal" :data-source="friendReqs">
            <a-list-item slot="renderItem" slot-scope="friendReq">
              <a-list-item-meta :description="friendReq.reqMsg">
                <router-link
                  slot="title"
                  :to="'/home/notice/friendReq/' + friendReq.friendReqId"
                >
                  {{ friendReq.nickname }}
                </router-link>
                <a-avatar slot="avatar" class="photo">{{
                  sliceName(friendReq.nickname)
                }}</a-avatar>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
        <a-menu-item-group key="g2">
          <template slot="title">
            <a-icon type="usergroup-add" /><span>群聊请求</span>
          </template>
          <a-list item-layout="horizontal" :data-source="groupJoinReqs">
            <a-list-item slot="renderItem" slot-scope="groupJoinReq">
              <a-list-item-meta
                :description="groupJoinReq.nickname + ' 申请加入群聊'"
              >
                <router-link
                  slot="title"
                  :to="
                    '/home/notice/groupJoinReq/' + groupJoinReq.groupJoinReqId
                  "
                >
                  {{ groupJoinReq.groupName }}
                </router-link>
                <a-avatar slot="avatar" class="photo">{{
                  sliceName(groupJoinReq.nickname)
                }}</a-avatar>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
        <a-menu-item-group key="g3">
          <template slot="title">
            <a-icon type="to-top" /><span>群聊邀请</span>
          </template>
          <a-list item-layout="horizontal" :data-source="groupJoinInvites">
            <a-list-item slot="renderItem" slot-scope="groupJoinInvite">
              <a-list-item-meta
                :description="groupJoinInvite.nickname + ' 邀请您加入群聊'"
              >
                <router-link
                  slot="title"
                  :to="
                    '/home/notice/groupJoinInvite/' +
                      groupJoinInvite.groupJoinInviteId
                  "
                >
                  {{ groupJoinInvite.groupName }}
                </router-link>
                <a-avatar slot="avatar" class="photo">{{
                  sliceName(groupJoinInvite.groupName)
                }}</a-avatar>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-menu-item-group>
      </a-menu>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '24px 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions } = createNamespacedHelpers("notice");

export default {
  computed: {
    ...mapState(["friendReqs", "groupJoinReqs", "groupJoinInvites"]),
  },
  methods: {
    ...mapActions(["getAllNotices"]),
    sliceName(name) {
      return sliceNickname(name);
    },
  },
  mounted() {
    this.getAllNotices();
  },
};
</script>

<style lang="less" scoped>
.ant-list {
  width: 90%;
  margin: 0 auto;
}
.photo {
  background-color: #1da57a;
}
</style>
