import type { CodeService } from "@/api/git/service";
import type { RepoListRequest, RepoListResponse } from "@/definition/git/repo";
import { useConfigStore } from "@/store/config";

/**
 * Codeup 服务
 */
export default class CodeupService implements CodeService {
    // codeup 的 api 基础地址
    private baseUrl: string;

    // codeup 的 api 认证 token
    private token: string;

    constructor() {
        const useConfig = useConfigStore();
        this.baseUrl = useConfig.getGitConfig.endpoint || "https://openapi-rdc.aliyuncs.com";
        this.token = useConfig.getGitConfig.token;
    }

    /**
     * 代码库列表
     * @param data 代码库列表请求
     * @returns 代码库列表
     */
    async repoList(data: RepoListRequest): Promise<RepoListResponse[]> {
        return [];
    }

    /**
     * 代码库详情
     * @returns 代码库详情
     */
    async repoDetail(): Promise<unknown> {
        return {};
    }

    /**
     * 代码库分支列表
     * @returns 代码库分支列表
     */
    async repoBranchList(): Promise<unknown> {
        return [];
    }

    /**
     * 代码库成员列表
     * @returns 代码库成员列表
     */
    async repoMemberList(): Promise<unknown> {
        return [];
    }

    /**
     * 代码库成员详情
     * @returns 代码库成员详情
     */
    async repoMemberDetail(): Promise<unknown> {
        return {};
    }

    /**
     * 代码库提交列表
     * @returns 代码库提交列表
     */
    async repoCommitList(): Promise<unknown> {
        return [];
    }
}
