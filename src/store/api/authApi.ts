import { createApi } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseQueryWithReauth } from './baseApi';
import type { LoginCredentials, RegisterData, LoginResponse, User } from '../../types/auth';
import { setError, setLoading, setToken, setUser } from '../slices/authSlice';
import type { AppDispatch } from '../index';
import { ENDPOINTS } from '../../constants/endpoints';
import { ApiResponse } from '../../types/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    email: string;
    exp: number;
    iss: string;
    aud: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // Login
        login: builder.mutation<ApiResponse<LoginResponse>, LoginCredentials>({
            query: (credentials) => ({
                url: ENDPOINTS.AUTH.LOGIN,
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;

                    if (data.data) {
                        const { accessToken, refreshToken } = data.data;

                        // ✅ Decode token using jwt-decode
                        const decoded = jwtDecode<JwtPayload>(accessToken);

                        const user: User = {
                            id: decoded.sub,
                            email: decoded.email,
                            name: decoded.email.split('@')[0], // fallback name
                            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                            avatar: undefined,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        // Save to AsyncStorage
                        await AsyncStorage.multiSet([
                            ['access_token', accessToken],
                            ['refresh_token', refreshToken],
                            ['user', JSON.stringify(user)],
                        ]);

                        // Dispatch to Redux
                        dispatch(setToken({ accessToken, refreshToken }));
                        dispatch(setUser(user));
                    }
                } catch (err: any) {
                    // dispatch(setError(err?.error?.data?.message || 'Login failed'));
                }
                finally {
                    dispatch(setLoading(false));
                }
            },
            //   async onQueryStarted(arg, { queryFulfilled }) {
            //     try {
            //       const { data } = await queryFulfilled;
            //       if (data.token) {
            //         await AsyncStorage.setItem('auth_token', data.token);

            //       }
            //     } catch (error) {
            //       console.error('Login error:', error);
            //     }
            //   },
            invalidatesTags: ['Auth'],
        }),

        // Register
        register: builder.mutation<ApiResponse<null>, FormData>({
            query: (formData) => ({
                url: ENDPOINTS.AUTH.REGISTER,
                method: 'POST',
                body: formData,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                dispatch(setLoading(true));
                try {
                    const { data } = await queryFulfilled;
                    // if (data.token) {
                    // await AsyncStorage.setItem('auth_token', data.token);
                    // dispatch(setToken(data.token));
                    // dispatch(setUser(data.user));
                    // }
                } catch (err: any) {
                    // dispatch(setError(err?.error?.data?.message || 'Register failed'));
                }
                finally {
                    dispatch(setLoading(false));
                }
            },
            invalidatesTags: ['Auth'],
        }),
        // register: builder.mutation<AuthResponse, RegisterData>({
        //     query: (data) => ({
        //         url: ENDPOINTS.AUTH.REGISTER,
        //         method: 'POST',
        //         body: data,
        //     }),
        //     async onQueryStarted(arg, { queryFulfilled }) {
        //         try {
        //             const { data } = await queryFulfilled;
        //             if (data.token) {
        //                 await AsyncStorage.setItem('auth_token', data.token);
        //             }
        //         } catch (error) {
        //             console.error('Register error:', error);
        //         }
        //     },
        //     invalidatesTags: ['Auth'],
        // }),

        // Get current user (Me)
        getCurrentUser: builder.query<LoginResponse, void>({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),

        // Logout
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('Logout API error:', error);
                } finally {
                    await AsyncStorage.removeItem('auth_token');
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // Refresh Token
        refreshToken: builder.mutation<{ token: string }, void>({
            query: () => ({
                url: ENDPOINTS.AUTH.REFRESH,
                method: 'POST',
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.token) {
                        await AsyncStorage.setItem('auth_token', data.token);
                    }
                } catch (error) {
                    console.error('Refresh token error:', error);
                }
            },
        }),

        // Forgot Password
        forgotPassword: builder.mutation<ApiResponse<null>, string>({
            query: (email) => ({
                url: `${ENDPOINTS.AUTH.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`,
                method: 'POST',
            }),
        }),
        //         forgotPassword: builder.mutation<{ message: string }, string>({
        //     query: (email) => ({
        //         url: `${ENDPOINTS.AUTH.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`,
        //         method: 'POST',
        //     }),
        //     async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //         dispatch(setLoading(true));
        //         try {
        //             await queryFulfilled;
        //         } catch (err: any) {
        //             dispatch(setError(err?.error?.data?.message || 'Failed to send reset email'));
        //         } finally {
        //             dispatch(setLoading(false));
        //         }
        //     },
        // }),
        // forgotPassword: builder.mutation<{ message: string }, { email: string }>({
        //     query: (data) => ({
        //         url: ENDPOINTS.AUTH.RESET_PASSWORD,
        //         method: 'POST',
        //         body: data,
        //     }),
        // }),

        // Reset Password
        resetPassword: builder.mutation<
            { message: string },
            { token: string; newPassword: string }
        >({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLazyGetCurrentUserQuery,
} = authApi;