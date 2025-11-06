import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { CreateTechPaymentRequest, GeneralPaymentResultResponse, PaymentMethod, Transaction } from '@/types/transaction.type';

export const transactionApi = createApi({
    reducerPath: 'transactionApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Transaction', 'PaymentMethod'],
    endpoints: (builder) => ({
        createPaymentForTech: builder.mutation<ApiResponse<GeneralPaymentResultResponse>, CreateTechPaymentRequest>({
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

        getAllPaymentMethods: builder.query<ApiResponse<PaymentMethod[]>, void>({
            query: () => ENDPOINTS.PAYMENT_METHOD.GET_ALL,
            providesTags: ["PaymentMethod"],
        }),
    }),
});

export const {
    useCreatePaymentForTechMutation,
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
    useGetAllPaymentMethodsQuery,
    useLazyGetAllPaymentMethodsQuery,
} = transactionApi;