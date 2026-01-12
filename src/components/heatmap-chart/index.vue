<template>
    <div class="card">
        <h3
            class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 truncate"
            :title="title"
        >
            {{ title }}
        </h3>
        <div ref="chartRef" class="w-full" :style="{ height: height + 'px' }"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    VisualMapComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    HeatmapChart,
    CanvasRenderer
]);

interface HeatmapData {
    x: string;
    y: string;
    value: number;
}

interface Props {
    title?: string;
    data: HeatmapData[];
    height?: number;
}

const props = withDefaults(defineProps<Props>(), {
    title: "活跃度热力图",
    height: 400
});

const chartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts>();

function initChart(): void {
    if (!chartRef.value) return;
    chartInstance.value = echarts.init(chartRef.value);
    updateChart();
}

function updateChart(): void {
    if (!chartInstance.value || props.data.length === 0) return;

    const xValues = Array.from(new Set(props.data.map((item) => item.x)));
    const yValues = Array.from(new Set(props.data.map((item) => item.y)));

    const seriesData = props.data.map((item) => [
        xValues.indexOf(item.x),
        yValues.indexOf(item.y),
        item.value
    ]);

    const maxValue = Math.max(...props.data.map((item) => item.value), 1);

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#E5E7EB" : "#374151";

    const option = {
        backgroundColor: "transparent",
        textStyle: { color: textColor },
        tooltip: {
            position: "top",
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            borderColor: isDark ? "#374151" : "#E5E7EB",
            textStyle: { color: textColor },
            formatter: (params: any) => {
                const data = params.data as number[];
                if (!data || data.length < 3) return "";

                const xIndex = data[0];
                const yIndex = data[1];
                const value = data[2];

                if (typeof xIndex !== "number" || typeof yIndex !== "number") return "";

                const xLabel = xValues[xIndex] ?? "Unknown";
                const yLabel = yValues[yIndex] ?? "Unknown";

                const truncatedXLabel = truncateText(xLabel, 50);
                const truncatedYLabel = truncateText(yLabel, 30);

                return `<div style="max-width: 300px;">
                    <div style="font-weight: 600; margin-bottom: 4px; word-break: break-all;">${truncatedXLabel}</div>
                    <div>${truncatedYLabel}: <strong>${value}</strong> 次修改</div>
                </div>`;
            }
        },
        grid: { left: "3%", right: "12%", bottom: "3%", top: "3%", containLabel: true },
        xAxis: {
            type: "category",
            data: xValues,
            splitArea: { show: true },
            axisLabel: {
                color: textColor,
                rotate: 45,
                interval: 0,
                fontSize: 11,
                overflow: "truncate",
                width: 80
            },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        yAxis: {
            type: "category",
            data: yValues,
            splitArea: { show: true },
            axisLabel: { color: textColor, fontSize: 11, overflow: "truncate", width: 100 },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        visualMap: {
            min: 0,
            max: maxValue,
            calculable: true,
            orient: "vertical",
            right: "0%",
            top: "center",
            textStyle: { color: textColor },
            inRange: {
                color: ["#EEF2FF", "#C7D2FE", "#A5B4FC", "#818CF8", "#6366F1", "#4F46E5"]
            }
        },
        series: [
            {
                type: "heatmap",
                data: seriesData,
                label: { show: false },
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(0, 0, 0, 0.5)" } }
            }
        ]
    };

    chartInstance.value.setOption(option, true);
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}

function handleResize(): void {
    chartInstance.value?.resize();
}

watch(() => props.data, updateChart, { deep: true });

onMounted(() => {
    initChart();
    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(() => updateChart());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    chartInstance.value?.dispose();
});
</script>
