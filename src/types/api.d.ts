// 后端标准返回格式
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}
