// import { useGetAllConferencesWithPricesPaginationQuery, useGetConferenceByIdQuery, useLazyGetAllConferencesWithPricesPaginationQuery, useLazyGetConferenceByIdQuery } from '@/redux/services/conference.service';
import { useAddToFavouriteMutation, useDeleteFromFavouriteMutation, useGetAllConferencesPaginationQuery, useGetOwnFavouriteConferencesQuery, useGetResearchConferenceDetailQuery, useGetTechnicalConferenceDetailQuery, useLazyGetAllConferencesPaginationQuery, useLazyGetAllConferencesWithPricesPaginationQuery, useLazyGetConferencesByStatusQuery, useLazyGetOwnConferencesForScheduleQuery, useLazyGetOwnFavouriteConferencesQuery } from '../store/api/conferenceApi';
import { AddedFavouriteConferenceResponse, ConferenceDetailForScheduleResponse, ConferenceResponse, DeletedFavouriteConferenceResponse } from '../types/conference.type';
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

    const {
        data: favouriteConferencesData,
        error: favouriteConferencesError,
        isLoading: favouriteConferencesLoading,
        isFetching: favouriteConferencesFetching,
        refetch: refetchFavouriteConferences,
    } = useGetOwnFavouriteConferencesQuery();

    const [triggerGetFavourites, {
        data: lazyFavouritesData,
        error: lazyFavouritesError,
        isLoading: lazyFavouritesLoading
    }] = useLazyGetOwnFavouriteConferencesQuery();

    // Favourite mutations
    const [addToFavourite, {
        isLoading: addingToFavourite,
        error: addToFavouriteError
    }] = useAddToFavouriteMutation();

    const [deleteFromFavourite, {
        isLoading: deletingFromFavourite,
        error: deleteFromFavouriteError
    }] = useDeleteFromFavouriteMutation();

    const [
        triggerGetOwnConferencesSchedule,
        {
            data: lazyOwnConferencesScheduleData,
            error: lazyOwnConferencesScheduleError,
            isLoading: lazyOwnConferencesScheduleLoading,
        },
    ] = useLazyGetOwnConferencesForScheduleQuery();

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

    const fetchFavouriteConferences = useCallback(
        () => triggerGetFavourites().unwrap(),
        [triggerGetFavourites]
    );

    const addFavourite = useCallback(
        (conferenceId: string) => addToFavourite({ conferenceId }).unwrap(),
        [addToFavourite]
    );

    const removeFavourite = useCallback(
        (conferenceId: string) => deleteFromFavourite({ conferenceId }).unwrap(),
        [deleteFromFavourite]
    );

    const fetchOwnConferencesForSchedule = useCallback(
        () => triggerGetOwnConferencesSchedule().unwrap(),
        [triggerGetOwnConferencesSchedule],
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

        // Favourite conferences
        favouriteConferences: favouriteConferencesData?.data,
        lazyFavouriteConferences: lazyFavouritesData?.data,
        fetchFavouriteConferences,
        refetchFavouriteConferences,
        favouriteConferencesLoading: favouriteConferencesLoading || favouriteConferencesFetching || lazyFavouritesLoading,
        favouriteConferencesError: parseApiError(favouriteConferencesError || lazyFavouritesError),
        favouriteConferencesData,

        // Favourite mutations
        addFavourite,
        removeFavourite,
        addingToFavourite,
        deletingFromFavourite,
        addToFavouriteError: parseApiError<AddedFavouriteConferenceResponse>(addToFavouriteError),
        deleteFromFavouriteError: parseApiError<DeletedFavouriteConferenceResponse>(deleteFromFavouriteError),

        // --- Own Conferences for Schedule ---
        // ownConferencesForSchedule: ownConferencesScheduleData?.data,
        lazyOwnConferencesForSchedule: lazyOwnConferencesScheduleData?.data,
        fetchOwnConferencesForSchedule,
        // refetchOwnConferencesSchedule,
        ownConferencesForScheduleLoading: lazyOwnConferencesScheduleLoading,
        ownConferencesForScheduleError: parseApiError<
            ConferenceDetailForScheduleResponse[]
        >(lazyOwnConferencesScheduleError),
    };
};