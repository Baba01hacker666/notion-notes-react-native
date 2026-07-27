const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    assetExts: ['db', 'mp3', 'wav', 'png', 'jpg', 'ttf', 'otf'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
