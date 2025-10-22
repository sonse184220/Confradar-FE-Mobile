import { useCallback } from 'react';
import {
    useGetAllConferenceCategoriesQuery,
    useGetConferenceCategoryByIdQuery,
    useLazyGetAllConferenceCategoriesQuery,
    useLazyGetConferenceCategoryByIdQuery,
} from '../store/api/conferenceCategoryApi';
import type { ApiResponse } from '../types/api';
import type {
    ConferenceCategoryListResponse,
    ConferenceCategoryResponse,
} from '../store/api/conferenceCategoryApi';

export const useConferenceCategory = () => {
    // Parse error helper
    const parseError = (error: any): string => {
        if (error?.data?.Message) return error.data.Message;
        if (error?.data?.message) return error.data.message;
        if (typeof error?.data === 'string') return error.data;
        return 'Có lỗi xảy ra khi tải danh mục hội nghị.';
    };

    // --- Normal Queries ---
    const {
        data: categoriesData,
        error: categoriesError,
        isLoading: categoriesLoading,
        isFetching: categoriesFetching,
        refetch: refetchCategories,
    } = useGetAllConferenceCategoriesQuery();

    const {
        data: categoryData,
        error: categoryError,
        isLoading: categoryLoading,
        isFetching: categoryFetching,
        refetch: refetchCategory,
    } = useGetConferenceCategoryByIdQuery('', { skip: true });

    // --- Lazy Queries ---
    const [triggerGetAll, { data: lazyCategories, error: lazyCategoriesError, isLoading: lazyCategoriesLoading }] =
        useLazyGetAllConferenceCategoriesQuery();

    const [triggerGetById, { data: lazyCategory, error: lazyCategoryError, isLoading: lazyCategoryLoading }] =
        useLazyGetConferenceCategoryByIdQuery();

    const fetchCategories = useCallback(async (): Promise<ApiResponse<ConferenceCategoryListResponse[]>> => {
        try {
            return await triggerGetAll().unwrap();
        } catch (err) {
            throw err;
        }
    }, [triggerGetAll]);

    const fetchCategory = useCallback(
        async (id: string): Promise<ApiResponse<ConferenceCategoryResponse>> => {
            try {
                return await triggerGetById(id).unwrap();
            } catch (err) {
                throw err;
            }
        },
        [triggerGetById]
    );

    // --- Export unified interface ---
    return {
        // Data
        categories: categoriesData?.data || [],
        category: categoryData?.data || null,

        // Lazy Data
        lazyCategories: lazyCategories?.data || [],
        lazyCategory: lazyCategory?.data || null,

        // Fetchers
        fetchCategories,
        fetchCategory,
        refetchCategories,
        refetchCategory,

        // State
        loading:
            categoriesLoading ||
            categoryLoading ||
            lazyCategoriesLoading ||
            lazyCategoryLoading ||
            categoriesFetching ||
            categoryFetching,
        error:
            categoriesError
                ? parseError(categoriesError)
                : categoryError
                    ? parseError(categoryError)
                    : lazyCategoriesError
                        ? parseError(lazyCategoriesError)
                        : lazyCategoryError
                            ? parseError(lazyCategoryError)
                            : null,
    };
};


// import {
//     useGetAllConferenceCategoriesQuery,
//     useGetConferenceCategoryByIdQuery,
//     useLazyGetAllConferenceCategoriesQuery,
//     useLazyGetConferenceCategoryByIdQuery,
//     type ConferenceCategoryResponse,
//     type ConferenceCategoryListResponse,
// } from '../store/api/conferenceCategoryApi';
// import type { ApiResponse } from '../types/api';

// const parseError = (error: any): string => {
//     if (error?.data?.Message) {
//         return error.data.Message;
//     }
//     if (error?.data?.message) {
//         return error.data.message;
//     }
//     if (typeof error?.data === 'string') {
//         return error.data;
//     }
//     return 'Có lỗi xảy ra khi tải thông tin danh mục.';
// };

// export const useGetAllConferenceCategories = () => {
//     const { data, error, isLoading, isFetching, refetch } = useGetAllConferenceCategoriesQuery();

//     return {
//         categories: data?.data || [],
//         error: error ? parseError(error) : null,
//         isLoading,
//         isFetching,
//         refetch,
//         message: data?.message,
//         success: data?.success,
//     };
// };

// export const useGetConferenceCategoryById = (id: string, skip: boolean = false) => {
//     const { data, error, isLoading, isFetching, refetch } = useGetConferenceCategoryByIdQuery(id, {
//         skip: skip || !id,
//     });

//     return {
//         category: data?.data || null,
//         error: error ? parseError(error) : null,
//         isLoading,
//         isFetching,
//         refetch,
//         message: data?.message,
//         success: data?.success,
//     };
// };

// export const useGetAllConferenceCategoriesLazy = () => {
//     const [trigger, { data, error, isLoading, isFetching }] = useLazyGetAllConferenceCategoriesQuery();

//     const fetchCategories = async (): Promise<ApiResponse<ConferenceCategoryListResponse[]>> => {
//         try {
//             const result = await trigger().unwrap();
//             return result;
//         } catch (err) {
//             throw err;
//         }
//     };

//     return {
//         fetchCategories,
//         categories: data?.data || [],
//         error: error ? parseError(error) : null,
//         isLoading,
//         isFetching,
//         message: data?.message,
//         success: data?.success,
//     };
// };

// export const useGetConferenceCategoryByIdLazy = () => {
//     const [trigger, { data, error, isLoading, isFetching }] = useLazyGetConferenceCategoryByIdQuery();

//     const fetchCategory = async (id: string): Promise<ApiResponse<ConferenceCategoryResponse>> => {
//         try {
//             const result = await trigger(id).unwrap();
//             return result;
//         } catch (err) {
//             throw err;
//         }
//     };

//     return {
//         fetchCategory,
//         category: data?.data || null,
//         error: error ? parseError(error) : null,
//         isLoading,
//         isFetching,
//         message: data?.message,
//         success: data?.success,
//     };
// };