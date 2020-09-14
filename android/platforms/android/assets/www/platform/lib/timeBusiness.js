function delayURLForBusiness(url) { 
			var delay=document.getElementById("timeForBusiness").innerHTML; 
			//最后的innerHTML不能丢，否则delay为一个对象 
			if(delay>0){ 
			delay--; 
			document.getElementById("timeForBusiness").innerHTML=delay; 
		}else{ 
			
			window.top.location.href=url; 
		} 
			setTimeout("delayURLForBusiness('" + url + "')", 1000); 
			//此处1000毫秒即每一秒跳转一次 
		} 