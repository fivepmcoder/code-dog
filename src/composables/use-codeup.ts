import { ref } from "vue";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { useConfigStore } from "@/stores/config";
import type {
    Repository,
    Branch,
    Commit,
    CommitDetail,
    CommitDiff,
    ListRepositoriesParams,
    ListBranchesParams,
    ListCommitsParams,
    GetCommitParams,
    GetCommitDiffParams,
    PaginationHeaders,
    CommitStats,
    DiffFile
} from "@/types/codeup";

export function useCodeup() {
    const configStore = useConfigStore();

    const loading = ref(false);
    const error = ref<string | null>(null);

    function createClient(): AxiosInstance {
        const { accessKeyId } = configStore.codeupConfig;
        const baseURL = import.meta.env.DEV ? "/api/codeup" : "https://openapi-rdc.aliyuncs.com";

        return axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                "x-yunxiao-token": accessKeyId
            }
        });
    }

    function extractPaginationInfo(response: AxiosResponse): PaginationHeaders | null {
        const headers = response.headers;
        if (!headers) return null;

        return {
            "x-page": headers["x-page"] || "1",
            "x-per-page": headers["x-per-page"] || "20",
            "x-total": headers["x-total"] || "0",
            "x-total-pages": headers["x-total-pages"] || "1",
            "x-next-page": headers["x-next-page"],
            "x-prev-page": headers["x-prev-page"],
            "x-request-id": headers["x-request-id"] || ""
        };
    }

    async function listRepositories(
        params: ListRepositoriesParams = {}
    ): Promise<{ data: Repository[]; pagination: PaginationHeaders | null }> {
        loading.value = true;
        error.value = null;

        try {
            const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_REAL_API !== "true";

            if (useMock) {
                const { generateMockRepositories } = await import("@/mock/data");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return {
                    data: generateMockRepositories(6),
                    pagination: null
                };
            }

            const client = createClient();
            const { organizationId } = configStore.codeupConfig;

            const response = await client.get<Repository[]>(
                `/oapi/v1/codeup/organizations/${organizationId}/repositories`,
                {
                    params: {
                        page: params.page || 1,
                        perPage: params.perPage || 20,
                        orderBy: params.orderBy || "created_at",
                        sort: params.sort || "desc",
                        search: params.search,
                        archived: params.archived
                    }
                }
            );

            const repositories = Array.isArray(response.data) ? response.data : [];
            const pagination = extractPaginationInfo(response);

            return { data: repositories, pagination };
        } catch (err: any) {
            error.value =
                err.response?.data?.errorMessage ||
                err.response?.data?.message ||
                err.message ||
                "获取仓库列表失败";
            return { data: [], pagination: null };
        } finally {
            loading.value = false;
        }
    }

    async function listBranches(
        repositoryId: number | string,
        params: ListBranchesParams = {}
    ): Promise<{ data: Branch[]; pagination: PaginationHeaders | null }> {
        loading.value = true;
        error.value = null;

        try {
            const client = createClient();
            const { organizationId } = configStore.codeupConfig;

            const response = await client.get<Branch[]>(
                `/oapi/v1/codeup/organizations/${organizationId}/repositories/${repositoryId}/branches`,
                {
                    params: {
                        page: params.page || 1,
                        perPage: params.perPage || 20,
                        sort: params.sort,
                        search: params.search
                    }
                }
            );

            const branches = Array.isArray(response.data) ? response.data : [];
            const pagination = extractPaginationInfo(response);

            return { data: branches, pagination };
        } catch (err: any) {
            error.value = err.response?.data?.errorMessage || err.message || "获取分支列表失败";
            return { data: [], pagination: null };
        } finally {
            loading.value = false;
        }
    }

    async function listCommits(
        params: ListCommitsParams
    ): Promise<{ data: Commit[]; pagination: PaginationHeaders | null }> {
        loading.value = true;
        error.value = null;

        try {
            const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_REAL_API !== "true";

            if (useMock) {
                const { generateMockCommits } = await import("@/mock/data");
                await new Promise((resolve) => setTimeout(resolve, 800));
                return {
                    data: generateMockCommits(50),
                    pagination: null
                };
            }

            const client = createClient();
            const { organizationId } = configStore.codeupConfig;

            const response = await client.get<Commit[]>(
                `/oapi/v1/codeup/organizations/${organizationId}/repositories/${params.repositoryId}/commits`,
                {
                    params: {
                        refName: params.refName || "master",
                        since: params.since,
                        until: params.until,
                        page: params.page || 1,
                        perPage: params.perPage || 100,
                        path: params.path,
                        search: params.search,
                        showSignature: params.showSignature,
                        committerIds: params.committerIds
                    }
                }
            );

            const commits = Array.isArray(response.data) ? response.data : [];
            const pagination = extractPaginationInfo(response);

            return { data: commits, pagination };
        } catch (err: any) {
            error.value = err.response?.data?.errorMessage || err.message || "获取提交记录失败";
            return { data: [], pagination: null };
        } finally {
            loading.value = false;
        }
    }

    async function getCommit(params: GetCommitParams): Promise<CommitDetail | null> {
        try {
            const client = createClient();

            const response = await client.get<CommitDetail>(
                `/oapi/v1/codeup/organizations/${params.organizationId}/repositories/${params.repositoryId}/commits/${params.sha}`
            );

            return response.data;
        } catch (err: any) {
            return null;
        }
    }

    async function getCommitDiff(params: GetCommitDiffParams): Promise<CommitDiff | null> {
        loading.value = true;
        error.value = null;

        try {
            const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_REAL_API !== "true";

            if (useMock) {
                const { generateMockCommits, generateMockDiffs } = await import("@/mock/data");
                const mockCommits = generateMockCommits(1);
                const mockDiffs = generateMockDiffs(mockCommits);
                await new Promise((resolve) => setTimeout(resolve, 500));
                return mockDiffs[0] || null;
            }

            const commitData = await getCommit(params);
            if (!commitData) return null;

            return {
                commit: commitData,
                stats: commitData.stats || {
                    additions: 0,
                    deletions: 0,
                    total: 0
                }
            };
        } catch (err: any) {
            error.value = err.response?.data?.errorMessage || err.message || "获取提交差异失败";
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function getCompares(params: {
        repositoryId: number | string;
        from: string;
        to: string;
        sourceType?: "branch" | "tag";
        targetType?: "branch" | "tag";
        straight?: boolean;
    }): Promise<{
        commits: CommitDetail[];
        diffs: DiffFile[];
    } | null> {
        loading.value = true;
        error.value = null;
        try {
            const client = createClient();
            const { organizationId } = configStore.codeupConfig;
            const response = await client.get(
                `/oapi/v1/codeup/organizations/${organizationId}/repositories/${params.repositoryId}/compares`,
                {
                    params: {
                        from: params.from,
                        to: params.to,
                        sourceType: params.sourceType,
                        targetType: params.targetType,
                        straight: params.straight ?? false
                    }
                }
            );
            return {
                commits: response.data.commits || [],
                diffs: response.data.diffs || []
            };
        } catch (err: any) {
            error.value = err.response?.data?.errorMessage || err.message || "获取差异失败";
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function batchGetCommitDiffs(
        repositoryId: number | string,
        commits: Commit[]
    ): Promise<CommitDiff[]> {
        if (commits.length === 0) return [];
        const results: CommitDiff[] = [];
        for (let i = 0; i < commits.length; i++) {
            const commit = commits[i];
            if (!commit) continue;
            try {
                if (commit.parentIds && commit.parentIds.length > 0) {
                    const parentSha = commit.parentIds?.[0] || "";

                    const compareResult = await getCompares({
                        repositoryId,
                        from: parentSha,
                        to: commit.id
                    });
                    if (compareResult && compareResult.diffs) {
                        const commitDetail = compareResult.commits.find(
                            (c) => c.id === commit.id
                        ) || {
                            ...commit,
                            stats: {
                                additions: compareResult.diffs.reduce((sum, d) => {
                                    const matches = d.diff?.match(/^\+[^+]/gm);
                                    return sum + (matches?.length || 0);
                                }, 0),
                                deletions: compareResult.diffs.reduce((sum, d) => {
                                    const matches = d.diff?.match(/^-[^-]/gm);
                                    return sum + (matches?.length || 0);
                                }, 0),
                                total: 0
                            }
                        };
                        if (commitDetail.stats) {
                            commitDetail.stats.total =
                                commitDetail.stats.additions + commitDetail.stats.deletions;
                        }
                        results.push({
                            commit: commitDetail as CommitDetail,
                            stats: commitDetail.stats || { additions: 0, deletions: 0, total: 0 },
                            diffs: compareResult.diffs
                        });
                    } else {
                        results.push(createDefaultCommitDiff(commit));
                    }
                } else {
                    results.push(createDefaultCommitDiff(commit));
                }
                if (i < commits.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 300));
                }
            } catch (err) {
                results.push(createDefaultCommitDiff(commit));
            }
        }
        return results;
    }

    function createDefaultCommitDiff(commit: Commit): CommitDiff {
        const defaultStats: CommitStats = {
            additions: 0,
            deletions: 0,
            total: 0
        };

        const commitDetail: CommitDetail = {
            ...commit,
            stats: defaultStats
        };

        return {
            commit: commitDetail,
            stats: defaultStats
        };
    }

    async function testConnection(): Promise<boolean> {
        loading.value = true;
        error.value = null;

        try {
            const client = createClient();
            const { organizationId } = configStore.codeupConfig;

            await client.get(`/oapi/v1/codeup/organizations/${organizationId}/repositories`, {
                params: {
                    page: 1,
                    perPage: 1
                }
            });

            return true;
        } catch (err: any) {
            error.value =
                err.response?.data?.errorMessage ||
                err.response?.data?.message ||
                err.message ||
                "连接测试失败";
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        listRepositories,
        listBranches,
        listCommits,
        getCommit,
        getCommitDiff,
        batchGetCommitDiffs,
        testConnection
    };
}
