// 仓库配置
export interface GitConfig {
    type: "codeup" | "github";
    token: string;
    endpoint?: string;
    organization?: string;
}

// 模型配置
export interface LLMConfig {
    endpoint: string;
    apiKey?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
