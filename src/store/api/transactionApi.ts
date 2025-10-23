import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { ApiResponse } from '../../types/api';
import { ENDPOINTS } from '../../constants/endpoints';

// Transaction types
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

// export interface Transaction {
//     transactionId: string;
//     userId?: string;
//     currency?: string;
//     amount?: number;
//     transactionCode?: string;
//     createdAt?: string;
//     transactionStatusId?: string;
//     transactionTypeId?: string;
//     paymentMethodId?: string;
//     paymentMethod?: PaymentMethod;
//     transactionStatus?: TransactionStatus;
//     transactionType?: TransactionType;
// }

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
        // Get own transactions
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

        // Get transaction by ID
        getTransactionById: builder.query<ApiResponse<Transaction>, string>({
            query: (id) => ({
                url: `${ENDPOINTS.TRANSACTION.GET_BY_ID}/${id}`, // hoặc `/transaction/${id}`
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Transaction', id }],
        }),

        // Create transaction (nếu cần)
        // createTransaction: builder.mutation<ApiResponse<Transaction>, Partial<Transaction>>({
        //     query: (data) => ({
        //         url: ENDPOINTS.TRANSACTION.CREATE, // hoặc '/transaction'
        //         method: 'POST',
        //         body: data,
        //     }),
        //     invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
        // }),
    }),
});

export const {
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
    useGetTransactionByIdQuery,
    useLazyGetTransactionByIdQuery,
    // useCreateTransactionMutation,
} = transactionApi;