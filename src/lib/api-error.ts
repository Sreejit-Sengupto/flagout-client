// utils/api-error.ts
export class ApiError extends Error {
    status: number;
    details?: string;

    constructor(status: number, message: string, details?: string) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
