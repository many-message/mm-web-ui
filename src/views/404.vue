<template>
  <div id="commont-404">
    <div class="title">
      <a-icon type="exclamation-circle" />
      <span class="status">404</span>
    </div>
    <div class="body">
      <span class="slogan">您访问的页面不存在！</span>
      <router-link to="/">
        <a-button type="primary">返回首页</a-button>
      </router-link>
    </div>
  </div>
</template>

<style lang="less">
#commont-404 {
  width: 50%;
  text-align: center;
  margin: 0 auto;
  margin-top: 10%;
}
#commont-404 .title {
  font-size: 44px;
}
#commont-404 .status {
  margin-left: 20px;
}
#commont-404 .body {
  margin-top: 50px;
}
#commont-404 .slogan {
  font-size: 22px;
}
</style>
