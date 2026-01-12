import { defineStore } from "pinia";
import { ref } from "vue";
import type { Repository } from "@/types/codeup";

export const useDataStore = defineStore("data", () => {
    const repositories = ref<Repository[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    function setRepositories(repos: Repository[]): void {
        repositories.value = repos;
    }

    function setLoading(isLoading: boolean): void {
        loading.value = isLoading;
    }

    function setError(errorMessage: string | null): void {
        error.value = errorMessage;
    }

    function clearData(): void {
        repositories.value = [];
        error.value = null;
    }

    function getRepositoryById(id: number): Repository | undefined {
        return repositories.value.find((repo) => repo.id === id);
    }

    return {
        repositories,
        loading,
        error,
        setRepositories,
        setLoading,
        setError,
        clearData,
        getRepositoryById
    };
});
