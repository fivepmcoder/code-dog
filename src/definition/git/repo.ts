/**
 * 代码库列表请求
 */
export interface RepoListRequest {
    // 页码
    page: number;
    // 每页大小
    size: number;
    // 排序字段
    orderBy?: string;
    // 排序方式
    sort?: string;
}

/**
 * 代码库列表响应
 */
export interface RepoListResponse {
    // 代码库id
    id: string;
    // 代码库名称
    name: string;
    // 代码库描述
    description: string;
    // 头像地址
    avatarUrl: string;
    // 代码库完整名称
    fullName: string;
    // 页面访问的url
    webUrl: string;
    // 最后活跃时间
    lastActivityTime: string;
}
