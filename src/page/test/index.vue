<template>
    <div class="space-y-8 p-8">
        <h1 class="mb-8 text-3xl font-bold">Toast & Loading 测试</h1>

        <!-- Toast 测试区 -->
        <section class="space-y-4">
            <h2 class="text-2xl font-semibold">Toast 测试</h2>

            <div class="flex flex-wrap gap-4">
                <button
                    @click="testToastInfo"
                    class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                    Info Toast
                </button>

                <button
                    @click="testToastSuccess"
                    class="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                    Success Toast
                </button>

                <button
                    @click="testToastWarning"
                    class="rounded bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                >
                    Warning Toast
                </button>

                <button
                    @click="testToastError"
                    class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                    Error Toast
                </button>
            </div>

            <div class="mt-4 flex flex-wrap gap-4">
                <button
                    @click="testToastWithTitle"
                    class="rounded bg-purple-500 px-4 py-2 text-white transition hover:bg-purple-600"
                >
                    Toast 带标题
                </button>

                <button
                    @click="testMultipleToasts"
                    class="rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-600"
                >
                    多个 Toast
                </button>

                <button
                    @click="testLongToast"
                    class="rounded bg-pink-500 px-4 py-2 text-white transition hover:bg-pink-600"
                >
                    长时间 Toast (10s)
                </button>

                <button
                    @click="toast.remoteAllToast()"
                    class="rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
                >
                    清除所有 Toast
                </button>
            </div>
        </section>

        <!-- Loading 测试区 -->
        <section class="space-y-4">
            <h2 class="text-2xl font-semibold">Loading 测试</h2>

            <div class="flex flex-wrap gap-4">
                <button
                    @click="testLoading"
                    class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                    显示 Loading (3秒)
                </button>

                <button
                    @click="testLoadingWithCustomText"
                    class="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                >
                    自定义文字 Loading
                </button>

                <button
                    @click="loading.setLoading(false)"
                    class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                    手动关闭 Loading
                </button>
            </div>
        </section>

        <!-- 组合测试区 -->
        <section class="space-y-4">
            <h2 class="text-2xl font-semibold">组合测试</h2>

            <div class="flex flex-wrap gap-4">
                <button
                    @click="testLoadingWithToast"
                    class="rounded bg-purple-500 px-4 py-2 text-white transition hover:bg-purple-600"
                >
                    Loading + Toast 组合
                </button>

                <button
                    @click="testApiRequest"
                    class="rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-600"
                >
                    模拟 API 请求
                </button>

                <button
                    @click="testMultipleConcurrent"
                    class="rounded bg-pink-500 px-4 py-2 text-white transition hover:bg-pink-600"
                >
                    并发多个请求
                </button>
            </div>
        </section>

        <!-- 状态显示 -->
        <section class="space-y-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h2 class="text-xl font-semibold">当前状态</h2>
            <div class="space-y-2 font-mono text-sm">
                <div>Loading 状态: {{ loading.loading ? "显示中" : "隐藏" }}</div>
                <div>Loading 文字: {{ loading.text }}</div>
                <div>Toast 数量: {{ toast.toasts.length }}</div>
                <div v-if="toast.toasts.length > 0" class="mt-2">
                    <div class="mb-1 font-semibold">活跃的 Toasts:</div>
                    <div v-for="t in toast.toasts" :key="t.id" class="ml-4">
                        - [{{ t.type }}] {{ t.title || "" }} {{ t.message }}
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { toastStore } from "@/store/toast";
import { loadingStore } from "@/store/loading";

const toast = toastStore();
const loading = loadingStore();

// Toast 测试函数
const testToastInfo = () => {
    toast.info("这是一条普通信息提示");
};

const testToastSuccess = () => {
    toast.success("操作成功完成！");
};

const testToastWarning = () => {
    toast.warning("请注意，磁盘空间不足");
};

const testToastError = () => {
    toast.error("网络连接失败，请检查网络设置");
};

const testToastWithTitle = () => {
    toast.success("数据已保存到服务器", 3000, "保存成功");
};

const testMultipleToasts = () => {
    toast.info("第一条消息");
    setTimeout(() => toast.success("第二条消息"), 500);
    setTimeout(() => toast.warning("第三条消息"), 1000);
    setTimeout(() => toast.error("第四条消息"), 1500);
};

const testLongToast = () => {
    toast.info("这条消息会显示 10 秒", 10000, "长时间提示");
};

// Loading 测试函数
const testLoading = () => {
    loading.setLoading(true, "加载中...");
    setTimeout(() => {
        loading.setLoading(false);
        toast.success("加载完成！");
    }, 3000);
};

const testLoadingWithCustomText = () => {
    loading.setLoading(true, "正在处理您的请求...");
    setTimeout(() => {
        loading.setLoading(false);
    }, 2000);
};

// 组合测试
const testLoadingWithToast = () => {
    // 先显示一个 Toast
    toast.info("开始处理...");

    // 1秒后显示 Loading
    setTimeout(() => {
        loading.setLoading(true, "处理中...");
    }, 1000);

    // 3秒后关闭 Loading 并显示成功 Toast
    setTimeout(() => {
        loading.setLoading(false);
        toast.success("处理完成！", 3000, "操作成功");
    }, 4000);
};

const testApiRequest = async () => {
    loading.setLoading(true, "正在保存数据...");

    try {
        // 模拟 API 请求
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 随机成功或失败
        if (Math.random() > 0.3) {
            toast.success("数据保存成功！", 3000, "操作成功");
        } else {
            throw new Error("保存失败");
        }
    } catch (error) {
        toast.error("保存失败，请重试", 3000, "错误");
    } finally {
        loading.setLoading(false);
    }
};

const testMultipleConcurrent = () => {
    // 模拟多个并发请求
    loading.setLoading(true, "请求1处理中...");

    setTimeout(() => {
        loading.setLoading(true, "请求2处理中...");
    }, 500);

    setTimeout(() => {
        loading.setLoading(true, "请求3处理中...");
    }, 1000);

    // 依次完成
    setTimeout(() => {
        loading.setLoading(false);
        toast.success("请求1完成");
    }, 2000);

    setTimeout(() => {
        loading.setLoading(false);
        toast.success("请求2完成");
    }, 3000);

    setTimeout(() => {
        loading.setLoading(false);
        toast.success("请求3完成");
    }, 4000);
};
</script>
