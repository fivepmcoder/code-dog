/**
 * 代码库列表文档：https://docs.github.com/zh/enterprise-server@3.4/rest/repos/repos#list-organization-repositories
 */

import type { RepoList } from "@/definition/git/repo";

/**
 * 代码库列表请求
 */
export interface GithubRepoListRequest {
    // 组织名称，路径参数
    org: string;
    // 页码
    page: number;
    // 每页大小
    per_page: number;
    // 代码库类型：all，public，private，forks，sources，member，internal
    type?: string;
    // 排序字段：created，updated，pushed，full_name
    sort?: string;
    // 排序方式：asc，desc
    direction?: string;
}

/**
 * 代码库列表响应
 */
export interface GithubRepoListResponse {
    // 代码库id
    id: number;
    // 代码库名称
    name: string;
    // 代码库完整名称
    full_name: string;
    // 代码库描述
    description: string;
    // 代码库所有者信息
    owner: {
        // 代码库所有者头像地址
        avatar_url: string;
    };
    // 页面访问时的url
    html_url: string;
    // 最后活跃时间
    pushed_at: string;
}

/**
 * 代码库列表响应转换
 * @param repo github代码库列表响应
 * @returns 代码库列表
 */
export const transformGithubRepoList = (repo: GithubRepoListResponse): RepoList => {
    return {
        id: repo.id.toString(),
        name: repo.name,
        description: repo.description,
        avatarUrl: repo.owner.avatar_url,
        fullName: repo.full_name,
        webUrl: repo.html_url,
        lastActivityTime: repo.pushed_at
    };
};
