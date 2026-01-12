import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
    const isDark = ref(false);

    function initTheme(): void {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            isDark.value = savedTheme === "dark";
        } else {
            isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        applyTheme();
    }

    function applyTheme(): void {
        if (isDark.value) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    function toggleTheme(): void {
        isDark.value = !isDark.value;
        localStorage.setItem("theme", isDark.value ? "dark" : "light");
        applyTheme();
    }

    watch(isDark, applyTheme);

    return {
        isDark,
        initTheme,
        toggleTheme
    };
});
