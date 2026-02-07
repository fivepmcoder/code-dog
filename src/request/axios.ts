import type { CreateRequestConfig, RequestConfig, RequestError } from "@/definition/request";
import axios, {
    type InternalAxiosRequestConfig,
    type AxiosResponse,
    AxiosError,
    type AxiosInstance
} from "axios";

/**
 * 创建 Axios 实例
 */
export const createAxiosInstance = (config: CreateRequestConfig): AxiosInstance => {
    const {
        baseURL,
        // tokenHeader = "Authorization",
        contentType = "application/json",
        debug = false,
        onShowLoading,
        onRequest,
        onSuccess,
        onError,
        ...otherConfig
    } = config;

    const instance = axios.create({
        ...(baseURL && { baseURL }),
        timeout: 30000,
        headers: {
            "Content-Type": contentType
        },
        ...otherConfig
    });

    // 停止 Loading
    const stopLoading = (requestConfig: RequestConfig | undefined) => {
        if (requestConfig && requestConfig.showLoading !== false && onShowLoading) {
            onShowLoading(false, requestConfig);
        }
    };

    // 请求拦截器
    instance.interceptors.request.use(async (axiosConfig: InternalAxiosRequestConfig) => {
        const requestConfig = axiosConfig as RequestConfig;

        // Loading 开始
        if (requestConfig.showLoading !== false && onShowLoading) {
            onShowLoading(true, requestConfig);
        }

        // 调用请求钩子
        let finalConfig = requestConfig;
        if (onRequest) {
            try {
                finalConfig = await onRequest(requestConfig);
            } catch (error) {
                if (debug) {
                    console.error("[Request] onRequest hook error:", error);
                }
            }
        }

        if (debug) {
            console.log("[Request]", {
                method: finalConfig.method && finalConfig.method.toUpperCase(),
                url: finalConfig.url,
                data: finalConfig.data as unknown
            });
        }

        return finalConfig;
    });

    // 响应拦截器
    instance.interceptors.response.use(
        async (response: AxiosResponse) => {
            const requestConfig = response.config as RequestConfig;

            // Loading 结束
            stopLoading(requestConfig);

            // 调用成功钩子
            if (onSuccess) {
                try {
                    await onSuccess(response, requestConfig);
                } catch (error) {
                    if (debug) {
                        console.error("[Response] onSuccess hook error:", error);
                    }
                }
            }

            if (debug) {
                console.log("[Response]", {
                    status: response.status,
                    data: response.data as unknown
                });
            }

            return response;
        },
        async (error: AxiosError) => {
            const requestConfig = error.config as RequestConfig | undefined;

            // Loading 结束
            stopLoading(requestConfig);

            // 标准化错误
            const requestError: RequestError = {
                code: error.code || "UNKNOWN_ERROR",
                message: error.message || "请求失败",
                originalError: error
            };
            if (error.response) {
                requestError.status = error.response.status;
                requestError.data = error.response.data;
            }

            // 错误提示
            if (error.response) {
                const { status } = error.response;
                const errorMessages: Record<number, string> = {
                    400: "请求参数错误",
                    401: "未授权，请重新登录",
                    403: "拒绝访问",
                    404: "请求的资源不存在",
                    408: "请求超时",
                    500: "服务器内部错误",
                    502: "网关错误",
                    503: "服务不可用",
                    504: "网关超时"
                };
                requestError.message = errorMessages[status] || requestError.message;
            } else if (error.code === "ECONNABORTED") {
                requestError.message = "请求超时";
            } else if (error.code === "ERR_NETWORK") {
                requestError.message = "网络连接失败";
            }

            // 调用错误钩子
            if (onError) {
                try {
                    await onError(requestError, requestConfig);
                } catch (hookError) {
                    if (debug) {
                        console.error("[Error] onError hook error:", hookError);
                    }
                }
            }

            if (debug) {
                console.error("[Error]", {
                    url: error.config && error.config.url,
                    status: error.response && error.response.status,
                    message: requestError.message
                });
            }

            return Promise.reject(requestError);
        }
    );

    return instance;
};
