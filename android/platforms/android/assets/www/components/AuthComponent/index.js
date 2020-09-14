define([
    'jquery', 
    'Vue',
    'text!components/AuthComponent/index.html',
    'commUtil',
    'netUtil',
    'boxUtil'
], function($, Vue, template, commUtil, netUtil, boxUtil) {
    'use strict';

    var pageView = null;//保存当前对应的指针

    var AuthComponent = Vue.extend({

        template: template,

        created: function(){
            pageView = this;
        },

        data: function(){
            return {
                tranTellerNo: "",
                pageCache: null,
            }
        },

        methods: {

            //打开本地授权方法
            openLocalAuth: function(pageCache){

                //console.log(JSON.stringify(pageView.pageCache));

                pageView.pageCache = pageCache;         

                //显示缓存的授权柜员
                pageView.tranTellerNo = localStorage['tranTellerNo'];

                //聚焦在柜员输入框上
                setTimeout(function(){
                    $("#tranTellerNo").focus();
                },500);
                
                $('#local-auth-popup').popup('open');
            },

            //关闭本地授权方法，
            //status    0：指纹验证失败；1：指纹验证成功；
            closeLocalAuth: function(status){

                if(status == undefined){
                    status = 0;
                }

                pageView.pageCache.localAuthSuccessFlag = false;
                
                if(status == 1){
                    pageView.pageCache.localAuthSuccessFlag = true;
                }

                $('#local-auth-popup').popup('close');

                pageView.$emit("finish-local-auth");
            },

            //点击完成按钮，进行指纹校验
            finishNo: function(){

                if(pageView.tranTellerNo == undefined || pageView.tranTellerNo.length === 0){
                    commUtil.alert("请输入柜员号");
                    return;
                }                                                   
        
                localStorage['tranTellerNo'] = pageView.tranTellerNo;//缓存授权柜员

                commUtil.alert("将启动本地授权，请将手指放置在安全盒子的指纹识别处。", function(){
                    boxUtil.readFingerprint(function(fingerprint){
                
                        //验证指纹
                        var reqObj = new Object();
                        reqObj.BranchId = app.cfg.branchNumber;
                        reqObj.trancode = "ibp.bds.p314.01";
                        reqObj.seqNo = pageView.pageCache.serNo;
                        reqObj.deviceNo = app.cfg.branchNumber;
                        reqObj.TranCode = '1210';
                        reqObj.TranTellerNo = pageView.tranTellerNo;
                        reqObj.FgrChar = fingerprint.replace(/\+/g, "%2B");
                        reqObj.FgrCmprMode = '0';
                        reqObj.seqForCheck = pageView.pageCache.serNo;

                        netUtil.post(reqObj, function(response){
                            if(response.H_ret_status == "S" && response.H_ret_code == "000000"){
                                //指纹验证成功  
                                pageView.closeLocalAuth(1);                  
                            }
                            else{
                                commUtil.alert(response.H_ret_code + "：" + response.H_ret_desc + "，请点击验证按钮重新验证指纹", function(){

                                }, "指纹校验失败");
                            }
                        });
                    })
                })               
            },

            openRemoteAuth: function(){
                $('#remote-auth-popup').popup('open');
            },

            closeRemoteAuth: function(){
                $('#remote-auth-popup').popup('close');
            },
        }
    });

    return AuthComponent;
});