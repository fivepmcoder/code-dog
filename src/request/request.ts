import type { CreateRequestConfig, RequestConfig, RequestInstance } from "@/definition/request";
import { createAxiosInstance } from "@/request/axios";

/**
 * 创建请求服务
 */
export const createRequest = (config: CreateRequestConfig = {}): RequestInstance => {
    const instance = createAxiosInstance(config);

    /**
     * 通用请求方法
     */
    const request = <T = unknown>(requestConfig: RequestConfig) => {
        return instance<T>(requestConfig);
    };

    /**
     * GET 请求
     */
    request.get = <T = unknown>(url: string, config?: Partial<RequestConfig>) => {
        return request<T>({ method: "GET", ...config, url } as RequestConfig);
    };

    /**
     * POST 请求
     */
    request.post = <T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>) => {
        return request<T>({ method: "POST", ...config, url, data } as RequestConfig);
    };

    /**
     * PUT 请求
     */
    request.put = <T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>) => {
        return request<T>({ method: "PUT", ...config, url, data } as RequestConfig);
    };

    /**
     * DELETE 请求
     */
    request.delete = <T = unknown>(url: string, config?: Partial<RequestConfig>) => {
        return request<T>({ method: "DELETE", ...config, url } as RequestConfig);
    };

    return request as RequestInstance;
};
