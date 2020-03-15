<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item>
      <a-input
        v-decorator="[
          'email',
          {
            rules: [
              { required: true, message: '请输入您的邮箱！' },
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
      <a-input
        v-decorator="[
          'pwd',
          {
            rules: [
              { required: true, message: '请输入您的密码！' },
              { max: 20, message: '密码不能超过20字符！' },
              { min: 6, message: '密码不能少于6字符！' },
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
      <a-button type="primary" html-type="submit" class="login-form-button">
        登 录
      </a-button>
      <router-link to="/user/register">新用户注册</router-link>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "user_login_form" });
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
  },
};
</script>

<style lang="less"></style>
