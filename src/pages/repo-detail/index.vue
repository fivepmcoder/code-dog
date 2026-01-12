<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0B]">
        <header
            class="bg-white dark:bg-[#1E1E21] shadow-sm border-b border-gray-200 dark:border-gray-800"
        >
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 min-w-0 flex-1">
                        <button
                            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex-shrink-0"
                            @click="goBack"
                        >
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div class="min-w-0 flex-1">
                            <h1
                                class="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate"
                                :title="repository?.name || '加载中...'"
                            >
                                {{ repository?.name || "加载中..." }}
                            </h1>
                            <p
                                class="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate"
                                :title="repository?.pathWithNamespace"
                            >
                                {{ repository?.pathWithNamespace }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-4 flex-shrink-0 ml-4">
                        <div class="flex items-center space-x-2">
                            <label class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0"
                                >分支：</label
                            >
                            <select
                                v-model="selectedBranch"
                                class="input w-48"
                                :disabled="loadingBranches || analyzing"
                            >
                                <option v-if="branches.length === 0" value="">加载中...</option>
                                <option
                                    v-for="branch in branches"
                                    :key="branch.name"
                                    :value="branch.name"
                                >
                                    {{ branch.name }}
                                    <span v-if="branch.defaultBranch">（默认）</span>
                                </option>
                            </select>
                        </div>

                        <theme-toggle />

                        <button
                            v-if="!analysis"
                            class="btn btn-primary whitespace-nowrap"
                            :disabled="analyzing"
                            @click="handleAnalyze"
                        >
                            {{ analyzing ? "分析中..." : "开始分析" }}
                        </button>
                        <button
                            v-else
                            class="btn btn-secondary whitespace-nowrap"
                            :disabled="analyzing"
                            @click="handleAnalyze"
                        >
                            {{ analyzing ? "重新分析中..." : "重新分析" }}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-6 py-8">
            <div v-if="!analyzing && !analysis" class="card mb-8">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">分析配置</h3>

                <div class="mb-4">
                    <label class="label mb-3">选择时间范围</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <button
                            class="btn transition-all"
                            :class="selectedQuickRange === 7 ? 'btn-primary' : 'btn-secondary'"
                            @click="selectQuickRange(7)"
                        >
                            <span class="text-sm">最近 7 天</span>
                        </button>
                        <button
                            class="btn transition-all"
                            :class="selectedQuickRange === 30 ? 'btn-primary' : 'btn-secondary'"
                            @click="selectQuickRange(30)"
                        >
                            <span class="text-sm">最近 1 个月</span>
                        </button>
                        <button
                            class="btn transition-all"
                            :class="selectedQuickRange === 90 ? 'btn-primary' : 'btn-secondary'"
                            @click="selectQuickRange(90)"
                        >
                            <span class="text-sm">最近 3 个月</span>
                        </button>
                        <button
                            class="btn transition-all"
                            :class="selectedQuickRange === 180 ? 'btn-primary' : 'btn-secondary'"
                            @click="selectQuickRange(180)"
                        >
                            <span class="text-sm">最近 6 个月</span>
                        </button>
                        <button
                            class="btn transition-all"
                            :class="selectedQuickRange === 365 ? 'btn-primary' : 'btn-secondary'"
                            @click="selectQuickRange(365)"
                        >
                            <span class="text-sm">最近 1 年</span>
                        </button>
                        <button
                            class="btn transition-all"
                            :class="
                                selectedQuickRange === 'custom' ? 'btn-primary' : 'btn-secondary'
                            "
                            @click="toggleCustomDate"
                        >
                            <span class="text-sm">自定义</span>
                        </button>
                    </div>
                </div>

                <transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="showCustomDate"
                        class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="label">开始日期</label>
                                <input
                                    v-model="dateRange.start"
                                    type="date"
                                    class="input"
                                    :min="minDate"
                                    :max="dateRange.end"
                                    @change="onCustomDateChange"
                                />
                            </div>
                            <div>
                                <label class="label">结束日期</label>
                                <input
                                    v-model="dateRange.end"
                                    type="date"
                                    class="input"
                                    :min="dateRange.start"
                                    :max="maxDate"
                                    @change="onCustomDateChange"
                                />
                            </div>
                        </div>
                    </div>
                </transition>

                <div
                    class="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                    <div class="flex items-center space-x-2">
                        <svg
                            class="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span class="text-sm text-blue-900 dark:text-blue-100">
                            将分析 <strong>{{ formatDate(dateRange.start) }}</strong> 至
                            <strong>{{ formatDate(dateRange.end) }}</strong
                            >， 共 <strong>{{ calculateDays }}</strong> 天的提交记录
                        </span>
                    </div>
                    <span
                        v-if="calculateDays > 180"
                        class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded"
                    >
                        较长时间范围
                    </span>
                </div>
            </div>

            <div v-if="analyzing" class="card mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        正在分析仓库...
                    </h3>
                    <span class="text-sm text-gray-600 dark:text-gray-300"
                        >{{ Math.round(analysisProgress) }}%</span
                    >
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        class="bg-primary-500 dark:bg-primary-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: analysisProgress + '%' }"
                    ></div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 break-words">
                    {{ analysisStepText }}
                </p>
            </div>

            <div v-if="analysisError" class="card mb-8 border-red-200 bg-red-50 dark:bg-red-900/10">
                <div class="flex items-start">
                    <svg
                        class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0"
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
                    <div class="ml-3 flex-1 min-w-0">
                        <h3 class="text-sm font-medium text-red-800 dark:text-red-400">分析失败</h3>
                        <p class="mt-1 text-sm text-red-700 dark:text-red-300 break-words">
                            {{ analysisError }}
                        </p>
                        <div class="mt-4">
                            <button class="btn btn-secondary" @click="handleAnalyze">重试</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="analysis && !analyzing">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <metric-card
                        title="贡献者"
                        :value="analysis.contributors.length"
                        description="参与开发的成员"
                        :icon="UsersIcon"
                        icon-bg-class="bg-blue-100 dark:bg-blue-900/30"
                        icon-color-class="text-blue-600 dark:text-blue-400"
                    />
                    <metric-card
                        title="总提交"
                        :value="analysis.commitRange.total"
                        description="代码提交次数"
                        :icon="CodeBracketIcon"
                        icon-bg-class="bg-green-100 dark:bg-green-900/30"
                        icon-color-class="text-green-600 dark:text-green-400"
                    />
                    <metric-card
                        title="时间跨度"
                        :value="dateRangeText"
                        description="分析时间范围"
                        :icon="ClockIcon"
                        icon-bg-class="bg-purple-100 dark:bg-purple-900/30"
                        icon-color-class="text-purple-600 dark:text-purple-400"
                    />
                    <metric-card
                        title="分析时间"
                        :value="formatAnalyzedTime"
                        description="最后分析时间"
                        :icon="DocumentChartBarIcon"
                        icon-bg-class="bg-orange-100 dark:bg-orange-900/30"
                        icon-color-class="text-orange-600 dark:text-orange-400"
                    />
                </div>

                <div class="mb-8">
                    <filter-bar
                        v-model="filters"
                        search-placeholder="搜索成员姓名或邮箱..."
                        :show-date-range="true"
                        :show-sort-by="true"
                        :show-min-commits="true"
                    />
                </div>

                <div class="mb-8">
                    <contribution-chart
                        title="成员贡献排行"
                        :data="contributionChartData"
                        :show-type-switch="true"
                        :height="350"
                    />
                </div>

                <div class="mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                            团队成员贡献
                            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                                （显示 {{ filterStats.filtered }} / {{ filterStats.total }} 位成员）
                            </span>
                        </h2>
                    </div>

                    <div
                        v-if="filteredContributors.length > 0"
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <user-card
                            v-for="contributor in filteredContributors"
                            :key="contributor.userId"
                            :user-name="contributor.userName"
                            :email="contributor.email"
                            :total-commits="contributor.totalCommits"
                            :total-files="contributor.totalFiles"
                            :directories-count="contributor.directories.length"
                            :main-modules="
                                analysis.functionProfiles[contributor.userId]?.mainModules
                            "
                            :summary="analysis.functionProfiles[contributor.userId]?.summary"
                            :time-range="contributor.activeTimeRange"
                            :badge="getContributorBadge(contributor)"
                            :badge-variant="getContributorBadgeVariant(contributor)"
                            @click="showContributorDetail(contributor)"
                        />
                    </div>

                    <div v-else class="card text-center py-12">
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
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            没有找到符合条件的成员
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                            尝试调整筛选条件或重置筛选器
                        </p>
                        <button class="btn btn-primary" @click="resetFilters">重置筛选</button>
                    </div>
                </div>
            </div>

            <div v-if="!analysis && !analyzing" class="card max-w-2xl mx-auto text-center py-12">
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">尚未分析</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                    选择分支和时间范围，然后点击"开始分析"按钮，使用 AI 分析团队成员的功能贡献
                </p>
                <button class="btn btn-primary" @click="handleAnalyze">开始分析</button>
            </div>
        </main>

        <drawer
            v-model="drawerVisible"
            blur-level="none"
            :title="selectedContributor?.userName || '成员详情'"
            :width="drawerWidth"
            :resizable="true"
            :min-width="600"
            :max-width="1800"
            :show-width-hint="true"
            @resize="handleDrawerResize"
        >
            <div v-if="selectedContributor" class="space-y-6">
                <div class="card">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        基本信息
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600 dark:text-gray-400 flex-shrink-0">邮箱</span>
                            <span
                                class="text-gray-900 dark:text-white font-medium truncate ml-4"
                                :title="selectedContributor.email"
                            >
                                {{ selectedContributor.email }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">总提交数</span>
                            <span class="text-gray-900 dark:text-white font-medium">
                                {{ selectedContributor.totalCommits }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">修改文件数</span>
                            <span class="text-gray-900 dark:text-white font-medium">
                                {{ selectedContributor.totalFiles }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">活跃目录数</span>
                            <span class="text-gray-900 dark:text-white font-medium">
                                {{ selectedContributor.directories.length }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="selectedProfile" class="card">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        AI 功能分析
                    </h3>
                    <p class="text-gray-700 dark:text-gray-200 mb-4 break-words">
                        {{ selectedProfile.summary }}
                    </p>
                    <div class="mb-4">
                        <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            主要模块
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            <function-tag
                                v-for="module in selectedProfile.mainModules"
                                :key="module"
                                :label="module"
                                variant="primary"
                            />
                        </div>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            技术栈
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            <function-tag
                                v-for="tech in selectedProfile.techStack"
                                :key="tech"
                                :label="tech"
                                variant="success"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid gap-6" :class="drawerLayoutClass">
                    <div class="card min-w-0">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                目录活跃度分析
                            </h3>
                            <div class="flex items-center space-x-2">
                                <label class="text-sm text-gray-600 dark:text-gray-400"
                                    >显示：</label
                                >
                                <select
                                    v-model.number="heatmapTopN"
                                    class="input w-20 text-sm py-1"
                                >
                                    <option :value="5">前 5</option>
                                    <option :value="10">前 10</option>
                                    <option :value="15">前 15</option>
                                    <option :value="20">前 20</option>
                                </select>
                            </div>
                        </div>
                        <heatmap-chart
                            :data="heatmapData"
                            :height="Math.max(300, heatmapTopN * 30)"
                        />
                    </div>

                    <div class="card min-w-0">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                高频修改文件
                            </h3>
                            <div class="flex items-center space-x-2">
                                <label class="text-sm text-gray-600 dark:text-gray-400"
                                    >显示：</label
                                >
                                <select
                                    v-model.number="topFilesCount"
                                    class="input w-20 text-sm py-1"
                                >
                                    <option :value="5">前 5</option>
                                    <option :value="10">前 10</option>
                                    <option :value="15">前 15</option>
                                    <option :value="20">前 20</option>
                                </select>
                            </div>
                        </div>
                        <div
                            class="space-y-2 overflow-y-auto"
                            :style="{ maxHeight: Math.max(300, heatmapTopN * 30) + 'px' }"
                        >
                            <div
                                v-for="(file, index) in selectedContributor.topFiles.slice(
                                    0,
                                    topFilesCount
                                )"
                                :key="file.path"
                                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                            >
                                <div class="flex items-center space-x-3 flex-1 min-w-0">
                                    <span
                                        class="text-sm font-bold text-gray-400 dark:text-gray-500 w-6 flex-shrink-0"
                                    >
                                        {{ index + 1 }}
                                    </span>
                                    <span
                                        class="text-sm text-gray-900 dark:text-gray-100 truncate"
                                        :title="file.path"
                                    >
                                        {{ file.path }}
                                    </span>
                                </div>
                                <span
                                    class="text-sm font-medium text-primary-600 dark:text-primary-400 flex-shrink-0 ml-2"
                                >
                                    {{ file.count }} 次
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore } from "@/stores/data";
import { useCodeup } from "@/composables/use-codeup";
import { useToast } from "@/composables/use-toast";
import { useAnalyzer } from "@/composables/use-analyzer";
import MetricCard from "@/components/metric-card/index.vue";
import UserCard from "@/components/user-card/index.vue";
import ThemeToggle from "@/components/theme-toggle/index.vue";
import Drawer from "@/components/drawer/index.vue";
import ContributionChart from "@/components/contribution-chart/index.vue";
import HeatmapChart from "@/components/heatmap-chart/index.vue";
import FunctionTag from "@/components/function-tag/index.vue";
import FilterBar from "@/components/filter-bar/index.vue";
import type { Filters } from "@/components/filter-bar/index.vue";
import dayjs from "dayjs";
import type { Branch } from "@/types/codeup";
import type { RepositoryAnalysis, UserContribution } from "@/types/analysis";
import {
    UsersIcon,
    CodeBracketIcon,
    ClockIcon,
    DocumentChartBarIcon
} from "@heroicons/vue/24/outline";
import { useConfirm } from "@/composables/use-confirm";

const route = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const codeup = useCodeup();
const toast = useToast();
const analyzer = useAnalyzer();
const confirm = useConfirm();

const heatmapTopN = ref(10);
const topFilesCount = ref(10);
const analyzing = ref(false);
const analysisError = ref<string | null>(null);
const analysisProgress = ref(0);
const analysisStepText = ref("准备分析...");
const drawerVisible = ref(false);
const selectedContributor = ref<UserContribution | null>(null);
const currentAnalysis = ref<RepositoryAnalysis | null>(null);

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>("");
const loadingBranches = ref(false);

const dateRange = ref({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
});

const selectedQuickRange = ref<number | "custom">(90);
const showCustomDate = ref(false);

const drawerWidth = ref("1200px");
const currentDrawerWidth = ref(1200);

const filters = ref<Filters>({
    search: "",
    dateRange: "all",
    sortBy: "commits-desc",
    minCommits: 0
});

const repositoryId = computed(() => Number(route.params.id));

const repository = computed(() => {
    return dataStore.getRepositoryById(repositoryId.value);
});

const analysis = computed(() => {
    return currentAnalysis.value;
});

const minDate = computed(() => {
    if (repository.value?.createdAt) {
        return repository.value.createdAt.split("T")[0];
    }

    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    return fiveYearsAgo.toISOString().split("T")[0];
});

const maxDate = computed(() => {
    return new Date().toISOString().split("T")[0];
});

const calculateDays = computed(() => {
    if (!dateRange.value.start || !dateRange.value.end) {
        return 0;
    }

    const start = new Date(dateRange.value.start);
    const end = new Date(dateRange.value.end);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const dateRangeText = computed(() => {
    if (!analysis.value) return "-";
    const start = dayjs(analysis.value.commitRange.start);
    const end = dayjs(analysis.value.commitRange.end);
    const days = end.diff(start, "day");
    return `${days} 天`;
});

const formatAnalyzedTime = computed(() => {
    if (!analysis.value) return "-";
    return dayjs(analysis.value.analyzedAt).format("MM-DD HH:mm");
});

const filteredContributors = computed(() => {
    if (!analysis.value) return [];
    let result = [...analysis.value.contributors];

    if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();
        result = result.filter(
            (contributor) =>
                contributor.userName.toLowerCase().includes(searchLower) ||
                contributor.email.toLowerCase().includes(searchLower)
        );
    }

    if (filters.value.minCommits > 0) {
        result = result.filter(
            (contributor) => contributor.totalCommits >= filters.value.minCommits
        );
    }

    if (filters.value.dateRange !== "all") {
        const now = dayjs();
        const daysMap: Record<string, number> = {
            "7d": 7,
            "30d": 30,
            "90d": 90,
            "180d": 180,
            "1y": 365
        };
        const days = daysMap[filters.value.dateRange];
        if (days) {
            const cutoffDate = now.subtract(days, "day");
            result = result.filter((contributor) => {
                const lastActivity = dayjs(contributor.activeTimeRange.end);
                return lastActivity.isAfter(cutoffDate);
            });
        }
    }

    switch (filters.value.sortBy) {
        case "commits-desc":
            result.sort((a, b) => b.totalCommits - a.totalCommits);
            break;
        case "commits-asc":
            result.sort((a, b) => a.totalCommits - b.totalCommits);
            break;
        case "files-desc":
            result.sort((a, b) => b.totalFiles - a.totalFiles);
            break;
        case "files-asc":
            result.sort((a, b) => a.totalFiles - b.totalFiles);
            break;
        case "name-asc":
            result.sort((a, b) => a.userName.localeCompare(b.userName));
            break;
        case "name-desc":
            result.sort((a, b) => b.userName.localeCompare(a.userName));
            break;
    }
    return result;
});

const filterStats = computed(() => {
    if (!analysis.value) return { total: 0, filtered: 0 };
    return {
        total: analysis.value.contributors.length,
        filtered: filteredContributors.value.length
    };
});

const contributionChartData = computed(() => {
    if (!analysis.value) return [];
    return analysis.value.contributors.map((contributor) => ({
        name: contributor.userName,
        value: contributor.totalCommits
    }));
});

const selectedProfile = computed(() => {
    if (!selectedContributor.value || !analysis.value) return null;
    return analysis.value.functionProfiles?.[selectedContributor.value.userId];
});

const drawerLayoutClass = computed(() => {
    if (currentDrawerWidth.value >= 1000) {
        return "grid-cols-2";
    }
    return "grid-cols-1";
});

function shortenPath(path: string, maxLength: number = 30): string {
    if (path.length <= maxLength) return path;

    const segments = path.split("/");
    if (segments.length <= 2) {
        return path.slice(0, maxLength - 3) + "...";
    }

    const first = segments[0];
    const last = segments[segments.length - 1];
    return `${first}/.../${last}`;
}

const heatmapData = computed(() => {
    if (!selectedContributor.value) return [];

    const sortedDirs = [...selectedContributor.value.directories]
        .sort((a, b) => b.modificationCount - a.modificationCount)
        .slice(0, heatmapTopN.value);

    const data: Array<{ x: string; y: string; value: number }> = [];
    sortedDirs.forEach((dir) => {
        data.push({
            x: shortenPath(dir.path, 35),
            y: "修改次数",
            value: dir.modificationCount
        });
    });
    return data;
});

async function loadBranches(): Promise<void> {
    if (!repository.value) return;
    loadingBranches.value = true;
    try {
        const { data } = await codeup.listBranches(repository.value.id, {
            perPage: 50
        });
        branches.value = data;
        selectedBranch.value = repository.value.defaultBranch || data[0]?.name || "";
    } catch (error) {
        toast.error("加载分支列表失败");
    } finally {
        loadingBranches.value = false;
    }
}

function selectQuickRange(days: number): void {
    selectedQuickRange.value = days;
    showCustomDate.value = false;
    setDateRange(days);
}

function toggleCustomDate(): void {
    selectedQuickRange.value = "custom";
    showCustomDate.value = !showCustomDate.value;
}

function onCustomDateChange(): void {
    selectedQuickRange.value = "custom";
}

function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return "-";
    return dayjs(dateStr).format("YYYY年MM月DD日");
}

function setDateRange(days: number): void {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    dateRange.value = {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0]
    };
}

function clearCurrentAnalysis(): void {
    currentAnalysis.value = null;
    selectedContributor.value = null;
    drawerVisible.value = false;
}

function handleDrawerResize(width: number): void {
    currentDrawerWidth.value = width;
    drawerWidth.value = `${width}px`;
    localStorage.setItem("contributorDrawerWidth", width.toString());
}

async function handleAnalyze(): Promise<void> {
    if (!repository.value) {
        toast.error("仓库信息加载失败");
        return;
    }
    if (!selectedBranch.value) {
        toast.error("请选择要分析的分支");
        return;
    }

    if (currentAnalysis.value) {
        const confirmed = await confirm.confirm(
            "将使用新的日期范围重新分析，当前结果会被覆盖，确定继续吗？",
            "确认重新分析"
        );
        if (!confirmed) {
            return;
        }
        clearCurrentAnalysis();
    }

    analyzing.value = true;
    analysisError.value = null;
    analysisProgress.value = 0;

    try {
        const startDate = dateRange.value.start;
        const endDate = dateRange.value.end;

        analysisStepText.value = "正在获取提交列表...";
        analysisProgress.value = 10;

        const { data: commits } = await codeup.listCommits({
            repositoryId: repository.value.id,
            refName: selectedBranch.value,
            since: startDate + "T00:00:00Z",
            until: endDate + "T23:59:59Z",
            perPage: 100
        });

        if (commits.length === 0) {
            toast.warning("所选时间范围内没有提交记录");
            analyzing.value = false;
            return;
        }

        analysisProgress.value = 20;

        const maxCommits = 50;
        const selectedCommits = commits.slice(0, maxCommits);

        analysisStepText.value = `正在获取提交详情（${selectedCommits.length} 个）...`;
        const commitDiffs = await codeup.batchGetCommitDiffs(repository.value.id, selectedCommits);

        analysisProgress.value;
        analysisProgress.value = 40;

        analysisStepText.value = "正在使用 AI 分析贡献数据...";

        const progressInterval = setInterval(() => {
            if (analyzer.progress.value > 0) {
                analysisProgress.value = 40 + (analyzer.progress.value / 100) * 60;
            }
        }, 100);

        try {
            const analysisResult = await analyzer.analyzeRepository(
                repository.value.id,
                repository.value.name,
                commits,
                commitDiffs
            );

            clearInterval(progressInterval);
            analysisProgress.value = 100;
            analysisStepText.value = "分析完成！";

            currentAnalysis.value = analysisResult;

            toast.success(
                `分析完成！共分析 ${commitDiffs.length} 个提交，${analysisResult.contributors.length} 位贡献者`
            );
        } catch (err: any) {
            clearInterval(progressInterval);
            throw err;
        }
    } catch (error: any) {
        const errorMessage = error.message || "分析过程中发生错误";
        analysisError.value = errorMessage;
        toast.error(errorMessage);
    } finally {
        analyzing.value = false;
    }
}

function getContributorBadge(contributor: UserContribution): string {
    if (contributor.totalCommits >= 30) return "Core";
    if (contributor.totalCommits >= 15) return "Active";
    return "Contributor";
}

function getContributorBadgeVariant(
    contributor: UserContribution
): "primary" | "success" | "warning" | "danger" {
    if (contributor.totalCommits >= 30) return "primary";
    if (contributor.totalCommits >= 15) return "success";
    return "warning";
}

function showContributorDetail(contributor: UserContribution): void {
    selectedContributor.value = contributor;
    drawerVisible.value = true;
}

function resetFilters(): void {
    filters.value = {
        search: "",
        dateRange: "all",
        sortBy: "commits-desc",
        minCommits: 0
    };
}

function goBack(): void {
    router.push("/dashboard");
}

onMounted(async () => {
    if (!repository.value) {
        toast.error("仓库不存在");
        router.push("/dashboard");
        return;
    }

    const savedWidth = localStorage.getItem("contributorDrawerWidth");
    if (savedWidth) {
        const width = parseInt(savedWidth);
        currentDrawerWidth.value = width;
        drawerWidth.value = `${width}px`;
    }

    await loadBranches();
});
</script>
