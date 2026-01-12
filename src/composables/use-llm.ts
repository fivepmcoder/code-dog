import { ref } from "vue";
import axios, { type AxiosInstance } from "axios";
import { useConfigStore } from "@/stores/config";

export interface LLMMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface LLMResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export function useLLM() {
    const configStore = useConfigStore();

    const loading = ref(false);
    const error = ref<string | null>(null);

    function createClient(): AxiosInstance {
        const { endpoint, apiKey } = configStore.llmConfig;

        return axios.create({
            baseURL: endpoint,
            timeout: 60000,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json"
            }
        });
    }

    function parseLLMResponse(data: any): LLMResponse {
        if (!data) {
            throw new Error("响应数据为空");
        }

        if (data.choices && Array.isArray(data.choices)) {
            if (data.choices.length === 0) {
                throw new Error("choices 数组为空");
            }

            const choice = data.choices[0];

            if (choice.message?.content) {
                return {
                    content: choice.message.content,
                    usage: data.usage
                        ? {
                              promptTokens: data.usage.prompt_tokens || 0,
                              completionTokens: data.usage.completion_tokens || 0,
                              totalTokens: data.usage.total_tokens || 0
                          }
                        : undefined
                };
            }

            if (choice.delta?.content) {
                return {
                    content: choice.delta.content,
                    usage: data.usage
                        ? {
                              promptTokens: data.usage.prompt_tokens || 0,
                              completionTokens: data.usage.completion_tokens || 0,
                              totalTokens: data.usage.total_tokens || 0
                          }
                        : undefined
                };
            }

            if (choice.text) {
                return {
                    content: choice.text,
                    usage: data.usage
                        ? {
                              promptTokens: data.usage.prompt_tokens || 0,
                              completionTokens: data.usage.completion_tokens || 0,
                              totalTokens: data.usage.total_tokens || 0
                          }
                        : undefined
                };
            }

            throw new Error("choice 中缺少 content 字段");
        }

        if (data.content && typeof data.content === "string") {
            return { content: data.content };
        }

        if (data.result) {
            return {
                content: typeof data.result === "string" ? data.result : JSON.stringify(data.result)
            };
        }

        throw new Error(
            `不支持的响应格式\n响应键: ${Object.keys(data).join(
                ", "
            )}\n请检查 endpoint 和 model 配置是否正确`
        );
    }

    async function chat(messages: LLMMessage[]): Promise<LLMResponse | null> {
        loading.value = true;
        error.value = null;

        try {
            const client = createClient();
            const { model, temperature, maxTokens } = configStore.llmConfig;

            const response = await client.post("/chat/completions", {
                model,
                messages,
                temperature: temperature || 0.7,
                max_tokens: maxTokens || 2000,
                stream: false
            });

            if (!response.data) {
                throw new Error("响应数据为空");
            }

            return parseLLMResponse(response.data);
        } catch (err: any) {
            let errorMessage = "LLM 调用失败";

            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;

                switch (status) {
                    case 401:
                        errorMessage = "API Key 无效或已过期";
                        break;
                    case 403:
                        errorMessage = "无权访问该模型";
                        break;
                    case 404:
                        errorMessage = "模型不存在或 endpoint 错误";
                        break;
                    case 429:
                        errorMessage = "请求频率过高，请稍后重试";
                        break;
                    case 400:
                        errorMessage = data?.error?.message || data?.message || "请求参数错误";
                        break;
                    case 500:
                    case 502:
                    case 503:
                        errorMessage = "服务暂时不可用";
                        break;
                    default:
                        errorMessage =
                            data?.error?.message || data?.message || `HTTP ${status} 错误`;
                }
            } else if (err.request) {
                errorMessage = "网络连接失败，请检查 endpoint 配置";
            } else {
                errorMessage = err.message;
            }

            error.value = errorMessage;
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function complete(prompt: string, systemPrompt?: string): Promise<string | null> {
        const messages: LLMMessage[] = [];

        if (systemPrompt) {
            messages.push({
                role: "system",
                content: systemPrompt
            });
        }

        messages.push({
            role: "user",
            content: prompt
        });

        const response = await chat(messages);
        return response?.content || null;
    }

    async function testConnection(): Promise<boolean> {
        loading.value = true;
        error.value = null;

        try {
            const result = await complete('Reply with "OK"', "You are a helpful assistant.");
            const success = result !== null && result.trim().length > 0;

            if (!success) {
                error.value = error.value || "响应为空";
            }

            return success;
        } catch (err: any) {
            error.value = err.message || "连接测试失败";
            return false;
        } finally {
            loading.value = false;
        }
    }

    function validateConfig(): { valid: boolean; message?: string } {
        const { endpoint, apiKey, model } = configStore.llmConfig;

        if (!endpoint?.trim()) {
            return { valid: false, message: "请配置 LLM Endpoint" };
        }

        if (!apiKey?.trim()) {
            return { valid: false, message: "请配置 LLM API Key" };
        }

        if (!model?.trim()) {
            return { valid: false, message: "请配置 LLM Model" };
        }

        try {
            new URL(endpoint);
        } catch {
            return { valid: false, message: "Endpoint 格式不正确" };
        }

        return { valid: true };
    }

    return {
        loading,
        error,
        chat,
        complete,
        testConnection,
        validateConfig
    };
}
