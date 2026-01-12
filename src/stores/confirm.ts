import { defineStore } from "pinia";
import { ref } from "vue";
import type { ConfirmType } from "@/components/confirm-dialog/index.vue";

interface ConfirmOptions {
    type?: ConfirmType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const useConfirmStore = defineStore("confirm", () => {
    const visible = ref(false);
    const type = ref<ConfirmType>("warning");
    const title = ref("");
    const message = ref("");
    const confirmText = ref("确定");
    const cancelText = ref("取消");

    let resolvePromise: ((value: boolean) => void) | null = null;

    function show(options: ConfirmOptions): Promise<boolean> {
        visible.value = true;
        type.value = options.type || "warning";
        title.value = options.title;
        message.value = options.message;
        confirmText.value = options.confirmText || "确定";
        cancelText.value = options.cancelText || "取消";

        return new Promise((resolve) => {
            resolvePromise = resolve;
        });
    }

    function handleConfirm(): void {
        visible.value = false;
        if (resolvePromise) {
            resolvePromise(true);
            resolvePromise = null;
        }
    }

    function handleCancel(): void {
        visible.value = false;
        if (resolvePromise) {
            resolvePromise(false);
            resolvePromise = null;
        }
    }

    return {
        visible,
        type,
        title,
        message,
        confirmText,
        cancelText,
        show,
        handleConfirm,
        handleCancel
    };
});
