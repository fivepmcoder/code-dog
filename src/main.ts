import { createApp } from "vue";
import App from "@/app.vue";
import store from "@/stores";
import router from "@/router";
import "@/assets/styles/index.css";
import { useConfigStore } from "@/stores/config";

async function bootstrap() {
    const app = createApp(App);

    app.use(store);
    app.use(router);

    app.mount("#app");

    const { useThemeStore } = await import("@/stores/theme");
    const themeStore = useThemeStore();
    const configStore = useConfigStore();
    configStore.loadFromStorage();
    themeStore.initTheme();
}

bootstrap();
