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
        LIST_PAGINATED: "/Conference/paginated-conferences",
        LIST_WITH_PRICES: "/Conference/conferences-with-prices",
        LIST_BY_STATUS: "/Conference/by-status",

        VIEW_REGISTERED_USERS: "/Conference/view-registered-users-for-conference",


        GET_TECH_BY_ID: (conferenceId: string) => `/Conference/technical-detail/${conferenceId}`,
        GET_RESEARCH_BY_ID: (conferenceId: string) => `/Conference/research-detail/${conferenceId}`,

        // ✅ Trạng thái & hoàn thành bước
        STEP_COMPLETION_STATUS: "/Conference/step-completion-status",
        RESEARCH_STEP_COMPLETION_STATUS: "/Conference/research-step-completion-status",
        CHECK_TECH_STEP_COMPLETION: "/Conference/check-technical-step-completion",
        CHECK_RESEARCH_STEP_COMPLETION: "/Conference/check-research-step-completion",

        //pending & approve
        PENDING_CONFERENCES: "/Conference/pending-conferences",
        APPROVE_CONFERENCE: (conferenceId: string) => `/Conference/approve-conference/${conferenceId}`,


        DETAIL: "/Conference",
        TECHNICAL_DETAIL: "/Conference/technical-detail",
        RESEARCH_DETAIL: "/Conference/research-detail",
        CREATE: "/Conference",
        UPDATE: "/Conference",
        DELETE: "/Conference",

        // GET_ALL: '/Conference',
        // GET_BY_ID: '/Conference',
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