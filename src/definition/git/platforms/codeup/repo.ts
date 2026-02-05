/**
 * 代码库列表文档：https://api.aliyun.com/document/devops/2021-06-25/ListRepositories
 */

import type { RepoListResponse } from "@/definition/git/repo";

/**
 * 代码库列表请求
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
 * 代码库列表响应
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
}

/**
 * 代码库列表响应转换
 * @param repo codeup代码库列表响应
 * @returns 代码库列表
 */
export const transformCodeupRepoList = (repo: CodeupRepoListResponse): RepoListResponse => {
    return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        avatarUrl: repo.avatarUrl,
        fullName: repo.nameWithNamespace,
        webUrl: repo.webUrl,
        lastActivityTime: repo.lastActivityAt
    };
};
