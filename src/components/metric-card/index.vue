<template>
    <div class="card">
        <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
                <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400 truncate"
                    :title="title"
                >
                    {{ title }}
                </p>

                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
                    {{ formattedValue }}
                </p>

                <p
                    v-if="description"
                    class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
                    :title="description"
                >
                    {{ description }}
                </p>

                <div v-if="trend" class="mt-2 flex items-center text-sm">
                    <span
                        :class="[
                            'flex items-center flex-shrink-0',
                            trend.type === 'up'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                        ]"
                    >
                        <svg
                            v-if="trend.type === 'up'"
                            class="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                        <svg
                            v-else
                            class="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                        {{ trend.value }}
                    </span>
                    <span
                        class="ml-2 text-gray-500 dark:text-gray-400 truncate"
                        :title="trend.label"
                    >
                        {{ trend.label }}
                    </span>
                </div>
            </div>

            <div v-if="icon" class="flex-shrink-0 p-3 rounded-lg ml-4" :class="iconBgClass">
                <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

interface Trend {
    type: "up" | "down";
    value: string;
    label: string;
}

interface Props {
    title: string;
    value: number | string;
    description?: string;
    trend?: Trend;
    icon?: Component;
    iconBgClass?: string;
    iconColorClass?: string;
    format?: "number" | "currency" | "percentage";
}

const props = withDefaults(defineProps<Props>(), {
    description: "",
    iconBgClass: "bg-primary-100 dark:bg-primary-900/30",
    iconColorClass: "text-primary-600 dark:text-primary-400",
    format: "number"
});

const formattedValue = computed(() => {
    if (typeof props.value === "string") {
        return props.value;
    }

    switch (props.format) {
        case "currency":
            return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
                props.value
            );
        case "percentage":
            return `${props.value}%`;
        default:
            return new Intl.NumberFormat("zh-CN").format(props.value);
    }
});
</script>
