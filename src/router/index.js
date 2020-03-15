import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/UserLayout.vue"),
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
    path: "/",
    name: "Home",
    component: Home,
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
