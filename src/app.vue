<template>
    <div id="app" class="min-h-screen bg-gray-50 dark:bg-[#0A0A0B]">
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>

        <toast-container />

        <confirm-dialog
            v-model:visible="confirmStore.visible"
            :type="confirmStore.type"
            :title="confirmStore.title"
            :message="confirmStore.message"
            :confirm-text="confirmStore.confirmText"
            :cancel-text="confirmStore.cancelText"
            @confirm="confirmStore.handleConfirm"
            @cancel="confirmStore.handleCancel"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useConfigStore } from "@/stores/config";
import { useConfirmStore } from "@/stores/confirm";
import ToastContainer from "@/components/toast/index.vue";
import ConfirmDialog from "@/components/confirm-dialog/index.vue";

const configStore = useConfigStore();
const confirmStore = useConfirmStore();

onMounted(() => {
    configStore.loadFromStorage();
});
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
</style>
