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
        GET_OWN: '/payment/get-own-transaction',
        GET_BY_ID: '/transaction',
        CREATE_TECH_PAYMENT: '/payment/pay-tech',
    },
    PAYMENT_METHOD: {
        GET_ALL: "/PaymentMethod/list-all-payment-methods",
    },
    TICKET: {
        GET_OWN_TICKET: '/Ticket/get-own-paid-ticket',
    },
    FAVOURITE_CONFERENCE: {
        LIST_OWN: '/FavouriteConference/list-own-favourite-conferences',
        ADD: '/FavouriteConference/add-to-favourite',
        DELETE: '/FavouriteConference/delete-from-favourite',
    },

    PAPER: {
        LIST_ALL_PAPERS: "/Paper/list-all-papers",

        //ABSTRACT
        SUBMIT_ABSTRACT: "/Paper/submit-abstract",

        // FULL PAPER
        SUBMIT_FULLPAPER: "/Paper/submit-fullpaper",

        // REVISION PAPER
        SUBMIT_PAPER_REVISION: "/Paper/submit-paper-revision",
        SUBMIT_PAPER_REVISION_RESPONSE: "/Paper/submit-paper-revision-response",

        // CAMERA READY
        SUBMIT_CAMERA_READY: "/Paper/submit-camera-ready",

        LIST_SUBMITTED_PAPERS_CUSTOMER: "/Paper/get-all-submitted-papers-for-customer",
        GET_PAPER_DETAIL_CUSTOMER: "/Paper/get-paper-detail-customer",
        LIST_PAPER_PHASES: "/Paper/list-paper-phases",
        LIST_AVAILABLE_CUSTOMERS: "/Paper/list-available-customers",

        //WAITLIST
        LIST_CUSTOMER_WAITLIST: "/Paper/list-customer-waitlist",
        LEAVE_WAITLIST: "/Paper/leave-waitlist",
    },

} as const;