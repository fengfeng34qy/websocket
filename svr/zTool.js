

(function (exports) {
	var SimpleMap = exports.SimpleMap = function() {
		this.map = {};
		this.mapSize = 0;
	};

	SimpleMap.prototype.put = function(key, value) {
		var oldValue = this.map[key];
		for(var name in this.map){
		    if(this.map[name].nick === value.nick){
		        delete this.map[name];
            }
        }
        // if(this.getHas(this.map, value)){
        //     this.map[key] = value;
        //     this.mapSize++;
        // }
		this.map[key] = value;
		if (!oldValue) {
			this.mapSize++;
		}
		return (oldValue || value);
	};

	SimpleMap.prototype.get = function(key) {
		return this.map[key];
	};

	SimpleMap.prototype.remove = function(key) {
		var v = this.map[key];
		if (v) {
			delete this.map[key];
			this.mapSize--;
		}
		return v;
	};

	SimpleMap.prototype.size = function() {
		return this.mapSize;
	};

	SimpleMap.prototype.clear = function() {
		this.map = {};
		this.mapSize = 0;
	};

	SimpleMap.prototype.keySet = function() {
		var theKeySet = [];
		for (var i in this.map) {
			theKeySet.push(i);
		}
		return theKeySet;
	};

	SimpleMap.prototype.values = function() {
		var theValue = [];
		for (var i in this.map) {
			theValue.push(this.map[i]);
		}
		// return this.unArray(theValue);
        return theValue;
	};

	// 去掉重复用户
    SimpleMap.prototype.unArray = function(arr){
        var a = arr;
        for(var i=0; i<a.length; i++){
            for(var j=i+1; j<a.length; j++){
                var obj1 = a[i];
                var obj2 = a[j];
                if(obj1.nick === obj2.nick){
                    a.splice(i,1);
                    i--;
                    break;
                }
            }
        }
        return a;
	};

    SimpleMap.prototype.getHas = function(map,value){
        for(var k in map){
            if(k.nick === value.nick){
                delete this.map[k];
                // return false;
            }
        }
        return true;
    };

	var CircleList = exports.CircleList = function(maxSize) {
		this.maxSize = (maxSize || 10);
		this.list = [];
		this.index = null;
	};

	CircleList.prototype.clear = function() {
		this.list = [];
		this.index = null;
	};

	CircleList.prototype.add = function(value) {
		if (null == this.index) {
			this.index = 0;
		}

		this.list[this.index++] = value;
		
		if (this.index == this.maxSize) {
			this.index = 0;
		}
	};

	CircleList.prototype.values = function() {
		var theValue = [];
		if (null != this.index) {
			if (this.list.length == this.maxSize) {
				for (var i = this.index; i < this.maxSize; i++) {
					theValue.push(this.list[i]);
				}
			}

			for (var i = 0; i < this.index; i++) {
				theValue.push(this.list[i]);
			}
		}
		return theValue;
	};

})( (function(){
    if(typeof exports === 'undefined') {
        window.zTool = {};
        return window.zTool;
    } else {
        return exports;
    }
})() );