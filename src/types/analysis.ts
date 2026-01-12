import type { Repository } from "./codeup";

export interface FileModification {
    path: string;
    count: number;
    firstModified: string;
    lastModified: string;
}

export interface DirectoryStats {
    path: string;
    fileCount: number;
    modificationCount: number;
    files: FileModification[];
}

export interface UserContribution {
    userId: string;
    userName: string;
    email: string;
    totalCommits: number;
    totalFiles: number;
    directories: DirectoryStats[];
    activeTimeRange: {
        start: string;
        end: string;
    };
    topFiles: FileModification[];
}

export interface FunctionProfile {
    userId: string;
    userName: string;
    summary: string;
    mainModules: string[];
    techStack: string[];
    confidence: number;
    generatedAt: string;
}

export interface RepositoryAnalysis {
    repositoryId: number;
    repositoryName: string;
    branch?: string;
    contributors: UserContribution[];
    functionProfiles: Record<string, FunctionProfile>;
    analyzedAt: string;
    commitRange: {
        start: string;
        end: string;
        total: number;
        analyzed?: number;
    };
}

export interface TeamOverview {
    totalContributors: number;
    totalRepositories: number;
    totalCommits: number;
    activeRepositories: Repository[];
    topContributors: Array<{
        name: string;
        commits: number;
        repositories: number;
    }>;
}
