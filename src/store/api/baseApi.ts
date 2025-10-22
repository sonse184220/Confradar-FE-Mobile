import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/apiConfig';
import { ENDPOINTS } from '../../constants/endpoints';

// Base query with auth token
const baseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.baseURL,
    prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('access_token');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // headers.set('Content-Type', 'application/json');
        // headers.set('Accept', 'application/json');

        return headers;
    },
    timeout: API_CONFIG.timeout,
    // responseHandler: async (response) => {
    //     const data = await response.json();
    //     return data.data || data;
    // },
});

// Base query with refresh-auth logic
export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            const refreshResult = await baseQuery(
                { url: ENDPOINTS.AUTH.REFRESH, method: 'POST' },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { token } = refreshResult.data as { token: string };

                await AsyncStorage.setItem('auth_token', token);

                result = await baseQuery(args, api, extraOptions);
            } else {
                await AsyncStorage.removeItem('auth_token');
            }
        } catch (error) {
            await AsyncStorage.removeItem('auth_token');
        }
    }

    return result;
};