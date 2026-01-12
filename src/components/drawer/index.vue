<template>
    <Transition name="fade">
        <div
            v-if="modelValue"
            class="fixed inset-0 z-40 transition-opacity"
            :class="backdropClass"
            @click="handleOverlayClick"
        ></div>
    </Transition>

    <Transition name="slide">
        <div
            v-if="modelValue"
            class="fixed right-0 top-0 h-full bg-white dark:bg-[#1E1E21] shadow-2xl z-50 overflow-hidden flex border-l border-gray-200 dark:border-gray-800"
            :style="{ width: currentWidth + 'px' }"
            @click.stop
        >
            <div
                v-if="resizable"
                class="w-1.5 bg-transparent hover:bg-blue-500/20 dark:hover:bg-blue-600/20 cursor-col-resize transition-colors flex-shrink-0 group relative"
                @mousedown="startResize"
            >
                <div
                    class="absolute inset-y-0 left-0 w-0.5 bg-blue-500 dark:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                    <svg
                        class="w-3 h-3 text-blue-500 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <circle cx="8" cy="4" r="1" />
                        <circle cx="8" cy="8" r="1" />
                        <circle cx="8" cy="12" r="1" />
                    </svg>
                </div>
            </div>

            <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div
                    class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E21] flex-shrink-0"
                >
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                        <h2
                            class="text-xl font-semibold text-gray-900 dark:text-white truncate"
                            :title="title"
                        >
                            {{ title }}
                        </h2>
                        <span
                            v-if="resizable && showWidthHint"
                            class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                            {{ currentWidth }}px
                        </span>
                    </div>
                    <button
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0 ml-4"
                        @click="handleClose"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gray-50 dark:bg-[#0A0A0B]">
                    <slot></slot>
                </div>

                <div
                    v-if="$slots.footer"
                    class="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E1E21] flex-shrink-0"
                >
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface Props {
    modelValue: boolean;
    title?: string;
    width?: string;
    closeOnClickOutside?: boolean;
    blurLevel?: "none" | "light" | "medium" | "heavy";
    resizable?: boolean;
    minWidth?: number;
    maxWidth?: number;
    showWidthHint?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "详情",
    width: "800px",
    closeOnClickOutside: true,
    blurLevel: "light",
    resizable: false,
    minWidth: 400,
    maxWidth: 1800,
    showWidthHint: true
});

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    resize: [width: number];
}>();

const parseWidth = (width: string): number => {
    const num = parseInt(width.replace(/[^0-9]/g, ""));
    return isNaN(num) ? 800 : num;
};

const currentWidth = ref(parseWidth(props.width));
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(0);

watch(
    () => props.width,
    (newWidth) => {
        if (!isResizing.value) {
            currentWidth.value = parseWidth(newWidth);
        }
    }
);

function handleClose(): void {
    emit("update:modelValue", false);
}

function handleOverlayClick(): void {
    if (props.closeOnClickOutside) {
        handleClose();
    }
}

function startResize(e: MouseEvent): void {
    if (!props.resizable) return;

    isResizing.value = true;
    startX.value = e.clientX;
    startWidth.value = currentWidth.value;

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);

    e.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
}

function handleResize(e: MouseEvent): void {
    if (!isResizing.value) return;

    const diff = startX.value - e.clientX;
    let newWidth = startWidth.value + diff;

    newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth));

    const maxViewportWidth = window.innerWidth * 0.95;
    newWidth = Math.min(newWidth, maxViewportWidth);

    currentWidth.value = newWidth;
}

function stopResize(): void {
    if (!isResizing.value) return;

    isResizing.value = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    emit("resize", currentWidth.value);
}

const backdropClass = computed(() => {
    const blurClasses = {
        none: "",
        light: "backdrop-blur-[2px]",
        medium: "backdrop-blur-sm",
        heavy: "backdrop-blur-md"
    };

    const opacityClasses = {
        none: "bg-black/20 dark:bg-black/40",
        light: "bg-black/40 dark:bg-black/60",
        medium: "bg-black/60 dark:bg-black/70",
        heavy: "bg-black/70 dark:bg-black/80"
    };

    return `${opacityClasses[props.blurLevel]} ${blurClasses[props.blurLevel]}`;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}
</style>
