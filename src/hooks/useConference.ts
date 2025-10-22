import { useCallback } from 'react';
import {
    useGetAllConferencesQuery,
    useGetConferenceByIdQuery,
    useLazyGetAllConferencesQuery,
    useLazyGetConferenceByIdQuery,
} from '../store/api/conferenceApi';
import type { ApiResponse } from '../types/api';
import type { ConferenceResponse } from '../store/api/conferenceApi';

export const useConference = () => {
    const parseError = (error: any): string => {
        if (error?.data?.Message) return error.data.Message;
        if (error?.data?.message) return error.data.message;
        if (typeof error?.data === 'string') return error.data;
        return 'Có lỗi xảy ra khi tải thông tin hội nghị.';
    };

    const {
        data: conferencesData,
        error: conferencesError,
        isLoading: conferencesLoading,
        isFetching: conferencesFetching,
        refetch: refetchConferences,
    } = useGetAllConferencesQuery();

    const {
        data: conferenceData,
        error: conferenceError,
        isLoading: conferenceLoading,
        isFetching: conferenceFetching,
        refetch: refetchConference,
    } = useGetConferenceByIdQuery('', { skip: true });

    const [triggerGetAll, { data: lazyConferences, error: lazyConferencesError, isLoading: lazyConferencesLoading }] =
        useLazyGetAllConferencesQuery();

    const [triggerGetById, { data: lazyConference, error: lazyConferenceError, isLoading: lazyConferenceLoading }] =
        useLazyGetConferenceByIdQuery();

    const fetchConferences = useCallback(async () => {
        try {
            return await triggerGetAll().unwrap();
        } catch (err) {
            throw err;
        }
    }, [triggerGetAll]);

    const fetchConference = useCallback(
        async (id: string): Promise<ApiResponse<ConferenceResponse>> => {
            try {
                return await triggerGetById(id).unwrap();
            } catch (err) {
                throw err;
            }
        },
        [triggerGetById]
    );

    return {
        conferences: conferencesData?.data || [],
        conference: conferenceData?.data || null,

        lazyConferences: lazyConferences?.data || [],
        lazyConference: lazyConference?.data || null,

        fetchConferences,
        fetchConference,
        refetchConferences,
        refetchConference,

        loading:
            conferencesLoading ||
            conferenceLoading ||
            lazyConferencesLoading ||
            lazyConferenceLoading ||
            conferencesFetching ||
            conferenceFetching,
        error:
            conferencesError
                ? parseError(conferencesError)
                : conferenceError
                    ? parseError(conferenceError)
                    : lazyConferencesError
                        ? parseError(lazyConferencesError)
                        : lazyConferenceError
                            ? parseError(lazyConferenceError)
                            : null,
    };
};


// import { useAppSelector } from './useRedux';
// import {
//     useGetAllConferencesQuery,
//     useGetConferenceByIdQuery,
//     useLazyGetAllConferencesQuery,
//     useLazyGetConferenceByIdQuery,
//     ConferenceResponse,
// } from '../store/api/conferenceApi';

// export const useConference = () => {
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
//         return 'Có lỗi xảy ra khi tải thông tin hội nghị.';
//     };

//     // Get all conferences handler
//     const useGetAllConferences = () => {
//         const { data, error, isLoading, isFetching, refetch } = useGetAllConferencesQuery();

//         return {
//             conferences: data?.data || [],
//             error: error ? parseError(error) : null,
//             isLoading,
//             isFetching,
//             refetch,
//             message: data?.message,
//             success: data?.success,
//         };
//     };

//     // Get conference by ID handler
//     const useGetConferenceById = (id: string) => {
//         const { data, error, isLoading, isFetching, refetch } = useGetConferenceByIdQuery(id, {
//             skip: !id,
//         });

//         return {
//             conference: data?.data || null,
//             error: error ? parseError(error) : null,
//             isLoading,
//             isFetching,
//             refetch,
//             message: data?.message,
//             success: data?.success,
//         };
//     };

//     // Lazy query handlers (gọi thủ công khi cần)
//     const useGetAllConferencesLazy = () => {
//         const [trigger, { data, error, isLoading, isFetching }] = useLazyGetAllConferencesQuery();

//         const fetchConferences = async () => {
//             try {
//                 const result = await trigger().unwrap();
//                 return result;
//             } catch (err) {
//                 throw err;
//             }
//         };

//         return {
//             fetchConferences,
//             conferences: data?.data || [],
//             error: error ? parseError(error) : null,
//             isLoading,
//             isFetching,
//         };
//     };

//     const useGetConferenceByIdLazy = () => {
//         const [trigger, { data, error, isLoading, isFetching }] = useLazyGetConferenceByIdQuery();

//         const fetchConference = async (id: string) => {
//             try {
//                 const result = await trigger(id).unwrap();
//                 return result;
//             } catch (err) {
//                 throw err;
//             }
//         };

//         return {
//             fetchConference,
//             conference: data?.data || null,
//             error: error ? parseError(error) : null,
//             isLoading,
//             isFetching,
//         };
//     };

//     return {
//         useGetAllConferences,
//         useGetConferenceById,
//         useGetAllConferencesLazy,
//         useGetConferenceByIdLazy,
//     };
// };