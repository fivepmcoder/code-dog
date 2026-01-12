<template>
    <span
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 max-w-full"
        :class="[colorClass, clickable ? 'cursor-pointer hover:opacity-80' : '']"
        :title="title || label"
        @click="handleClick"
    >
        <span v-if="icon" class="mr-1.5 flex-shrink-0">
            <component :is="icon" class="w-4 h-4" />
        </span>

        <span class="truncate">{{ label }}</span>

        <button
            v-if="closable"
            class="ml-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors flex-shrink-0"
            @click.stop="handleClose"
        >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

type TagVariant = "primary" | "success" | "warning" | "danger" | "info" | "gray";

interface Props {
    label: string;
    title?: string;
    variant?: TagVariant;
    icon?: Component;
    closable?: boolean;
    clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    closable: false,
    clickable: false
});

const emit = defineEmits<{
    click: [];
    close: [];
}>();

const colorClass = computed(() => {
    const variants: Record<TagVariant, string> = {
        primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    };
    return variants[props.variant];
});

function handleClick(): void {
    if (props.clickable) {
        emit("click");
    }
}

function handleClose(): void {
    emit("close");
}
</script>
