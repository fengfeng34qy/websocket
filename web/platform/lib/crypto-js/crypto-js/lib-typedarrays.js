(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){if("function"==typeof ArrayBuffer){var r=e,t=r.lib,i=t.WordArray,o=i.init,n=i.init=function(e){if(e instanceof ArrayBuffer&&(e=new Uint8Array(e)),(e instanceof Int8Array||e instanceof Uint8ClampedArray||e instanceof Int16Array||e instanceof Uint16Array||e instanceof Int32Array||e instanceof Uint32Array||e instanceof Float32Array||e instanceof Float64Array)&&(e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength)),e instanceof Uint8Array){for(var r=e.byteLength,t=[],i=0;r>i;i++)t[i>>>2]|=e[i]<<24-8*(i%4);o.call(this,t,r)}else o.apply(this,arguments)};n.prototype=i}}(),e.lib.WordArray});