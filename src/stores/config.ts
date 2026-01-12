import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AppConfig, CodeupConfig, LLMConfig } from "@/types/config";

const STORAGE_KEY = "codeup-insight-config";

export const useConfigStore = defineStore("config", () => {
    const codeupConfig = ref<CodeupConfig>({
        accessKeyId: "",
        accessKeySecret: "",
        organizationId: "",
        endpoint: "https://openapi-rdc.aliyuncs.com"
    });

    const llmConfig = ref<LLMConfig>({
        endpoint: "",
        apiKey: "",
        model: "qwen-plus",
        temperature: 0.7,
        maxTokens: 2000
    });

    const isConfigured = computed(() => {
        const hasCodeup = !!(
            codeupConfig.value.accessKeyId?.trim() && codeupConfig.value.organizationId?.trim()
        );

        const hasLLM = !!(
            llmConfig.value.endpoint?.trim() &&
            llmConfig.value.apiKey?.trim() &&
            llmConfig.value.model?.trim()
        );

        return hasCodeup && hasLLM;
    });

    function updateCodeupConfig(config: Partial<CodeupConfig>): void {
        codeupConfig.value = { ...codeupConfig.value, ...config };
        saveToStorage();
    }

    function updateLLMConfig(config: Partial<LLMConfig>): void {
        llmConfig.value = { ...llmConfig.value, ...config };
        saveToStorage();
    }

    function saveToStorage(): void {
        const config: AppConfig = {
            codeup: codeupConfig.value,
            llm: llmConfig.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    function loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const config: AppConfig = JSON.parse(stored);
                codeupConfig.value = {
                    ...codeupConfig.value,
                    ...config.codeup
                };
                llmConfig.value = {
                    ...llmConfig.value,
                    ...config.llm
                };
            }
        } catch (error) {}
    }

    function clearConfig(): void {
        codeupConfig.value = {
            accessKeyId: "",
            accessKeySecret: "",
            organizationId: "",
            endpoint: "https://openapi-rdc.aliyuncs.com"
        };
        llmConfig.value = {
            endpoint: "",
            apiKey: "",
            model: "qwen-plus",
            temperature: 0.7,
            maxTokens: 2000
        };
        localStorage.removeItem(STORAGE_KEY);
    }

    function validateCodeupConfig(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!codeupConfig.value.accessKeyId?.trim()) {
            errors.push("Personal Access Token 不能为空");
        }
        if (!codeupConfig.value.organizationId?.trim()) {
            errors.push("组织 ID 不能为空");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    function validateLLMConfig(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!llmConfig.value.endpoint?.trim()) {
            errors.push("LLM Endpoint 不能为空");
        }
        if (!llmConfig.value.apiKey?.trim()) {
            errors.push("API Key 不能为空");
        }
        if (!llmConfig.value.model?.trim()) {
            errors.push("Model 不能为空");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    loadFromStorage();

    return {
        codeupConfig,
        llmConfig,
        isConfigured,
        updateCodeupConfig,
        updateLLMConfig,
        saveToStorage,
        loadFromStorage,
        clearConfig,
        validateCodeupConfig,
        validateLLMConfig
    };
});
