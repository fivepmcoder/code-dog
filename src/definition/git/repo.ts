/**
 * 代码库列表
 */
export interface RepoList {
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
