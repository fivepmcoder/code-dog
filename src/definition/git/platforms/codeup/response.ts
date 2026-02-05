/**
 * 云效响应
 */
export interface CodeupResponse {
    // 请求id
    requestId: string;
    // 错误信息
    errorMessage: string;
    // 总数量
    total: number;
    // 调用是否成功
    success: boolean;
    // 错误码
    errCode: number;
    // 结果
    result: unknown;
}
