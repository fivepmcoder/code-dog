import type { Router } from "vue-router";
import { useConfigStore } from "@/stores/config";

export function setupRouterGuards(router: Router) {
    router.beforeEach((to, from, next) => {
        const configStore = useConfigStore();

        document.title = `${to.meta.title || "Codeup Insight"} - Codeup Insight`;

        if (to.path === from.path && to.name === from.name) {
            return next(false);
        }

        if (to.meta.requiresAuth && !configStore.isConfigured) {
            return next({ name: "ConfigCenter" });
        }

        next();
    });

    router.onError((error) => {
        console.error("路由错误:", error);
    });
}
