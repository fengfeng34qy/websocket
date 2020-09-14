function delayURL(url) { 
			var delay=document.getElementById("time").innerHTML; 
			//最后的innerHTML不能丢，否则delay为一个对象 
			if(delay>0){ 
			delay--; 
			document.getElementById("time").innerHTML=delay; 
		}else{ 
			document.getElementById("fileInfo").innerHTML = "   ";
			document.getElementById("fileInfo1").innerHTML = "   ";
			document.getElementById("fileInfo2").innerHTML = "   ";
			document.getElementById("fileInfo3").innerHTML = "   ";
			document.getElementById("fileInfo4").innerHTML = "   ";
			document.getElementById("fileInfo5").innerHTML = "   ";
			document.getElementById("fileInfo6").innerHTML = "   ";
			
			document.getElementById("fail").innerHTML = "连接失败";
			window.top.location.href=url; 
		} 
			setTimeout("delayURL('" + url + "')", 1000); 
			//此处1000毫秒即每一秒跳转一次 
		} 