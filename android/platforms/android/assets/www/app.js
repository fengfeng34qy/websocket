define(['jquery', 'underscore', 'router','backbone'],
    function($, _, Router, Backbone) {
        var App = Backbone.View.extend({

            events: {
                "routed":"路由完成",	//构建页面并dom中生成页面完成
                "warn":"发生警告",
                "ready":"视图加载完成"	//页面完成数据加载后需要触发该事件，router调用相应渲染方法，该方法应该在集合加载数据完成后触发
            },

            initialize: function() {
                console.log('app init');
                this.on('warn', this.warn);
                this.on('notes', this.notes);
                // try{
                    this.router = new Router();
                    Backbone.history.start();
                // }catch(e){
                    // window.catchError('app error: ' + e);
                // }
                
                this.cfg={
                    "server": "http://www.sunfengfeng.com/"
                };

            },

            warn: function(){
                alert('warn');
            },

            notes: function(){
                alert('notes');
            }

        });

        return App;
    });
