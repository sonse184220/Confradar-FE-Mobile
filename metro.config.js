const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const config = mergeConfig(getDefaultConfig(__dirname), {
    resolver: {
        extraNodeModules: {
            "@": path.resolve(__dirname, "src"),
        },
        sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs', 'cjs']
    }
});

module.exports = withNativeWind(config, { input: './global.css' });