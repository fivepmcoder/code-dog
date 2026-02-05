/**
 * codeup响应
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

/**
 * codeup代码库列表请求
 */
export interface CodeupRepoListRequest {
    // 企业标识
    organizationId: string;
    // 访问令牌
    accessToken: string;
    // 页码
    page: number;
    // 每页大小
    perPage: number;
    // 排序字段：created_at，id，name，path，updated_at，last_activity_at
    orderBy?: string;
    // 排序方式：asc，desc
    sort?: string;
    // 搜索关键字
    search?: string;
}

/**
 * codeup代码库列表响应
 */
export interface CodeupRepoListResponse {
    // 代码库id
    id: string;
    // 代码库名称
    name: string;
    // 代码库描述
    description: string;
    // 头像地址
    avatarUrl: string;
    // 代码库完整名称
    nameWithNamespace: string;
    // 页面访问时的url
    webUrl: string;
    // 最后活跃时间
    lastActivityAt: string;
    // 代码库路径
    path: string;
}

/**
 * codeup代码库成员列表请求
 */
export interface CodeupMemberListRequest {
    // 代码库id
    repositoryId: string;
}

/**
 * codeup代码库成员列表响应
 */
export interface CodeupMemberListResponse {
    // 成员id
    id: number;
    // 用户名
    username: string;
    // 姓名
    name: string;
    // 邮箱
    email: string;
    // 头像地址
    avatarUrl: string;
}

/**
 * codeup分支列表请求
 */
export interface CodeupBranchListRequest {
    // 代码库id
    repositoryId: string;
    // 页码
    page: number;
    // 每页大小
    pageSize: number;
}

/**
 * codeup分支列表响应
 */
export interface CodeupBranchListResponse {
    // 分支名称
    name: string;
    // 分支最后一次提交信息
    commit: {
        // 提交id
        id: string;
        // 简短提交id
        shortId: string;
        // 提交标题
        title: string;
        // 提交内容
        message: string;
        // 作者姓名
        authorName: string;
        // 作者邮箱
        authorEmail: string;
        // 作者提交时间
        authoredDate: string;
        // 提交人姓名
        committerName: string;
        // 提交人邮箱
        committerEmail: string;
        // 提交时间
        committedDate: string;
    };
}
