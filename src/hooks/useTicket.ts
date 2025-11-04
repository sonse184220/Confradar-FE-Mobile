import { useGetOwnPaidTicketsQuery, useLazyGetOwnPaidTicketsQuery } from "@/store/api/ticketApi";
import { parseApiError } from "@/utils/api";

export const useTicket = (filters?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    sessionStartTime?: string;
    sessionEndTime?: string;
}) => {
    const {
        data: ticketsResponse,
        isLoading: ticketsLoading,
        error: ticketsRawError,
        refetch: refetchTickets,
    } = useGetOwnPaidTicketsQuery(filters ?? {});

    const [
        getTickets,
        { isLoading: lazyTicketsLoading, error: lazyTicketsRawError },
    ] = useLazyGetOwnPaidTicketsQuery();

    const ticketsError = parseApiError<string>(ticketsRawError);
    const lazyTicketsError = parseApiError<string>(lazyTicketsRawError);

    const fetchTickets = async (params?: typeof filters) => {
        try {
            const result = await getTickets(params ?? {}).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };


    return {
        // Data
        tickets: ticketsResponse?.data?.items ?? [],
        totalPages: ticketsResponse?.data?.totalPages ?? 1,
        totalCount: ticketsResponse?.data?.totalCount ?? 0,

        // Methods
        fetchTickets,
        refetchTickets,

        // Loading states
        loading: ticketsLoading || lazyTicketsLoading,

        // Errors
        ticketsError: ticketsError || lazyTicketsError,
    };
};

// import { useEffect } from 'react';
// import {
//     useCreatePaymentForTechMutation,
//     useGetOwnPaidTicketsQuery,
//     useLazyGetOwnPaidTicketsQuery,
//     type CreateTechPaymentRequest,
//     // type MomoPaymentCallBackResponse,
// } from '../store/api/ticketApi';
// import { useAppDispatch, useAppSelector } from './useRedux';

// export const useTicket = () => {

//     // RTK Query hooks
//     const [
//         createPaymentMutation,
//         { isLoading: paymentLoading, error: paymentRawError, data: paymentData }
//     ] = useCreatePaymentForTechMutation();

//     const {
//         data: ticketsData,
//         isLoading: ticketsLoading,
//         error: ticketsRawError,
//         refetch: refetchTickets
//     } = useGetOwnPaidTicketsQuery();

//     const [
//         getTickets,
//         { isLoading: lazyTicketsLoading, error: lazyTicketsRawError }
//     ] = useLazyGetOwnPaidTicketsQuery();

//     // const [
//     //     getTransactions,
//     //     { isLoading: transactionsLoading, data: transactionsData, error: transactionsRawError }
//     // ] = useLazyGetOwnTransactionQuery();

//     // Parse error function
//     const parseError = (error: any): string => {
//         if (error?.data?.Message) {
//             return error.data.Message;
//         }
//         if (error?.data?.message) {
//             return error.data.message;
//         }
//         if (typeof error?.data === 'string') {
//             return error.data;
//         }
//         return 'Có lỗi xảy ra. Vui lòng thử lại.';
//     };

//     const paymentError = paymentRawError ? parseError(paymentRawError) : null;
//     const ticketsError = ticketsRawError ? parseError(ticketsRawError) : null;
//     const lazyTicketsError = lazyTicketsRawError ? parseError(lazyTicketsRawError) : null;
//     // const transactionsError = transactionsRawError ? parseError(transactionsRawError) : null;

//     const purchaseTicket = async (request: CreateTechPaymentRequest) => {
//         try {
//             const result = await createPaymentMutation(request).unwrap();
//             // result.Data contains the MoMo payment URL
//             return result;
//         } catch (error) {
//             throw error;
//         }
//     };

//     const fetchTickets = async () => {
//         try {
//             const result = await getTickets().unwrap();
//             return result;
//         } catch (error) {
//             throw error;
//         }
//     };

//     // const fetchTransactions = async () => {
//     //     try {
//     //         const result = await getTransactions().unwrap();
//     //         return result;
//     //     } catch (error) {
//     //         throw error;
//     //     }
//     // };

//     return {
//         purchaseTicket,
//         fetchTickets,
//         refetchTickets,

//         tickets: ticketsData?.data || [],
//         ticketsResponse: ticketsData,
//         // fetchTransactions,
//         // loading: paymentLoading || transactionsLoading,
//         loading: paymentLoading || ticketsLoading,
//         // ticketsLoading,

//         paymentError,
//         ticketsError: ticketsError || lazyTicketsError,
//         // transactionsError,

//         paymentResponse: paymentData,
//         // transactions: transactionsData?.data || [],
//     };
// };