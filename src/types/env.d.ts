/// <reference types="vite/client" />

// 声明 vite 环境变量的类型
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_HOST: string;
    readonly VITE_PORT: number;
    readonly VITE_API_BASE_URL: string;

    // Codeup Insight 特有的环境变量
    readonly VITE_USE_REAL_API: string;
    readonly VITE_CODEUP_ENDPOINT: string;
    readonly VITE_DEFAULT_LLM_ENDPOINT: string;
    readonly VITE_DEFAULT_LLM_MODEL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
