import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { ENDPOINTS } from '../../constants/endpoints';

// Types
export interface ConferenceResponse {
    conferenceId: string;
    conferenceName: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    capacity?: number;
    address?: string;
    bannerImageUrl?: string;
    createdAt?: string;
    isInternalHosted?: boolean;
    isResearchConference?: boolean;
    isActive?: boolean;
    userId?: string;
    locationId?: string;
    categoryId?: string;
    policies?: ConferencePolicyResponse[];
    media?: ConferenceMediaResponse[];
    sponsors?: SponsorResponse[];
    prices?: ConferencePriceResponse[];
    sessions?: ConferenceSessionResponse[];
}

export interface ConferencePolicyResponse {
    policyId: string;
    policyName?: string;
    description?: string;
}

export interface ConferenceMediaResponse {
    mediaId: string;
    mediaUrl?: string;
    mediaTypeId?: string;
}

export interface SponsorResponse {
    sponsorId: string;
    name?: string;
    imageUrl?: string;
}

export interface ConferencePriceResponse {
    priceId: string;
    ticketPrice?: number;
    ticketName?: string;
    ticketDescription?: string;
    actualPrice?: number;
    currentPhase?: string;
    pricePhaseId?: string;
}

export interface ConferenceSessionResponse {
    sessionId: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
    conferenceId?: string;
    statusId?: string;
    roomId?: string;
    room?: RoomInfoResponse;
    speaker?: SpeakerResponse;
}

export interface RoomInfoResponse {
    roomId: string;
    number?: string;
    displayName?: string;
    destinationId?: string;
}

export interface SpeakerResponse {
    name: string;
    description?: string;
}

export const conferenceApi = createApi({
    reducerPath: 'conferenceApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Conference'],
    endpoints: (builder) => ({
        // Get All Conferences
        getAllConferences: builder.query<ApiResponse<ConferenceResponse[]>, void>({
            query: () => ({
                url: ENDPOINTS.CONFERENCE.GET_ALL,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ conferenceId }) => ({
                            type: 'Conference' as const,
                            id: conferenceId,
                        })),
                        { type: 'Conference', id: 'LIST' },
                    ]
                    : [{ type: 'Conference', id: 'LIST' }],
        }),

        // Get Conference By ID
        getConferenceById: builder.query<ApiResponse<ConferenceResponse>, string>({
            query: (id) => ({
                url: `${ENDPOINTS.CONFERENCE.GET_BY_ID}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Conference', id }],
        }),
    }),
});

export const {
    useGetAllConferencesQuery,
    useGetConferenceByIdQuery,
    useLazyGetAllConferencesQuery,
    useLazyGetConferenceByIdQuery,
} = conferenceApi;