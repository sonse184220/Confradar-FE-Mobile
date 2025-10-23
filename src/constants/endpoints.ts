export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/Auth/login',
        REGISTER: '/Auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/Auth/forget-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
        PROFILE: '/users',
        UPDATE_PROFILE: '/users/profile',
        UPLOAD_AVATAR: '/users/avatar',
        CHANGE_PASSWORD: '/users/change-password',
        DELETE_ACCOUNT: '/users/account',
    },
    CONFERENCE: {
        GET_ALL: '/Conference',
        GET_BY_ID: '/Conference',
    },
    CONFERENCE_CATEGORY: {
        GET_ALL: '/ConferenceCategory',
        GET_BY_ID: '/api/conferencecategory',
    },
    TRANSACTION: {
        GET_OWN: '/Payment/get-own-transaction',
        GET_BY_ID: '/transaction',
        CREATE: '/transaction',
    }
} as const;