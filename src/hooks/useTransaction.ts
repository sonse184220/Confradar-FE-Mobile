import { parseApiError } from '@/utils/api';
import {
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
    useCreatePaymentForTechMutation,
    useGetAllPaymentMethodsQuery,
    useLazyGetAllPaymentMethodsQuery
} from '@/store/api/transactionApi';
import { CreateTechPaymentRequest, PaymentMethod } from '@/types/transaction.type';

export const useTransaction = () => {
    const [
        createTechPayment,
        { isLoading: techPaymentLoading, error: techPaymentRawError, data: techPaymentData },
    ] = useCreatePaymentForTechMutation();

    const {
        data: transactionsData,
        isLoading: transactionsLoading,
        error: transactionsRawError,
        refetch: refetchTransactions
    } = useGetOwnTransactionsQuery();

    const [getOwnTransactions, {
        isLoading: lazyTransactionsLoading,
        error: lazyTransactionsRawError
    }] = useLazyGetOwnTransactionsQuery();

    const { data, isLoading, error } = useGetAllPaymentMethodsQuery();
    const [fetchPaymentMethods, { isLoading: lazyLoading, data: lazyData, error: lazyError }] =
        useLazyGetAllPaymentMethodsQuery();

    // Parse errors
    const techPaymentError = parseApiError<string>(techPaymentRawError);
    const transactionsError = parseApiError<string>(transactionsRawError);
    const lazyTransactionsError = parseApiError<string>(lazyTransactionsRawError);
    const paymentMethodsError = parseApiError<string>(error || lazyError);

    const purchaseTechTicket = async (request: CreateTechPaymentRequest) => {
        try {
            const result = await createTechPayment(request).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchOwnTransactions = async () => {
        try {
            const result = await getOwnTransactions().unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    const fetchAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
        try {
            const result = await fetchPaymentMethods().unwrap();
            return result.data || [];
        } catch (err) {
            throw err;
        }
    };

    return {
        // Data
        techPaymentResponse: techPaymentData,
        transactions: transactionsData?.data || [],
        transactionsResponse: transactionsData,
        paymentMethods: data?.data || lazyData?.data || [],

        // Methods
        purchaseTechTicket,
        fetchOwnTransactions,
        refetchTransactions,
        fetchAllPaymentMethods,

        // Loading states
        loading: techPaymentLoading || transactionsLoading || lazyTransactionsLoading,
        transactionsLoading,

        // Errors
        techPaymentError,

        transactionsError,
        paymentMethodsError,
    };
};