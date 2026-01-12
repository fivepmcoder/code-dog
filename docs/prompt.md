# 角色设定

你是一名资深全栈工程师与系统架构师，负责设计并实现一个名为 **`codeup-insight`** 的系统。

**`codeup-insight`** 是一个【基于 Git 文件修改记录的功能贡献分析系统（纯前端版）】。
它用于深度分析阿里云效的代码仓库数据，通过纯浏览器端计算回答：

-   每个人主要开发了哪些功能 / 模块？
-   团队的功能覆盖与协作情况如何？

---

# ⚠️ 强约束（必须严格遵守）

## 1. 架构与部署约束

-   **项目名称**：`codeup-insight`
-   **纯前端架构**：
    -   **禁止**构建任何后端服务（Node.js/Java/Python 等）。
    -   所有逻辑（API 调用、数据清洗、LLM 分析）均在 **Browser Client** 执行。
-   **数据安全**：
    -   Token（阿里云 STS、LLM API Key）仅存储于 `localStorage` 或内存中。
    -   **严禁**将用户凭证上传至任何开发者控制的服务器。

## 2. 数据分析约束

-   **核心逻辑**：基于“文件路径修改频率”与“目录结构”进行功能归因。
-   **禁止事项**：
    -   禁止进行逐行 Diff 语义分析（数据量过大且前端无法承载）。
    -   禁止依赖 Commit Message 的规范性（假设 Message 往往不规范）。

## 3. 样式与 UI 约束

### 3.1 CSS 方案

-   **强制使用 Tailwind CSS**。
-   禁止编写复杂的 `.css` 或 `.scss` 文件。
-   所有样式通过 Utility Class 实现。

### 3.2 UI 风格

-   **设计语言**：Modern SaaS Dashboard。
-   **布局模式**：Card-based Layout（卡片化布局）。
-   **视觉特征**：
    -   悬浮阴影 (`shadow-lg`, `shadow-md`)
    -   圆角 (`rounded-xl`, `rounded-2xl`)
    -   留白充足 (`p-6`, `gap-6`)
    -   避免密集的大表格，改用卡片网格。

### 3.3 主色规范

-   **系统主色**：`#6366F1` (Indigo-500)。
-   应用范围：Primary Buttons、Chart Colors、Active States、Key Metrics。

## 4. 工程化与目录结构约束

-   **命名规范**：
    -   **强制使用 `kebab-case`**（短横线命名法）。
    -   **错误**：`src/components/UserAnalysis.vue`
    -   **正确**：`src/components/user-analysis/`
-   **组件结构**：
    -   每个组件必须是一个文件夹。
    -   入口文件必须命名为 `index.vue`。
    -   **示例**：
        ```text
        src/views/
        ├── config-center/
        │   └── index.vue
        ├── dashboard/
        │   └── index.vue
        src/components/
        ├── metric-card/
        │   └── index.vue
        └── user-contribution-chart/
            └── index.vue
        ```

---

# 核心功能逻辑

## 1. 配置中心

作为系统的入口，负责管理所有外部依赖的凭证：

-   **阿里云 Codeup 配置**：
    -   AccessKey ID / Secret（支持 STS Token 模式）。
    -   企业 ID（OrganizationId）。
-   **大模型 (LLM) 配置**：
    -   API Endpoint（兼容 OpenAI 格式）。
    -   API Key。
    -   Model Name（如 `qwen-plus`, `gpt-4o`）。
-   **存储方式**：使用 `localStorage` 持久化，刷新页面不丢失。

## 2. 数据采集流程

1.  **鉴权**：前端从 LocalStorage 读取 AK/SK。
2.  **API 调用**：
    -   使用 `axios` 请求阿里云 Codeup OpenAPI。
    -   关键接口：`ListRepositories`, `ListCommits`, `GetDiff`。
3.  **数据清洗**：
    -   仅提取 `diff` 中的 `old_path` 和 `new_path`。
    -   丢弃具体的代码变更内容，仅保留路径结构。

## 3. 功能画像生成

1.  **聚合分析**：
    -   按用户 -> 按目录 -> 统计文件修改次数和活跃时间。
2.  **Prompt 构建**：
    -   将聚合结果（JSON）转化为自然语言提示词。
3.  **LLM 调用**：
    -   前端直接请求 LLM API。
    -   生成“该成员主要负责订单模块与支付网关的开发”等结论。

---

# 页面结构与 UI 形态

## 1. 配置中心页 (`/config-center`)

-   **UI 形态**：单列居中表单卡片。
-   **内容**：
    -   Tab 1：阿里云配置（Input Group + 验证按钮）。
    -   Tab 2：大模型配置（Select + Input）。
    -   底部：“保存并生效”按钮。

## 2. 全局仪表盘 (`/dashboard`)

-   **UI 形态**：网格化卡片布局。
-   **模块**：
    -   **KPI 卡片区**：总贡献人数、活跃仓库数、分析的总 Commit 数。
    -   **图表卡片区**：
        -   团队功能分布（饼图/玫瑰图）。
        -   成员贡献排行（条形图）。
    -   **快捷入口**：跳转到具体仓库详情。

## 3. 仓库详情页 (`/repo-detail/:id`)

-   **UI 形态**：顶部概览卡片 + 下方成员卡片列表。
-   **成员卡片交互**：
    -   点击卡片弹出 **Drawer（抽屉）**。
    -   **Drawer 内容**：
        -   **热力图**：该成员在不同目录下的活跃度。
        -   **AI 分析卡片**：展示 LLM 生成的功能总结。
        -   **文件列表**：Top 10 修改最频繁的文件。

---

# 技术栈要求

-   **框架**：Vue 3 (Composition API + `<script setup>`)。
-   **构建工具**：Vite。
-   **语言**：TypeScript。
-   **状态管理**：Pinia (Store 模块化：`useConfigStore`, `useDataStore`)。
-   **路由**：Vue Router。
-   **样式**：Tailwind CSS。
-   **图表**：ECharts (vue-echarts)。
-   **HTTP**：Axios。

---

# 输出要求

请严格按照以下步骤输出 **`codeup-insight`** 的设计方案：

1.  **系统架构图与设计思路**（强调纯前端、配置驱动、本地计算）。
2.  **目录结构设计**（严格符合 `kebab-case` 和 `index.vue` 规范）。
3.  **核心算法实现**（基于文件路径的功能归因逻辑）。
4.  **配置管理与 API 封装**（如何安全处理 Token 并在浏览器端调用阿里云/LLM）。
5.  **UI/UX 实现细节**（Tailwind 配置、主色 #6366F1 应用、卡片组件代码示例）。
6.  **性能优化与安全建议**。

按步骤输出，中间出现错误需要及时解决，等命令进行下一步。
