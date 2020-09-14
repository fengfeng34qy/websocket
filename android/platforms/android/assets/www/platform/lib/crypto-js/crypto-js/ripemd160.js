(function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core")):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){function r(e,r,t){return e^r^t}function t(e,r,t){return e&r|~e&t}function o(e,r,t){return(e|~r)^t}function i(e,r,t){return e&t|r&~t}function n(e,r,t){return e^(r|~t)}function c(e,r){return e<<r|e>>>32-r}var s=e,a=s.lib,f=a.WordArray,u=a.Hasher,h=s.algo,p=f.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),d=f.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),l=f.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),y=f.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),v=f.create([0,1518500249,1859775393,2400959708,2840853838]),m=f.create([1352829926,1548603684,1836072691,2053994217,0]),_=h.RIPEMD160=u.extend({_doReset:function(){this._hash=f.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,s){for(var a=0;16>a;a++){var f=s+a,u=e[f];e[f]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}var h,_,x,g,w,S,b,q,B,H,k=this._hash.words,A=v.words,C=m.words,j=p.words,z=d.words,J=l.words,D=y.words;S=h=k[0],b=_=k[1],q=x=k[2],B=g=k[3],H=w=k[4];for(var R,a=0;80>a;a+=1)R=0|h+e[s+j[a]],R+=16>a?r(_,x,g)+A[0]:32>a?t(_,x,g)+A[1]:48>a?o(_,x,g)+A[2]:64>a?i(_,x,g)+A[3]:n(_,x,g)+A[4],R=0|R,R=c(R,J[a]),R=0|R+w,h=w,w=g,g=c(x,10),x=_,_=R,R=0|S+e[s+z[a]],R+=16>a?n(b,q,B)+C[0]:32>a?i(b,q,B)+C[1]:48>a?o(b,q,B)+C[2]:64>a?t(b,q,B)+C[3]:r(b,q,B)+C[4],R=0|R,R=c(R,D[a]),R=0|R+H,S=H,H=B,B=c(q,10),q=b,b=R;R=0|k[1]+x+B,k[1]=0|k[2]+g+H,k[2]=0|k[3]+w+S,k[3]=0|k[4]+h+b,k[4]=0|k[0]+_+q,k[0]=R},_doFinalize:function(){var e=this._data,r=e.words,t=8*this._nDataBytes,o=8*e.sigBytes;r[o>>>5]|=128<<24-o%32,r[(o+64>>>9<<4)+14]=16711935&(t<<8|t>>>24)|4278255360&(t<<24|t>>>8),e.sigBytes=4*(r.length+1),this._process();for(var i=this._hash,n=i.words,c=0;5>c;c++){var s=n[c];n[c]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8)}return i},clone:function(){var e=u.clone.call(this);return e._hash=this._hash.clone(),e}});s.RIPEMD160=u._createHelper(_),s.HmacRIPEMD160=u._createHmacHelper(_)}(Math),e.RIPEMD160});