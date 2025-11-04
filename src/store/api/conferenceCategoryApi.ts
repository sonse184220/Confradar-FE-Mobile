import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { ENDPOINTS } from '../../constants/endpoints';

export interface ConferenceCategoryResponse {
    categoryId: string;
    categoryName: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ConferenceCategoryListResponse {
    conferenceCategoryId: string;
    conferenceCategoryName: string;
    description?: string;
    conferenceCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export const conferenceCategoryApi = createApi({
    reducerPath: 'conferenceCategoryApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ConferenceCategory'],
    endpoints: (builder) => ({
        getAllConferenceCategories: builder.query<ApiResponse<ConferenceCategoryListResponse[]>, void>({
            query: () => ({
                url: ENDPOINTS.CONFERENCE_CATEGORY.GET_ALL,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ conferenceCategoryId }) => ({
                            type: 'ConferenceCategory' as const,
                            id: conferenceCategoryId,
                        })),
                        { type: 'ConferenceCategory', id: 'LIST' },
                    ]
                    : [{ type: 'ConferenceCategory', id: 'LIST' }],
        }),

        getConferenceCategoryById: builder.query<ApiResponse<ConferenceCategoryResponse>, string>({
            query: (id) => ({
                url: `${ENDPOINTS.CONFERENCE_CATEGORY.GET_BY_ID}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'ConferenceCategory', id }],
        }),
    }),
});

export const {
    useGetAllConferenceCategoriesQuery,
    useGetConferenceCategoryByIdQuery,
    useLazyGetAllConferenceCategoriesQuery,
    useLazyGetConferenceCategoryByIdQuery,
} = conferenceCategoryApi;