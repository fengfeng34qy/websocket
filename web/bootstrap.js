(function () {
    var root = this;
    require.config({
        //注册的库从加载页面目录算起，相对路径从当前页面baseurl算起
        baseUrl: document.URL.substring(0, document.URL.lastIndexOf("/") + 1),
        shim: {
            'jquery': {
                exports: '$'
            },
            'underscore': {
                exports: '_'
            },
            "angular": {
                exports: "angular"
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'backbone.iobind': {
                deps: ['underscore', 'jquery', 'backbone'],
                exports: 'Backbone'
            },
            'backbone.iosync': {
                deps: ['underscore', 'jquery', 'backbone'],
                exports: 'Backbone'
            },
            'socketio': {
                exports: 'io'
            },
            'crypt': {
                exports: 'crypt'
            },
            'smartWizard': {
                deps: ['jquery'],
                exports: '$'
            },
            'maskedInput': {
                deps: ['jquery'],
                exports: '$.mask'
            },
            'jqueryUI': {
                deps: ['jquery'],
            },
            'keyboard': {
                deps: ['jquery'],
            },
            'kbscramble': {
                deps: ['keyboard'],
            },
            'flot': {
                exports: '$.flot'
            },
            'flot.pie': {
                deps: ['jquery', 'flot'],
                exports: '$.flot'
            },
            'flot.stack': {
                deps: ['jquery', 'flot'],
                exports: '$.flot'
            },
            'threshold': {
                deps: ['jquery', 'flot'],
                exports: '$.flot'
            },
            'barframe': {
                deps: ['jquery', 'flot'],
                exports: '$.flot'
            },
            'pdfjs': {
                exports: 'PDFJS'
            },
            'iscroll': {
                exports: 'iScroll'
            },
            'pdfjsworker': {
                exports: 'Pdfjsworker'
            },
            'steps': {
                exports: '$.fn.steps'
            },
            'zTool':{
                exports: 'zTool'
            },
            'chatLib': {
                exports: 'chatLib'
            },
            'socket':{
                exports: 'socket'
            }

        },
        paths: {
            // area: 'platform/lib/area',
            // jquery: 'libs/jquery',
            // jqm: 'libs/jquery.mobile-1.4.5',
            // underscore: 'libs/underscore/underscore',
            router: 'libs/router',
            // FastClick: 'libs/fastclick.js',
            // app: 'js/app',
            // 'crypto-js': 'libs/crypto-js',              // 加密控件
            // md5: 'libs/md5',
            // fileop: 'libs/fileop',
            // maskedinput: 'libs/maskedinput/jquery.maskedinput-jqmw',
            // smartWizard: 'libs/jquery.smartWizard-2.0',
            // steps: 'libs/wizard/jquery.steps',
            // wizard: 'libs/wizard/jquery.steps-jqmw',
            zTool: 'libs/zTool',
            chatLib: 'libs/chatLib',
            socket: 'libs/socket.io',

            // area: 'platform/lib/area',
            jquery: 'platform/lib/jquery',
            jqm: 'platform/lib/jquery.mobile-1.4.5',
            underscore: 'platform/lib/underscore',
            // angular: 'platform/lib/angular',
            backbone: 'platform/lib/backbone',
            // socketio: 'platform/lib/socket.io',
            // 'backbone.iobind': 'platform/lib/backbone.iobind',
            // 'backbone.iosync': 'platform/lib/backbone.iosync',
            text: 'platform/lib/text',
            // crypt: 'platform/lib/crypt',
            app: 'app',
            // router: 'platform/router',
            mfp: 'platform/index',
            smartWizard: 'platform/lib/jquery.smartWizard-2.0',
            // address: 'platform/lib/Address',
            messageHandler: './messageHandler',
            // collectionRegister: 'platform/lib/collectionRegister',
            // flot: 'platform/lib/jquery.flot',
            'flot.pie': 'platform/lib/jquery.flot.pie',
            // idcardvalidator: 'platform/lib/idcard-validator',
            // dateformat: 'platform/lib/dateformat',
            // fileget: 'platform/lib/fileget',
            // imatedev: 'platform/lib/imatedev',
            // pdfjs: 'platform/lib/pdf',
            // pdfjsworker: 'platform/lib/pdf.worker',
            // fileop: 'platform/lib/fileop',
            // md5: 'platform/lib/md5',
            // 'flot.stack': 'platform/lib/jquery.flot.stack',
            // iscroll: 'platform/lib/iscroll',
            // keyboard: 'platform/lib/jquery.keyboard',
            // kbscramble: 'platform/lib/jquery.keyboard.extension-scramble',
            // maskedInput: 'platform/widget/maskedinput/jquery.inputmask-3.1.62',
            // maskedInput:'platform/widget/maskedinput/jquery.inputmask-3.3.7',
            // maskedinput: 'platform/widget/maskedinput/jquery.maskedinput-jqmw',
            // threshold: 'platform/lib/jquery.flot.threshold',
            // barframe: 'platform/lib/jquery.flot.barframe',
            // 导航控件
            // steps: 'platform/widget/wizard/jquery.steps',
            // wizard: 'platform/widget/wizard/jquery.steps-jqmw',
            //电子签名
            // esign: 'platform/lib/esign',
            // wave: 'platform/lib/waves',
            // echarts: 'platform/lib/echarts.common.min',
            // base64: 'platform/lib/Base64',
            //加密控件
            'crypto-js': 'platform/lib/crypto-js/crypto-js',
            //网络通讯组件
            // 'netUtil': 'platform/utils/netUtil',
            // 'FastClick': 'platform/lib/fastclick.js',

            //组件化依赖
            // 'AuthComponent': 'components/AuthComponent/index',
            // 'commUtil': 'platform/utils/commUtil',
            // 'boxUtil': 'platform/utils/boxUtil',
            'Vue': 'platform/lib/vue'
        }

    });
        
    document.addEventListener("deviceready", onDeviceReady, false);
    //预加载库启动平台和应用
    function onDeviceReady(){
        require(['app'], function(App){
            root.app = new App();
        });
    }

    // PC调试页面时直接进入
    if(navigator.userAgent.match(/(windows NT|Macintosh|Android)/i)){
        onDeviceReady();
    }



}).call(this);


