const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite's web worker imports a missing wa-sqlite.wasm in some npm builds.
// Native uses database.native.ts; web uses database.web.ts — block stray imports.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'expo-sqlite' ||
      moduleName.startsWith('expo-sqlite/') ||
      moduleName.includes('expo-sqlite/web/worker'))
  ) {
    return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
