import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { setError, setLoading } from '../slices/authSlice';
import { ENDPOINTS } from '@/constants/endpoints';
import { ApiResponsePagination } from '@/types/api.type';
import { CustomerPaidTicketResponse } from '@/types/ticket.type';

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Ticket'],
    endpoints: (builder) => ({
        // createPaymentForTech: builder.mutation<ApiResponse<string>, CreateTechPaymentRequest>({
        //     query: (request) => ({
        //         url: '/payment/pay-tech-with-momo',
        //         method: 'POST',
        //         body: request,
        //     }),
        //     async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //         dispatch(setLoading(true));
        //         try {
        //             const { data } = await queryFulfilled;
        //         } catch (err: any) {
        //             dispatch(setError(err?.error?.data?.message || 'Payment failed'));
        //         } finally {
        //             dispatch(setLoading(false));
        //         }
        //     },
        //     invalidatesTags: ['Transaction'],
        // }),

        // getOwnPaidTickets: builder.query<ApiResponse<Ticket[]>, void>({
        //     query: () => ({
        //         url: ENDPOINTS.TICKET.GET_OWN_TICKET,
        //         method: 'GET',
        //     }),
        //     providesTags: (result) =>
        //         result?.data
        //             ? [
        //                 ...result.data.map(({ ticketId }) => ({
        //                     type: 'Ticket' as const,
        //                     id: ticketId,
        //                 })),
        //                 { type: 'Ticket', id: 'LIST' },
        //             ]
        //             : [{ type: 'Ticket', id: 'LIST' }],
        // }),

        getOwnPaidTickets: builder.query<
            ApiResponsePagination<CustomerPaidTicketResponse[]>,
            {
                keyword?: string;
                pageNumber?: number;
                pageSize?: number;
                sessionStartTime?: string;
                sessionEndTime?: string;
            }
        >({
            query: ({ keyword, pageNumber = 1, pageSize = 10, sessionStartTime, sessionEndTime } = {}) => ({
                url: ENDPOINTS.TICKET.GET_OWN_TICKET,
                method: "GET",
                params: { keyword, pageNumber, pageSize, sessionStartTime, sessionEndTime },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ ticketId }) => ({
                            type: "Ticket" as const,
                            id: ticketId,
                        })),
                        { type: "Ticket", id: "LIST" },
                    ]
                    : [{ type: "Ticket", id: "LIST" }],
        }),
    }),
});

export const {
    // useCreatePaymentForTechMutation,
    useGetOwnPaidTicketsQuery,
    useLazyGetOwnPaidTicketsQuery,
} = ticketApi;