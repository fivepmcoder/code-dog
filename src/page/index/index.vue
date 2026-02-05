<template>
    <div class="h-full flex justify-center items-center p-4 text-main">
        <div class="bg-card w-2/4 min-w-36 p-8 rounded-lg shadow-xl">
            <h2 class="text-2xl font-bold text-center border-b pb-10 mb-6">Git Config</h2>
            <form class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block text-sm font-bold pb-1.5"
                        >Personal Access Token *</label
                    >
                    <input
                        :type="showToken ? 'text' : 'password'"
                        id="name"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 caret-primary"
                    />
                    <input
                        class="cursor-pointer"
                        type="checkbox"
                        v-model="showToken"
                        @change="!showToken"
                    />
                    显示令牌
                    <p class="opacity-60 text-xs">
                        在云效控制台获取：个人设置 -> 访问令牌 -> 新建令牌
                    </p>
                </div>

                <button
                    class="cursor-pointer w-full max-w-xs mx-auto bg-primary text-white font-bold py-2 px-4 rounded-full transform duration-500 hover:-translate-y-1 hover:shadow-2xl"
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
