<template>
    <div class="text-main flex h-full items-center justify-center">
        <div class="bg-card w-2/4 min-w-36 rounded-lg p-8 shadow-xl">
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
                    class="bg-primary mx-auto w-full max-w-xs transform cursor-pointer rounded-full px-4 py-2 font-bold text-white duration-500 hover:-translate-y-0.5 hover:shadow-xl"
                >
                    下一步
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const useConfig = useConfigStore();

const router = useRouter();

const showToken = ref(false);
const disabled = ref(false);

const configData = reactive({
    type: "codeup" as "codeup" | "github",
    token: useConfig.gitConfig.token || "",
    organization: useConfig.gitConfig.organization || "",
    endpoint: useConfig.gitConfig.endpoint || "https://openapi-rdc.aliyuncs.com"
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

    useConfig.setGitConfig({
        ...configData
    });

    router.push("/");
};
</script>
