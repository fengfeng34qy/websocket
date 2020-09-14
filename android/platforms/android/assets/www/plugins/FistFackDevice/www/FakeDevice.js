cordova.define("FistFackDevice.FakeDevice", function(require, exports, module) {
// var exec = require('cordova/exec');

// exports.coolMethod = function (arg0, success, error) {
//     exec(success, error, 'FakeDevice', 'coolMethod', [arg0]);
// };

var FakeDevice = {
	fakeDevice: function(successCallback, errorCallback, string){
		cordova.exec(successCallback, errorCallback, 'FakeDevice', 'coolMethod', string);
	}
}
module.exports = FakeDevice;
});
