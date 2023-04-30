import { createRouter, createWebHashHistory } from "vue-router";
import LayoutView from "@/views/Layout.vue";
import { useLoginStore } from "@/stores/loginStore";

const routes = [
  {
    meta: {
      title: "首页",
    },
    path: "/",
    name: "home",
    component: LayoutView,
    redirect: "/welcome",
    children: [
      {
        meta: {
          title: "欢迎页",
        },
        path: "/welcome",
        name: "welcome",
        component: () => import("@/views/Welcome.vue"),
      },
      {
        meta: {
          title: "用户管理",
        },
        path: "/users",
        name: "users",
        component: () => import("@/views/Users.vue"),
      },
      {
        meta: {
          title: "视频管理",
        },
        path: "/videos",
        name: "videos",
        component: () => import("@/views/Videos.vue"),
      },
      {
        meta: {
          title: "bgm管理",
        },
        path: "/bgms",
        name: "bgms",
        component: () => import("@/views/Bgms.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录页",
      requireAuth: false,
    },
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    meta: {
      title: "404 not found",
      requireAuth: false,
    },
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();
  if (to.meta.requireAuth !== false) {
    // 需要登录
    const loginStore = useLoginStore();
    
    if (!loginStore.token) {
      // 未登录
      next({
        path: "/login",
      });
    } else {
      //已登录
      next();
    }
  } else {
    // 不需要登录
    next();
  }
});

export default router;
