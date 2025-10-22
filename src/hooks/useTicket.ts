import { useEffect } from 'react';
import {
    useCreatePaymentForTechMutation,
    useLazyGetOwnTransactionQuery,
    type CreateTechPaymentRequest,
    type MomoPaymentCallBackResponse,
} from '../store/api/ticketApi';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useTicket = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    // RTK Query hooks
    const [
        createPaymentMutation,
        { isLoading: paymentLoading, error: paymentRawError, data: paymentData }
    ] = useCreatePaymentForTechMutation();

    const [
        getTransactions,
        { isLoading: transactionsLoading, data: transactionsData, error: transactionsRawError }
    ] = useLazyGetOwnTransactionQuery();

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
    const transactionsError = transactionsRawError ? parseError(transactionsRawError) : null;

    const purchaseTicket = async (request: CreateTechPaymentRequest) => {
        try {
            const result = await createPaymentMutation(request).unwrap();
            // result.Data contains the MoMo payment URL
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchTransactions = async () => {
        try {
            const result = await getTransactions().unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        user,
        purchaseTicket,
        fetchTransactions,
        loading: paymentLoading || transactionsLoading,
        paymentError,
        transactionsError,
        paymentResponse: paymentData,
        transactions: transactionsData?.data || [],
    };
};