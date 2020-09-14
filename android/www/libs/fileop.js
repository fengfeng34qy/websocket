define([],
	function() {
		var config = {
			rootdir: "bankMobileClient", //
			serverUrl: app.cfg.server+'/products'
		};
		/* for browser compatible by wudlng */
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem; //文件系统请求标识 
		window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL; //根据URL取得文件的读取权限
		var fileSystem;
        var lastOp;

        getLastOp = function() {
            return lastOp;
        }

        cdLocalDir = function(cb, ecb) {
       //alert('in cdLocalDir'+LocalFileSystem.PERSISTENT);
            lastOp = 'get filesystem';
            /* for browser compatible by wudlng */
            window.requestFileSystem((typeof(LocalFileSystem) != 'undefined' && LocalFileSystem.PERSISTENT) || window.PERSISTENT, 0, function(fs) {

                fileSystem = fs;
                lastOp = 'make root directory';
                console.log(fileSystem.root.fullPath+' @ '+fileSystem.root.toURL());
                fileSystem.root.getDirectory(config.rootdir, {create:true},
                    function(fileEntry) {
                        cb(fileEntry);
                    }, ecb);
            }, ecb);
        }
       
       exist = function(filename, cb, ecb) {
       cdLocalDir(function(dirEntry) {
                  lastOp = 'open file '+filename;
                  dirEntry.getFile(filename, null,
                                   function(theFile) {
                                   cb(true,theFile.toURL());
                                   },
                                   function(ferror) {
                                   if (ferror.code == FileError.NOT_FOUND_ERR)
                                   cb(false);
                                   else ecb(ferror);
                                   });       // dir.getFile's ecb
                  }, ecb);        // cdLocalDir's ecb
       }
       
		// ecb FileError
		downloadFile = function(filename, cb, ecb) {
        //alert("download Json start1");
            cdLocalDir(function(dirEntry) {
                      //  alert("download Json start2");
                var fileTransfer = new FileTransfer();
                lastOp = 'download file '+filename;
                fileTransfer.download(
                    encodeURI(app.cfg.server+'/products/'+filename),
                    fileSystem.root.toURL()+config.rootdir+'/'+filename,
                        function(theFile) {
                            cb(theFile.toURL());
                        }, ecb,
                    false, null);
            }, ecb);
		};

        loadJson = function(filename, cb, ecb)  {
            cdLocalDir(function(dirEntry) {
                lastOp = 'open file '+filename;
                dirEntry.getFile(filename, null,
                    function(theFile) {
                        lastOp = 'read file '+filename;
                        theFile.file(
                            function(file) {
                                var reader = new FileReader();
                                reader.onloadend = function (evt) {
                                    cb(JSON.parse(evt.target.result));
                                };
                                reader.readAsText(file);
                            }, ecb);
                    }, ecb);
            }, ecb);
        };

        // exclusive and create cause an error when file exist
        saveJson = function(filename, jsonData, cb, ecb) {
            cdLocalDir(function(dirEntry) {
                lastOp = 'open file '+filename;
                dirEntry.getFile(filename, {create:true, exclusive:false},
                    function(theFile) {
                        lastOp = 'create writer for '+filename;
                        theFile.createWriter(function(writer) {
                            writer.onwriteend = function(evt) {
                                cb();
                            };
                            lastOp = 'write data into '+filename;
                            writer.write(JSON.stringify(jsonData));
                        }, ecb);
                    }, ecb);
            }, ecb);
        };

		function fileErrPrompt(code) {
			switch (code) {
			case FileError.NOT_FOUND_ERR:
				return "NOT_FOUND_ERR";
			case FileError.SECURITY_ERR:
				return "SECURITY_ERR";
			case FileError.ABORT_ERR:
				return "ABORT_ERR";
			case FileError.NOT_READABLE_ERR:
				return "NOT_READABLE_ERR";
			case FileError.ENCODING_ERR:
				return "ENCODING_ERR";
			case FileError.NO_MODIFICATION_ALLOWED_ERR:
				return "NO_MODIFICATION_ALLOWED_ERR";
			case FileError.INVALID_STATE_ERR:
				return "INVALID_STATE_ERR";
			case FileError.SYNTAX_ERR:
				return "SYNTAX_ERR";
			case FileError.INVALID_MODIFICATION_ERR:
				return "INVALID_MODIFICATION_ERR";
			case FileError.QUOTA_EXCEEDED_ERR:
				return "QUOTA_EXCEEDED_ERR";
			case FileError.TYPE_MISMATCH_ERR:
				return "TYPE_MISMATCH_ERR";
			case FileError.PATH_EXISTS_ERR:
				return "PATH_EXISTS_ERR";
			default:
			  return "Unknown Error";
			};
		};
	
		return {
			error: fileErrPrompt,
            lastop: getLastOp,
			download: downloadFile,
            existFile:exist,
            loadJson: loadJson,
            saveJson: saveJson
		};
	});