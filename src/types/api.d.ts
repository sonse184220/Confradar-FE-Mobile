export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    errors: Record<string, string[]> | {};
}

export interface AuthResponse {
    Success: boolean;
    Message: string;
    Data: {
        user: User;
        token: string;
    };
    Errors: Record<string, string[]> | {};
}