(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,i=t.CipherParams,o=r.enc,n=o.Hex,c=r.format;c.Hex={stringify:function(e){return e.ciphertext.toString(n)},parse:function(e){var r=n.parse(e);return i.create({ciphertext:r})}}}(),e.format.Hex});