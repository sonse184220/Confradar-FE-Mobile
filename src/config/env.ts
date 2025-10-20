import Constants from 'expo-constants';

const { API_BASE_URL, APP_NAME, ENABLE_LOG } = Constants.expoConfig?.extra || {};

export const ENV = {
    API_BASE_URL,
    APP_NAME,
    ENABLE_LOG: ENABLE_LOG === 'true',
};

// import Config from 'react-native-config';

// export const ENV = {
//     API_BASE_URL: Config.API_BASE_URL,
//     APP_NAME: Config.APP_NAME,
//     ENABLE_LOG: Config.ENABLE_LOG === 'true',
// };
