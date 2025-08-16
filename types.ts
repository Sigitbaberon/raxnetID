export enum ActionType {
    LIKE = 'like',
    COMMENT = 'comment',
    SHARE = 'share',
    FOLLOW = 'follow',
    SUBSCRIBE = 'subscribe'
}

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export interface User {
    id: string; // Changed to string for Supabase UUID
    username: string;
    email: string;
    coinBalance: number;
}

export interface Task {
    id: number;
    creatorId: string; // Changed to string for Supabase UUID
    creatorUsername: string;
    url: string;
    actionType: ActionType;
    coinReward: number;
    status: TaskStatus;
    completerId?: string | null; // Changed to string for Supabase UUID
}

export interface Transaction {
    id: number;
    userId: string; // Changed to string for Supabase UUID
    taskId: number;
    type: 'debit' | 'credit';
    amount: number;
    timestamp: string;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}