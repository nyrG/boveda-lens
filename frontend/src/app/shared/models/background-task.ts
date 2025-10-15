/**
 * Defines the possible states of a background task.
 */
export type TaskStatus = 'uploading' | 'processing' | 'completed' | 'failed';

/**
 * Represents a single long-running background task.
 * This can be used to track file uploads, data processing, etc.
 */
export interface BackgroundTask<T = any> {
    id: string;
    name: string;
    status: TaskStatus;
    progress: number;
    result?: T;
    error?: any;
}
