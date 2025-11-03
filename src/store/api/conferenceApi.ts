import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from './baseApi';
import { ENDPOINTS } from '../../constants/endpoints';
import type { ConferenceFormData, ConferenceResponse, RegisteredUserInConference, ResearchConferenceDetailResponse, TechnicalConferenceDetailResponse } from "../../types/conference.type";
import type { ApiResponse, ApiResponsePagination } from "../../types/api.type";

export const conferenceApi = createApi({
    reducerPath: "conferenceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Conference"],

    endpoints: (builder) => ({
        //get all conf for customer
        getAllConferencesPagination: builder.query<ApiResponsePagination<ConferenceResponse[]>,
            { page?: number; pageSize?: number; }
        >({
            query: ({ page = 1, pageSize = 12, }) => ({
                url: ENDPOINTS.CONFERENCE.LIST_PAGINATED,
                method: 'GET',
                params: { page, pageSize, },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data?.items.map(({ conferenceId }) => ({
                            type: 'Conference' as const,
                            id: conferenceId,
                        })),
                        { type: 'Conference', id: 'LIST' },
                    ]
                    : [{ type: 'Conference', id: 'LIST' }],
        }),

        //get all conf for customer with prices
        getAllConferencesWithPricesPagination: builder.query<ApiResponsePagination<ConferenceResponse[]>,
            { page?: number; pageSize?: number; searchKeyword?: string; cityId?: string; startDate?: string; endDate?: string }
        >({
            query: ({ page = 1, pageSize = 12, searchKeyword, cityId, startDate, endDate }) => ({
                url: ENDPOINTS.CONFERENCE.LIST_WITH_PRICES,
                method: 'GET',
                params: { page, pageSize, searchKeyword, cityId, startDate, endDate },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data?.items.map(({ conferenceId }) => ({
                            type: 'Conference' as const,
                            id: conferenceId,
                        })),
                        { type: 'Conference', id: 'LIST' },
                    ]
                    : [{ type: 'Conference', id: 'LIST' }],
        }),
        // getAllConferences: builder.query<ApiResponse<Conference[]>, void>({
        //   query: () => ({
        //     url: endpoint.CONFERENCE.LIST,
        //     method: "GET",
        //   }),
        //   providesTags: ["Conference"],
        // }),

        //tech detail endpoint
        getTechnicalConferenceDetail: builder.query<
            ApiResponse<TechnicalConferenceDetailResponse>,
            string
        >({
            query: (conferenceId) => ({
                url: `${ENDPOINTS.CONFERENCE.TECHNICAL_DETAIL}/${conferenceId}`,
                method: "GET",
            }),
            providesTags: (result, error, conferenceId) => [{ type: "Conference", id: conferenceId }],
        }),

        //research detail endpoint
        getResearchConferenceDetail: builder.query<
            ApiResponse<ResearchConferenceDetailResponse>,
            string
        >({
            query: (conferenceId) => ({
                url: `${ENDPOINTS.CONFERENCE.RESEARCH_DETAIL}/${conferenceId}`,
                method: "GET",
            }),
            providesTags: (result, error, conferenceId) => [{ type: "Conference", id: conferenceId }],
        }),

        //conferences by status with pagination & start endDate filter
        getConferencesByStatus: builder.query<
            ApiResponsePagination<ConferenceResponse[]>,
            { conferenceStatusId: string; page?: number; pageSize?: number; searchKeyword?: string; cityId?: string; startDate?: string; endDate?: string }
        >({
            query: ({ conferenceStatusId, page = 1, pageSize = 10, searchKeyword, cityId, startDate, endDate }) => ({
                url: `${ENDPOINTS.CONFERENCE.LIST_BY_STATUS}/${conferenceStatusId}`,
                method: "GET",
                params: { page, pageSize, searchKeyword, cityId, startDate, endDate },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ conferenceId }) => ({ type: "Conference" as const, id: conferenceId })),
                        { type: "Conference", id: "LIST" },
                    ]
                    : [{ type: "Conference", id: "LIST" }],
        }),

        //view conf detail for customer old version
        // getConferenceById: builder.query<ApiResponse<ConferenceResponse>, string>({
        //   query: (id) => ({
        //     url: `${endpoint.CONFERENCE.DETAIL}/${id}`,
        //     method: 'GET',
        //   }),
        //   providesTags: (result, error, id) => [{ type: 'Conference', id }],
        // }),
        // getConferenceById: builder.query<ApiResponse<Conference>, string>({
        //   query: (id) => ({
        //     url: `${endpoint.CONFERENCE.DETAIL}/${id}`,
        //     method: "GET",
        //   }),
        //   providesTags: ["Conference"],
        // }),

        createConference: builder.mutation<ApiResponse<string>, ConferenceFormData>({
            query: (body) => ({
                url: ENDPOINTS.CONFERENCE.CREATE,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Conference"],
        }),

        updateConference: builder.mutation<ApiResponse<string>, { id: string; data: ConferenceFormData }>({
            query: ({ id, data }) => ({
                url: `${ENDPOINTS.CONFERENCE.UPDATE}/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Conference"],
        }),


        deleteConference: builder.mutation<ApiResponse<string>, string>({
            query: (id) => ({
                url: `${ENDPOINTS.CONFERENCE.DELETE}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Conference"],
        }),

        viewRegisteredUsersForConference: builder.query<
            ApiResponse<RegisteredUserInConference[]>,
            string
        >({
            query: (conferenceId) => ({
                url: `${ENDPOINTS.CONFERENCE.VIEW_REGISTERED_USERS}?conferenceId=${conferenceId}`,
                method: "GET",
            }),
            providesTags: ["Conference"],
        }),


        getPendingConferences: builder.query<
            ApiResponsePagination<ConferenceResponse[]>,
            { page?: number; pageSize?: number }
        >({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: ENDPOINTS.CONFERENCE.PENDING_CONFERENCES,
                method: "GET",
                params: { page, pageSize },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ conferenceId }) => ({
                            type: "Conference" as const,
                            id: conferenceId,
                        })),
                        { type: "Conference", id: "PENDING_LIST" },
                    ]
                    : [{ type: "Conference", id: "PENDING_LIST" }],
        }),

        approveConference: builder.mutation<
            ApiResponse<null>,
            { conferenceId: string; reason: string; isApprove: boolean }
        >({
            query: ({ conferenceId, reason, isApprove }) => ({
                url: ENDPOINTS.CONFERENCE.APPROVE_CONFERENCE(conferenceId),
                method: "PUT",
                body: { reason, isApprove },
            }),
            invalidatesTags: ["Conference"],
        }),


    }),
});

export const {
    useGetAllConferencesPaginationQuery,
    useGetTechnicalConferenceDetailQuery,
    useGetResearchConferenceDetailQuery,
    useGetAllConferencesWithPricesPaginationQuery,
    // useGetConferenceByIdQuery,
    useGetConferencesByStatusQuery,
    useLazyGetAllConferencesPaginationQuery,
    useLazyGetAllConferencesWithPricesPaginationQuery,
    // useLazyGetConferenceByIdQuery,
    useLazyGetConferencesByStatusQuery,
    useViewRegisteredUsersForConferenceQuery,
    useLazyGetPendingConferencesQuery,

    useApproveConferenceMutation,

    useCreateConferenceMutation,
    useUpdateConferenceMutation,
    useDeleteConferenceMutation,
} = conferenceApi;


// import { createApi } from '@reduxjs/toolkit/query/react';
// import { baseQueryWithReauth } from './baseApi';
// import { ApiResponse } from '../../types/api';
// import { ENDPOINTS } from '../../constants/endpoints';

// // Types
// export interface ConferenceResponse {
//     conferenceId: string;
//     conferenceName: string;
//     description?: string;
//     startDate?: string;
//     endDate?: string;
//     capacity?: number;
//     address?: string;
//     bannerImageUrl?: string;
//     createdAt?: string;
//     isInternalHosted?: boolean;
//     isResearchConference?: boolean;
//     isActive?: boolean;
//     userId?: string;
//     locationId?: string;
//     categoryId?: string;
//     policies?: ConferencePolicyResponse[];
//     media?: ConferenceMediaResponse[];
//     sponsors?: SponsorResponse[];
//     prices?: ConferencePriceResponse[];
//     sessions?: ConferenceSessionResponse[];
// }

// export interface ConferencePolicyResponse {
//     policyId: string;
//     policyName?: string;
//     description?: string;
// }

// export interface ConferenceMediaResponse {
//     mediaId: string;
//     mediaUrl?: string;
//     mediaTypeId?: string;
// }

// export interface SponsorResponse {
//     sponsorId: string;
//     name?: string;
//     imageUrl?: string;
// }

// export interface ConferencePriceResponse {
//     priceId: string;
//     ticketPrice?: number;
//     ticketName?: string;
//     ticketDescription?: string;
//     actualPrice?: number;
//     currentPhase?: string;
//     pricePhaseId?: string;
// }

// export interface ConferenceSessionResponse {
//     sessionId: string;
//     title: string;
//     description?: string;
//     startTime?: string;
//     endTime?: string;
//     date?: string;
//     conferenceId?: string;
//     statusId?: string;
//     roomId?: string;
//     room?: RoomInfoResponse;
//     speaker?: SpeakerResponse;
// }

// export interface RoomInfoResponse {
//     roomId: string;
//     number?: string;
//     displayName?: string;
//     destinationId?: string;
// }

// export interface SpeakerResponse {
//     name: string;
//     description?: string;
// }

// export const conferenceApi = createApi({
//     reducerPath: 'conferenceApi',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Conference'],
//     endpoints: (builder) => ({
//         // Get All Conferences
//         getAllConferences: builder.query<ApiResponse<ConferenceResponse[]>, void>({
//             query: () => ({
//                 url: ENDPOINTS.CONFERENCE.GET_ALL,
//                 method: 'GET',
//             }),
//             providesTags: (result) =>
//                 result?.data
//                     ? [
//                         ...result.data.map(({ conferenceId }) => ({
//                             type: 'Conference' as const,
//                             id: conferenceId,
//                         })),
//                         { type: 'Conference', id: 'LIST' },
//                     ]
//                     : [{ type: 'Conference', id: 'LIST' }],
//         }),

//         // Get Conference By ID
//         getConferenceById: builder.query<ApiResponse<ConferenceResponse>, string>({
//             query: (id) => ({
//                 url: `${ENDPOINTS.CONFERENCE.GET_BY_ID}/${id}`,
//                 method: 'GET',
//             }),
//             providesTags: (result, error, id) => [{ type: 'Conference', id }],
//         }),
//     }),
// });

// export const {
//     useGetAllConferencesQuery,
//     useGetConferenceByIdQuery,
//     useLazyGetAllConferencesQuery,
//     useLazyGetConferenceByIdQuery,
// } = conferenceApi;