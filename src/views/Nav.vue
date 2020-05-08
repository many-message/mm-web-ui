<template>
  <a-layout-sider :trigger="null" collapsed>
    <a-avatar @click="showDrawer" class="photo">{{ photoName }}</a-avatar>
    <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[navDefaultKey]">
      <a-menu-item key="1">
        <router-link to="/home/notice">
          <a-badge dot :offset="[0, 10]">
            <a-icon type="notification" />
            <span>通知</span>
          </a-badge>
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
    <a-drawer
      title="个人信息"
      placement="left"
      :closable="false"
      :visible="drawerVisible"
      @close="handleCloseDrawer"
    >
      <a-descriptions :column="1">
        <a-descriptions-item label="昵称">
          {{ userInfo.nickname }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ userInfo.email }}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          {{ userInfo.sex === "1" ? "男" : "女" }}
        </a-descriptions-item>
        <a-descriptions-item>
          <a-button @click="showUpdateInfoModal" icon="edit">修改信息</a-button>
        </a-descriptions-item>
        <a-descriptions-item>
          <a-button @click="showUpdatePwdModal" type="primary" icon="lock">
            修改密码
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item>
          <a-button @click="logout" type="danger" icon="logout">
            退出系统
          </a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
    <!-- 修改用户信息 -->
    <a-modal
      title="修改信息"
      :visible="updateInfoVisible"
      :confirm-loading="updateInfoConfirmLoadding"
      @ok="handleUpdateInfoOk"
      @cancel="handleUpdateInfoCancel"
    >
      <a-input
        v-model="updateInfo.nickname"
        @change="handleUpdateNicknameChange"
        placeholder="请输入昵称"
      />
      <a-radio-group
        v-model="updateInfo.sex"
        :defaultValue="updateInfo.sex"
        :style="{ marginTop: '20px' }"
      >
        <a-radio value="1">男</a-radio>
        <a-radio value="2">女</a-radio>
      </a-radio-group>
    </a-modal>
    <!-- 修改密码 -->
    <a-modal
      title="修改密码"
      :visible="updatePwdVisible"
      :confirm-loading="updatePwdConfirmLoadding"
      @ok="handleUpdatePwdOk"
      @cancel="handleUpdatePwdCancel"
    >
      <a-input-password
        v-model="pwdInfo.oldPwd"
        @change="handleOldPwdChange"
        placeholder="请输入旧密码"
      />
      <a-input-password
        v-model="pwdInfo.newPwd"
        @change="handleNewPwdChange"
        placeholder="请输入新密码"
        :style="{ marginTop: '20px' }"
      />
    </a-modal>
  </a-layout-sider>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Session } from "@/util";
import Router from "@/router";

const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} = createNamespacedHelpers("user");

const pathNavMap = {
  Notice: "1",
  NoticeFriendReq: "1",
  NoticeGroupJoinReq: "1",
  NoticeGroupJoinInvite: "1",
  NoticeSuccess: "1",
  Message: "2",
  Cantact: "3",
  CantactFriend: "3",
  CantactGroup: "3",
  CantactSuccess: "3",
  Find: "4",
  FindUser: "4",
  FindGroup: "4",
};

export default {
  computed: {
    ...mapGetters(["photoName"]),
    ...mapState(["userInfo"]),
    navDefaultKey: () => {
      return pathNavMap[Router.history.current.name];
    },
  },
  data() {
    return {
      // 抽屉
      drawerVisible: false,
      // 修改信息
      updateInfoVisible: false,
      updateInfoConfirmLoadding: false,
      updateInfo: {
        nickname: null,
        sex: null,
      },
      // 修改密码
      updatePwdVisible: false,
      updatePwdConfirmLoadding: false,
      pwdInfo: {
        oldPwd: null,
        newPwd: null,
      },
    };
  },
  methods: {
    ...mapActions(["updateUserInfo", "updatePwd"]),
    ...mapMutations(["loadUserInfo"]),
    showDrawer() {
      this.drawerVisible = true;
    },
    handleCloseDrawer() {
      this.drawerVisible = false;
    },
    logout() {
      Session.removeToken();
      this.$message.success("您已成功退出系统！");
      this.$router.push("/user/login");
    },
    // 修改信息
    showUpdateInfoModal() {
      const { nickname, sex } = this.userInfo;
      this.updateInfo = { nickname, sex };
      this.updateInfoVisible = true;
    },
    handleUpdateNicknameChange() {
      if (this.updateInfo.nickname) {
        this.updateInfo.nickname = this.updateInfo.nickname.trim();
      }
    },
    handleUpdateInfoOk() {
      const { nickname, sex } = this.updateInfo;
      if (!nickname) {
        this.$message.error("请输入昵称！");
        return;
      }
      if (!sex) {
        this.$message.error("请选择性别！");
        return;
      }
      this.updateInfoConfirmLoadding = true;
      // 修改用户信息
      this.updateUserInfo({
        updateInfo: this.updateInfo,
        success: () => {
          this.updateInfoConfirmLoadding = false;
          this.updateInfoVisible = false;
        },
        error: () => {
          this.updateInfoConfirmLoadding = false;
        },
      });
    },
    handleUpdateInfoCancel() {
      this.updateInfoVisible = false;
    },
    // 修改密码
    showUpdatePwdModal() {
      this.pwdInfo = {
        oldPwd: null,
        newPwd: null,
      };
      this.updatePwdVisible = true;
    },
    handleOldPwdChange() {
      if (this.pwdInfo.oldPwd) {
        this.pwdInfo.oldPwd = this.pwdInfo.oldPwd.trim();
      }
    },
    handleNewPwdChange() {
      if (this.pwdInfo.newPwd) {
        this.pwdInfo.newPwd = this.pwdInfo.newPwd.trim();
      }
    },
    handleUpdatePwdOk() {
      if (!this.pwdInfo.oldPwd) {
        this.$message.error("请输入旧密码！");
        return;
      }
      if (!this.pwdInfo.newPwd) {
        this.$message.error("请输入新密码");
        return;
      }
      this.updatePwdConfirmLoadding = true;
      // 修改密码
      this.updatePwd({
        pwdInfo: this.pwdInfo,
        success: () => {
          this.updatePwdConfirmLoadding = false;
          this.updatePwdVisible = false;
        },
        error: () => {
          this.updatePwdConfirmLoadding = false;
        },
      });
    },
    handleUpdatePwdCancel() {
      this.updatePwdVisible = false;
    },
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
