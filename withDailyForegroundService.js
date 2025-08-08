// ./withDailyForegroundService.js
const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withDailyForegroundService(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    
    // Add service declaration
    manifest.application[0].service = manifest.application[0].service || [];
    manifest.application[0].service.push({
      $: {
        'android:name': 'com.daily.reactlibrary.DailyOngoingMeetingForegroundService',
        'android:foregroundServiceType': 'mediaProjection|camera|microphone',
        'android:exported': 'false'
      }
    });

    return config;
  });
};