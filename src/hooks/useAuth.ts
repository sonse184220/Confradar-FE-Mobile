import { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '';
import {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useGetProfileByIdQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation
} from '@/store/api/authApi';
import { setUser, clearAuth } from '@/store/slices/authSlice';
import type { ChangePasswordRequest, LoginCredentials, ProfileUpdateRequest, RegisterData } from '@/types/auth';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // RTK Query hooks
    const [loginMutation, { isLoading: loginLoading, error: loginRawError, data: loginData }] = useLoginMutation();
    const [registerMutation, { isLoading: registerLoading, error: registerRawError, data: registerData }] = useRegisterMutation();
    const [logoutMutation, { isLoading: logoutLoading }] = useLogoutMutation();
    // const [getCurrentUser, { isLoading: checkAuthLoading }] = useLazyGetCurrentUserQuery();
    const [forgotPasswordMutation, { isLoading: forgotLoading, error: forgotRawError, data: forgotData }] = useForgotPasswordMutation();

    const { data, error, isLoading, refetch } = useGetProfileByIdQuery(user?.id!, {
        skip: !user?.id!,
    })

    const [updateProfileMutation, { isLoading: isUpdating, error: updateError }] = useUpdateProfileMutation();

    const [changePasswordMutation, { isLoading: isChanging, error: changePasswordError, data: changePasswordData }] = useChangePasswordMutation();

    const updateProfile = async (payload: ProfileUpdateRequest) => {
        if (!user?.id!) throw new Error("User not logged in");
        const result = await updateProfileMutation(payload).unwrap();
        return result;
    };

    const changePassword = async (payload: ChangePasswordRequest) => {
        const result = await changePasswordMutation(payload).unwrap();
        return result;
    };

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

    // const parseSuccess = (data: any): string | null => {
    //     if (data?.Message) {
    //         return data.Message;
    //     }
    //     if (data?.message) {
    //         return data.message;
    //     }
    //     return null;
    // };

    const loginError = loginRawError ? parseError(loginRawError) : null;
    const registerError = registerRawError ? parseError(registerRawError) : null;
    const forgotError = forgotRawError ? parseError(forgotRawError) : null;

    // const loginSuccess = loginData?.Success ? parseSuccess(loginData) : null;
    // const registerSuccess = registerData?.Success ? parseSuccess(registerData) : null;
    // const forgotSuccess = forgotData?.Success ? parseSuccess(forgotData) : null;

    // Login handler
    const login = async (credentials: LoginCredentials) => {
        try {
            const result = await loginMutation(credentials).unwrap();
            // dispatch(setUser(result.Data.user));
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Register handler
    const register = async (data: RegisterData) => {
        try {
            // Tạo FormData từ RegisterData
            const formData = new FormData();

            // Append required fields
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('confirmPassword', data.confirmPassword);
            formData.append('fullName', data.fullName);

            // Append optional fields nếu có giá trị
            if (data.birthday) formData.append('birthday', data.birthday);
            if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
            if (data.gender) formData.append('gender', data.gender);
            if (data.bioDescription) formData.append('bioDescription', data.bioDescription);

            // Append file nếu có
            if (data.avatarFile) {
                formData.append('avatarFile', data.avatarFile);
            }

            const result = await registerMutation(formData).unwrap();
            // dispatch(setUser(result.user));
            return result;
        } catch (error) {
            throw error;
        }
    };
    // const register = async (data: RegisterData) => {
    //     try {
    //         const result = await registerMutation(data).unwrap();
    //         dispatch(setUser(result.user));
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    //forgot password
    const forgotPassword = async (email: string) => {
        try {
            const result = await forgotPasswordMutation(email).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Logout handler
    const logout = async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(clearAuth());
        }
    };

    // Check auth status
    // const checkAuth = async () => {
    //     try {
    //         const result = await getCurrentUser().unwrap();
    //         // dispatch(setUser(result.user));
    //         return result;
    //     } catch (error) {
    //         dispatch(clearAuth());
    //         throw error;
    //     }
    // };

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        // checkAuth,
        forgotPassword,
        loading: loginLoading || registerLoading || logoutLoading || forgotLoading,
        loginError,
        registerError,
        forgotError,
        loginResponse: loginData,
        registerResponse: registerData,
        forgotResponse: forgotData,

        profile: data?.data || null,
        isLoading,
        error,
        refetch,

        updateProfile,
        isUpdating,
        updateError,

        changePassword,
        isChanging,
        changePasswordError,
        changePasswordData,
    };
};