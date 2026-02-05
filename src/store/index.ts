import { createPinia } from "pinia";
import type { App } from "vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const store = createPinia();

export const registerStore = (app: App) => {
    store.use(piniaPluginPersistedstate);
    app.use(store);
};
