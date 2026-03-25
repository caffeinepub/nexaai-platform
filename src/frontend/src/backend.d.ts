import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    author: string;
    imageUrl: string;
    timestamp: Time;
    category: string;
}
export type Time = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, author: string, category: string, imageUrl: string): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getBlogPostById(id: bigint): Promise<BlogPost>;
    getCallerUserRole(): Promise<UserRole>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
}
