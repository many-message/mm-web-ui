<template>
  <div id="comment-user-layout">
    <a-layout>
      <a-layout-content>
        <div class="header">
          <span class="title">Many Message</span>
          <div class="slogan">MM 是一款基于Web浏览器的即时通讯系统</div>
        </div>
      </a-layout-content>
      <a-layout-content>
        <div class="form">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer>
        Copyright
        <span
          role="img"
          aria-label="copyright"
          class="anticon anticon-copyright"
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="copyright"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"
            ></path>
          </svg>
        </span>
        2020 成都东软学院毕业设计
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import { Session } from "@/util";
import router from "@/router";

export default {
  beforeCreate() {
    if (Session.getToken()) {
      router.push("/");
    }
  },
};
</script>

<style lang="less">
#comment-user-layout {
  width: 100%;
  height: 100%;
  background: url("../assets/login-bg.svg");
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
#comment-user-layout .ant-layout {
  padding-top: 74px;
  background: transparent;
}
#comment-user-layout .header {
  margin: 0 auto;
  text-align: center;
}
#comment-user-layout .title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 33px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}
#comment-user-layout .slogan {
  margin-top: 12px;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
#comment-user-layout .form {
  width: 368px;
  margin: 0 auto;
  text-align: center;
}
#comment-user-layout .form .ant-input,
#comment-user-layout .form .login-form-button {
  font-size: 16px;
  height: 40px;
}
#comment-user-layout .login-form-button {
  width: 100%;
}
#comment-user-layout .ant-form-explain {
  text-align: left;
}
#comment-user-layout .ant-layout-footer {
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
}
</style>
