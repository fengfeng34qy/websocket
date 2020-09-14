(function (undefined) {
  // Common JS // require JS
  var _, $, Backbone, exports;
  if (typeof window === 'undefined' || typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    exports = Backbone;
    if (typeof module !== 'undefined') module.exports = exports;
  } else {
    $ = this.$;
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }


/*!
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


/**
 * # Backbone.sync
 *
 * Replaces default Backbone.sync function with socket.io transport
 *
 * ### Assumptions
 *
 * Currently expects active socket to be located at `window.socket`,
 * `Backbone.socket` or the sync'ed model own socket.
 * See inline comments if you want to change it.
 * ### Server Side
 *
 *     socket.on('todos:create', function (data, fn) {
 *      ...
 *      fn(null, todo);
 *     });
 *     socket.on('todos:read', ... );
 *     socket.on('todos:update', ... );
 *     socket.on('todos:delete', ... );
 *
 * @name sync
 *
Backbone.sync = function (method, model, options) {
  var params = _.extend({}, options)

  if (params.url) {
    params.url = _.result(params, 'url');
  } else {
    params.url = _.result(model, 'url') || urlError();
  }

  var cmd = params.url.split('/')
    , namespace = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

  if ( !params.data && model ) {
    params.data = params.attrs || model.toJSON(options) || {};
  }

  if (params.patch === true && params.data.id == null && model) {
    params.data.id = model.id;
  }

  // If your socket.io connection exists on a different var, change here:
  var io = model.socket || Backbone.socket || window.socket

  //since Backbone version 1.0.0 all events are raised in methods 'fetch', 'save', 'remove' etc

  var defer = $.Deferred();
  io.emit(namespace + ':' + method, params.data, function (err, data) {
    if (err) {
      if(options.error) options.error(err);
      defer.reject();
    } else {
      if(options.success) options.success(data);
      defer.resolve();
    }
  });
  var promise = defer.promise();
  model.trigger('request', model, promise, options);
  return promise;
};

// Throw an error when a URL is needed, and none is supplied.
// Copy from backbone.js#1558
var urlError = function() {
  throw new Error('A "url" property or function must be specified');
};*/

var serverUrl = 'http://localhost:8080';// To support both ajax and socketio. by Fan.ll
Backbone.setServerUrl = function(url){
	serverUrl = url;
};

// Map from CRUD to HTTP for our default `Backbone.sync` implementation. Derived from Backbone.js. By Fan.ll
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'jsonp', crossDomain: true, jsonp: 'jsoncallback'};//xhrFields:{withCredentials:true}}; //crossDomain. by Fan.ll

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }
    
    params.url = serverUrl + params.url; // To support both ajax and socketio. by Fan.ll

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

function stringToHex(str){
    var val="";
    for(var i = 0; i < str.length; i++){
      if(val == "")
        val = str.charCodeAt(i).toString(16);
      else
        val += "," + str.charCodeAt(i).toString(16);
    }
    return val;
}

Backbone.Collection.prototype.fetch = function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        console.log("respone ==" + JSON.stringify(resp));
		if (resp.list&&resp.list[0]&&resp.list[0].custname) console.log("custname="+stringToHex(resp.list[0].custname));
        if(typeof resp === 'string'){
			if(typeof (JSON.parse(resp).H_ret_code)!="undefined"&&JSON.parse(resp).H_ret_code != '000000'){
					app.trigger('warn', JSON.parse(resp).H_ret_code +　JSON.parse(resp).H_ret_desc);
				return;//暂且忽略
			}
		}else{
			if(typeof (resp.H_ret_code)!="undefined"&&resp.H_ret_code != '000000'){
					app.trigger('warn', resp.H_ret_code +　resp.H_ret_desc);
				return;//暂且忽略
			}
		}
        //resp = resp.result;
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      options.timeout = 20000;
      wrapError(this, options);
      this.listenTo(collection, 'error', function(msg){
      	app.trigger("warn", msg);
      });
      
/*      options.complete = function(resp) {
        $.mobile.loading('hide');
      };
      $.mobile.loading('show');
*/      return this.sync('read', this, options);
  };
  
  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      //if (error) error(model, resp, options);
        console.log("backbone fetch error:" + JSON.stringify(resp));
      model.trigger('error', "连接服务器失败");
    };
  };

})();

