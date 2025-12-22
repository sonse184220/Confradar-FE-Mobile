import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from './baseApi';
import { ENDPOINTS } from '../../constants/endpoints';
import type { AddedFavouriteConferenceResponse, ConferenceDetailForScheduleResponse, ConferenceResponse, DeletedFavouriteConferenceResponse, FavouriteConferenceDetailResponse, FavouriteConferenceRequest, ResearchConferenceDetailResponse, TechnicalConferenceDetailResponse } from "../../types/conference.type";
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
            { page?: number; pageSize?: number; searchKeyword?: string; cityId?: string; startDate?: string; endDate?: string, isComplete?: boolean; }
        >({
            query: ({ page = 1, pageSize = 12, searchKeyword, cityId, startDate, endDate, isComplete }) => ({
                url: ENDPOINTS.CONFERENCE.LIST_WITH_PRICES,
                method: 'GET',
                params: { page, pageSize, searchKeyword, cityId, startDate, endDate, isComplete },
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

        getOwnFavouriteConferences: builder.query<
            ApiResponse<FavouriteConferenceDetailResponse[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.FAVOURITE_CONFERENCE.LIST_OWN,
                method: "GET",
            }),
            providesTags: ["Conference"],
        }),
        addToFavourite: builder.mutation<
            ApiResponse<AddedFavouriteConferenceResponse>,
            FavouriteConferenceRequest
        >({
            query: (body) => ({
                url: ENDPOINTS.FAVOURITE_CONFERENCE.ADD,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Conference"],
        }),

        // Remove conference from favourites
        deleteFromFavourite: builder.mutation<
            ApiResponse<DeletedFavouriteConferenceResponse>,
            FavouriteConferenceRequest
        >({
            query: (body) => ({
                url: ENDPOINTS.FAVOURITE_CONFERENCE.DELETE,
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Conference"],
        }),

        getOwnConferencesForSchedule: builder.query<
            ApiResponse<ConferenceDetailForScheduleResponse[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.CONFERENCE.GET_OWN_CONFERENCES_FOR_SCHEDULE,
                method: "GET",
            }),
            providesTags: ["Conference"],
        }),

    }),
});

export const {
    useGetAllConferencesPaginationQuery,
    useGetTechnicalConferenceDetailQuery,
    useGetResearchConferenceDetailQuery,
    useGetAllConferencesWithPricesPaginationQuery,
    useGetConferencesByStatusQuery,
    useLazyGetAllConferencesPaginationQuery,
    useLazyGetAllConferencesWithPricesPaginationQuery,
    useLazyGetConferencesByStatusQuery,

    //favorite
    useGetOwnFavouriteConferencesQuery,
    useLazyGetOwnFavouriteConferencesQuery,
    useAddToFavouriteMutation,
    useDeleteFromFavouriteMutation,

    useLazyGetOwnConferencesForScheduleQuery,
} = conferenceApi;