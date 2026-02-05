import { createApp } from "vue";
import App from "@/app.vue";
import "@/assets/app.css";
import { registerRouter } from "@/router";
import { registerStore } from "@/store";

async function bootstrap() {
    const app = createApp(App);

    registerRouter(app);
    registerStore(app);

    app.mount("#app");
}

bootstrap();
