// Shared types for Flagout
// These types are used by both the web dashboard and the API server

export interface FeatureFlag {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    enabled: boolean;
    environment: string;
    rollout_percentage: number;
    targeting: unknown;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    projectId: string;
    createdAt: Date;
    expiresAt: Date | null;
}

export interface EvaluationResult {
    flagKey: string;
    enabled: boolean;
    value: unknown;
    reason: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
