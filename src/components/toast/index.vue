<template>
    <Teleport to="body">
        <TransitionGroup
            name="toast"
            tag="div"
            class="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none"
        >
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="pointer-events-auto max-w-sm w-full bg-white dark:bg-[#1E1E21] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
                <div class="p-4 flex items-start">
                    <div class="flex-shrink-0">
                        <svg
                            v-if="toast.type === 'success'"
                            class="w-6 h-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <svg
                            v-else-if="toast.type === 'error'"
                            class="w-6 h-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <svg
                            v-else-if="toast.type === 'warning'"
                            class="w-6 h-6 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <svg
                            v-else
                            class="w-6 h-6 text-blue-500"
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
                    </div>

                    <div class="ml-3 flex-1 min-w-0">
                        <p
                            v-if="toast.title"
                            class="text-sm font-medium text-gray-900 dark:text-white truncate"
                            :title="toast.title"
                        >
                            {{ toast.title }}
                        </p>
                        <p
                            class="text-sm text-gray-600 dark:text-gray-300 break-words line-clamp-3"
                            :class="{ 'mt-1': toast.title }"
                            :title="toast.message"
                        >
                            {{ toast.message }}
                        </p>
                    </div>

                    <button
                        class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        @click="removeToast(toast.id)"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div v-if="toast.duration" class="h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                        class="h-full transition-all ease-linear"
                        :class="getProgressBarClass(toast.type)"
                        :style="{ width: `${toast.progress}%`, transitionDuration: '100ms' }"
                    ></div>
                </div>
            </div>
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { storeToRefs } from "pinia";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
const { removeToast } = toastStore;

function getProgressBarClass(type: string): string {
    const classes: Record<string, string> = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    };
    return classes[type] || "bg-blue-500";
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.toast-move {
    transition: transform 0.3s ease;
}
</style>
