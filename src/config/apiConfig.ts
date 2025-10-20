import { ENV } from "./env";

export const API_CONFIG = {
    baseURL: ENV.API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};