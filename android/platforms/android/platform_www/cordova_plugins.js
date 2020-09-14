cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "SimpleMath.MyMath",
    "file": "plugins/SimpleMath/www/MyMath.js",
    "pluginId": "SimpleMath",
    "clobbers": [
      "cordova.plugins.MyMath"
    ]
  },
  {
    "id": "cordova-plugin-keyboard.keyboard",
    "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
    "pluginId": "cordova-plugin-keyboard",
    "clobbers": [
      "window.Keyboard"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova.custom.plugins.exitapp.exitApp",
    "file": "plugins/cordova.custom.plugins.exitapp/www/ExitApp.js",
    "pluginId": "cordova.custom.plugins.exitapp",
    "merges": [
      "navigator.app"
    ]
  },
  {
    "id": "FistFackDevice.FakeDevice",
    "file": "plugins/FistFackDevice/www/FakeDevice.js",
    "pluginId": "FistFackDevice",
    "clobbers": [
      "fakeDevice"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-dialogs": "1.3.4",
  "SimpleMath": "1.0.0",
  "cordova-plugin-keyboard": "1.2.0",
  "cordova-plugin-device": "2.0.1",
  "cordova-plugin-splashscreen": "5.0.1",
  "cordova.custom.plugins.exitapp": "1.0.0",
  "FistFackDevice": "1.0.0"
};
// BOTTOM OF METADATA
});