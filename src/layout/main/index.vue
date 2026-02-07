<template>
    <main class="container mx-auto flex-1 overflow-auto">
        <!-- 全局加载组件 -->
        <Loading />
        <!-- 全局提示组件 -->
        <Toast />
        <!-- 路由视图 -->
        <router-view />
    </main>
</template>

<script setup lang="ts">
import Loading from "@/components/loading/index.vue";
import Toast from "@/components/toast/index.vue";
</script>
