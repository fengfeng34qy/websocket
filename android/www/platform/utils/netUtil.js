/**
 * author 邱登峰
 * date 2017/10/18
 * 网络通讯模块
 */
define(['jquery', 'crypto-js', 'commUtil'], 
    function($, CryptoJS, commUtil){

    //对页面锁屏次数进行计数
    var counter = 0;

    //定义网络通讯工具类
    var netUtil = {

        /**
         * 测试方法
         */
        testFunc: function(){
            console.log(aesUtil.encryptFunc("123"));
            console.log(aesUtil.decryptFunc(aesUtil.encryptFunc("123")));
        },

        /**
         * ajax post请求，没有loading标志
         * 
         * jsonObj 要发送的数据
         * successFunc 成功回调
         * failureFunc 失败回调
         * errorFunc 连接失败回调
         */
        postWithoutLoading: function(jsonObj, successFunc, errorFunc){
            
            if(typeof(jsonObj) != 'object' || typeof(jsonObj) == null){
                return false;
            }

            if(successFunc == undefined || typeof(successFunc) != 'function'){
                return false;
            }

            var url = app.cfg.server + '/qmServer_receiveJson2';

            console.log("netUtil url=" + url);
            console.log("netUtil data=" + JSON.stringify(jsonObj));

            var dataStr = aesUtil.encryptFunc(encodeURI(JSON.stringify(jsonObj)));
            dataStr = "msg=" + dataStr;
    
            $.ajax({
                url: url,
                data: dataStr,
                type: 'post',
                crossDomain: true,
                dataType: 'json',
                timeout: app.cfg.ajaxTimeout,
                success: function(resp){

                    var response = {};
                    var msg = "";
                    
                    //如果返回的是字符串
                    if(typeof(resp) == 'string'){
                        try{
                            response = JSON.parse(resp);
                        }catch(e){
                            //app.trigger('warn', "通讯报文格式异常!");

                            commUtil.alert("通讯报文格式异常!");

                            return;
                        }
                    }//如果是对象
                    else if(typeof(resp) == 'object' && typeof(resp) != null){

                        //报文解密
                        if(resp.msg != undefined && resp.msg != ""){
                            response = JSON.parse(aesUtil.decryptFunc(resp.msg));
                        }
                        else{
                            response = resp;
                        }
                    }
                    else {
                        //app.trigger('warn', "通讯报文格式异常!");

                        commUtil.alert("通讯报文格式异常!");

                        return;
                    }

                    console.log("netUtil response=" + JSON.stringify(response));

                    response.H_ret_status = response.H_ret_status || "F";
                    response.H_ret_code = response.H_ret_code || "999999";
                    msg = response.H_ret_desc = response.H_ret_desc || response.error || response.message || "";
                    //fixme: 跳转信息不应该卸载这里
                    if (response.H_ret_code != '000000'){
                        if(response.message == 'logonUserNull') {
                            //针对转账页面，意外退出清理缓存
                            app.trigger("tradeClearPage");
                            window.location.hash = '#toReturnLoginDialog'; 
                            
                            return;
                        }
                        else if(response.H_ret_code == 'Failure'){
                            window.location.hash = "#login";
                        }
                        else {
                            if(msg) {
                                //app.trigger('warn', msg);
                            }
                            else {
                                console.warn("通讯发生错误，并且无错误信息返回。");
                            }   
                        }
                    }

                    successFunc(response);
                },
                error: function(resp){
                    //app.trigger('warn', "通讯报文格式异常!");
                    
                    if(errorFunc == undefined || typeof(errorFunc) != 'function'){
                        errorFunc = function(){};
                    }

                    commUtil.alert("当前网络异常，请重试。", errorFunc(resp));

                    return;
                }
            });
        },

        /**
         * ajax post请求，有loading标志
         * 
         * jsonObj 要发送的数据
         * successFunc 成功回调
         * failureFunc 失败回调
         * errorFunc 连接失败回调
         */
        post: function(jsonObj, successFunc, errorFunc){

            //显示loading符号
            this.showLoading();
            
            this.postWithoutLoading(jsonObj, successFunc, errorFunc);

            //关闭loading符号
            this.hideLoading();
        },

        /**
         * 显示loading符号
         */
        showLoading: function(){

            if(counter == 0){
                $.mobile.loading('show', {
                    text: '加载中',
                    textVisible: true,
                    theme: 'b',
                    html: ""}
                );

                //console.log('loading show');
            }

            counter ++;            
        },

        /**
         * 隐藏loading符号
         */
        hideLoading: function(){

            counter --;

            if(counter == 0){

                $.mobile.loading('hide');

                //console.log('loading hide');
            }
            
            if(counter < 0){
                counter = 0;
            }
        },
        /**
         * 加密
         */
        encrypt: function(dataStr){
            return aesUtil.encryptFunc(dataStr);
        },
        /**
         * 解密
         */
        decrypt: function(dataStr){
            return aesUtil.decryptFunc(dataStr);
        }
    }

    //定义aes工具类
    var aesUtil = {
        
        //aes password
        key: CryptoJS.enc.Latin1.parse("25t78vtkde4ew6y9"),
        //aes 偏移量
        iv: CryptoJS.enc.Latin1.parse("gi215c6c8h3pwgg8"),

        /**
         * aes加密函数
         * 
         * dataStr为字符串
         */
        encryptFunc: function(dataStr){

            //console.log(dataStr);

            var key = this.key;
            var iv = this.iv;

            var encrypted = CryptoJS.AES.encrypt(
                dataStr,
                key,
                {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding}
            );

            var encryptedStr = encrypted.toString().replace(/\+/g, "%2B");

            //console.log(encryptedStr);
            
            return encryptedStr;
        },

        /**
         * aes解密函数
         */
        decryptFunc: function(dataStr){

            var key = this.key;
            var iv = this.iv;

            var decrypted = CryptoJS.AES.decrypt(
                dataStr,
                key,
                {iv:iv,padding:CryptoJS.pad.ZeroPadding}
            );

            var decStr = decrypted.toString(CryptoJS.enc.Utf8);
    
            return decStr;
        }

    }

    return netUtil;
});