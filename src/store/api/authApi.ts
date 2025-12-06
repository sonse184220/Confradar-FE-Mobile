import { createApi } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseQueryWithReauth } from './baseApi';
import type { LoginCredentials, RegisterData, LoginResponse, User, ProfileUpdateRequest, UserProfileResponse, ChangePasswordRequest } from '@/types/auth';
import { setError, setLoading, setToken, setUser } from '@/store/slices/authSlice';
import type { AppDispatch } from '../index';
import { ENDPOINTS } from '@/constants/endpoints';
import { ApiResponse } from '@/types/api';
import { jwtDecode } from 'jwt-decode';
import { Notification } from '@/types/notification.type';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth', 'Notifications'],
    endpoints: (builder) => ({
        // Login
        login: builder.mutation<ApiResponse<LoginResponse>, LoginCredentials>({
            query: ({ email, password, firebaseWebFcmToken, firebaseMobileFcmToken }) => ({
                url: ENDPOINTS.AUTH.LOGIN,
                method: "POST",
                body: {
                    email,
                    password,
                    firebaseWebFcmToken,
                    firebaseMobileFcmToken,
                },
            }),
            invalidatesTags: ['Auth'],
        }),
        // login: builder.mutation<ApiResponse<LoginResponse>, LoginCredentials>({
        //     query: (credentials) => ({
        //         url: ENDPOINTS.AUTH.LOGIN,
        //         method: 'POST',
        //         body: credentials,
        //     }),
        //     invalidatesTags: ['Auth'],
        // }),

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

        getProfileById: builder.query<ApiResponse<UserProfileResponse>, string>({
            query: (userId) => ({
                url: `${ENDPOINTS.AUTH.PROFILE}?userId=${userId}`,
                method: "GET",
            }),
        }),

        updateProfile: builder.mutation<ApiResponse<number>, ProfileUpdateRequest>({
            query: (data) => {
                const formData = new FormData();
                if (data.fullName) formData.append("FullName", data.fullName);
                if (data.birthDay) formData.append("BirthDay", data.birthDay);
                if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
                if (data.gender) formData.append("Gender", data.gender);
                if (data.avatarFile) formData.append("AvatarFile", data.avatarFile);
                if (data.bioDescription) formData.append("BioDescription", data.bioDescription);

                return {
                    url: ENDPOINTS.AUTH.UPDATE_PROFILE,
                    method: "PUT",
                    body: formData,
                };
            },
        }),

        changePassword: builder.mutation<ApiResponse<null>, ChangePasswordRequest>({
            query: (data) => ({
                url: ENDPOINTS.AUTH.CHANGE_PASSWORD,
                method: "PUT",
                body: data,
            }),
        }),

        firebaseLogin: builder.mutation({
            query: ({ token, firebaseWebFcmToken, firebaseMobileFcmToken }) => ({
                url: ENDPOINTS.AUTH.GOOGLE,
                method: "POST",
                body: {
                    token,
                    ...(firebaseWebFcmToken && { firebaseWebFcmToken }),
                    ...(firebaseMobileFcmToken && { firebaseMobileFcmToken }),
                },
            }),
        }),

        // firebaseLogin: builder.mutation({
        //     query: (token) => ({
        //         url: ENDPOINTS.AUTH.GOOGLE,
        //         method: "POST",
        //         body: { token },
        //     }),
        // }),

        getOwnNotifications: builder.query<ApiResponse<Notification[]>, void>({
            query: () => ({
                url: ENDPOINTS.AUTH.GET_NOTIFICATION,
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,

    useGetProfileByIdQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,

    useFirebaseLoginMutation,

    useGetOwnNotificationsQuery,
} = authApi;