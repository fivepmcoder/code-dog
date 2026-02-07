import { defineStore } from "pinia";

export const loadingStore = defineStore("loading", {
    state: () => ({
        count: 0,
        text: "Loading",
        textStack: [] as string[]
    }),

    getters: {
        loading: (state) => state.count > 0
    },

    actions: {
        setLoading(value: boolean, text = "Loading") {
            if (value) {
                this.count++;
                this.text = text;
                this.textStack.push(text);
            } else {
                this.count = Math.max(0, this.count - 1);
                this.textStack.pop();
                this.text = this.textStack[this.textStack.length - 1] || "Loading";
            }
        }
    }
});
