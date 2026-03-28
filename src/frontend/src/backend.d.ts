import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LicenseKey {
    key: string;
    activatedBy?: Principal;
    createdAt: Time;
    isActive: boolean;
}
export type Time = bigint;
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    author: string;
    imageUrl: string;
    timestamp: Time;
    category: string;
}
export interface UserProfile {
    displayName: string;
    bio: string;
    updatedAt: Time;
}
export interface AIHistoryEntry {
    id: bigint;
    toolName: string;
    input: string;
    output: string;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateKey(key: string): Promise<boolean>;
    addCustomKey(customKey: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkKeyValid(key: string): Promise<boolean>;
    createBlogPost(title: string, content: string, author: string, category: string, imageUrl: string): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    generateKey(): Promise<string>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllKeys(): Promise<Array<LicenseKey>>;
    getBlogPostById(id: bigint): Promise<BlogPost>;
    getCallerUserRole(): Promise<UserRole>;
    getUserKeys(): Promise<Array<LicenseKey>>;
    hasProStatus(): Promise<boolean>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    revokeKey(key: string): Promise<boolean>;
    setGroqApiKey(key: string): Promise<void>;
    callGroqAI(prompt: string, systemPrompt: string): Promise<string>;
    updateUserProfile(displayName: string, bio: string): Promise<void>;
    getUserProfile(user: Principal): Promise<UserProfile | undefined>;
    getMyProfile(): Promise<UserProfile | undefined>;
    saveAIHistory(toolName: string, input: string, output: string): Promise<bigint>;
    getMyHistory(): Promise<Array<AIHistoryEntry>>;
    clearMyHistory(): Promise<void>;
}
