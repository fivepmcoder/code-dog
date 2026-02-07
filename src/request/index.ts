import type { RequestConfig, RequestError } from "@/definition/request";
import { createRequest } from "@/request/request";
import { loadingStore } from "@/store/loading";

/**
 * 请求服务
 */
const request = createRequest({
    baseURL: "",
    timeout: 30000,
    debug: import.meta.env.DEV,

    onShowLoading: (loading: boolean, config: RequestConfig) => {
        const loadingInstance = loadingStore();
        loadingInstance.setLoading(loading, config.loadingText || "Loading");
    },

    onError: (error: RequestError) => {
        console.error("Request failed:", error.message);
    }
});

export default request;
