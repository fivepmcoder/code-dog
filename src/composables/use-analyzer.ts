import { ref } from "vue";
import type { Commit, CommitDiff, DiffFile } from "@/types/codeup";
import type {
    UserContribution,
    DirectoryStats,
    FileModification,
    FunctionProfile,
    RepositoryAnalysis
} from "@/types/analysis";
import { useLLM } from "./use-llm";

export function useAnalyzer() {
    const llm = useLLM();

    const loading = ref(false);
    const progress = ref(0);
    const error = ref<string | null>(null);

    async function analyzeRepository(
        repositoryId: number,
        repositoryName: string,
        commits: Commit[],
        diffs: CommitDiff[]
    ): Promise<RepositoryAnalysis> {
        loading.value = true;
        error.value = null;
        progress.value = 0;

        try {
            const userContributions = aggregateByUser(diffs);
            progress.value = 30;

            const functionProfiles: Record<string, FunctionProfile> = {};
            const userCount = userContributions.length;

            for (let i = 0; i < userContributions.length; i++) {
                const contribution = userContributions[i];
                if (!contribution) continue;

                const profile = await generateFunctionProfile(contribution);
                if (profile) {
                    functionProfiles[contribution.userId] = profile;
                }

                progress.value = 30 + ((i + 1) / userCount) * 60;
            }

            progress.value = 100;

            const analysis: RepositoryAnalysis = {
                repositoryId,
                repositoryName,
                contributors: userContributions,
                functionProfiles,
                analyzedAt: new Date().toISOString(),
                commitRange: {
                    start: commits[commits.length - 1]?.authoredDate || "",
                    end: commits[0]?.authoredDate || "",
                    total: commits.length
                }
            };

            return analysis;
        } catch (err: any) {
            error.value = err.message || "分析失败";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function aggregateByUser(diffs: CommitDiff[]): UserContribution[] {
        const userMap = new Map<string, UserContribution>();

        for (const diff of diffs) {
            const commit = diff.commit;
            const userKey = commit.authorEmail;

            let contribution = userMap.get(userKey);
            if (!contribution) {
                contribution = {
                    userId: userKey,
                    userName: commit.authorName,
                    email: commit.authorEmail,
                    totalCommits: 0,
                    totalFiles: 0,
                    directories: [],
                    activeTimeRange: {
                        start: commit.authoredDate,
                        end: commit.authoredDate
                    },
                    topFiles: []
                };
                userMap.set(userKey, contribution);
            }

            contribution.totalCommits++;

            if (commit.authoredDate < contribution.activeTimeRange.start) {
                contribution.activeTimeRange.start = commit.authoredDate;
            }
            if (commit.authoredDate > contribution.activeTimeRange.end) {
                contribution.activeTimeRange.end = commit.authoredDate;
            }

            if (diff.diffs) {
                for (const file of diff.diffs) {
                    processFileModification(contribution, file, commit.authoredDate);
                }
            }
        }

        const contributions = Array.from(userMap.values());
        for (const contribution of contributions) {
            contribution.directories = aggregateByDirectory(contribution);
            contribution.topFiles = getTopFiles(contribution, 10);
            contribution.totalFiles = contribution.topFiles.length;
        }

        return contributions;
    }

    function processFileModification(
        contribution: UserContribution,
        file: DiffFile,
        date: string
    ): void {
        const path = file.newPath || file.oldPath;
        if (!path) return;

        let fileModification = contribution.topFiles.find((f) => f.path === path);
        if (!fileModification) {
            fileModification = {
                path,
                count: 0,
                firstModified: date,
                lastModified: date
            };
            contribution.topFiles.push(fileModification);
        }

        fileModification.count++;
        if (date < fileModification.firstModified) {
            fileModification.firstModified = date;
        }
        if (date > fileModification.lastModified) {
            fileModification.lastModified = date;
        }
    }

    function aggregateByDirectory(contribution: UserContribution): DirectoryStats[] {
        const dirMap = new Map<string, DirectoryStats>();

        for (const file of contribution.topFiles) {
            const dir = getDirectoryPath(file.path);

            let dirStats = dirMap.get(dir);
            if (!dirStats) {
                dirStats = {
                    path: dir,
                    fileCount: 0,
                    modificationCount: 0,
                    files: []
                };
                dirMap.set(dir, dirStats);
            }

            dirStats.fileCount++;
            dirStats.modificationCount += file.count;
            dirStats.files.push(file);
        }

        return Array.from(dirMap.values()).sort(
            (a, b) => b.modificationCount - a.modificationCount
        );
    }

    function getDirectoryPath(filePath: string): string {
        const parts = filePath.split("/");
        if (parts.length === 1) return "/";
        return parts.slice(0, -1).join("/");
    }

    function getTopFiles(contribution: UserContribution, limit: number): FileModification[] {
        return contribution.topFiles.sort((a, b) => b.count - a.count).slice(0, limit);
    }

    async function generateFunctionProfile(
        contribution: UserContribution
    ): Promise<FunctionProfile | null> {
        try {
            const prompt = buildPromptForProfile(contribution);
            const response = await llm.complete(
                prompt,
                "你是一个代码分析专家，擅长根据 Git 提交记录分析开发者的工作内容和技术栈。"
            );

            if (!response) return null;

            const parsed = parseProfileResponse(response);

            return {
                userId: contribution.userId,
                userName: contribution.userName,
                summary: parsed.summary,
                mainModules: parsed.mainModules,
                techStack: parsed.techStack,
                confidence: parsed.confidence,
                generatedAt: new Date().toISOString()
            };
        } catch (err) {
            return null;
        }
    }

    function buildPromptForProfile(contribution: UserContribution): string {
        const directories = contribution.directories.slice(0, 5);
        const topFiles = contribution.topFiles.slice(0, 10);

        return `请分析以下开发者的贡献数据，总结其主要负责的功能模块和技术栈：

**开发者信息：**
- 姓名：${contribution.userName}
- 提交次数：${contribution.totalCommits}
- 修改文件数：${contribution.totalFiles}

**主要活跃目录：**
${directories.map((d) => `- ${d.path} (${d.modificationCount} 次修改)`).join("\n")}

**高频修改文件：**
${topFiles.map((f) => `- ${f.path} (${f.count} 次)`).join("\n")}

请以 JSON 格式返回分析结果：
{
  "summary": "简洁的功能总结（50字以内）",
  "mainModules": ["模块1", "模块2"],
  "techStack": ["技术1", "技术2"],
  "confidence": 0.85
}

只返回 JSON，不要包含其他文字。`;
    }

    function parseProfileResponse(response: string): {
        summary: string;
        mainModules: string[];
        techStack: string[];
        confidence: number;
    } {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("无法从响应中提取 JSON");
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                summary: parsed.summary || "暂无总结",
                mainModules: Array.isArray(parsed.mainModules) ? parsed.mainModules : [],
                techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
                confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5
            };
        } catch (err) {
            return {
                summary: "分析失败",
                mainModules: [],
                techStack: [],
                confidence: 0
            };
        }
    }

    return {
        loading,
        progress,
        error,
        analyzeRepository
    };
}
