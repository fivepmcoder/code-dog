import { useConfirmStore } from "@/stores/confirm";
import type { ConfirmType } from "@/components/confirm-dialog/index.vue";

export function useConfirm() {
    const confirmStore = useConfirmStore();

    async function confirm(
        message: string,
        title: string = "确认操作",
        type: ConfirmType = "warning"
    ): Promise<boolean> {
        return confirmStore.show({
            type,
            title,
            message
        });
    }

    async function confirmDanger(message: string, title: string = "危险操作"): Promise<boolean> {
        return confirmStore.show({
            type: "danger",
            title,
            message,
            confirmText: "删除",
            cancelText: "取消"
        });
    }

    async function confirmWarning(message: string, title: string = "警告"): Promise<boolean> {
        return confirmStore.show({
            type: "warning",
            title,
            message
        });
    }

    async function confirmInfo(message: string, title: string = "提示"): Promise<boolean> {
        return confirmStore.show({
            type: "info",
            title,
            message
        });
    }

    return {
        confirm,
        confirmDanger,
        confirmWarning,
        confirmInfo
    };
}
