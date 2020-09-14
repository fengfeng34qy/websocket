/**
 * author 邱登峰
 * date 2017/12/08
 * 封装了安全盒子的方法
 */
define(['commUtil'], 
function(commUtil){

//错误代码	描述
//0000	调用成功
//0001	蓝牙通讯超时
//0002	设备忙
//0003	设备未联接
//0004	通讯错误
//0005	数据解析错误

    var boxUtil = {

        /**
         * 初始化安全盒子方法
         * @argument successCallback 成功回调
         * @argument failureCallback 失败回调
         */
        init: function(successCallback, failureCallback){

            //盒子初始化
            AMate.init(1000, function(resp){
                if(resp.rspcode == 0){

                    AMate.selfCheck(function(){

                        //执行成功回调方法
                        if(typeof successCallback === "function"){
                            successCallback();
                        }

                    }, function(resp){
                        if(resp.rspcode == "0003"){
                            commUtil.alert(resp.rspcode + ": " + "盒子蓝牙未连接,请连接后重试。")
                            if(typeof failureCallback === "function"){
                                failureCallback();
                            }
                        }
                        else{
                            //外设存在问题，此时进行的操作是提示并退出
                            //在自检接口完善后再继续开发
                            commUtil.alert(resp.rspcode + ": " + "盒子自检异常,请到柜面进行该交易。")
                            if(typeof failureCallback === "function"){
                                failureCallback();
                            }
                        }
                    });
                }
                else{
                    commUtil.alert(resp.rspcode + ": " + "盒子初始化异常,请到柜面进行该交易。");
                    if(typeof failureCallback === "function"){
                        failureCallback();
                    }
                }
            }, function(){
                commUtil.alert("外设初始化异常。");
                if(typeof failureCallback === "function"){
                    failureCallback();
                }
            })
        },

        /**
         * 读取身份证
         * @argument successCallback 成功回调
         * @argument failureCallback 失败回调
         */
        readIDCard: function(successCallback, failureCallback){

        },

        /**
         * 读取IC卡
         * @argument successCallback 成功回调
         * @argument failureCallback 失败回调
         */
        readICCard: function(successCallback, failureCallback){

        },

        /**
         * 读取磁条卡
         * @argument successCallback 成功回调
         * @argument failureCallback 失败回调
         */
        readCitiaoCard: function(successCallback, failureCallback){

        },

        /**
         * 读取指纹
         * @argument successCallback 成功回调
         * @argument failureCallback 失败回调
         */
        readFingerprint: function(successCallback, failureCallback){
            AMate.Fingerprint.getFeature(function(resp){

                //执行成功回调方法
                if(typeof successCallback === "function"){
                    successCallback(resp.fingerprint);
                }

            }, function(){

                if(typeof failureCallback === "function"){
                    failureCallback();
                }
                
            })
        },

        /**
         * 安全盒子销毁方法
         */
        destroy: function(){
            AMate.destroy(function(){}, function(){});
        },

        /**
         * 安全盒子取消操作方法
         */
        cancel: function(){
            AMate.cancel(function(){},function(){});
        }
    }

    return boxUtil;

})