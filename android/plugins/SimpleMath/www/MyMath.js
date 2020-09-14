var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'MyMath', 'coolMethod', [arg0]);
};

// var MyMath = {
// 	coolMethod: function(successCallback, errorCallback, arg0){
// 		cordova.exec(successCallback, errorCallback, 'MyMath', 'coolMethod', [arg0]);
// 	}
// }

// module.exports = MyMath;