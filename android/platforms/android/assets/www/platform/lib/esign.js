(function ( root, doc, factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery"], function ( $) {
            return factory( $);
        });
    } else {
        // Browser globals
        factory( root.jQuery);
    }
}( this, document, function ( $) {
//签名
$.fn.esign = function() {
	var $esign = this;
	var canvas = $esign.find('#canvasEdit')[0];
	if (typeof document.ontouchstart != "undefined") {//pad
		canvas.addEventListener('touchmove', onMouseMove, false);	
		canvas.addEventListener('touchstart', onMouseDown, false);
		canvas.addEventListener('touchend', onMouseUp, false);
	}
	else {//PC
		canvas.addEventListener('mousemove', onMouseMove, false);
		canvas.addEventListener('mousedown', onMouseDown, false);
		canvas.addEventListener('mouseup', onMouseUp, false);
	}
	var context = canvas.getContext('2d');
	var linex = new Array();
	var liney = new Array();
	var linen = new Array();
	var lastX = 1;
	var lastY = 30;
	var flag = 0;
	function getCanvasPos(canvas, evt) { 
		var rect = canvas.getBoundingClientRect(); 
		var x,y;
		if (evt.targetTouches) {
			x = evt.targetTouches[0].clientX;
			y = evt.targetTouches[0].clientY;
		}
		else {
			x = evt.clientX;
			y = evt.clientY;
		}
		return { 
			x: (x - rect.left) * (canvas.width / rect.width),
			y: (y - rect.top) * (canvas.height / rect.height),
		}
	}
	function onMouseMove(evt)
	{
		var x = getCanvasPos(canvas, evt).x,
				y = getCanvasPos(canvas, evt).y;
				
		if (flag == 1)
		{
			linex.push(x);
			liney.push(y);
			linen.push(1);
			context.save();
			context.translate(context.canvas.width / 2, context.canvas.height / 2);
			context.translate(-context.canvas.width / 2 , -context.canvas.height/2);
			context.beginPath();
			context.lineWidth = 2;
			for (var i = 1; i < linex.length; i++)
			{
				lastX = linex[i];
				lastY = liney[i];
				if (linen[i] == 0)
					context.moveTo(lastX, lastY);
				else
					context.lineTo(lastX, lastY);
			}
			//context.strokeStyle = 'hsl(50%, 50%, 50%)';
			//context.shadowColor = 'white';
			context.shadowBlur = 10;
			context.stroke();
			context.restore();
		}
    evt.preventDefault();
	}
	function onMouseDown(evt)
	{
		var x = getCanvasPos(canvas, evt).x,
				y = getCanvasPos(canvas, evt).y;
		flag = 1;
		linex.push(x);
		liney.push(y);
		linen.push(0);
	}
	function onMouseUp(evt)
	{
		flag = 0;
	}
	// 重画
	function rewrite(){	
		linex = new Array();
		liney = new Array();
		linen = new Array();
		context.clearRect(0,0,canvas.width,canvas.height);
	}
	function preview(){
		var show=$esign.find("#sign_show")[0];
		show.innerHTML="";
		show.appendChild(convertCanvasToImage(canvas));
	}
	function save(){
		var textarea=$esign.find("#custom_sign")[0];
		textarea.innerHTML="";
		textarea.appendChild(convertCanvasToImage(canvas));
	}
	function convertCanvasToImage(canvas){
		var image=new Image();
		image.width=200;
		image.height=40;
		image.src=canvas.toDataURL("i/png");
		return image;
	}

	$esign.find("#sign_ok").on("click",function(){preview();rewrite()});
	$esign.find("#sign_clear").click(rewrite);
	$esign.find("#sign_save").click(save);

}
return $.fn.esign;
}));
