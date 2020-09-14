define(['jquery', 'underscore', 'backbone', 'text!./page.html', 'mfp', 'sessioninfo', 'zTool','chatLib', 'socket', 'text!./msgTemplate.html','smartWizard', 'jqm'],
    function ($, _, Backbone, pageTemplate, mfp, sessioninfo, zTool, chatLib, io, msgTemplate, smartWizard, jqm) {

        var that;
        var userInfo = sessioninfo.userInfo;
        var pageView;

        var EVENT_TYPE = chatLib.EVENT_TYPE;

        var socket = null;
        var onlineUserMap = new zTool.SimpleMap();
        var currentUser = null;
        var currentUserNick = null;
        var face = null;
        /*全局变量*/
        var socket;

        var StartPageView = Backbone.View.extend({

            template : _.template(pageTemplate),
            events : {
                'click #btn_submit' : 'loginSubmit',
                'click #backTowButton' : 'backTowButton',
                'click #sendBtn': 'sendMsgEvent',
                'click #logout': 'logout'
            },
            initialize : function (e) {
                pageView = this;
                this.on('routed', this.updateView);
                // 初始化数据
                pageView.initData();

                //禁用BACK键
                document.addEventListener("backbutton", this.onBackKeyDown, false);
                app.router.trigger("ready", this);
            },

            updateView: function(){

                if(!app.cfg.currentUserNick){
                    window.location.href = '/';
                    return;
                }
                
                pageView.$('#wizard').smartWizard({
                    noClick: true,
                    transitionEffect: 'fade',
                    onFinish: onFinishCallback,
                    onReturnStep: onReturnCallback,
                    onNextStep: onNextCallback,
                    onShowStep: onShowStepCallback,
                    onPreviousStep: onPreviousCallback
                });
                function onFinishCallback(){
                    return true;
                }
                function onReturnCallback(){
                    console.log('cancel');
                }
                function onPreviousCallback(stepObj){
                    var step_num = stepObj.attr('rel');
                    switch(step_num){
                        case '1':
                            return true;
                        case '2':
                            return true;
                    }
                }
                function onNextCallback(stepObj){
                    var step_num = stepObj.attr('rel');
                    switch(step_num){
                        case '1':
                            return true;
                        case '2':
                            return true;
                    }
                }
                function onShowStepCallback(stepObj){
                    var step_num = stepObj.attr('rel');
                    switch(step_num){
                        case '1':
                            pageView.$('#face').attr('src', 'page/startPage2/imgs/face/'+app.cfg.userInfo.face+'.png');
                            break;
                        case '2':
                            break
                    }
                }

                pageView.readConfigInfo();
            },

            onBackKeyDown: function(){
                if(location.hash == '#startPage' || location.hash == '' || true){
                    navigator.notification.confirm("是否退出程序?",  
                        function(buttonIndex){
                            console.log('buttonIndex:',buttonIndex);
                            if(buttonIndex==1){
                                // pageView.logout();  
                                navigator.app.exitApp();
                            }
                        },'提示',['退出','再逛逛']
                    );
                    return false;
                }else{
                    history.go(-1);  
                }
            },

            // 初始化数据
            initData: function(){
                var pageView;

                var EVENT_TYPE = chatLib.EVENT_TYPE;

                var socket = null;
                var onlineUserMap = new zTool.SimpleMap();
                var currentUser = null;
                var currentUserNick = null;
                var face = null;
                var online_num;
            },

            readConfigInfo : function () {
                
                currentUserNick = app.cfg.currentUserNick;
                pageView.reset();
                socket = io.connect('https://www.sunfengfeng.com');
                onlineUserMap = new zTool.SimpleMap();
                
                currentUserNick = app.cfg.currentUserNick;
                face = app.cfg.face;

                socket.on('connect', function () {
                    socket.emit('message', JSON.stringify({
                        'EVENT' : EVENT_TYPE.LOGIN,
                        'values' : [currentUserNick,face],
                        'face': face
                    }));
                });

                // 监听message
                socket.on('message', function(message){
                    var mData = chatLib.analyzeMessageData(message);

                    if (mData && mData.EVENT) {
                        switch (mData.EVENT) {
                            case EVENT_TYPE.LOGIN: // 新用户连接
                                var user = mData.values[0];
                                //获得所有在线用户
                                var users = mData.users;
                                if (users && users.length) {
                                    online_num = users.length;
                                    for ( var i=0;i<online_num;i++) {
                                        onlineUserMap.put(users[i].uid, users[i]);
                                        if (mData.user.uid == users[i].uid) {
                                            currentUser = users[i];
                                            app.cfg.currentUser = currentUser;
                                        }
                                    }
                                }
                                // 在线人数
                                var onlineCounts = mData.onLineCounts;
                                pageView.updateOnlineUser(onlineCounts);
                                break;

                            case EVENT_TYPE.LOGOUT:         // 用户退出
                                console.log('有用户退出了');
                                console.log(mData);
                                var user2 = mData.values[0];
                                onlineUserMap.remove(user2.uid);
                                var onlineCounts = mData.onLineCounts;
                                pageView.updateOnlineUser(onlineCounts);
                                pageView.addUserExit(user2);
                                break;

                            case EVENT_TYPE.SPEAK:          // 用户发言
                                var oUser = {};
                                oUser.content = mData.values[0];
                                oUser.face = mData.values[1];
                                oUser.nick = mData.values[2];

                                // 不是当前用户
                                if(oUser.nick !== app.cfg.currentUserNick){
                                    pageView.msg_tip_play();
                                }
                                
                                pageView.appendMessage(oUser);

                                pageView.scrollBottom(); // 滚动部底

                                break;

                            case EVENT_TYPE.ERROR: // 出错了
                                appendMessage("[系统繁忙...]");
                                break;

                            default:
                                break;
                        }

                    }
                });

                socket.on("close",function(){
                    // appendMessage("[网络连接已被关闭...]");
                    pageView.close();
                });
            },

            close: function(){
                if (socket) {
                    socket.close();
                }
                socket = null;
            },

            // 在线人数
            updateOnlineUser: function(n){
                // var size = onlineUserMap.size();
                $("#onlineNum").html(n);
            },

            // 发送消息
            sendMsgEvent: function(){
                var value = $.trim($("#msgText").val());
                    if (value) {
                        $("#msgText").val('');
                        var data = JSON.stringify({
                            'EVENT' : EVENT_TYPE.SPEAK,
                            'values' : [value,face,currentUserNick]
                        });
                        socket.emit('message',data);
                    }
            },

            // 用户退出
            logout: function(){
                // var data = JSON.stringify({
                //     'EVENT' : EVENT_TYPE.LOGOUT,
                //     'values' : [currentUser]
                // });
                // socket.emit('message',data);
            },

            // 插入消息
            appendMessage: function(user){
                var compiled = _.template(msgTemplate);
                $("#msgWrap").append( compiled(user) );
            },

            // 插入用户退出提示
            addUserExit: function(username){
                $("#msgWrap").append('<div class="everyLine exit">'+'用户' + '<span>'+ username + '</span>' + '退出了房间' + '</div>');
            },

            // 获取消息时间
            formatUserTalkString: function(user){
                return pageView.formatUserString(user);
            },

            // 重置
            reset: function(){
                if (socket) {
                    socket.close();
                }
                onlineUserMap = null;
                currentUser = null;
            },

            formatUserString: function(user){
                if (!user) {
                    return '';
                }
                return '<h3 style="display:inline-block">'+user.nick+'</h3>';
            },

            // 滚动底部
            scrollBottom: function(){
                var msgWrap = document.getElementById('msgWrap');
                var mainbody = document.getElementById('mainbody');

                var msgWrapHeight = msgWrap.clientHeight;
                var mainbodyHeight = mainbody.clientHeight;
                var scrollHeight = msgWrapHeight - mainbodyHeight;
                $('#mainbody').animate({scrollTop: scrollHeight}, 300);
            },

            // qq提示音
            msg_tip_play: function(){
                var audis = document.getElementById('msg_tip');
                audis.play();
            },

            render : function () {
                this.setElement($(this.template()));
                return this;
            }

        });// QueueView

        return StartPageView;

    });//function+define