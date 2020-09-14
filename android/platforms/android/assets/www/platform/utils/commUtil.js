/**
 * author 邱登峰
 * date 2017/12/08
 * 封装了一些常用的工具方法
 */
define(['jquery'], 
function($){

    // var dialogWdith = 800;
    // var dialogHeight = 400;
    // var dialogX = 624;
    // var dailogY = 368;

    //override defaults
    // Alertify.defaults.transition = "zoom";

    var commUtil = {

        //JS浮点数四则运算
        /**
         *两数相加
            *@param {float} a 加数1
            *@param {float} b 被加数2
            *@return {float} 返回两数相加结果
            **/
        add: function (a, b) {
            var c = 0;
            var d = 0;
            var e = 1;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) { }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) { }
            return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
        },
        /**
         *两数相减
            *@param {float} a 减数1
            *@param {float} b 被减数2
            *@return {float} 返回相减结果
            **/
        sub: function (a, b) {
            var c = 0;
            var d = 0;
            var e = 1;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) { }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) { }
            return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
        },
        /**
         *两数相乘
            *@param {float} a 乘数1
            *@param {float} b 乘减数2
            *@return {float} 返回两数相乘结果
            **/
        mul: function (a, b) {
            var c = 0;
            var d = a.toString();
            var e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) { }
            try {
                c += e.split(".")[1].length;
            } catch (f) { }
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },
        /**
         *两数相除
            *@param {float} a 乘除1
            *@param {float} b 乘除数2
            *@return {float} 返回相除结果
            **/
        div: function (a, b) {
            var c = 1;
            var d = 1;
            var e = 0;
            var f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) { }
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) { }
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
        },

        /**
         * 弹出一个带ok的提示框
         * @argument title 标题
         * @argument message 内容
         * @argument onOk 点击ok按钮时的回调
         */
        alert: function(message, onOk, title){

            if(title == null || title == undefined){
                title = "温馨提示";
            }

            if(typeof onOk != 'function'){
                onOk = function(){};
            }

            if(this.isDebug()){//如果是在调试模式
                alert(message);
                onOk();
            }
            else{
                navigator.notification.alert(
                    message,
                    onOk,
                    title,
                    '好的'
                )
            }

            // Alertify.alert(title, message, onOk).setting({
            //     'label': '好的',
            //     'closable': false,
            //     'resizable': true
            // }).show().resizeTo(dialogWdith, dialogHeight).moveTo(dialogX, dailogY);

            // Alertify.alert(title, message, onOk).set('resizable', true).resizeTo(800, 250).moveTo(0, 900);

            
        },


        /**
         * 弹出一个确认提示框
         * @argument title 标题
         * @argument message 内容
         * @argument onOk 点击ok按钮时的回调
         * @argument onCancel 点击cancel的回调
         */
        confirm: function(title, message, onOk, onCancel){

            if(typeof onOk != 'function'){
                onOk = function(){};
            }

            if(typeof onCancel != 'function'){
                onCancel = function(){};
            }

            if(this.isDebug()){
                var result = confirm(message);
                if(result){
                    onOk();
                }
                else{
                    onCancel();
                }
            }
            else{
                navigator.notification.confirm(
                    message,
                    function(index){
                        if(index == 0){
                            onOk();
                        }
                        else{
                            onCancel();
                        }
                    },
                    title,
                    ['好的', '取消']

                )
            }


            // Alertify.confirm(title, message, onOk, onCancel).setting({
            //     'labels': {ok: '好的', cancel: '取消'},
            //     closable: false,
            //     'resizable': true
            // }).show().resizeTo(dialogWdith, dialogHeight).moveTo(dialogX, dailogY);
        },
        
        /**
         * 弹出一个几秒钟之后消失的通知
         * @argument message 通知的内容
         * @argument callback 回调函数
         * @argument delay 通知消失的时间（秒）
         */
        // notify: function(message, callback, delay){

        //     //默认5秒之后消失
        //     if(delay == 0 || delay == null || delay == undefined){
        //         delay = 5;
        //     }

        //     Alertify.set('notifier', 'position', 'top-center');
        //     Alertify.notify(message, 'success', delay, callback);

        // },

        /**
         * 判断当前环境是否为浏览器调试环境
         */
        isDebug: function(){

            //console.log(navigator.userAgent);

            if(navigator.userAgent.match(/(windows NT|Macintosh|Safari)/i)){
                return true;
            }
            else{
                return false;
            }
        }
    }


    return commUtil;

});