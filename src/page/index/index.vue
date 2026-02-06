<template>
    <div class="text-main flex h-full items-center justify-center">
        <div class="bg-card w-2/4 min-w-36 rounded-lg p-8 shadow-xl">
            <h2 class="mb-6 border-b pb-10 text-center text-2xl font-bold">Git Config</h2>
            <form class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block pb-1.5 text-sm font-bold"
                        >Personal Access Token *</label
                    >
                    <input
                        :type="showToken ? 'text' : 'password'"
                        id="name"
                        class="focus:ring-primary caret-primary w-full rounded-lg border border-gray-300 px-4 py-2 transition duration-200 focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                    <input
                        class="cursor-pointer"
                        type="checkbox"
                        v-model="showToken"
                        @change="!showToken"
                    />
                    显示令牌
                    <p class="text-xs opacity-60">
                        在云效控制台获取：个人设置 -> 访问令牌 -> 新建令牌
                    </p>
                </div>

                <button
                    class="bg-primary mx-auto w-full max-w-xs transform cursor-pointer rounded-full px-4 py-2 font-bold text-white duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                    下一步
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showToken = ref(false);
</script>
