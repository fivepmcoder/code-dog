<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="visible"
                class="fixed inset-0 bg-black/60 dark:bg-black/80 z-[90] flex items-center justify-center p-4 backdrop-blur-sm"
                @click="handleCancel"
            >
                <Transition name="scale">
                    <div
                        v-if="visible"
                        class="bg-white dark:bg-[#1E1E21] rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800"
                        @click.stop
                    >
                        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div class="flex items-start">
                                <div
                                    class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                    :class="iconBgClass"
                                >
                                    <svg
                                        v-if="type === 'warning' || type === 'danger'"
                                        class="w-6 h-6"
                                        :class="iconColorClass"
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
                                        class="w-6 h-6"
                                        :class="iconColorClass"
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
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white truncate"
                                        :title="title"
                                    >
                                        {{ title }}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <p
                                class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words line-clamp-6"
                                :title="message"
                            >
                                {{ message }}
                            </p>
                        </div>

                        <div class="p-6 pt-0 flex gap-3">
                            <button class="flex-1 btn btn-secondary" @click="handleCancel">
                                {{ cancelText }}
                            </button>
                            <button
                                class="flex-1 btn"
                                :class="confirmButtonClass"
                                @click="handleConfirm"
                            >
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type ConfirmType = "info" | "warning" | "danger";

interface Props {
    visible: boolean;
    type?: ConfirmType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "warning",
    confirmText: "确定",
    cancelText: "取消"
});

const emit = defineEmits<{
    confirm: [];
    cancel: [];
    "update:visible": [value: boolean];
}>();

const iconBgClass = computed(() => {
    const classes: Record<ConfirmType, string> = {
        info: "bg-blue-100 dark:bg-blue-900/30",
        warning: "bg-yellow-100 dark:bg-yellow-900/30",
        danger: "bg-red-100 dark:bg-red-900/30"
    };
    return classes[props.type];
});

const iconColorClass = computed(() => {
    const classes: Record<ConfirmType, string> = {
        info: "text-blue-600 dark:text-blue-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        danger: "text-red-600 dark:text-red-400"
    };
    return classes[props.type];
});

const confirmButtonClass = computed(() => {
    const classes: Record<ConfirmType, string> = {
        info: "btn-primary",
        warning: "btn-primary",
        danger: "btn-danger"
    };
    return classes[props.type];
});

function handleConfirm(): void {
    emit("confirm");
    emit("update:visible", false);
}

function handleCancel(): void {
    emit("cancel");
    emit("update:visible", false);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
