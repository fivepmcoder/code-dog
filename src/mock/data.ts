import type { Repository, Commit, CommitDiff, DiffFile } from "@/types/codeup";
import type { RepositoryAnalysis, UserContribution, FunctionProfile } from "@/types/analysis";

export function generateMockRepositories(count: number = 6): Repository[] {
    const repos: Repository[] = [];
    const repoNames = [
        "web-portal",
        "mobile-app",
        "backend-api",
        "admin-dashboard",
        "data-service",
        "payment-gateway"
    ];

    for (let i = 0; i < count; i++) {
        repos.push({
            id: 1000 + i,
            name: repoNames[i] || `repo-${i}`,
            nameWithNamespace: `company / ${repoNames[i] || `repo-${i}`}`,
            path: repoNames[i] || `repo-${i}`,
            pathWithNamespace: `company/${repoNames[i] || `repo-${i}`}`,
            description: `这是 ${repoNames[i] || `repo-${i}`} 项目的代码仓库`,
            visibility: "private",
            httpUrlToRepo: "",
            sshUrlToRepo: "",
            webUrl: `https://codeup.aliyun.com/company/${repoNames[i] || `repo-${i}`}`,
            defaultBranch: "master",
            createdAt: new Date(
                Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastActivityAt: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            accessLevel: "30",
            archived: false,
            avatarUrl: "",
            creatorId: 1,
            demoProject: false,
            starCount: 0,
            starred: false
        });
    }

    return repos;
}

export function generateMockCommits(count: number = 50): Commit[] {
    const commits: Commit[] = [];
    const authors = [
        { name: "张三", email: "zhangsan@company.com" },
        { name: "李四", email: "lisi@company.com" },
        { name: "王五", email: "wangwu@company.com" },
        { name: "Alice Chen", email: "alice@company.com" }
    ];

    for (let i = 0; i < count; i++) {
        const author = authors[Math.floor(Math.random() * authors.length)];
        if (!author) continue;

        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();

        commits.push({
            id: `commit-${i}-${Math.random().toString(36).substring(7)}`,
            shortId: Math.random().toString(36).substring(7),
            title: `feat: implement feature ${i}`,
            message: `feat: implement feature ${i}\n\nDetailed description of changes`,
            authorName: author.name,
            authorEmail: author.email,
            authoredDate: date,
            committerName: author.name,
            committerEmail: author.email,
            committedDate: date,
            parentIds: [],
            webUrl: ""
        });
    }

    return commits;
}

export function generateMockDiffs(commits: Commit[]): CommitDiff[] {
    const diffs: CommitDiff[] = [];
    const directories = [
        "src/components",
        "src/pages",
        "src/utils",
        "src/api",
        "src/stores",
        "src/composables"
    ];

    for (const commit of commits) {
        const fileCount = Math.floor(Math.random() * 5) + 1;
        const files: DiffFile[] = [];

        for (let i = 0; i < fileCount; i++) {
            const dir = directories[Math.floor(Math.random() * directories.length)];
            const fileName = `file-${Math.random().toString(36).substring(7)}.ts`;

            files.push({
                oldPath: `${dir}/${fileName}`,
                newPath: `${dir}/${fileName}`,
                aMode: "100644",
                bMode: "100644",
                diff: "",
                newFile: Math.random() > 0.8,
                renamedFile: false,
                deletedFile: Math.random() > 0.9
            });
        }

        diffs.push({
            commit: {
                ...commit,
                stats: {
                    additions: Math.floor(Math.random() * 100),
                    deletions: Math.floor(Math.random() * 50),
                    total: 0
                }
            },
            stats: {
                additions: Math.floor(Math.random() * 100),
                deletions: Math.floor(Math.random() * 50),
                total: 0
            },
            diffs: files
        });
    }

    return diffs;
}

export function generateMockAnalysis(
    repositoryId: number,
    repositoryName: string
): RepositoryAnalysis {
    const commits = generateMockCommits(50);
    const diffs = generateMockDiffs(commits);

    const userMap = new Map<string, UserContribution>();

    for (const diff of diffs) {
        const { commit } = diff;
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

        if (diff.diffs) {
            for (const file of diff.diffs) {
                let fileModification = contribution.topFiles.find((f) => f.path === file.newPath);
                if (!fileModification) {
                    fileModification = {
                        path: file.newPath,
                        count: 0,
                        firstModified: commit.authoredDate,
                        lastModified: commit.authoredDate
                    };
                    contribution.topFiles.push(fileModification);
                }
                fileModification.count++;
            }
        }

        contribution.totalFiles = contribution.topFiles.length;
    }

    const contributors = Array.from(userMap.values());

    const functionProfiles: Record<string, FunctionProfile> = {};
    const modulesByUser = [
        ["用户管理", "权限系统"],
        ["订单处理", "支付集成"],
        ["数据分析", "报表生成"],
        ["前端组件", "UI 交互"]
    ];

    const techStackByUser = [
        ["Vue 3", "TypeScript", "Pinia"],
        ["Node.js", "Express", "MongoDB"],
        ["Python", "Pandas", "FastAPI"],
        ["React", "Tailwind CSS", "Vite"]
    ];

    contributors.forEach((contributor, index) => {
        const modules = modulesByUser[index % modulesByUser.length] || [];
        const techStack = techStackByUser[index % techStackByUser.length] || [];

        functionProfiles[contributor.userId] = {
            userId: contributor.userId,
            userName: contributor.userName,
            summary: `主要负责${modules.join("、")}等模块的开发与维护`,
            mainModules: modules,
            techStack: techStack,
            confidence: 0.85 + Math.random() * 0.1,
            generatedAt: new Date().toISOString()
        };
    });

    return {
        repositoryId,
        repositoryName,
        contributors,
        functionProfiles,
        analyzedAt: new Date().toISOString(),
        commitRange: {
            start: commits[commits.length - 1]?.authoredDate || new Date().toISOString(),
            end: commits[0]?.authoredDate || new Date().toISOString(),
            total: commits.length
        }
    };
}
