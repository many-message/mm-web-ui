<template>
  <a-layout id="component-home">
    <Nav />
    <a-layout>
      <router-view />
    </a-layout>
  </a-layout>
</template>

<script>
import { Session } from "@/util";
import Nav from "@/views/Nav.vue";

export default {
  components: {
    Nav,
  },
  beforeCreate() {
    if (!Session.getToken()) {
      // 用户未登录，跳转到登录页面
      this.$router.push("/user/login");
    }
  },
};
</script>

<style>
#component-home {
  width: 100%;
  height: 100%;
}
</style>
