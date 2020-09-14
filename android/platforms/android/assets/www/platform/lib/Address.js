define(['jquery','cordova'], 
function($,cordova){	
	var Address = {
		getAddress: function(successCallback, failureCallback){
		cordova.exec(successCallback, failureCallback, 'MacAddressPlugin',
			'getAddress', []);
	}
};
return  Address;
});
