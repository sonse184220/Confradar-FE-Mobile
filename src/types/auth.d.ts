export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    birthday?: string; // ISO date string
    phoneNumber?: string;
    gender?: 'Male' | 'Female' | 'Other';
    bioDescription?: string;
    avatarFile?: File | Blob;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}