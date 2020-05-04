<template>
  <a-layout-sider :trigger="null" collapsed>
    <a-avatar class="photo">{{ photoName }}</a-avatar>
    <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['2']">
      <a-menu-item key="1">
        <router-link to="/home/notice">
          <a-icon type="message" />
          <span>通知</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/home/message">
          <a-icon type="wechat" />
          <span>消息</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <router-link to="/home/cantact">
          <a-icon type="team" />
          <span>联系人</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="4">
        <router-link to="/home/find">
          <a-icon type="global" />
          <span>发现</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapGetters, mapMutations } = createNamespacedHelpers("user");

export default {
  computed: {
    ...mapGetters(["photoName"]),
  },
  methods: {
    ...mapMutations(["loadUserInfo"]),
  },
  mounted() {
    this.loadUserInfo();
  },
};
</script>

<style lang="less" scoped>
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
.photo {
  background-color: #1da57a;
  margin: 20px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.anticon {
  font-size: 18px !important;
}
</style>
