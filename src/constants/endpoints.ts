export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/Auth/login',
        REGISTER: '/Auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/Auth/forget-password',
        RESET_PASSWORD: '/auth/reset-password',

        PROFILE: "/Auth/view-profile-by-id",
        UPDATE_PROFILE: "/Auth/update-profile",
        CHANGE_PASSWORD: "/Auth/change-password",

        GOOGLE: "/Auth/firebase-login",
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

        GET_TECH_BY_ID: (conferenceId: string) => `/Conference/technical-detail/${conferenceId}`,
        GET_RESEARCH_BY_ID: (conferenceId: string) => `/Conference/research-detail/${conferenceId}`,

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
        CREATE_TECH_PAYMENT: '/Payment/pay-tech-with-momo',
    },
    TICKET: {
        GET_OWN_TICKET: '/Ticket/get-own-paid-ticket',
    },
    FAVOURITE_CONFERENCE: {
        LIST_OWN: '/FavouriteConference/list-own-favourite-conferences',
        ADD: '/FavouriteConference/add-to-favourite',
        DELETE: '/FavouriteConference/delete-from-favourite',
    }
} as const;