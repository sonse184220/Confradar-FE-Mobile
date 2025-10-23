import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import authReducer from './slices/authSlice';
import { conferenceApi } from './api/conferenceApi';
import { conferenceCategoryApi } from './api/conferenceCategoryApi';
import { ticketApi } from './api/ticketApi';
import { transactionApi } from './api/transactionApi';

export const store = configureStore({
    reducer: {
        // RTK Query API reducers
        [authApi.reducerPath]: authApi.reducer,
        [conferenceApi.reducerPath]: conferenceApi.reducer,
        [conferenceCategoryApi.reducerPath]: conferenceCategoryApi.reducer,
        [ticketApi.reducerPath]: ticketApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,

        // Slice reducers (cho local state)
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            conferenceApi.middleware,
            conferenceCategoryApi.middleware,
            ticketApi.middleware,
            transactionApi.middleware,
            //   userApi.middleware
        ),
});

// Setup listeners cho refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import userReducer from './userSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;