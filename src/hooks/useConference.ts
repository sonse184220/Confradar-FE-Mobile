// import { useGetAllConferencesWithPricesPaginationQuery, useGetConferenceByIdQuery, useLazyGetAllConferencesWithPricesPaginationQuery, useLazyGetConferenceByIdQuery } from '@/redux/services/conference.service';
import { useGetAllConferencesPaginationQuery, useGetResearchConferenceDetailQuery, useGetTechnicalConferenceDetailQuery, useLazyGetAllConferencesPaginationQuery, useLazyGetAllConferencesWithPricesPaginationQuery, useLazyGetConferencesByStatusQuery } from '../store/api/conferenceApi';
import { ConferenceResponse } from '../types/conference.type';
import { useCallback } from 'react';
import { parseApiError } from '../utils/api';

export const useConference = (params?: { page?: number; pageSize?: number; id?: string }) => {
    const {
        data: defaultConferencesData,
        error: defaultConferencesError,
        isLoading: defaultConferencesLoading,
        isFetching: defaultConferencesFetching,
        refetch: refetchDefaultConferences,
    } = useGetAllConferencesPaginationQuery({
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 12,
    });

    const {
        data: technicalConferenceData,
        error: technicalConferenceError,
        isLoading: technicalConferenceLoading,
        isFetching: technicalConferenceFetching,
        refetch: refetchTechnicalConference,
    } = useGetTechnicalConferenceDetailQuery(params?.id ?? '', { skip: !params?.id });

    const {
        data: researchConferenceData,
        error: researchConferenceError,
        isLoading: researchConferenceLoading,
        isFetching: researchConferenceFetching,
        refetch: refetchResearchConference,
    } = useGetResearchConferenceDetailQuery(params?.id ?? '', { skip: !params?.id });

    // Lazy load default paginated list
    const [triggerGetAll, { data: lazyDefaultData, error: lazyDefaultError, isLoading: lazyDefaultLoading }] =
        useLazyGetAllConferencesPaginationQuery();

    // Lazy load all conferences with price & filter
    const [triggerGetAllWithPrices, { data: lazyWithPricesData, error: lazyWithPricesError, isLoading: lazyWithPricesLoading }] =
        useLazyGetAllConferencesWithPricesPaginationQuery();

    // Lazy load conferences by status
    const [triggerGetByStatus, { data: statusConferencesData, error: statusConferencesError, isLoading: statusConferencesLoading }] =
        useLazyGetConferencesByStatusQuery();

    // Fetch functions
    const fetchDefaultConferences = useCallback(
        (params?: { page?: number; pageSize?: number }) => triggerGetAll(params || {}).unwrap(),
        [triggerGetAll]
    );

    const fetchConferencesWithPrices = useCallback(
        (params?: { page?: number; pageSize?: number; searchKeyword?: string; cityId?: string; startDate?: string; endDate?: string }) =>
            triggerGetAllWithPrices(params || {}).unwrap(),
        [triggerGetAllWithPrices]
    );

    const fetchConferencesByStatus = useCallback(
        (statusId: string, params?: { page?: number; pageSize?: number; searchKeyword?: string; cityId?: string; startDate?: string; endDate?: string }) =>
            triggerGetByStatus({ conferenceStatusId: statusId, ...params }).unwrap(),
        [triggerGetByStatus]
    );

    return {
        // Default paginated conferences
        defaultConferences: defaultConferencesData?.data,
        lazyDefaultConferences: lazyDefaultData?.data,
        fetchDefaultConferences,
        refetchDefaultConferences,
        defaultLoading: defaultConferencesLoading || defaultConferencesFetching || lazyDefaultLoading,
        // defaultError: defaultConferencesError || lazyDefaultError,
        defaultError: parseApiError<ConferenceResponse[]>(defaultConferencesError || lazyDefaultError),

        // Conferences with prices (filterable)
        lazyConferencesWithPrices: lazyWithPricesData?.data,
        fetchConferencesWithPrices,
        lazyWithPricesLoading,
        // lazyWithPricesError,
        lazyWithPricesError: parseApiError<ConferenceResponse[]>(lazyWithPricesError),

        // Conferences by status
        statusConferences: statusConferencesData?.data,
        fetchConferencesByStatus,
        statusConferencesLoading,
        // statusConferencesError,
        statusConferencesError: parseApiError<ConferenceResponse[]>(statusConferencesError),

        // technical conference
        technicalConference: technicalConferenceData?.data,
        refetchTechnicalConference,
        technicalConferenceLoading: technicalConferenceLoading || technicalConferenceFetching,
        technicalConferenceError: parseApiError(technicalConferenceError),

        // Research conference
        researchConference: researchConferenceData?.data,
        refetchResearchConference,
        researchConferenceLoading: researchConferenceLoading || researchConferenceFetching,
        researchConferenceError: parseApiError(researchConferenceError),
    };
};

// import { useCallback } from 'react';
// import {
//     useGetAllConferencesQuery,
//     useGetConferenceByIdQuery,
//     useLazyGetAllConferencesQuery,
//     useLazyGetConferenceByIdQuery,
// } from '../store/api/conferenceApi';
// import type { ApiResponse } from '../types/api';
// import type { ConferenceResponse } from '../store/api/conferenceApi';

// export const useConference = () => {
//     const parseError = (error: any): string => {
//         if (error?.data?.Message) return error.data.Message;
//         if (error?.data?.message) return error.data.message;
//         if (typeof error?.data === 'string') return error.data;
//         return 'Có lỗi xảy ra khi tải thông tin hội nghị.';
//     };

//     const {
//         data: conferencesData,
//         error: conferencesError,
//         isLoading: conferencesLoading,
//         isFetching: conferencesFetching,
//         refetch: refetchConferences,
//     } = useGetAllConferencesQuery();

//     const {
//         data: conferenceData,
//         error: conferenceError,
//         isLoading: conferenceLoading,
//         isFetching: conferenceFetching,
//         refetch: refetchConference,
//     } = useGetConferenceByIdQuery('', { skip: true });

//     const [triggerGetAll, { data: lazyConferences, error: lazyConferencesError, isLoading: lazyConferencesLoading }] =
//         useLazyGetAllConferencesQuery();

//     const [triggerGetById, { data: lazyConference, error: lazyConferenceError, isLoading: lazyConferenceLoading }] =
//         useLazyGetConferenceByIdQuery();

//     const fetchConferences = useCallback(async () => {
//         try {
//             return await triggerGetAll().unwrap();
//         } catch (err) {
//             throw err;
//         }
//     }, [triggerGetAll]);

//     const fetchConference = useCallback(
//         async (id: string): Promise<ApiResponse<ConferenceResponse>> => {
//             try {
//                 return await triggerGetById(id).unwrap();
//             } catch (err) {
//                 throw err;
//             }
//         },
//         [triggerGetById]
//     );

//     return {
//         conferences: conferencesData?.data || [],
//         conference: conferenceData?.data || null,

//         lazyConferences: lazyConferences?.data || [],
//         lazyConference: lazyConference?.data || null,

//         fetchConferences,
//         fetchConference,
//         refetchConferences,
//         refetchConference,

//         loading:
//             conferencesLoading ||
//             conferenceLoading ||
//             lazyConferencesLoading ||
//             lazyConferenceLoading ||
//             conferencesFetching ||
//             conferenceFetching,
//         error:
//             conferencesError
//                 ? parseError(conferencesError)
//                 : conferenceError
//                     ? parseError(conferenceError)
//                     : lazyConferencesError
//                         ? parseError(lazyConferencesError)
//                         : lazyConferenceError
//                             ? parseError(lazyConferenceError)
//                             : null,
//     };
// };


// // import { useAppSelector } from './useRedux';
// // import {
// //     useGetAllConferencesQuery,
// //     useGetConferenceByIdQuery,
// //     useLazyGetAllConferencesQuery,
// //     useLazyGetConferenceByIdQuery,
// //     ConferenceResponse,
// // } from '../store/api/conferenceApi';

// // export const useConference = () => {
// //     // Parse error function
// //     const parseError = (error: any): string => {
// //         if (error?.data?.Message) {
// //             return error.data.Message;
// //         }
// //         if (error?.data?.message) {
// //             return error.data.message;
// //         }
// //         if (typeof error?.data === 'string') {
// //             return error.data;
// //         }
// //         return 'Có lỗi xảy ra khi tải thông tin hội nghị.';
// //     };

// //     // Get all conferences handler
// //     const useGetAllConferences = () => {
// //         const { data, error, isLoading, isFetching, refetch } = useGetAllConferencesQuery();

// //         return {
// //             conferences: data?.data || [],
// //             error: error ? parseError(error) : null,
// //             isLoading,
// //             isFetching,
// //             refetch,
// //             message: data?.message,
// //             success: data?.success,
// //         };
// //     };

// //     // Get conference by ID handler
// //     const useGetConferenceById = (id: string) => {
// //         const { data, error, isLoading, isFetching, refetch } = useGetConferenceByIdQuery(id, {
// //             skip: !id,
// //         });

// //         return {
// //             conference: data?.data || null,
// //             error: error ? parseError(error) : null,
// //             isLoading,
// //             isFetching,
// //             refetch,
// //             message: data?.message,
// //             success: data?.success,
// //         };
// //     };

// //     // Lazy query handlers (gọi thủ công khi cần)
// //     const useGetAllConferencesLazy = () => {
// //         const [trigger, { data, error, isLoading, isFetching }] = useLazyGetAllConferencesQuery();

// //         const fetchConferences = async () => {
// //             try {
// //                 const result = await trigger().unwrap();
// //                 return result;
// //             } catch (err) {
// //                 throw err;
// //             }
// //         };

// //         return {
// //             fetchConferences,
// //             conferences: data?.data || [],
// //             error: error ? parseError(error) : null,
// //             isLoading,
// //             isFetching,
// //         };
// //     };

// //     const useGetConferenceByIdLazy = () => {
// //         const [trigger, { data, error, isLoading, isFetching }] = useLazyGetConferenceByIdQuery();

// //         const fetchConference = async (id: string) => {
// //             try {
// //                 const result = await trigger(id).unwrap();
// //                 return result;
// //             } catch (err) {
// //                 throw err;
// //             }
// //         };

// //         return {
// //             fetchConference,
// //             conference: data?.data || null,
// //             error: error ? parseError(error) : null,
// //             isLoading,
// //             isFetching,
// //         };
// //     };

// //     return {
// //         useGetAllConferences,
// //         useGetConferenceById,
// //         useGetAllConferencesLazy,
// //         useGetConferenceByIdLazy,
// //     };
// // };