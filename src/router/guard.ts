import { configStore } from "@/store/config";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

/**
 * 路由前置守卫
 */
export const beforGuard = (
    to: RouteLocationNormalized,
    _form: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const config = configStore();
    if (!config.getGitConfig.token && to.path != "/config" && to.path != "/test") {
        next("/config");
        return;
    }
    next();
};
