export default ({ config }) => ({
    ...config,
    extra: {
        API_BASE_URL: process.env.API_BASE_URL,
        APP_NAME: process.env.APP_NAME,
        ENABLE_LOG: process.env.ENABLE_LOG === 'true',
        // API_URL:  process.env.API_BASE_URL,
    },
});
