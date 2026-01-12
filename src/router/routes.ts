import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/config-center"
    },
    {
        path: "/config-center",
        name: "ConfigCenter",
        component: () => import("@/pages/config-center/index.vue"),
        meta: {
            title: "配置中心",
            requiresAuth: false
        }
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        meta: {
            title: "全局仪表盘",
            requiresAuth: true
        }
    },
    {
        path: "/repo/:id",
        name: "RepoDetail",
        component: () => import("@/pages/repo-detail/index.vue"),
        meta: {
            title: "仓库详情",
            requiresAuth: true
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        redirect: "/config-center"
    }
];

export default routes;
