define(['jquery', 'underscore', 'backbone', 'text!./page.html', 'mfp', 'sessioninfo', 'text!../../defaultcfg.json','zTool'],
    function ($, _, Backbone, pageTemplate, mfp, sessioninfo, defaultcfg, zTool) {
        var pageView;
        var userInfo = sessioninfo.userInfo;

        var StartPageView = Backbone.View.extend({

            template : _.template(pageTemplate),
            events : {
                'click #btn_submit' : 'loginSubmit',
                'click #backTowButton' : 'backTowButton',
                'click #login': 'loginEvent'
            },
            initialize : function (e) {
                
                pageView = this;
                var cfgObj = JSON.parse(defaultcfg);
                defaultcfg = JSON.stringify(cfgObj);
                that = this;
                that.on("routed", this.display);
                value = e;
                pageView.initData();
                //禁用BACK键
                document.addEventListener("backbutton", that.onBackKeyDown, false);
                app.router.trigger("ready", this);

            },

            initData: function(){
                
            },

            onBackKeyDown: function(){

                if(location.hash == '#startPage' || location.hash == '' || true){
                    navigator.notification.confirm("是否退出程序?",  
                        function(buttonIndex){
                            console.log('buttonIndex:',buttonIndex);
                            if(buttonIndex==1){
                                navigator.app.exitApp();
                            }
                        },'提示',['退出','再逛逛']
                    );
                    return false;
                }else{
                    history.go(-1);  
                }
            },

            readConfigInfo : function () {
                if (app.cfg.username == '') {
                    $.extend(app.cfg, JSON.parse(defaultcfg));
                }
                that.getUserInfoToAjax();
            },

            //首次进入获取用户
            getUserInfoToAjax : function () {
                
                mfp.ajax({
                    url: app.cfg.server + 'user/getUser',
                    data: {},
                    type: 'post',
                    crossDomain: true,
                    dataType: 'json',
                    forceTimeout: 50000,
                    sucess: function(response){
                        console.log(response);
                    },
                    error: function(error){
                        console.log(error);
                    }
                })

            },
            display : function (render, e) {
                $('#username').focus();
                that.readConfigInfo();
                        
            },

            // 登陆
            loginEvent: function(){
                var username = pageView.$('#username').val();
                var password = pageView.$('#password').val();
                if(!username){
                    alert('请输入用户名');
                    return false;
                }
                if(!password){
                    alert('请输入密码');
                    return false;
                }
                mfp.ajax({
                    url: app.cfg.server + 'user/signin',
                    data: {
                        user: {
                            name: username,
                            password: password
                        }
                    },
                    type: 'post',
                    crossDomain: true,
                    dataType: 'json',
                    forceTimeout: 50000,
                    success: function(response){
                        if(response.H_ret_status === 'S'){
                            app.cfg.userInfo = response;
                            app.cfg.currentUserNick = response.nickname;
                            app.cfg.face = response.face;
                            document.removeEventListener("backbutton", that.onBackKeyDown);
                            window.location.hash = '#startPage2';
                            // pageView.setLocalStoregeCurrentUserNick(response);
                        }
                    },
                    error: function(error){
                        console.log(error);
                    }
                })
            },

            render : function () {
                this.setElement($(this.template()));
                return this;
            }

        });

        return StartPageView;

    });//function+define