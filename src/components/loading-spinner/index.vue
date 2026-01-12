<template>
    <div class="flex items-center justify-center" :class="containerClass">
        <div class="relative flex-shrink-0" :style="{ width: size + 'px', height: size + 'px' }">
            <div
                class="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"
            ></div>
            <div
                class="absolute inset-0 border-4 border-primary-500 dark:border-primary-400 rounded-full animate-spin border-t-transparent"
            ></div>
        </div>

        <span
            v-if="text"
            class="ml-3 text-gray-600 dark:text-gray-300 truncate max-w-xs"
            :title="text"
        >
            {{ text }}
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    size?: number;
    text?: string;
    containerClass?: string;
}

withDefaults(defineProps<Props>(), {
    size: 40,
    text: "",
    containerClass: ""
});
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
