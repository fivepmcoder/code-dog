export interface ApiResponse<T> {
    success?: boolean;
    result?: T;
    errorMessage?: string;
    errorCode?: string;
}

export interface PaginationHeaders {
    "x-page": string;
    "x-per-page": string;
    "x-total": string;
    "x-total-pages": string;
    "x-next-page"?: string;
    "x-prev-page"?: string;
    "x-request-id": string;
}

export interface Repository {
    id: number;
    name: string;
    nameWithNamespace: string;
    path: string;
    pathWithNamespace: string;
    description: string;
    visibility: "private" | "internal" | "public";
    httpUrlToRepo: string;
    sshUrlToRepo: string;
    webUrl: string;
    defaultBranch: string;
    createdAt: string;
    updatedAt: string;
    lastActivityAt: string;
    accessLevel: string;
    archived: boolean;
    avatarUrl: string;
    creatorId: number;
    demoProject: boolean;
    encrypted?: boolean;
    namespaceId?: number;
    repositorySize?: string;
    starCount: number;
    starred: boolean;
}

export interface RepositoryDetail extends Repository {
    adminSettingLanguage: string;
    allowPush: boolean;
    cloneDownloadControlGray: boolean;
    enableCloneDownloadControl: boolean;
    forkCount: number;
    openCloneDownloadControl: boolean;
    projectType: number;
    namespace: RepositoryNamespace;
    owner: RepositoryOwner;
    permissions: RepositoryPermissions;
}

export interface RepositoryNamespace {
    id: number;
    name: string;
    path: string;
    avatar: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    ownerId: number;
    visibility: "private" | "internal" | "public";
}

export interface RepositoryOwner {
    id: number;
    userId: string;
    username: string;
    name: string;
    email: string;
    avatarUrl: string;
    webUrl: string;
    state: "active" | "blocked";
}

export interface RepositoryPermissions {
    projectAccess?: {
        accessLevel: string;
        notificationLevel: number;
    };
    groupAccess?: {
        accessLevel: string;
        notificationLevel: number;
    };
}

export interface ListRepositoriesParams {
    page?: number;
    perPage?: number;
    orderBy?: "created_at" | "name" | "path" | "last_activity_at";
    sort?: "asc" | "desc";
    search?: string;
    archived?: boolean;
}

export interface Branch {
    name: string;
    defaultBranch: boolean;
    protected: boolean;
    webUrl: string;
    commit: BranchCommit;
}

export interface BranchCommit {
    id: string;
    shortId: string;
    title: string;
    message: string;
    authorName: string;
    authorEmail: string;
    authoredDate: string;
    committerName: string;
    committerEmail: string;
    committedDate: string;
    parentIds: string[];
    webUrl: string;
    stats: CommitStats;
}

export interface ListBranchesParams {
    page?: number;
    perPage?: number;
    sort?: "name_asc" | "name_desc" | "updated_asc" | "updated_desc";
    search?: string;
}

export interface Commit {
    id: string;
    shortId: string;
    title: string;
    message: string;
    authorName: string;
    authorEmail: string;
    authoredDate: string;
    committerName: string;
    committerEmail: string;
    committedDate: string;
    parentIds: string[];
    webUrl: string;
}

export interface CommitStats {
    additions: number;
    deletions: number;
    total: number;
}

export interface CommitDetail extends Commit {
    stats: CommitStats;
}

export interface ListCommitsParams {
    repositoryId: number | string;
    refName?: string;
    since?: string;
    until?: string;
    page?: number;
    perPage?: number;
    path?: string;
    search?: string;
    showSignature?: boolean;
    committerIds?: string;
}

export interface GetCommitParams {
    organizationId: string;
    repositoryId: number | string;
    sha: string;
}

export interface CommitDiff {
    commit: CommitDetail;
    stats: CommitStats;
    diffs?: DiffFile[];
}

export interface DiffFile {
    oldPath: string;
    newPath: string;
    aMode: string;
    bMode: string;
    diff: string;
    newFile: boolean;
    renamedFile: boolean;
    deletedFile: boolean;
}

export interface GetCommitDiffParams {
    organizationId: string;
    repositoryId: number | string;
    sha: string;
}

export interface RepositoryMember {
    id: number;
    userId: string;
    username: string;
    name: string;
    avatarUrl: string;
    webUrl: string;
    state: "active" | "blocked";
    accessLevel: number;
    expiresAt?: string;
}

export interface ListMembersParams {
    accessLevel?: 0 | 20 | 30 | 40;
}
