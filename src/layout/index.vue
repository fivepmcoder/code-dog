<template>
    <div class="flex h-dvh overflow-hidden">
        <!-- 侧边栏 -->
        <div class="flex flex-1 flex-col overflow-hidden">
            <!-- 导航栏 -->
            <Header class="shrink-0" @toggle-theme="themeToggle" />
            <!-- 主内容 -->
            <Main class="flex-1" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { themeStore } from "@/store/theme/index";
import { nextTick, onMounted } from "vue";
import Header from "@/layout/header/index.vue";
import Main from "@/layout/main/index.vue";

// 初始化主题
const theme = themeStore();
onMounted(() => {
    theme.initTheme();
});

/**
 * 计算从点击位置到屏幕四角的最大距离
 * 确保圆形动画能够覆盖整个屏幕
 * @param x 点击x坐标
 * @param y 点击y坐标
 */
const computeMaxRadios = (x: number, y: number): number => {
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    return Math.hypot(maxX, maxY);
};

/**
 * 主题切换逻辑
 * 使用 View Transitions API 实现从点击位置扩散的动画效果
 * @param event 点击事件对象
 */
const themeToggle = async (event: MouseEvent) => {
    // 检查浏览器是否支持
    const isSupported =
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 不支持的浏览器直接切换
    if (!isSupported) {
        theme.toggleTheme();
        return;
    }

    // 获取点击位置
    const x = event.clientX;
    const y = event.clientY;
    // 计算覆盖全屏所需的最大半径
    const endRadius = computeMaxRadios(x, y);

    // 启动视图过渡
    const transition = (document as any).startViewTransition(async () => {
        // 在回调中执行实际的主题切换
        theme.toggleTheme();
        await nextTick();
    });
    // 等待过渡完成
    await transition.ready;

    // 定义 clip-path 动画关键帧
    // 起始：点击位置的 0 像素圆
    // 结束：覆盖全屏的大圆
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    // 应用动画到对应的伪元素
    document.documentElement.animate(
        {
            clipPath: theme.isDark ? [...clipPath].reverse() : clipPath
        },
        {
            duration: 600,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: theme.isDark
                ? "::view-transition-old(root)"
                : "::view-transition-new(root)"
        }
    );
};
</script>
