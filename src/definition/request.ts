import type { Toast } from "@/definition/store";
import type {
    AxiosError,
    AxiosResponse,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from "axios";

/**
 * 扩展请求配置
 * 可以在每次请求中配置
 */
export interface RequestConfig extends InternalAxiosRequestConfig {
    // 是否跳过授权认证
    skipAuth?: boolean;

    // 是否展示 Loading 状态
    showLoading?: boolean;

    // Loading 文本
    loadingText?: string;

    // 是否展示 toast 消息
    showToast?: boolean;

    // toast 消息
    toastMessage?: string;

    // toast 类型
    toastType?: Toast["type"];

    // toast 持续时间
    toastDuration?: number;

    // 自定义 toast 标题
    toastTitle?: string;
}

/**
 * 通用响应结构
 */
export interface ApiResponse<T = unknown> {
    // 业务状态码
    code: number;
    // 提示信息
    message: string;
    // 返回数据
    data?: T;
}

/**
 * 标准化错误结构
 */
export interface RequestError {
    // 错误码
    code: number | string;
    // 错误信息
    message: string;
    // 状态码
    status?: number;
    // 响应数据
    data?: unknown;
    // 原始 Axios 错误
    originalError?: AxiosError;
}

/**
 * 请求实例
 */
export interface RequestInstance {
    /**
     * 通用请求方法
     */
    <T = unknown>(config: RequestConfig): Promise<AxiosResponse<T>>;

    /**
     * get 请求
     */
    get<T = unknown>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>>;

    /**
     * post 请求
     */
    post<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<AxiosResponse<T>>;

    /**
     * put 请求
     */
    put<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<AxiosResponse<T>>;

    /**
     * delete 请求
     */
    delete<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<AxiosResponse<T>>;
}

/**
 * 创建请求配置
 * 用于初始化请求实例的全局配置
 */
export interface CreateRequestConfig extends CreateAxiosDefaults {
    // 默认Authorization头值
    tokenHeader?: string;

    // 默认application/json
    contentType?: string;

    // 调试模式
    debug?: boolean;

    // Loading 状态显示/隐藏的回调钩子
    onShowLoading?(loading: boolean, config?: RequestConfig): void;

    // 请求发送前的拦截钩子
    onRequest?(config?: RequestConfig): RequestConfig | Promise<RequestConfig>;

    // 响应成功后的回调钩子
    onSuccess?(response: AxiosResponse, config?: RequestConfig): void | Promise<void>;

    // 响应失败的回调钩子
    onError?(error: RequestError, config?: RequestConfig): void | Promise<void>;
}
