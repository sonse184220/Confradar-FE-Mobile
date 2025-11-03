import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { setError, setLoading } from '../slices/authSlice';

export interface CreateTechPaymentRequest {
    conferencePriceId: string;
}

// export interface UserCheckIn {
//     userCheckInId: string;
//     isPresenter?: boolean;
//     hasCheckIn?: boolean;
//     checkInTime?: string;
//     conferenceSessionId?: string;
//     userId?: string;
//     ticketId?: string;
//     conferenceSession?: ConferenceSession;
//     ticket?: Ticket;
//     user?: User;
// }

export interface Ticket {
    ticketId: string;
    userId?: string;
    conferencePriceId?: string;
    transactionId?: string;
    registeredDate?: string;
    isRefunded?: boolean;
    actualPrice?: number;
}

// export interface MomoPaymentCallBackResponse {
//     partnerCode?: string;
//     orderId?: string;
//     requestId?: string;
//     amount?: number;
//     orderInfo?: string;
//     orderType?: string;
//     transId?: string;
//     resultCode?: number;
//     message?: string;
//     payType?: string;
//     responseTime?: number;
//     extraData?: string;
//     signature?: string;
// }

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    orderId: string;
    transactionDate: string;
    description?: string;
    conferencePriceId: string;
}

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Ticket', 'Transaction'],
    endpoints: (builder) => ({
        createPaymentForTech: builder.mutation<ApiResponse<string>, CreateTechPaymentRequest>({
            query: (request) => ({
                url: '/payment/pay-tech-with-momo',
                method: 'POST',
                body: request,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                } catch (err: any) {
                    dispatch(setError(err?.error?.data?.message || 'Payment failed'));
                } finally {
                    dispatch(setLoading(false));
                }
            },
            invalidatesTags: ['Transaction'],
        }),

        getOwnPaidTickets: builder.query<ApiResponse<Ticket[]>, void>({
            query: () => ({
                url: '/Ticket/get-own-paid-ticket',
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ ticketId }) => ({
                            type: 'Ticket' as const,
                            id: ticketId,
                        })),
                        { type: 'Ticket', id: 'LIST' },
                    ]
                    : [{ type: 'Ticket', id: 'LIST' }],
        }),

        // getOwnTransaction: builder.query<ApiResponse<Transaction[]>, void>({
        //     query: () => '/payment/get-own-transaction',
        //     providesTags: ['Transaction'],
        // }),
    }),
});

export const {
    useCreatePaymentForTechMutation,
    useGetOwnPaidTicketsQuery,
    useLazyGetOwnPaidTicketsQuery,
} = ticketApi;