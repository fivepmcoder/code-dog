<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0B]">
        <header
            class="bg-white dark:bg-[#1E1E21] shadow-sm border-b border-gray-200 dark:border-gray-800"
        >
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate">
                            Codeup Insight
                        </h1>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                            团队代码贡献分析仪表盘
                        </p>
                    </div>
                    <div class="flex items-center space-x-4 flex-shrink-0 ml-4">
                        <theme-toggle />
                        <button
                            class="btn btn-secondary whitespace-nowrap"
                            @click="handleRefresh"
                            :disabled="loading"
                        >
                            {{ loading ? "加载中..." : "刷新数据" }}
                        </button>
                        <button class="btn btn-primary whitespace-nowrap" @click="goToConfig">
                            配置中心
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-8">
            <div v-if="loading && !dataStore.repositories.length" class="py-20">
                <loading-spinner :size="60" text="正在加载仓库数据..." container-class="py-20" />
            </div>

            <div v-else-if="errorMessage" class="card max-w-2xl mx-auto text-center py-12">
                <div class="text-red-500 dark:text-red-400 mb-4">
                    <svg
                        class="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">加载失败</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6 break-words px-4">
                    {{ errorMessage }}
                </p>
                <button class="btn btn-primary" @click="handleRefresh">重试</button>
            </div>

            <div v-else-if="dataStore.repositories.length > 0">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <metric-card
                        title="总仓库数"
                        :value="dataStore.repositories.length"
                        description="已分析的代码仓库"
                        :icon="FolderIcon"
                        icon-bg-class="bg-blue-100 dark:bg-blue-900/30"
                        icon-color-class="text-blue-600 dark:text-blue-400"
                    />
                    <metric-card
                        title="活跃贡献者"
                        :value="totalContributors"
                        description="参与代码提交的开发者"
                        :icon="UsersIcon"
                        icon-bg-class="bg-green-100 dark:bg-green-900/30"
                        icon-color-class="text-green-600 dark:text-green-400"
                    />
                    <metric-card
                        title="总提交数"
                        :value="totalCommits"
                        description="所有仓库的提交总数"
                        :icon="CodeBracketIcon"
                        icon-bg-class="bg-purple-100 dark:bg-purple-900/30"
                        icon-color-class="text-purple-600 dark:text-purple-400"
                    />
                </div>

                <div class="mb-8">
                    <div
                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                    >
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">代码仓库</h2>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <select v-model="statusFilter" class="input w-full sm:w-40">
                                <option value="all">全部状态</option>
                                <option value="analyzed">已分析</option>
                                <option value="not-analyzed">未分析</option>
                            </select>
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="搜索仓库..."
                                class="input w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            v-for="repo in filteredRepositories"
                            :key="repo.id"
                            class="card cursor-pointer hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 transition-all"
                            @click="goToRepoDetail(repo.id)"
                        >
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate"
                                        :title="repo.name"
                                    >
                                        {{ repo.name }}
                                    </h3>
                                    <p
                                        class="text-sm text-gray-500 dark:text-gray-400 truncate"
                                        :title="repo.pathWithNamespace"
                                    >
                                        {{ repo.pathWithNamespace }}
                                    </p>
                                </div>
                                <span class="badge badge-primary flex-shrink-0 ml-2">{{
                                    getRepoStatus(repo)
                                }}</span>
                            </div>

                            <p
                                v-if="repo.description"
                                class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 break-words"
                                :title="repo.description"
                            >
                                {{ repo.description }}
                            </p>

                            <div
                                class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700"
                            >
                                <span
                                    class="truncate"
                                    :title="`最后活跃：${formatDate(repo.lastActivityAt)}`"
                                >
                                    最后活跃：{{ formatDate(repo.lastActivityAt) }}
                                </span>
                                <button
                                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex-shrink-0 ml-2"
                                    @click.stop="analyzeRepository(repo)"
                                >
                                    分析 →
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredRepositories.length === 0" class="card text-center py-12">
                        <p class="text-gray-500 dark:text-gray-400">未找到匹配的仓库</p>
                    </div>
                </div>

                <div
                    v-if="pagination"
                    class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                    <p>
                        第 {{ pagination["x-page"] }} / {{ pagination["x-total-pages"] }} 页， 共
                        {{ pagination["x-total"] }} 个仓库
                    </p>
                </div>
            </div>

            <div v-else class="card max-w-2xl mx-auto text-center py-12">
                <div class="text-gray-400 dark:text-gray-500 mb-4">
                    <svg
                        class="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    暂无仓库数据
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">请先加载仓库列表</p>
                <button class="btn btn-primary" @click="handleRefresh">加载仓库</button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDataStore } from "@/stores/data";
import { useCodeup } from "@/composables/use-codeup";
import { useToast } from "@/composables/use-toast";
import LoadingSpinner from "@/components/loading-spinner/index.vue";
import MetricCard from "@/components/metric-card/index.vue";
import ThemeToggle from "@/components/theme-toggle/index.vue";
import dayjs from "dayjs";
import type { Repository, PaginationHeaders } from "@/types/codeup";
import { FolderIcon, UsersIcon, CodeBracketIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const dataStore = useDataStore();
const codeup = useCodeup();
const toast = useToast();

const loading = ref(false);
const errorMessage = ref<string | null>(null);
const searchQuery = ref("");
const statusFilter = ref<"all" | "analyzed" | "not-analyzed">("all");
const pagination = ref<PaginationHeaders | null>(null);

const filteredRepositories = computed(() => {
    let result = dataStore.repositories;

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (repo) =>
                repo.name.toLowerCase().includes(query) ||
                repo.pathWithNamespace.toLowerCase().includes(query) ||
                repo.description?.toLowerCase().includes(query)
        );
    }

    return result;
});

const totalContributors = computed(() => 0);
const totalCommits = computed(() => 0);

async function handleRefresh(): Promise<void> {
    loading.value = true;
    errorMessage.value = null;

    try {
        const { data, pagination: paginationData } = await codeup.listRepositories({
            page: 1,
            perPage: 50,
            orderBy: "last_activity_at",
            sort: "desc"
        });

        dataStore.setRepositories(data);
        pagination.value = paginationData;

        if (data.length === 0) {
            toast.info("当前组织下没有代码库");
        } else {
            toast.success(`成功加载 ${data.length} 个代码库`);
        }
    } catch (error: any) {
        const errMsg = error.message || codeup.error.value || "加载仓库列表失败";
        errorMessage.value = errMsg;
        toast.error(errMsg);
    } finally {
        loading.value = false;
    }
}

function goToConfig(): void {
    router.push("/config-center");
}

function goToRepoDetail(repoId: number): void {
    router.push(`/repo/${repoId}`);
}

function analyzeRepository(repo: Repository): void {
    goToRepoDetail(repo.id);
}

function getRepoStatus(repo: Repository): string {
    return "未分析";
}

function formatDate(date: string): string {
    if (!date) return "未知";
    return dayjs(date).format("YYYY-MM-DD");
}

onMounted(async () => {
    if (dataStore.repositories.length === 0) {
        await handleRefresh();
    }
});
</script>
