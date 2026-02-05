import { createRequest } from "@/request/request";

/**
 * 请求服务
 */
const request = createRequest({
    baseURL: "",
    timeout: 30000,
    debug: import.meta.env.DEV,

    onShowLoading: (loading, config) => {
        console.log(`Loading: ${loading}`, config.url);
    },

    onError: (error) => {
        console.error("Request failed:", error.message);
    }
});

export default request;
