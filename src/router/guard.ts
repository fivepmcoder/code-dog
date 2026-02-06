import { useConfigStore } from "@/store/config";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

/**
 * 路由前置守卫
 */
export const beforGuard = (
    to: RouteLocationNormalized,
    _form: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const useConfig = useConfigStore();
    if (!useConfig.getGitConfig.token && to.path != "/config") {
        next("/config");
        return;
    }
    next();
};
