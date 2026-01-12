<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <h3
                class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate"
                :title="title"
            >
                {{ title }}
            </h3>
            <div v-if="showTypeSwitch" class="flex space-x-2 flex-shrink-0">
                <button
                    v-for="type in chartTypes"
                    :key="type.value"
                    class="px-3 py-1 text-sm rounded-lg transition-colors"
                    :class="[
                        currentType === type.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    ]"
                    @click="currentType = type.value"
                >
                    {{ type.label }}
                </button>
            </div>
        </div>

        <div ref="chartRef" class="w-full" :style="{ height: height + 'px' }"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts/core";
import { BarChart, PieChart, LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    PieChart,
    LineChart,
    CanvasRenderer
]);

interface ChartData {
    name: string;
    value: number;
}

interface Props {
    title?: string;
    data: ChartData[];
    type?: "bar" | "pie" | "line";
    height?: number;
    showTypeSwitch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: "数据图表",
    type: "bar",
    height: 400,
    showTypeSwitch: false
});

const chartRef = ref<HTMLDivElement>();
const chartInstance = ref<echarts.ECharts>();
const currentType = ref(props.type);

const chartTypes = [
    { value: "bar" as const, label: "柱状图" },
    { value: "pie" as const, label: "饼图" },
    { value: "line" as const, label: "折线图" }
];

function initChart(): void {
    if (!chartRef.value) return;
    chartInstance.value = echarts.init(chartRef.value);
    updateChart();
}

function updateChart(): void {
    if (!chartInstance.value) return;
    chartInstance.value.setOption(getChartOption(), true);
}

function getChartOption() {
    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#E5E7EB" : "#374151";
    const backgroundColor = isDark ? "#1F2937" : "#FFFFFF";

    const baseOption = {
        backgroundColor: "transparent",
        textStyle: { color: textColor },
        tooltip: {
            trigger: "item" as const,
            backgroundColor,
            borderColor: isDark ? "#374151" : "#E5E7EB",
            textStyle: { color: textColor }
        },
        legend: {
            top: "bottom",
            textStyle: { color: textColor }
        }
    };

    if (currentType.value === "bar") {
        return {
            ...baseOption,
            tooltip: {
                ...baseOption.tooltip,
                trigger: "axis" as const,
                axisPointer: { type: "shadow" }
            },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                data: props.data.map((item) => item.name),
                axisLabel: {
                    color: textColor,
                    rotate: props.data.length > 10 ? 45 : 0,
                    overflow: "truncate",
                    width: 80
                },
                axisLine: { lineStyle: { color: isDark ? "#374151" : "#E5E7EB" } }
            },
            yAxis: {
                type: "value",
                axisLabel: { color: textColor },
                splitLine: { lineStyle: { color: isDark ? "#374151" : "#E5E7EB" } }
            },
            series: [
                {
                    type: "bar",
                    data: props.data.map((item) => item.value),
                    itemStyle: { color: "#6366F1", borderRadius: [4, 4, 0, 0] },
                    emphasis: { itemStyle: { color: "#4F46E5" } }
                }
            ]
        };
    } else if (currentType.value === "pie") {
        return {
            ...baseOption,
            series: [
                {
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 8, borderColor: backgroundColor, borderWidth: 2 },
                    label: { show: true, color: textColor, overflow: "truncate", width: 100 },
                    emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" } },
                    data: props.data.map((item, index) => ({
                        name: item.name,
                        value: item.value,
                        itemStyle: { color: getColorByIndex(index) }
                    }))
                }
            ]
        };
    } else {
        return {
            ...baseOption,
            tooltip: { ...baseOption.tooltip, trigger: "axis" as const },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                data: props.data.map((item) => item.name),
                axisLabel: { color: textColor, overflow: "truncate", width: 80 },
                axisLine: { lineStyle: { color: isDark ? "#374151" : "#E5E7EB" } }
            },
            yAxis: {
                type: "value",
                axisLabel: { color: textColor },
                splitLine: { lineStyle: { color: isDark ? "#374151" : "#E5E7EB" } }
            },
            series: [
                {
                    type: "line",
                    data: props.data.map((item) => item.value),
                    smooth: true,
                    lineStyle: { color: "#6366F1", width: 3 },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: "rgba(99, 102, 241, 0.3)" },
                                { offset: 1, color: "rgba(99, 102, 241, 0)" }
                            ]
                        }
                    },
                    itemStyle: { color: "#6366F1" }
                }
            ]
        };
    }
}

function getColorByIndex(index: number): string {
    const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#14B8A6"];
    return colors[index % colors.length] || "#6366F1";
}

function handleResize(): void {
    chartInstance.value?.resize();
}

watch(() => props.data, updateChart, { deep: true });
watch(() => currentType.value, updateChart);

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
