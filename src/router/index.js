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
          import(/* webpackChunkName: "notice" */ "../views/notice/Notice.vue"),
        children: [
          {
            path: "/home/notice/friendReq/:friendReqId",
            name: "NoticeFriendReq",
            component: () =>
              import(
                /* webpackChunkName: "notice" */ "../views/notice/FriendReq.vue"
              ),
            props: true,
          },
          {
            path: "/home/notice/groupJoinReq/:groupJoinReqId",
            name: "NoticeGroupJoinReq",
            component: () =>
              import(
                /* webpackChunkName: "notice" */ "../views/notice/GroupJoinReq.vue"
              ),
            props: true,
          },
          {
            path: "/home/notice/groupJoinInvite/:groupJoinInviteId",
            name: "NoticeGroupJoinInvite",
            component: () =>
              import(
                /* webpackChunkName: "notice" */ "../views/notice/GroupJoinInvite.vue"
              ),
            props: true,
          },
        ],
      },
      {
        path: "/home/message",
        name: "Message",
        component: () =>
          import(
            /* webpackChunkName: "message" */ "../views/message/Message.vue"
          ),
        children: [
          {
            path: "/home/message/user/:chatId",
            name: "MessageUser",
            component: () =>
              import(
                /* webpackChunkName: "message" */ "../views/message/UserMessage.vue"
              ),
            props: true,
          },
          {
            path: "/home/message/group/:chatId",
            name: "MessageGroup",
            component: () =>
              import(
                /* webpackChunkName: "message" */ "../views/message/GroupMessage.vue"
              ),
            props: true,
          },
        ],
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
            path: "/home/cantact/group/:groupId",
            name: "CantactGroup",
            component: () =>
              import(
                /* webpackChunkName: "cantact" */ "../views/cantact/Group.vue"
              ),
            props: true,
          },
        ],
      },
      {
        path: "/home/find",
        name: "Find",
        component: () =>
          import(/* webpackChunkName: "find" */ "../views/find/Find.vue"),
        children: [
          {
            path: "/home/find/user/:userId",
            name: "FindUser",
            component: () =>
              import(/* webpackChunkName: "find" */ "../views/find/User.vue"),
            props: true,
          },
          {
            path: "/home/find/group/:groupId",
            name: "FindGroup",
            component: () =>
              import(/* webpackChunkName: "find" */ "../views/find/Group.vue"),
            props: true,
          },
        ],
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
