<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item>
      <a-input
        v-decorator="[
          'nickname',
          {
            rules: [
              { required: true, message: '请输入昵称！' },
              { max: 32, message: '昵称必须在32字符以内！' },
            ],
            getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
          },
        ]"
        placeholder="昵称"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'pwd',
          {
            rules: [
              { required: true, message: '请输入密码！' },
              { max: 20, message: '密码最多20字符！' },
              { min: 6, message: '密码最少6字符！' },
            ],
            getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
          },
        ]"
        type="password"
        placeholder="密码"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'rePwd',
          {
            rules: [
              { required: true, message: '请确认密码！' },
              { validator: compareToFirstPassword },
            ],
            getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
          },
        ]"
        type="password"
        placeholder="确认密码"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'email',
          {
            rules: [
              { required: true, message: '请输入邮箱！' },
              {
                pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                message: '请输入正确的邮箱格式！',
              },
              { max: 64, message: '邮箱不能超过64字符！' },
            ],
            getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
          },
        ]"
        placeholder="邮箱"
      >
        <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-row :gutter="8">
        <a-col :span="12">
          <a-input
            v-decorator="[
              'code',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                  { pattern: /^\d{6}$/, message: '必须输入6位数字！' },
                ],
                getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
              },
            ]"
            placeholder="验证码"
          />
        </a-col>
        <a-col :span="12">
          <a-button>发送验证码</a-button>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item>
      <a-radio-group
        v-decorator="[
          'sex',
          { rules: [{ required: true, message: '请选择性别！' }] },
        ]"
      >
        <a-radio value="1">
          男
        </a-radio>
        <a-radio value="2">
          女
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-form-button">
        注 册
      </a-button>
      <router-link to="/user/login">使用已有账户登录</router-link>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "user_register_form" });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("pwd")) {
        callback("两次输入的密码不一致！");
      } else {
        callback();
      }
    },
  },
};
</script>

<style></style>
