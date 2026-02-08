<template>
    <div class="text-main relative flex h-full items-center justify-center">
        <div class="bg-card w-auto max-w-2xl rounded-lg p-8 shadow-xl">
            <h2 class="mb-6 pb-10 text-center text-2xl font-bold">云效配置项</h2>
            <form @submit.prevent="submitConfig" class="flex flex-col gap-6">
                <div class="space-y-1">
                    <label class="text-sl block pb-1.5 font-bold"
                        >个人授权令牌 <span class="text-error">*</span></label
                    >
                    <p class="text-xs opacity-60">
                        在云效控制台获取：个人设置 → 访问令牌 → 新建令牌
                    </p>
                    <input
                        v-model="configData.token"
                        :type="showToken ? 'text' : 'password'"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <div class="flex items-center">
                        <p v-if="errors.token" class="text-error text-xs">
                            {{ errors.token }}
                        </p>
                        <div class="ml-auto flex items-center">
                            <input
                                class="cursor-pointer"
                                type="checkbox"
                                v-model="showToken"
                                @change="!showToken"
                            />
                            <span class="ml-1">显示令牌</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="text-sl block pb-1.5 font-bold"
                        >组织 <span class="text-error">*</span></label
                    >
                    <p class="text-xs opacity-60">
                        在云效 URL 中获取：https://devops.aliyun.com/organization/
                        <strong>【组织ID】</strong>
                    </p>
                    <input
                        v-model="configData.organization"
                        type="text"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <p class="text-error h-6 text-xs">
                        {{ errors.organization }}
                    </p>
                </div>
                <div class="space-y-1 pb-7">
                    <label class="text-sl block pb-1.5 font-bold">端口</label>
                    <p class="text-xs opacity-60">
                        默认为阿里云 Codeup OpenAPI 地址，使用专有云时可自定义
                    </p>
                    <input
                        v-model="configData.endpoint"
                        type="text"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
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
        <!-- 保存之后选项卡是否跳过LLM配置 -->
        <div
            v-if="nextAction"
            class="absolute inset-0 z-10 flex items-center justify-center bg-black/0"
        >
            <div class="bg-card animate-in fade-in zoom-in w-full max-w-sm rounded-2xl p-6">
                <h3 class="mb-4 text-center text-xl font-bold">保存成功</h3>
                <p class="mb-8 text-center text-gray-400">
                    配置已生效。是否现在去配置 LLM 模型以开启更多功能？
                </p>
                <div class="flex justify-center gap-4">
                    <button
                        @click="handleNext(false)"
                        class="flex-1 cursor-pointer rounded-xl border border-gray-300 py-2 font-medium hover:opacity-90"
                    >
                        稍后配置
                    </button>
                    <button
                        @click="handleNext(true)"
                        class="bg-primary flex-1 cursor-pointer rounded-xl py-2 font-bold text-white hover:opacity-90"
                    >
                        立即配置
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { configStore } from "@/store/config";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const config = configStore();

const router = useRouter();

const showToken = ref(false);
const disabled = ref(false);
const nextAction = ref(false);

const configData = reactive({
    type: "codeup" as "codeup" | "github",
    token: config.gitConfig.token || "",
    organization: config.gitConfig.organization || "",
    endpoint: config.gitConfig.endpoint || "https://openapi-rdc.aliyuncs.com"
});
const errors = reactive({
    token: "",
    organization: "",
    endpoint: ""
});
const validate = () => {
    let isValid = true;
    if (!configData.token) {
        errors.token = "请输入个人授权令牌";
        isValid = false;
    }
    if (!configData.organization) {
        errors.organization = "请输入组织ID";
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

    config.setGitConfig({
        ...configData
    });

    nextAction.value = true;
};

// 下一步操作是跳过LLM配置，直接跳转到首页，还是进行LLM配置
const handleNext = (isSkip: boolean) => {
    // 跳过LLM配置，直接跳转到首页
    if (isSkip !== true) {
        router.push("/");
        return;
    }
    router.push("/llm");
};
</script>
