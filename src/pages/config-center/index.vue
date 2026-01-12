<template>
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] flex items-center justify-center p-6">
        <div class="fixed top-6 right-6 z-10">
            <theme-toggle />
        </div>

        <div class="w-full max-w-4xl">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2 dark:text-white">
                    Codeup Insight
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">
                    基于 Git 文件修改记录的功能贡献分析系统
                </p>
            </div>

            <div class="card max-w-3xl mx-auto">
                <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        class="flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 border-b-2"
                        :class="[
                            activeTab === tab.key
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        ]"
                        @click="activeTab = tab.key"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <div v-show="activeTab === 'codeup'" class="space-y-4">
                    <div>
                        <label class="label">Personal Access Token *</label>
                        <input
                            v-model="codeupForm.accessKeyId"
                            :type="showSecret ? 'text' : 'password'"
                            class="input"
                            :class="{ 'input-error': errors.accessKeyId }"
                            placeholder="请输入云效 Codeup Personal Access Token"
                        />
                        <div class="mt-2 flex items-center">
                            <input
                                id="show-secret"
                                v-model="showSecret"
                                type="checkbox"
                                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label
                                for="show-secret"
                                class="ml-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                                显示令牌
                            </label>
                        </div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                            在云效控制台获取：个人设置 → 访问令牌 → 新建令牌
                        </p>
                        <p v-if="errors.accessKeyId" class="mt-1 text-sm text-red-600 break-words">
                            {{ errors.accessKeyId }}
                        </p>
                    </div>

                    <div>
                        <label class="label">组织 ID (Organization ID) *</label>
                        <input
                            v-model="codeupForm.organizationId"
                            type="text"
                            class="input"
                            :class="{ 'input-error': errors.organizationId }"
                            placeholder="请输入云效组织 ID"
                        />
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                            在云效 URL 中获取：https://devops.aliyun.com/organization/<strong
                                >【组织ID】</strong
                            >
                        </p>
                        <p
                            v-if="errors.organizationId"
                            class="mt-1 text-sm text-red-600 break-words"
                        >
                            {{ errors.organizationId }}
                        </p>
                    </div>

                    <div>
                        <label class="label">API Endpoint（可选）</label>
                        <input
                            v-model="codeupForm.endpoint"
                            type="text"
                            class="input"
                            placeholder="https://openapi-rdc.aliyuncs.com"
                        />
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                            默认为阿里云 Codeup OpenAPI 地址，使用专有云时可自定义
                        </p>
                    </div>

                    <div class="pt-4">
                        <button
                            class="btn btn-secondary w-full"
                            :disabled="testingCodeup"
                            @click="testCodeupConnection"
                        >
                            <span v-if="testingCodeup">测试连接中...</span>
                            <span v-else>测试 Codeup 连接</span>
                        </button>
                    </div>
                </div>

                <div v-show="activeTab === 'llm'" class="space-y-4">
                    <div>
                        <label class="label">LLM Endpoint *</label>
                        <input
                            v-model="llmForm.endpoint"
                            type="text"
                            class="input"
                            :class="{ 'input-error': errors.endpoint }"
                            placeholder="https://api.deepseek.com/v1"
                        />
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                            支持 OpenAI 兼容格式的 API，如通义千问、DeepSeek、智谱 AI 等
                        </p>
                        <p v-if="errors.endpoint" class="mt-1 text-sm text-red-600 break-words">
                            {{ errors.endpoint }}
                        </p>
                    </div>

                    <div>
                        <label class="label">API Key *</label>
                        <input
                            v-model="llmForm.apiKey"
                            :type="showApiKey ? 'text' : 'password'"
                            class="input"
                            :class="{ 'input-error': errors.apiKey }"
                            placeholder="请输入 LLM API Key"
                        />
                        <div class="mt-2 flex items-center">
                            <input
                                id="show-api-key"
                                v-model="showApiKey"
                                type="checkbox"
                                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label
                                for="show-api-key"
                                class="ml-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                                显示 API Key
                            </label>
                        </div>
                        <p v-if="errors.apiKey" class="mt-1 text-sm text-red-600 break-words">
                            {{ errors.apiKey }}
                        </p>
                    </div>

                    <div>
                        <label class="label">Model Name *</label>
                        <input
                            v-model="llmForm.model"
                            type="text"
                            class="input"
                            :class="{ 'input-error': errors.model }"
                            placeholder="deepseek-chat"
                        />
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                            例如：qwen-plus、gpt-4o、deepseek-chat
                        </p>
                        <p v-if="errors.model" class="mt-1 text-sm text-red-600 break-words">
                            {{ errors.model }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="label">Temperature</label>
                            <input
                                v-model.number="llmForm.temperature"
                                type="number"
                                step="0.1"
                                min="0"
                                max="2"
                                class="input"
                            />
                        </div>
                        <div>
                            <label class="label">Max Tokens</label>
                            <input
                                v-model.number="llmForm.maxTokens"
                                type="number"
                                step="100"
                                min="100"
                                max="8000"
                                class="input"
                            />
                        </div>
                    </div>

                    <div class="pt-4">
                        <button
                            class="btn btn-secondary w-full"
                            :disabled="testingLLM"
                            @click="testLLMConnection"
                        >
                            <span v-if="testingLLM">测试连接中...</span>
                            <span v-else>测试 LLM 连接</span>
                        </button>
                    </div>
                </div>

                <div class="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button class="btn btn-secondary flex-1" @click="handleClear">清空配置</button>
                    <button class="btn btn-primary flex-1" :disabled="saving" @click="handleSave">
                        <span v-if="saving">保存中...</span>
                        <span v-else>保存并进入</span>
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>所有配置信息仅保存在浏览器本地，不会上传到任何服务器</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useConfigStore } from "@/stores/config";
import ThemeToggle from "@/components/theme-toggle/index.vue";
import { useToast } from "@/composables/use-toast";
import { useConfirm } from "@/composables/use-confirm";
import { useCodeup } from "@/composables/use-codeup";
import { useLLM } from "@/composables/use-llm";

const router = useRouter();
const configStore = useConfigStore();
const toast = useToast();
const confirm = useConfirm();
const codeup = useCodeup();
const llm = useLLM();

const tabs = [
    { key: "codeup" as const, label: "阿里云 Codeup 配置" },
    { key: "llm" as const, label: "大模型 (LLM) 配置" }
];

const activeTab = ref<"codeup" | "llm">("codeup");

const codeupForm = reactive({
    accessKeyId: configStore.codeupConfig.accessKeyId || "",
    organizationId: configStore.codeupConfig.organizationId || "",
    endpoint: configStore.codeupConfig.endpoint || "https://openapi-rdc.aliyuncs.com"
});

const llmForm = reactive({
    endpoint: configStore.llmConfig.endpoint || "https://api.deepseek.com/v1",
    apiKey: configStore.llmConfig.apiKey || "",
    model: configStore.llmConfig.model || "deepseek-chat",
    temperature: configStore.llmConfig.temperature || 0.7,
    maxTokens: configStore.llmConfig.maxTokens || 2000
});

const showSecret = ref(false);
const showApiKey = ref(false);
const testingCodeup = ref(false);
const testingLLM = ref(false);
const saving = ref(false);
const errors = reactive<Record<string, string>>({});

async function testCodeupConnection(): Promise<void> {
    clearErrors();

    let endpoint = codeupForm.endpoint.trim();
    if (endpoint && !endpoint.startsWith("http")) {
        endpoint = `https://${endpoint}`;
    }
    configStore.updateCodeupConfig({
        accessKeyId: codeupForm.accessKeyId.trim(),
        organizationId: codeupForm.organizationId.trim(),
        endpoint: endpoint || "https://openapi-rdc.aliyuncs.com"
    });

    const validation = configStore.validateCodeupConfig();
    if (!validation.valid) {
        validation.errors.forEach((err, index) => {
            if (index === 0) errors.accessKeyId = err;
            if (index === 1) errors.organizationId = err;
        });
        toast.error("请填写完整的 Codeup 配置");
        return;
    }
    testingCodeup.value = true;
    try {
        const success = await codeup.testConnection();
        if (success) {
            toast.success("Codeup 连接测试成功");
        } else {
            toast.error(codeup.error.value || "Codeup 连接测试失败");
        }
    } catch (err: any) {
        toast.error(`连接测试异常: ${err.message}`);
    } finally {
        testingCodeup.value = false;
    }
}

async function testLLMConnection(): Promise<void> {
    clearErrors();

    const validation = configStore.validateLLMConfig();
    if (!validation.valid) {
        validation.errors.forEach((err, index) => {
            if (index === 0) errors.endpoint = err;
            if (index === 1) errors.apiKey = err;
            if (index === 2) errors.model = err;
        });
        toast.error("请填写完整的 LLM 配置");
        return;
    }

    testingLLM.value = true;
    try {
        configStore.updateLLMConfig({
            endpoint: llmForm.endpoint.trim(),
            apiKey: llmForm.apiKey.trim(),
            model: llmForm.model.trim(),
            temperature: llmForm.temperature,
            maxTokens: llmForm.maxTokens
        });

        const success = await llm.testConnection();
        if (success) {
            toast.success("LLM 连接测试成功");
        } else {
            toast.error(llm.error.value || "LLM 连接测试失败");
        }
    } catch (err: any) {
        toast.error(`连接测试异常: ${err.message}`);
    } finally {
        testingLLM.value = false;
    }
}

async function handleSave(): Promise<void> {
    clearErrors();

    let codeupEndpoint = codeupForm.endpoint.trim();
    if (codeupEndpoint && !codeupEndpoint.startsWith("http")) {
        codeupEndpoint = `https://${codeupEndpoint}`;
    }
    configStore.updateCodeupConfig({
        accessKeyId: codeupForm.accessKeyId.trim(),
        organizationId: codeupForm.organizationId.trim(),
        endpoint: codeupEndpoint || "https://openapi-rdc.aliyuncs.com"
    });
    configStore.updateLLMConfig({
        endpoint: llmForm.endpoint.trim(),
        apiKey: llmForm.apiKey.trim(),
        model: llmForm.model.trim(),
        temperature: llmForm.temperature,
        maxTokens: llmForm.maxTokens
    });

    const codeupValidation = configStore.validateCodeupConfig();
    if (!codeupValidation.valid) {
        activeTab.value = "codeup";
        codeupValidation.errors.forEach((err) => {
            if (err.includes("Token")) errors.accessKeyId = err;
            if (err.includes("组织")) errors.organizationId = err;
        });
        toast.error("请填写完整的 Codeup 配置");
        return;
    }
    const llmValidation = configStore.validateLLMConfig();
    if (!llmValidation.valid) {
        activeTab.value = "llm";
        llmValidation.errors.forEach((err) => {
            if (err.includes("Endpoint")) errors.endpoint = err;
            if (err.includes("Key")) errors.apiKey = err;
            if (err.includes("Model")) errors.model = err;
        });
        toast.error("请填写完整的 LLM 配置");
        return;
    }
    if (!configStore.isConfigured) {
        toast.error("配置未生效，请检查必填项");
        return;
    }
    saving.value = true;
    try {
        toast.success("配置保存成功");
        await new Promise((resolve) => setTimeout(resolve, 500));
        await router.push({ name: "Dashboard" });
    } catch (err: any) {
        toast.error(`操作失败: ${err.message || "未知错误"}`);
    } finally {
        saving.value = false;
    }
}

async function handleClear(): Promise<void> {
    const confirmed = await confirm.confirmDanger(
        "清空后将删除所有已保存的配置信息，此操作不可恢复。确定要继续吗？",
        "确认清空配置"
    );

    if (confirmed) {
        configStore.clearConfig();

        Object.assign(codeupForm, {
            accessKeyId: "",
            organizationId: "",
            endpoint: "https://openapi-rdc.aliyuncs.com"
        });
        Object.assign(llmForm, {
            endpoint: "https://api.deepseek.com/v1",
            apiKey: "",
            model: "deepseek-chat",
            temperature: 0.7,
            maxTokens: 2000
        });

        clearErrors();
        toast.success("配置已清空");
    }
}

function clearErrors(): void {
    Object.keys(errors).forEach((key) => delete errors[key]);
}
</script>
