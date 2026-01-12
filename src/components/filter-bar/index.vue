<template>
    <div class="card">
        <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 min-w-0">
                <label class="label">搜索</label>
                <div class="relative">
                    <input
                        v-model="localFilters.search"
                        type="text"
                        class="input pl-10"
                        :placeholder="searchPlaceholder"
                        @input="handleFilterChange"
                    />
                    <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div v-if="showDateRange" class="w-full lg:w-64 flex-shrink-0">
                <label class="label">时间范围</label>
                <select v-model="localFilters.dateRange" class="input" @change="handleFilterChange">
                    <option value="all">全部时间</option>
                    <option value="7d">最近 7 天</option>
                    <option value="30d">最近 30 天</option>
                    <option value="90d">最近 90 天</option>
                    <option value="180d">最近 6 个月</option>
                    <option value="1y">最近 1 年</option>
                </select>
            </div>

            <div v-if="showSortBy" class="w-full lg:w-48 flex-shrink-0">
                <label class="label">排序方式</label>
                <select v-model="localFilters.sortBy" class="input" @change="handleFilterChange">
                    <option value="commits-desc">提交数（高到低）</option>
                    <option value="commits-asc">提交数（低到高）</option>
                    <option value="files-desc">文件数（高到低）</option>
                    <option value="files-asc">文件数（低到高）</option>
                    <option value="name-asc">名称（A-Z）</option>
                    <option value="name-desc">名称（Z-A）</option>
                </select>
            </div>

            <div v-if="showMinCommits" class="w-full lg:w-48 flex-shrink-0">
                <label class="label">最小提交数</label>
                <input
                    v-model.number="localFilters.minCommits"
                    type="number"
                    min="0"
                    class="input"
                    placeholder="0"
                    @input="handleFilterChange"
                />
            </div>

            <div class="flex items-end flex-shrink-0">
                <button class="btn btn-secondary whitespace-nowrap" @click="handleReset">
                    <svg
                        class="w-4 h-4 mr-2 inline-block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    重置
                </button>
            </div>
        </div>

        <div
            v-if="hasActiveFilters"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0"
                    >激活的筛选：</span
                >

                <function-tag
                    v-if="localFilters.search"
                    :label="`搜索: ${truncateText(localFilters.search, 20)}`"
                    :title="`搜索: ${localFilters.search}`"
                    variant="primary"
                    closable
                    @close="clearSearch"
                />

                <function-tag
                    v-if="localFilters.dateRange !== 'all'"
                    :label="`时间: ${getDateRangeLabel(localFilters.dateRange)}`"
                    variant="info"
                    closable
                    @close="clearDateRange"
                />

                <function-tag
                    v-if="localFilters.minCommits > 0"
                    :label="`最小提交: ${localFilters.minCommits}`"
                    variant="warning"
                    closable
                    @close="clearMinCommits"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FunctionTag from "@/components/function-tag/index.vue";

export interface Filters {
    search: string;
    dateRange: string;
    sortBy: string;
    minCommits: number;
}

interface Props {
    modelValue: Filters;
    searchPlaceholder?: string;
    showDateRange?: boolean;
    showSortBy?: boolean;
    showMinCommits?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    searchPlaceholder: "搜索...",
    showDateRange: true,
    showSortBy: true,
    showMinCommits: true
});

const emit = defineEmits<{
    "update:modelValue": [value: Filters];
    change: [value: Filters];
}>();

const localFilters = ref<Filters>({ ...props.modelValue });

const hasActiveFilters = computed(() => {
    return (
        localFilters.value.search !== "" ||
        localFilters.value.dateRange !== "all" ||
        localFilters.value.minCommits > 0
    );
});

function handleFilterChange(): void {
    emit("update:modelValue", { ...localFilters.value });
    emit("change", { ...localFilters.value });
}

function handleReset(): void {
    localFilters.value = {
        search: "",
        dateRange: "all",
        sortBy: "commits-desc",
        minCommits: 0
    };
    handleFilterChange();
}

function getDateRangeLabel(range: string): string {
    const labels: Record<string, string> = {
        all: "全部时间",
        "7d": "最近 7 天",
        "30d": "最近 30 天",
        "90d": "最近 90 天",
        "180d": "最近 6 个月",
        "1y": "最近 1 年"
    };
    return labels[range] || range;
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}

function clearSearch(): void {
    localFilters.value.search = "";
    handleFilterChange();
}

function clearDateRange(): void {
    localFilters.value.dateRange = "all";
    handleFilterChange();
}

function clearMinCommits(): void {
    localFilters.value.minCommits = 0;
    handleFilterChange();
}

watch(
    () => props.modelValue,
    (newVal) => {
        localFilters.value = { ...newVal };
    },
    { deep: true }
);
</script>
