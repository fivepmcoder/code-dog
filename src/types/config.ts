export interface CodeupConfig {
    accessKeyId: string;
    accessKeySecret: string;
    organizationId: string;
    endpoint?: string;
    securityToken?: string;
}

export interface LLMConfig {
    endpoint: string;
    apiKey: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
}

export interface AppConfig {
    codeup: CodeupConfig;
    llm: LLMConfig;
}

export interface ConfigValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}
