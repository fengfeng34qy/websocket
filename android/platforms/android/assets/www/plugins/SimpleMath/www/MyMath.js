cordova.define("SimpleMath.MyMath", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'MyMath', 'coolMethod', [arg0]);
};

});
