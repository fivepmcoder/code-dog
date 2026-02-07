import type { RouteRecordRaw } from "vue-router";

export default [
    {
        path: "/",
        component: () => import("@/layout/index.vue"),
        children: [
            {
                path: "",
                component: () => import("@/page/repository/index.vue")
            },
            {
                path: "config",
                component: () => import("@/page/config/index.vue")
            },
            {
                path: "member",
                component: () => import("@/page/member/index.vue")
            },
            {
                path: "test",
                component: () => import("@/page/test/index.vue")
            }
        ]
    }
] as RouteRecordRaw[];
