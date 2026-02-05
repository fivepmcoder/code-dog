import type { CodeService } from "@/api/git/service";
import type { RepoList } from "@/definition/git/repo";

/**
 * Codeup 服务
 */
class CodeupService implements CodeService {
    /**
     * 代码库列表
     * @returns 代码库列表
     */
    async repoList(): Promise<RepoList[]> {
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
