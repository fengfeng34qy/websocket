/**
 * @fileOverview Trias: Agree Mobile Front Platform Verion 1
 * @author da.lng@cfischina.com
 * @version 1.0
 */

define(['jquery', 'backbone', 'underscore', 'crypto-js'],
    function ($, Backbone, _, CryptoJS) {
        /**
         * 禁用JQM的hash机制
         */
        $(document).bind("mobileinit", function () {
            console.log('jquery-mobile 初始化完成');
            $.mobile.ajaxEnabled = true;
            $.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            //载入页面自动修改base标签影响全局路径相关操作，如<a>等
            $.mobile.dynamicBaseEnabled = true;
            $.mobile.defaultPageTransition = 'slide';

            // angularjs
            if (typeof angular != 'undefined') {
                $(document).on("pagebeforeshow", function (event, ui) {
                    var $page = $(event.target),
                        dataJs = $page.data("js") && $page.data("js").split(","),
                        rqJs = [],
                        ngApp = $page.attr("ng-app");

                    var ngBootStrap = function () {
                        if (!ngApp || $page.injector()) return;
                        angular.bootstrap($page, [ngApp]);
                        //点击标识当前进入哪个页面
                        app.currentPage = $page.attr("id");
                        app.trigger("menuClassToggle", app.currentPage);
                    };
                    if (dataJs) {
                        for (var i in dataJs) {
                            dataJs[i] = dataJs[i].replace(/(^\s*)|(\s*$)/g, "");
                            if (dataJs[i] == "") continue;
                            rqJs.push(dataJs[i]);
                        }
                        // 确保脚本加载完成
                        require(rqJs, function () {
                            ngBootStrap();
                        });
                    }
                    else {
                        ngBootStrap();
                    }
                });
            };

            // 支持多个pagecontainer
            function findClosestLink(ele) {
                while (ele) {
                    if ((typeof ele.nodeName === "string") && ele.nodeName.toLowerCase() === "a") {
                        break;
                    }
                    ele = ele.parentNode;
                }
                return ele;
            }
            // todo: dialog的close按钮，可以正常回退，但是hash不会变化导致router没有将frame-full后移。
            // 重载back不成功
            /*
            $.mobile.pagecontainer._proto.back = function() {
                Backbone.history.history.back();
                event.preventDefault();
            };
            */
            // 激活当前显示页面pagecontainer
            $(document).on("click", function (event) {
                if (event.isDefaultPrevented()) return;

                var link = findClosestLink(event.target),
                    $link,
                    $pc, targetPC;
                if (link == null) {
                    $link = $(event.target);
                }
                else {
                    $link = $(link);
                }
                // 曾强JQM，切换多pagecontainer
                targetPC = $link.data("pagecontainer");
                if (targetPC) {
                    $pc = $("#" + targetPC);
                }
                else {
                    $pc = $link.closest(":mobile-pagecontainer");
                }
                $.mobile.pageContainer = $pc.pagecontainer();

                // fixme: 兼容原有hash方式的切换页面，不推荐使用，后续使用url方式
                var url = $link.attr("href"),
                    id = $link.attr("id");
                if ($link.data("rel") == "back") {
                    Backbone.history.history.back();
                    event.preventDefault();
                }
                else if ($link.data("rel") == "popup" && url) {
                    $pc.find(url).popup("open");
                    event.preventDefault();
                }
                else if (url) {
                    if (url == "#") {
                        // jqm slider href="#"
                        event.preventDefault();
                    }
                    else if (url[0] == "#" && $(url).length > 0) {
                        $.mobile.base.reset();
                        window.location.hash = url;
                    }
                    else {
                        window.location.hash = url;
                        $.mobile.pageContainer.pagecontainer("change", url);
                        event.preventDefault();
                    }
                }

            });
        });

        function Mfp() { };
        /**
         * 平台框架使用Backbone
         */
        Mfp.prototype = Backbone;
        var mfp = new Mfp();

        /* 封装通讯入口 */
        /**
         * 封装产品通讯
         * 为后续定义公共行为留接口
         * @param {object} options 通讯参数，$.ajax相同
         * @return {null} 无
         */

        mfp.ajax = Backbone.ajax = function (options) {
            /*NOTE:重写ajax，以实现自动显示loading */
            // $.mobile.loading('show');
            console.log("mfp.ajax url=" + options.url);
            console.log("mfp.ajax data=" + options.data);

            if (!/\?/g.test(options.url)) {
                options.type = 'post';
                options.dataType = 'json';
                delete options.jsonp;
            }
            

            //报文加密
            if (options.data != undefined && options.data != "" && options.type.toLowerCase() == "post") {
                // options.data = encDataByAES(options.data);
                options.data = options.data;
            }

            var cmp = options.complete;
            options.complete = function () {
                // $.mobile.loading('hide');
                if (cmp != undefined) {
                    cmp();
                }
            };
            var succ = options.success,
                err = options.error;
            options.success = function (resp) {

                // console.log("mfp.ajax response=" + JSON.stringify(resp));

                var response = {}, msg = "";
                if (typeof resp == 'string') {

                    try {
                        response = JSON.parse(resp);
                    } catch (e) {
                        app.trigger('warn', "通讯报文格式异常!");
                        err && err(resp);
                        return;
                    }
                }
                else if (typeof resp == 'object' && resp != null) {

                    //报文解密
                    if (resp.msg != undefined && resp.msg != "") {
                        response = decDataByAES(resp.msg);
                    }
                    else {
                        response = resp;
                    }

                    console.log("mfp.ajax response=" + JSON.stringify(response));
                }
                else {
                    app.trigger('warn', "通讯报文格式异常!");
                    err && err(resp);
                    return;
                }
                response.H_ret_status = response.H_ret_status || "F";
                response.H_ret_code = response.H_ret_code || "999999";
                msg = response.H_ret_desc = response.H_ret_desc || response.error || response.message || "";
                //fixme: 跳转信息不应该卸载这里
                if (response.H_ret_code != '000000') {
                    if (response.message == 'logonUserNull') {
                        app.trigger("tradeClearPage");
                        window.location.hash = '#toReturnLoginDialog'; return;
                    }
                    else if (response.H_ret_code == 'Failure') {
                        window.location.hash = "#login";
                    }
                    else {
                        if (msg) {
                            //app.trigger('warn', msg);
                        }
                        else console.warn("通讯发生错误，并且无错误信息返回。");
                    }
                }
                // 通讯成功就调用成功回到，由应用判断成功失败
                succ && succ(response);
            }

            //因为要修改个别aJax请求的超时参数, 采用forceTimeout参数, 原先的调用方式和行为不变

            // options.timeout = 60000;
            if (options.forceTimeout) {
                options.timeout = parseInt(options.forceTimeout);
                delete options.forceTimeout;
            } else {
                options.timeout = 60000;
            }
            Backbone.$.ajax(options);
        };
        //无loading界面的平台ajax，可以自由控制loading
        mfp.ajaxNoLoading = function (options) {
            /* 重写ajax，以实现自动显示loading */
            //$.mobile.loading('show');
            console.log("mfp.ajax url=" + options.url);
            console.log("mfp.ajax data=" + options.data);

            if (!/\?/g.test(options.url)) {
                options.type = 'post';
                options.dataType = 'json';
                delete options.jsonp;
            }
            
            //AES加密数据
            if (options.data != undefined && options.data != "" && options.type.toLowerCase() == "post") {
                options.data = encDataByAES(options.data);
            }

            var cmp = options.complete;
            options.complete = function () {
                //$.mobile.loading('hide');
                if (cmp != undefined) {
                    cmp();
                }
            }
            var succ = options.success,
                err = options.error;
            options.success = function (resp) {
                // console.log("mfp.ajax response=" + JSON.stringify(resp));
                var response = {}, msg = "";
                if (typeof resp == 'string') {
                    try {
                        response = JSON.parse(resp);
                    } catch (e) {
                        app.trigger('warn', "通讯报文格式异常!");
                        err && err(resp);
                        return;
                    }
                }
                else if (typeof resp == 'object' && resp != null) {

                    //报文解密
                    if (resp.msg != undefined && resp.msg != "") {
                        response = decDataByAES(resp.msg);
                    }
                    else {
                        response = resp;
                    }
                }
                else {
                    app.trigger('warn', "通讯报文格式异常!");
                    err && err(resp);
                    return;
                }
                console.log("mfp.ajax response=" + JSON.stringify(response));
                response.H_ret_status = response.H_ret_status || "F";
                response.H_ret_code = response.H_ret_code || "999999";
                msg = response.H_ret_desc = response.H_ret_desc || response.error || response.message || "";
                //fixme: 跳转信息不应该卸载这里
                if (response.H_ret_code != '000000') {
                    if (response.message == 'logonUserNull') {
                        //针对转账页面，意外退出清理缓存
                        app.trigger("tradeClearPage");
                        window.location.hash = '#toReturnLoginDialog'; return;
                    }
                    else if (response.H_ret_code == 'Failure') {
                        window.location.hash = "#login";
                    }
                    else {
                        if (msg) {
                            //app.trigger('warn', msg);
                        }
                        else console.warn("通讯发生错误，并且无错误信息返回。");
                    }
                }
                // 通讯成功就调用成功回到，由应用判断成功失败
                succ && succ(response);
            }
            options.timeout = 60000;
            Backbone.$.ajax(options);
        };

        /**
         * 保留前面msg=前缀
         * @param {*} data 
         */
        function encDataByAES(data) {
            var plaintext = JSON.stringify(data);
            //判断是否为msg=开头
            // if (!data.indexOf('msg=')) {
                // var plaintext = data.substr(4);//去掉msg=头
                plaintext = encryptFunc(plaintext);
                //plaintext = plaintext.replace(/\+/g, "%2B");

                // return 'msg=' + plaintext;
                return plaintext;
            // }
            // else {//否则直接返回
                // return data;
            // }
        }

        /**
         * 将返回报文解密
         * @param {*} resp 
         */
        function decDataByAES(msg) {
            var respStr = decryptFunc(msg);

            //alert(respStr);

            return JSON.parse(respStr);
        }

        //aes password
        var key = CryptoJS.enc.Latin1.parse("25t78vtkde4ew6y9");
        //aes 偏移量
        var iv = CryptoJS.enc.Latin1.parse("gi215c6c8h3pwgg8");

        /**
         * AES加密
         * @param {*} data 
         */
        function encryptFunc(data) {

            //console.log('jimiqian:' + data);

            var encrypted = CryptoJS.AES.encrypt(
                data,
                key,
                { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }
            );

            encryptedStr = encrypted.toString().replace(/\+/g, "%2B");

            //console.log('jiamihou:' + encryptedStr);

            return encryptedStr;
        }

        /**
         * AES解密
         * @param {*} encrypted 
         */
        function decryptFunc(encrypted) {

            //console.log('jiemiqian:' + encrypted);

            var decrypted = CryptoJS.AES.decrypt(
                encrypted,
                key,
                { iv: iv, padding: CryptoJS.pad.ZeroPadding }
            );

            var decStr = decrypted.toString(CryptoJS.enc.Utf8);

            //console.log('jiemihou:' + decStr);

            return decStr;
        }


        require(['jqm'], function(){
            // ...
        })
        /**
         * 平台工具
         */
        function Util() { };
        Util.prototype = _;
        mfp.util = new Util();
        _.extend(mfp.util, {
            AmountLtoU: function (num) {
                ///<summery>小写金额转化大写金额</summery>
                ///<param name=num type=number>金额</param>
                if (isNaN(num)) return "无效数值！";
                var strPrefix = "";
                if (num < 0) strPrefix = "(负)";
                num = Math.abs(num);
                if (num >= 1000000000000) return "无效数值！";
                var strOutput = "";
                var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
                var strCapDgt = '零壹贰叁肆伍陆柒捌玖';
                num += "00";
                var intPos = num.indexOf('.');
                if (intPos >= 0) {
                    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
                }
                strUnit = strUnit.substr(strUnit.length - num.length);
                for (var i = 0; i < num.length; i++) {
                    strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
                }
                return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
            },

            getFillFormData: function (scope) {
                console.log("进入保存" + scope);
                if (!scope) {
                    throw new Error("Argument invalid, need [scope].");
                }
                var content = {};
                content.trade_id = app.param.interface[app.iForBusiness].trade_id;
                scope.$("[name]").each(function (index, element) {
                    if (content[element.name] == undefined) content[element.name] = "";
                    if (element.type == "radio" || element.type == "checkbox") {
                        if (element.checked) content[element.name] = encodeURIComponent(element.value);
                    }
                    else {
                        if (typeof (element.value) != "undefined") {
                            content[element.name] = encodeURIComponent(element.value.toString().replace(new RegExp('(["\"])', 'g'), "\\\""));
                        } else {
                            content[element.name] = encodeURIComponent(element.value);
                        }
                    }
                });
                console.debug(JSON.stringify(content));
                return content;

            },
            splitnum: function (str) {
                var result = '';
                str = str + '';
                if (str[0] == '-') {
                    var minus = true;
                    str = str.substr(1);
                }
                var start = (str).indexOf('.');
                if (start == -1) {
                    start = str.length;
                } else {
                    result = str.substring(start, str.length + 1);

                }

                for (var split = start; split > 3; split = split - 3) {
                    result = ',' + str.substring(split - 3, split) + result;
                }
                result = str.substring(0, split) + result;
                if (minus) {
                    result = '-' + result;
                }
                return result;
            },

            getFormData: function (scope) {
                console.log("进入保存" + scope);
                if (!scope) {
                    throw new Error("Argument invalid, need [scope].");
                }
                var content = {};
                scope.$("[name]").each(function (index, element) {
                    if (!$(element).hasClass('netBankIgnore')) {
                        if (content[element.name] == undefined) content[element.name] = "";
                        if (element.type == "radio" || element.type == "checkbox") {
                            if (element.checked) content[element.name] = element.value;
                        }
                        else {
                            content[element.name] = element.value;
                        }
                    }
                });
                console.debug(JSON.stringify(content));
                return content;

            },

            //隐藏身份证
            HiddenCertification: function (cert) {
                return cert.substring(0, 4) + "** ********" + cert.substring(14);
            },
            HiddenCard: function (card) {
                if (card.length == 16) {
                    return card.substring(0, 4) + " " + card.substring(4, 6) + "** ***" + card.substring(11, 12) + " " + card.substring(12);
                } else if (card.length == 19) {
                    return card.substring(0, 4) + " " + card.substring(4, 6) + "** ***" + card.substring(11, 12) + " " + card.substring(12, 16) + " " + card.substring(16);
                }
            },
            HiddenPhoneNum: function (num) {
                return num.substring(0, 3) + "****" + num.substring(7);
            },

            //校验姓名
            CheckName: function (nameId, errorId) {
                var str = $("#" + nameId).val();
                var errors = $("#" + errorId);
                var Name = /^[\u4e00-\u9fa5]+$/
                var name = /^[a-zA-Z]+$/;
                if (str == '') {

                    errors.html("姓名不能为空");
                }
                else if (!Name.test(str)) {

                    if (!name.test(str)) {
                        errors.html("请输入中文或英文字符");
                        return false;
                    }
                    if (str == "") {
                        errors.html("姓名不能为空");
                    } else {
                        errors.html("");
                        return true;
                    }
                }
                else {
                    //$(this).addClass('pn1');
                    errors.html("");
                    return true;
                }

            },
            //校验姓名(对公开户)
            CheckName1: function (nameId, errorId) {
                var str = $("#" + nameId).val();
                var errors = $("#" + errorId);
                var regExp = /^([A-Z ]+|[\u4e00-\u9fa5·]+)$/;
                if (regExp.test(str)) {
                    errors.html('');
                    return true;
                } else {
                    errors.html('名字不符合校验规则');
                    return false;
                }

            },
            //校验开户人地址
            CheckPer_company: function (per_company, errorPer_company) {
                var str = $("#" + per_company).val();
                str = $.trim(str);
                var errors = $("#" + errorPer_company);
                if (str == '') {
                    errors.html("工作单位不能为空");
                }
                else {
                    errors.html("");
                    return true;
                }

            },
            //校验排队号
            CheckCode: function (CodeId, errorId) {
                var str = $("#" + CodeId).val();
                var errors = $("#" + errorId);
                var Code = /^[a-zA-Z0-9]+$/;
                if (str == '') {

                    errors.html("排队号不能为空");
                }
                else if (!Code.test(str)) {
                    errors.html("排队号格式错误");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },

            //校验验证码
            checkCode: function (codeId, ErrorId) {
                var str = $("#" + codeId).val();
                var errors = $("#" + ErrorId);
                var Code = /^[0-9]+$/;
                if (str == '') {

                    errors.html("验证码不能为空");
                }
                else if (!Code.test(str)) {
                    errors.html("验证码错误");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },
            //校验选择其他职业输入框是否为空
            CheckOtherProfessionInput: function (professionInput, errorProfessionInput) {
                var c = $("#" + professionInput).val();
                c = $.trim(c);
                var errors = $("#" + errorProfessionInput);
                if (c == '') {
                    errors.html("请输入您的职业");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },
            //校验选择通讯地址其他地址时是否为空
            CheckOtherAddressInput: function (otherAddress, otherAddressInputError) {
                var c = $("#" + otherAddress).val();
                var errors = $("#" + otherAddressInputError);
                if (c.replace(/[^\x00-\xFF]/g, '**').length > 64) {
                    errors.html("地址长度不能超过32个汉字");
                    return false;
                }
                c = $.trim(c);

                if (c == '') {
                    errors.html("请输入您的地址");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },

            //代办理由校验是否为空
            CheckAgent_whyInput: function (agent_why, agent_whyError) {
                var c = $("#" + agent_why).val();
                var errors = $("#" + agent_whyError);
                if (c.replace(/[^\x00-\xFF]/g, '**').length > 10) {
                    errors.html("代办理由不能超过5个汉字");
                    return false;
                }
                c = $.trim(c);

                if (c == '') {
                    errors.html("请输入您的代办理由");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },

            //校验办理人职业是否被选中
            CheckProfession: function (profession, errorProfession) {
                var c = $("#" + profession).val();
                var errors = $("#" + errorProfession);
                if (c == '#') {
                    errors.html("请选择您的职业");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },
            //校验代理人选项是否被选中

            CheckAgent: function (agent, errorId) {
                var c = $("#" + agent).val();
                var errors = $("#" + errorId);
                if (c == '') {
                    errors.html("请选择是否代理人办理");
                    return false;
                }
                else {
                    errors.html("");
                    return true;
                }

            },
            // 功能: 1)去除字符串前后所有空格
            // 2)去除字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
            Trim: function (str, is_global) {
                var result;
                result = str.replace(/(^\s+)|(\s+$)/g, "");
                if (is_global.toLowerCase() == "g") {
                    result = result.replace(/\s/g, "");
                }
                return result;
            },

            //身份证校验改造版
            checkIDCard: function (idCard, failEvent) {

                if (typeof failEvent !== "function") {
                    failEvent = function () { };
                }


                return checkIdcard(idCard);

                function checkIdcard(idcard) {

                    idcard = idcard + "";

                    if (!idcard) {
                        failEvent("证件号码不可为空");
                        return false;
                    }

                    var Errors = new Array("验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!",
                        "身份证号码校验错误!", "身份证地区非法!");
                    var area = {
                        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海",
                        32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南",
                        44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西",
                        62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
                    }

                    var idcard, Y, JYM;
                    var S, M;
                    var idcard_array = new Array();
                    idcard_array = idcard.split("");

                    //地区检验
                    if (area[parseInt(idcard.substr(0, 2))] == null) {
                        failEvent(Errors[4]);
                        return false;
                    }
                    //身份号码位数及格式检验
                    var ereg = "";
                    switch (idcard.length) {
                        case 15:
                            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 ||
                                ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 &&
                                    (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                            } else {
                                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                            }
                            if (ereg.test(idcard)) {
                                // return true;
                                //身份证不再允许15位通过
                                failEvent(Errors[1]);
                                return false;
                            } else {
                                failEvent(Errors[1]);
                                return false;
                            }
                            break;
                        //18位身份号码检测/出生日期的合法性检查
                        case 18:
                            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 &&
                                parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                                //闰年出生日期的合法性正则表达式
                                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;
                            } else {
                                //平年出生日期的合法性正则表达式
                                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;

                            }
                            if (ereg.test(idcard)) {
                                //测试出生日期的合法性计算校验位                
                                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                                    + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                                Y = S % 11;
                                M = "F";
                                JYM = "10X98765432";
                                M = JYM.substr(Y, 1);//判断校验位
                                if (M == idcard_array[17]) {
                                    return true; //检测ID的校验位
                                }
                                else {
                                    failEvent(Errors[3]);
                                    return false;
                                }
                            } else {
                                failEvent(Errors[2]);
                                return false;
                            }
                            break;
                        default:
                            failEvent(Errors[1]);
                            return false;
                            break;
                    }

                }
            },

            //工具方法
            //获得当前日期的8位数格式字符串
            getCurrentDate: function () {
                var date = new Date(),
                    Y = date.getFullYear().toString(),
                    M = (date.getMonth() + 1).toString(),
                    D = date.getDate().toString();
                if (M.length != 2) {
                    M = '0' + M;
                }
                if (D.length != 2) {
                    D = '0' + D;
                }
                return Y + M + D;
            },

            //获得当前日期的字符串(带横线分割)
            getCurrentDate1: function () {
                var date = new Date(),
                    Y = date.getFullYear().toString(),
                    M = (date.getMonth() + 1).toString(),
                    D = date.getDate().toString();
                if (M.length != 2) {
                    M = '0' + M;
                }
                if (D.length != 2) {
                    D = '0' + D;
                }
                return Y + '-' + M + '-' + D;
            },

            //获得当前事件的6位数格式字符串
            getCurrentTime: function () {
                var time = new Date(),
                    H = time.getHours().toString(),
                    M = time.getMinutes().toString(),
                    S = time.getSeconds().toString();
                if (H.length != 2) {
                    H = '0' + H;
                }
                if (M.length != 2) {
                    M = '0' + M;
                }
                if (S.length != 2) {
                    S = '0' + S;
                }
                return H + M + S;
            },

            //获得当前时间的字符串(带冒号)
            getCurrentTime1: function () {
                var time = new Date(),
                    H = time.getHours().toString(),
                    M = time.getMinutes().toString(),
                    S = time.getSeconds().toString();
                if (H.length != 2) {
                    H = '0' + H;
                }
                if (M.length != 2) {
                    M = '0' + M;
                }
                if (S.length != 2) {
                    S = '0' + S;
                }
                return H + ':' + M + ':' + S;
            },


            //四则运算
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
                return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
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
                return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
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
                return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
            }


        });
        // FIXME: 兼容以前版本，工具入口可直接使用mfp.xx访问，后续版本中将去除
        _.extend(mfp, mfp.util);


        return mfp;
    });
