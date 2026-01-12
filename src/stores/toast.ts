import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    progress?: number;
}

export const useToastStore = defineStore("toast", () => {
    const toasts = ref<Toast[]>([]);

    function showToast(options: Omit<Toast, "id" | "progress">): void {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = {
            ...options,
            id,
            progress: 100
        };

        toasts.value.push(toast);

        if (options.duration) {
            startProgressBar(id, options.duration);
        }
    }

    function startProgressBar(id: string, duration: number): void {
        const interval = 100;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const toast = toasts.value.find((t) => t.id === id);

            if (!toast) {
                clearInterval(timer);
                return;
            }

            toast.progress = 100 - (currentStep / steps) * 100;

            if (currentStep >= steps) {
                clearInterval(timer);
                removeToast(id);
            }
        }, interval);
    }

    function removeToast(id: string): void {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    }

    function success(message: string, title?: string): void {
        showToast({ type: "success", message, title, duration: 3000 });
    }

    function error(message: string, title?: string): void {
        showToast({ type: "error", message, title, duration: 5000 });
    }

    function warning(message: string, title?: string): void {
        showToast({ type: "warning", message, title, duration: 4000 });
    }

    function info(message: string, title?: string): void {
        showToast({ type: "info", message, title, duration: 3000 });
    }

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
});
