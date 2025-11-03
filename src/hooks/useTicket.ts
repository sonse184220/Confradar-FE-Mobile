import { useEffect } from 'react';
import {
    useCreatePaymentForTechMutation,
    useGetOwnPaidTicketsQuery,
    useLazyGetOwnPaidTicketsQuery,
    type CreateTechPaymentRequest,
    // type MomoPaymentCallBackResponse,
} from '../store/api/ticketApi';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useTicket = () => {

    // RTK Query hooks
    const [
        createPaymentMutation,
        { isLoading: paymentLoading, error: paymentRawError, data: paymentData }
    ] = useCreatePaymentForTechMutation();

    const {
        data: ticketsData,
        isLoading: ticketsLoading,
        error: ticketsRawError,
        refetch: refetchTickets
    } = useGetOwnPaidTicketsQuery();

    const [
        getTickets,
        { isLoading: lazyTicketsLoading, error: lazyTicketsRawError }
    ] = useLazyGetOwnPaidTicketsQuery();

    // const [
    //     getTransactions,
    //     { isLoading: transactionsLoading, data: transactionsData, error: transactionsRawError }
    // ] = useLazyGetOwnTransactionQuery();

    // Parse error function
    const parseError = (error: any): string => {
        if (error?.data?.Message) {
            return error.data.Message;
        }
        if (error?.data?.message) {
            return error.data.message;
        }
        if (typeof error?.data === 'string') {
            return error.data;
        }
        return 'Có lỗi xảy ra. Vui lòng thử lại.';
    };

    const paymentError = paymentRawError ? parseError(paymentRawError) : null;
    const ticketsError = ticketsRawError ? parseError(ticketsRawError) : null;
    const lazyTicketsError = lazyTicketsRawError ? parseError(lazyTicketsRawError) : null;
    // const transactionsError = transactionsRawError ? parseError(transactionsRawError) : null;

    const purchaseTicket = async (request: CreateTechPaymentRequest) => {
        try {
            const result = await createPaymentMutation(request).unwrap();
            // result.Data contains the MoMo payment URL
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchTickets = async () => {
        try {
            const result = await getTickets().unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // const fetchTransactions = async () => {
    //     try {
    //         const result = await getTransactions().unwrap();
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    return {
        purchaseTicket,
        fetchTickets,
        refetchTickets,

        tickets: ticketsData?.data || [],
        ticketsResponse: ticketsData,
        // fetchTransactions,
        // loading: paymentLoading || transactionsLoading,
        loading: paymentLoading || ticketsLoading,
        // ticketsLoading,

        paymentError,
        ticketsError: ticketsError || lazyTicketsError,
        // transactionsError,

        paymentResponse: paymentData,
        // transactions: transactionsData?.data || [],
    };
};