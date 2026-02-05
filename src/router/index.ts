import routes from "@/router/routes";
import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes
});

export const registerRouter = (app: App) => {
    app.use(router);
};
