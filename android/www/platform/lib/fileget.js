define(['jquery', 'cordova'], 
function($, cordova){
	var fileSystem;
	var versionfilepath = app.cfg.rootdir + "/pdfVersion.ini";
	var versionfileurl = "cdvfile://localhost/persistent/" + app.cfg.rootdir + "/pdfVersion.ini";
	var filetypes = {"1":"productPdf", "2":"productThumbnail", "3":"activityPdf"};
	var pic_notFound = app.cfg.rootdir + "/" + filetypes[2] + "/pic_notFound.jpg";
	
	var downloadFile = function (sourceUrl, filepath, callback, errorcallback, pageview, fileinfo){
		fileSystem.root.getFile(filepath, {create:true}, 
			function(fileEntry){
				//为了兼容ios，要这样写。(Android fileEntry.toURL得到cdvfile..，而ios得到file..，这是不对的)
				var targetURL = "cdvfile://localhost/persistent/" + fileEntry.fullPath;
				console.log("targetURL:" + targetURL);
				var fileTransfer = new FileTransfer(); 
				var uri = encodeURI(sourceUrl);  
				$.mobile.loading('show');
				fileTransfer.download(
					uri, 
					targetURL, 
					function(fileEntry){
						console.log("downloadURL---------:");
						$.mobile.loading('hide');
						fileEntry.file(success, fail);
						updatePdfVersion(fileinfo);
						callback(fileEntry, pageview);
					},
					function(error){
						console.log("errrrrrrrror:");
						$.mobile.loading('hide');
						fileEntry.remove();
						errorcallback("下载出现错误");
					},
					false,
					null
				);  
		 	},
		 	function(){
				errorcallback('下载文件出错');
			}
		); 
	};
	
	function success(file) {
	  console.log("File size: " + file.size);
	}
	//校验pdf版本，不一致更新下pdf
	var checkPdfVersion = function(fileinfo, _url, targetfilepath, callback, errorcallback, pageview){
		var typename = filetypes[fileinfo.type];
		console.log("checkPdfVersion");
		fileSystem.root.getFile(versionfilepath, null, 
			function(fileEntry){
				fileEntry.file(function(file) {
					var reader = new FileReader();
	        reader.onloadend = function(evt) {
	            console.log("checkPdfVersion begin");
	            console.log(evt.target.result);
	            var cfg = $.parseJSON(evt.target.result);
	            var isnew = true;
	            console.log("cfg[typename][fileinfo.id]=" + cfg[typename][fileinfo.id]);
	            console.log("fileinfo.version" + fileinfo.version);
	            if((cfg[typename] == null) || (cfg[typename][fileinfo.id] != fileinfo.version)){
	            	isnew = false;
	            }
	            afterCheckVersion(fileinfo, _url, targetfilepath, callback, errorcallback, pageview, isnew);
	        };
					reader.readAsText(file);
				}, errorcallback);
			}, 
			errorcallback
		);
	};
	
	var fail = function (error) {
      console.log(error);
      app.trigger("warn", "获取文件发生错误:" + error.code);
  };
	
	var writeFile = function (filepath, text){
		fileSystem.root.getFile(filepath, null, 
			function(fileEntry){
				console.log("fileEntry url=" + fileEntry.toURL());
				fileEntry.createWriter(function(writer) {
					console.log("writeFile begin text=" + text);
					//writer.truncate(0);
					console.log("after truncate");
					writer.write(text);
					console.log("writeFile text = " + text);
					console.log("writeFile end");
				}, fail);
			}, 
			fail
		);
	};
	
	var updatePdfVersion = function(fileinfo){
		var typename = filetypes[fileinfo.type];
		fileSystem.root.getFile(versionfilepath, null, 
			function(fileEntry){
				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onloadend = function(evt) {
						console.log("updatePdfVersion begin");
						console.log(evt.target.result);
						var cfg = $.parseJSON(evt.target.result);
						cfg[typename][fileinfo.id] = fileinfo.version;
						console.log("cfg = " + JSON.stringify(cfg));
						writeFile(versionfilepath, JSON.stringify(cfg));
						console.log("updatePdfVersion end");
	        };
					reader.readAsText(file);
				}, fail);
			}, 
			fail
		);
	};
	
	var createPdfVersionFile = function(fileinfo, _url, _localFile, callback, errorcallback, pageview){
		fileSystem.root.getFile(versionfilepath, {create:true}, 
			function(fileEntry){
				fileEntry.createWriter(function(writer) {
					console.log("createPdfVersionFile begin");
					var cfg = {};
					cfg.productPdf = {};
					cfg.productThumbnail = {};
					cfg.activityPdf = {};
					writer.write(JSON.stringify(cfg));
					console.log("createPdfVersionFile end");
					checkPdfVersion(fileinfo, _url, _localFile, callback, errorcallback, pageview);
				}, errorcallback);
			}, 
			errorcallback
		);
	};
	
	var afterCheckVersion = function(fileinfo, _url, targetfilepath, callback, errorcallback, pageview, isnew){
		console.log("isnew = " + isnew);
		if(isnew){
			fileSystem.root.getFile(targetfilepath, null, 
				function(fileEntry){
					callback(fileEntry, pageview);
				}, 
				function(){ 
					console.log("err find file");
					downloadFile(_url, targetfilepath, callback, errorcallback, pageview, fileinfo); 
				}
			);
		}else {
			downloadFile(_url, targetfilepath, callback, errorcallback, pageview, fileinfo); 
		}
	};
	
	//fileinfo={id, type, version}
	var getFile = function (fileinfo, callback, errorcallback, pageview) {
		var dir;
		var extension;
		dir = app.cfg.rootdir + "/" + filetypes[fileinfo.type];
		if(fileinfo.type=="1" || fileinfo.type=="3"){
			extension = ".pdf";
		}else{
			extension = ".jpg";
		}
		var _localFile = dir + "/" + fileinfo.id + extension;
		var _url = app.cfg.server+"" + "/file_downLoadProductFile?downType=" + fileinfo.type + "&ID=" + fileinfo.id + "&trancode=H020";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){ 
    	fileSystem = fs;
			//创建目录
			fileSystem.root.getDirectory(app.cfg.rootdir, {create:true}, 
				function(fileEntry){ }, 
				function(){  errorcallback("创建目录失败");});
			fileSystem.root.getDirectory(dir, {create:true}, 
				function(fileEntry){ }, 
				function(){  errorcallback("创建目录失败");});
			//创建version文件
			fileSystem.root.getFile(versionfilepath, null, 
				function(fileEntry){
					checkPdfVersion(fileinfo, _url, _localFile, callback, errorcallback, pageview);
				},
			 	function() {
			 		createPdfVersionFile(fileinfo, _url, _localFile, callback, errorcallback, pageview);
			 	}
			);
			
			}, function(evt){
			errorcallback("加载文件系统出现错误");
		}); 
    };
    
    return getFile;

});