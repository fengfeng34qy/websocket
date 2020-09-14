(function(exports){
	// 事件类型
	exports.EVENT_TYPE = {'LOGIN':'LOGIN', 'LOGOUT':'LOGOUT', 'SPEAK':'SPEAK', 'LIST_USER':'LIST_USER', 'ERROR':'ERROR', 'LIST_HISTORY':'LIST_HISTORY'};

	// 服务端口
	exports.PORT = 8088;

	// 服务端口
	exports.HOST = "182.61.56.188";

	var analyzeMessageData = exports.analyzeMessageData = function(message) {
		try {
			return JSON.parse(message);
		} catch (error) {
			// 收到了非正常格式的数据
			console.log('method:analyzeMsgData,error:' + error);
		}

		return null;
	};

	var getMsgFirstDataValue = exports.getMsgFirstDataValue = function (mData) {
		if (mData && mData.values && mData.values[0]) {
			return mData.values[0];
		}

		return '';
	};

    var getMsgFace = exports.getMsgFace = function (mData) {
        if (mData && mData.values && mData.values[1]) {
            return mData.values[1];
        }
        return '';
    };

    var getOrigin = exports.getOrigin = function(mData){
        if (mData && mData.values && mData.values[2]) {
            return mData.values[2];
        }
        return '';
	};

})( (function(){
    if(typeof exports === 'undefined') {
        window.chatLib = {};
        return window.chatLib;
    } else {
        return exports;
    }
})() );