import type { GitConfig, LLMConfig } from "@/definition/config";
import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
    state: () => ({
        // 仓库配置
        gitConfig: {
            type: "codeup",
            token: "",
            endpoint: "",
            organization: ""
        } as GitConfig,
        // 模型配置
        llmConfig: {
            endpoint: "",
            apiKey: "",
            model: "",
            temperature: 0.7,
            maxTokens: 1024
        } as LLMConfig
    }),

    getters: {
        getGitConfig(): GitConfig {
            return this.gitConfig;
        },
        getLLMConfig(): LLMConfig {
            return this.llmConfig;
        }
    },

    actions: {
        setGitConfig(config: GitConfig) {
            this.gitConfig = config;
        },
        setLLMConfig(config: LLMConfig) {
            this.llmConfig = config;
        }
    },

    persist: true
});
