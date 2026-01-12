<template>
    <div
        class="card cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400"
        :class="{ 'ring-2 ring-primary-500 dark:ring-primary-400': selected }"
        @click="handleClick"
    >
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3 min-w-0 flex-1">
                <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                >
                    {{ initials }}
                </div>

                <div class="min-w-0 flex-1">
                    <h3
                        class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate"
                        :title="userName"
                    >
                        {{ userName }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate" :title="email">
                        {{ email }}
                    </p>
                </div>
            </div>

            <div v-if="badge" class="badge flex-shrink-0 ml-2" :class="badgeClass">
                {{ badge }}
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">提交次数</p>
                <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {{ formatNumber(totalCommits) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">修改文件</p>
                <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {{ formatNumber(totalFiles) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">活跃目录</p>
                <p class="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {{ formatNumber(directoriesCount) }}
                </p>
            </div>
        </div>

        <div v-if="mainModules.length > 0" class="flex flex-wrap gap-2 mb-3">
            <function-tag
                v-for="module in mainModules.slice(0, 3)"
                :key="module"
                :label="module"
                variant="primary"
            />
            <span
                v-if="mainModules.length > 3"
                class="text-xs text-gray-500 dark:text-gray-400 self-center flex-shrink-0"
            >
                +{{ mainModules.length - 3 }} 更多
            </span>
        </div>

        <p
            v-if="summary"
            class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 break-words"
            :title="summary"
        >
            {{ summary }}
        </p>

        <div
            v-if="timeRange"
            class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400"
        >
            <span
                class="block truncate"
                :title="`活跃时间：${formatDate(timeRange.start)} ~ ${formatDate(timeRange.end)}`"
            >
                活跃时间：{{ formatDate(timeRange.start) }} ~ {{ formatDate(timeRange.end) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FunctionTag from "@/components/function-tag/index.vue";
import dayjs from "dayjs";

type BadgeVariant = "primary" | "success" | "warning" | "danger";

interface Props {
    userName: string;
    email: string;
    totalCommits: number;
    totalFiles: number;
    directoriesCount: number;
    mainModules?: string[];
    summary?: string;
    timeRange?: {
        start: string;
        end: string;
    };
    badge?: string;
    badgeVariant?: BadgeVariant;
    selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    mainModules: () => [],
    summary: "",
    badge: "",
    badgeVariant: "primary",
    selected: false
});

const emit = defineEmits<{
    click: [];
}>();

const initials = computed(() => {
    const name = props.userName;
    if (!name) return "?";

    const parts = name.split(" ");
    if (parts.length >= 2) {
        const first = parts[0]?.[0];
        const second = parts[1]?.[0];
        if (first && second) {
            return (first + second).toUpperCase();
        }
    }
    return name.substring(0, 2).toUpperCase();
});

const badgeClass = computed(() => {
    const variants: Record<BadgeVariant, string> = {
        primary: "badge-primary",
        success: "badge-success",
        warning: "badge-warning",
        danger: "badge-danger"
    };
    return variants[props.badgeVariant];
});

function formatDate(date: string): string {
    return dayjs(date).format("YYYY-MM-DD");
}

function formatNumber(num: number): string {
    return new Intl.NumberFormat("zh-CN").format(num);
}

function handleClick(): void {
    emit("click");
}
</script>
