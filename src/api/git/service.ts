import type { RepoListRequest, RepoListResponse } from "@/definition/git/repo";

/**
 * 代码服务接口
 */
export interface CodeService {
    /**
     * 代码库列表
     * @returns 代码库列表
     */
    repoList: (data: RepoListRequest) => Promise<RepoListResponse[]>;

    /**
     * 代码库详情
     * @returns 代码库详情
     */
    repoDetail: () => Promise<unknown>;

    /**
     * 代码库分支列表
     * @returns 代码库分支列表
     */
    repoBranchList: () => Promise<unknown>;

    /**
     * 代码库成员列表
     * @returns 代码库成员列表
     */
    repoMemberList: () => Promise<unknown>;

    /**
     * 代码库成员详情
     * @returns 代码库成员详情
     */
    repoMemberDetail: () => Promise<unknown>;

    /**
     * 代码库提交列表
     * @returns 代码库提交列表
     */
    repoCommitList: () => Promise<unknown>;
}
