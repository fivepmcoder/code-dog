import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env: ImportMetaEnv = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            }
        },
        server: {
            host: env.VITE_HOST || "localhost",
            port: env.VITE_PORT || 8000,
            open: false,
            cors: true,
            strictPort: false,
            proxy: {
                "/api/codeup": {
                    target: "https://openapi-rdc.aliyuncs.com",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/codeup/, "")
                }
            }
        },
        build: {
            target: "modules",
            outDir: "dist",
            assetsDir: "assets"
        }
    };
});
