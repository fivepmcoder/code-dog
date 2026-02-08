<template>
    <div class="text-main flex h-full items-center justify-center">
        <div class="bg-card w-auto max-w-2xl rounded-lg p-8 shadow-xl">
            <h2 class="mb-1 pb-2 text-center text-2xl font-bold">模型配置项</h2>
            <form @submit.prevent="submitConfig" class="flex flex-col gap-4">
                <div class="space-y-1">
                    <label class="text-sl block pb-1.5 font-bold"
                        >端点 <span class="text-error">*</span></label
                    >
                    <p class="text-xs opacity-60">
                        例如：https://api.deepseek.ai/v1/chat/completions
                    </p>
                    <input
                        v-model="configData.endpoint"
                        type="text"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <p class="text-error h-6 text-xs">
                        {{ errors.endpoint }}
                    </p>
                </div>
                <div class="space-y-1">
                    <label class="text-sl block pb-1.5 font-bold"
                        >密钥 <span class="text-error">*</span></label
                    >
                    <p class="text-xs opacity-60">例如：sk-**********</p>
                    <input
                        v-model="configData.apiKey"
                        :type="showApiKey ? 'text' : 'password'"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <div class="flex items-center">
                        <p v-if="errors.apiKey" class="text-error text-xs">
                            {{ errors.apiKey }}
                        </p>
                        <div class="ml-auto flex items-center">
                            <input
                                class="cursor-pointer"
                                type="checkbox"
                                v-model="showApiKey"
                                @change="!showApiKey"
                            />
                            <span class="ml-1">显示密钥</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="text-sl block pb-1.5 font-bold"
                        >模型 <span class="text-error">*</span></label
                    >
                    <p class="text-xs opacity-60">例如：deepseek-v3</p>
                    <input
                        v-model="configData.model"
                        type="text"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <p class="text-error h-6 text-xs">
                        {{ errors.model }}
                    </p>
                </div>

                <div class="flex flex-row space-y-1 space-x-10">
                    <div>
                        <label class="text-sl block pb-1.5 font-bold">温度</label>
                        <input
                            v-model="configData.temperature"
                            type="text"
                            class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="text-sl block pb-1.5 font-bold">最大 Tokens</label>
                        <input
                            v-model="configData.maxTokens"
                            type="text"
                            class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    :disabled
                    type="submit"
                    class="bg-primary mx-auto w-full max-w-xs transform cursor-pointer rounded-full px-4 py-2 font-bold tracking-widest text-white duration-500 hover:-translate-y-0.5 hover:shadow-xl"
                >
                    <template v-if="disabled" class="flex items-center justify-center">
                        <svg
                            class="mr-2 -ml-1 inline-block h-5 w-5 animate-spin text-white"
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
                        <span>处理中...</span>
                    </template>
                    <template class="text-center" v-else>保存</template>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { configStore } from "@/store/config";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const config = configStore();

const router = useRouter();

const showApiKey = ref(false);
const disabled = ref(false);

const configData = reactive({
    endpoint: config.llmConfig.endpoint || "",
    apiKey: config.llmConfig.apiKey || "",
    model: config.llmConfig.model || "",
    temperature: config.llmConfig.temperature || 0.7,
    maxTokens: config.llmConfig.maxTokens || 1024
});
const errors = reactive({
    endpoint: "",
    apiKey: "",
    model: "",
    temperature: "",
    maxTokens: ""
});
const validate = () => {
    let isValid = true;
    if (!configData.endpoint) {
        errors.endpoint = "请输入端点";
        isValid = false;
    }
    if (!configData.apiKey) {
        errors.apiKey = "请输入密钥";
        isValid = false;
    }
    if (!configData.model) {
        errors.model = "请输入模型名称";
        isValid = false;
    }
    return isValid;
};
const submitConfig = () => {
    disabled.value = true;
    if (!validate()) {
        disabled.value = false;
        return;
    }

    config.setLLMConfig({
        ...configData
    });

    router.push("/");
};
</script>
