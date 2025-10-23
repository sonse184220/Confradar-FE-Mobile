import {
    useGetOwnTransactionsQuery,
    useLazyGetOwnTransactionsQuery,
    useGetTransactionByIdQuery,
    useLazyGetTransactionByIdQuery,
    // useCreateTransactionMutation,
    type Transaction
} from '../store/api/transactionApi';
import { useAppSelector } from './useRedux';

export const useTransaction = () => {

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

    const [getTransactionById, {
        isLoading: transactionByIdLoading,
        error: transactionByIdRawError
    }] = useLazyGetTransactionByIdQuery();

    // const [createTransactionMutation, {
    //     isLoading: createLoading,
    //     error: createRawError,
    //     data: createData
    // }] = useCreateTransactionMutation();

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

    // Parse errors
    const transactionsError = transactionsRawError ? parseError(transactionsRawError) : null;
    const lazyTransactionsError = lazyTransactionsRawError ? parseError(lazyTransactionsRawError) : null;
    const transactionByIdError = transactionByIdRawError ? parseError(transactionByIdRawError) : null;
    // const createError = createRawError ? parseError(createRawError) : null;

    // Get own transactions handler
    const fetchOwnTransactions = async () => {
        try {
            const result = await getOwnTransactions().unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Get transaction by ID handler
    const fetchTransactionById = async (id: string) => {
        try {
            const result = await getTransactionById(id).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Create transaction handler
    // const createTransaction = async (data: Partial<Transaction>) => {
    //     try {
    //         const result = await createTransactionMutation(data).unwrap();
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    return {
        // Data
        transactions: transactionsData?.data || [],
        transactionsResponse: transactionsData,
        // createResponse: createData,

        // Methods
        fetchOwnTransactions,
        fetchTransactionById,
        // createTransaction,
        refetchTransactions,

        // Loading states
        // loading: transactionsLoading || lazyTransactionsLoading || transactionByIdLoading || createLoading,
        loading: transactionsLoading || lazyTransactionsLoading || transactionByIdLoading,
        transactionsLoading,
        // createLoading,

        // Errors
        transactionsError: transactionsError || lazyTransactionsError,
        transactionByIdError,
        // createError,
    };
};