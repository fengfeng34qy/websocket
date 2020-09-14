define(function(require) {

	var collectionEvents = {};
	
	
	return {
		register: function(eventname, callback){
			if(collectionEvents[eventname] == undefined){
				collectionEvents[eventname] = [];
			}
			collectionEvents[eventname].push(callback); //事件处理函数列表
		},
		collectionEvents: collectionEvents
	}
});
