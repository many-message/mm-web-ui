<template>
  <a-layout>
    <a-layout-sider
      width="300"
      :style="{ background: '#FAFAFA', overflowY: 'scroll' }"
    >
      <div class="header">
        <a-input-search
          v-if="searchUser"
          placeholder="输入邮箱、用户名模糊搜索"
          :style="{
            width: '80%',
            margin: '0 auto',
            display: 'block',
          }"
          @search="handleSearch"
          v-model="searchKeyword"
        />
        <a-input-search
          v-else
          placeholder="输入群号、群名称模糊搜索"
          :style="{
            width: '80%',
            margin: '0 auto',
            display: 'block',
          }"
          @search="handleSearch"
          v-model="searchKeyword"
        />
      </div>
      <div class="title">
        <span :class="{ tag: searchUser }" @click="handleTagClick">用户</span>
        <a-divider type="vertical" />
        <span :class="{ tag: !searchUser }" @click="handleTagClick">群聊</span>
      </div>
      <div class="body">
        <a-list item-layout="horizontal" v-if="searchUser">
          <a-list-item v-for="user in users" :key="user.userId">
            <a-list-item-meta :description="user.email">
              <router-link slot="title" :to="'/home/find/user/' + user.userId">
                {{ user.nickname }}
              </router-link>
              <a-avatar slot="avatar" class="photo">{{
                sliceName(user.nickname)
              }}</a-avatar>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-list item-layout="horizontal" v-else>
          <a-list-item v-for="group in groups" :key="group.groupId">
            <a-list-item-meta :description="group.groupDesc">
              <router-link
                slot="title"
                :to="'/home/find/group/' + group.groupId"
              >
                {{ group.groupName }}
              </router-link>
              <a-avatar slot="avatar" class="photo">{{
                sliceName(group.groupName)
              }}</a-avatar>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-layout-sider>
    <a-layout-content :style="{ padding: '24px 24px', minHeight: '280px' }">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { sliceNickname } from "@/util";

const { mapState, mapActions, mapMutations } = createNamespacedHelpers("find");

export default {
  data() {
    return {
      // 是否搜索用户
      searchUser: true,
      searchKeyword: null,
    };
  },
  computed: {
    ...mapState(["users", "groups"]),
  },
  methods: {
    ...mapActions(["searchUsers", "getUser", "searchGroups", "getGroup"]),
    ...mapMutations(["clearData"]),
    handleTagClick() {
      this.searchUser = !this.searchUser;
      this.clearData();
    },
    handleSearch() {
      if (this.searchKeyword) {
        if (this.searchUser) {
          // 搜索用户
          this.searchUsers(this.searchKeyword);
        } else {
          // 搜索群聊
          this.searchGroups(this.searchKeyword);
        }
      }
    },
    sliceName(nickname) {
      return sliceNickname(nickname);
    },
  },
  mounted() {
    this.clearData();
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 60px;
  padding-top: 20px;
}
.title {
  width: 100%;
  height: 40px;
  text-align: center;
  cursor: pointer;
}
.tag {
  color: #1da57a;
  font-weight: bold;
}
.body {
  width: 100%;
}
.ant-list {
  width: 90%;
  margin: 0 auto;
}
.photo {
  background-color: #1da57a;
}
</style>
