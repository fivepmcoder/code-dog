<template>
    <Teleport to="body">
        <Transition name="loading">
            <div
                v-if="visible"
                class="text-main fixed inset-0 z-20 flex flex-col items-center justify-center"
            >
                <svg
                    class="h-10 w-10 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                <p class="font-bold">{{ text }}</p>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { loadingStore } from "@/store/loading";
import { storeToRefs } from "pinia";

const { loading: visible, text } = storeToRefs(loadingStore());
</script>

<style lang="css" scoped>
/* 进入动画 */
.loading-enter-active {
    transition: opacity 200ms ease-out;
}
/* 离开动画 */
.loading-leave-active {
    transition: opacity 150ms ease-in;
}
/* 进入起始状态和离开结束状态 */
.loading-enter-from,
.loading-leave-to {
    opacity: 0;
}
</style>
