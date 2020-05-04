import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "userLayout" */ "../layouts/UserLayout.vue"),
    children: [
      {
        path: "/user/login",
        name: "Login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/Login.vue"),
      },
      {
        path: "/user/register",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/Register.vue"),
      },
    ],
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "homeLayout" */ "../layouts/HomeLayout.vue"),
    children: [
      {
        path: "/home/notice",
        name: "Notice",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/notice/Notice.vue"),
      },
      {
        path: "/home/message",
        name: "Message",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/message/Message.vue"),
      },
      {
        path: "/home/cantact",
        name: "Cantact",
        component: () =>
          import(
            /* webpackChunkName: "cantact" */ "../views/cantact/Cantact.vue"
          ),
        children: [
          {
            path: "/home/cantact/friend/:friendId",
            name: "CantactFriend",
            component: () =>
              import(
                /* webpackChunkName: "cantact" */ "../views/cantact/Friend.vue"
              ),
            props: true,
          },
          {
            path: "/home/cantact/group",
            name: "CantactGroup",
            component: () =>
              import(
                /* webpackChunkName: "cantact" */ "../views/cantact/Group.vue"
              ),
          },
        ],
      },
      {
        path: "/home/find",
        name: "Find",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/find/Find.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/home/message",
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

// 全局后置钩子
router.afterEach(() => {
  NProgress.done();
});

export default router;
