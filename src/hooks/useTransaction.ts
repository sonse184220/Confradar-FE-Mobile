import { parseApiError } from '@/utils/api';
import {
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
    useCreatePaymentForTechMutation
} from '@/store/api/transactionApi';
import { CreateTechPaymentRequest } from '@/store/api/ticketApi';

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

    // Parse errors
    const techPaymentError = parseApiError<string>(techPaymentRawError);
    const transactionsError = parseApiError<string>(transactionsRawError);
    const lazyTransactionsError = parseApiError<string>(lazyTransactionsRawError);

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

    return {
        // Data
        techPaymentResponse: techPaymentData,
        transactions: transactionsData?.data || [],
        transactionsResponse: transactionsData,

        // Methods
        purchaseTechTicket,
        fetchOwnTransactions,
        refetchTransactions,

        // Loading states
        loading: techPaymentLoading || transactionsLoading || lazyTransactionsLoading,
        transactionsLoading,

        // Errors
        techPaymentError,

        transactionsError,
        // paymentMethodsError,
    };
};