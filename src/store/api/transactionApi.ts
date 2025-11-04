import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { CreateTechPaymentRequest } from './ticketApi';

export interface PaymentMethod {
    paymentMethodId: string;
    name?: string;
    description?: string;
}

export interface TransactionStatus {
    transactionStatusId: string;
    statusName?: string;
    description?: string;
}

export interface TransactionType {
    transactionTypeId: string;
    typeName?: string;
    description?: string;
}

export interface Transaction {
    transactionId: string;
    userId?: string;
    currency?: string;
    amount?: number;
    transactionCode?: string;
    createdAt?: string;
    transactionStatusId?: string;
    transactionTypeId?: string;
    paymentMethodId?: string;
    PaymentStatusName?: string;
    PaymentMethodName?: string;
}

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Transaction'],
    endpoints: (builder) => ({
        createPaymentForTech: builder.mutation<ApiResponse<string>, CreateTechPaymentRequest>({
            query: (request) => ({
                url: ENDPOINTS.TRANSACTION.CREATE_TECH_PAYMENT,
                method: 'POST',
                body: request,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                } catch (err: any) {
                    // dispatch(setError(err?.error?.data?.message || 'Payment failed'));
                } finally {
                    // dispatch(setLoading(false));
                }
            },
            invalidatesTags: ['Transaction'],
        }),

        getOwnTransactions: builder.query<ApiResponse<Transaction[]>, void>({
            query: () => ({
                url: ENDPOINTS.TRANSACTION.GET_OWN,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ transactionId }) => ({
                            type: 'Transaction' as const,
                            id: transactionId,
                        })),
                        { type: 'Transaction', id: 'LIST' },
                    ]
                    : [{ type: 'Transaction', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreatePaymentForTechMutation,
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
} = transactionApi;