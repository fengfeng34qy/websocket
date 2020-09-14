/*! 
 * based jQuery Steps v1.1.0 - 09/04/2014
 * this is jQuery Steps jqm widget wrap
 */

/**
 * Add jquery mobile widget wrapper
 *
 * @example
 *   <div data-role="wizard"><h1></h1><div></div></div>
 *   events:
 *    wizard.bind("canceled" + eventNamespace, options.onCanceled);
 *    wizard.bind("contentLoaded" + eventNamespace, options.onContentLoaded);
 *    wizard.bind("finishing" + eventNamespace, options.onFinishing);
 *    wizard.bind("finished" + eventNamespace, options.onFinished);
 *    wizard.bind("init" + eventNamespace, options.onInit);
 *    wizard.bind("stepChanging" + eventNamespace, options.onStepChanging);
 *    wizard.bind("stepChanged" + eventNamespace, options.onStepChanged);
 *
 *   options(in dom data-optkey):
 *    actionContainerTag: "div"
 *    autoFocus: false
 *    bodyTag: "div"
 *    clearFixCssClass: "clearfix"
 *    contentContainerTag: "div"
 *    cssClass: "wizard"
 *    enableAllSteps: false
 *    enableCancelButton: false
 *    enableCancelButton: false  data-enable-cancel-button: false
 *    enableContentCache: true
 *    enableFinishButton: true
 *    enableKeyNavigation: true
 *    enablePagination: true
 *    enhanced: false
 *    forceMoveForward: false
 *    headerTag: "h1"
 *    label-cancel: "取消"
 *    label-current: "current step:"
 *    label-finish: "完成"
 *    label-loading: "Loading ..."
 *    label-next: "下一步"
 *    label-pagination: "Pagination"
 *    label-previous: "上一步"
 *    labels: Object
 *    loadingTemplate: "<span class="spinner"></span> #text#"
 *    mini: null
 *    onCanceled: function (event) { }
 *    onContentLoaded: function (event, currentIndex) { }
 *    onFinished: function (event, currentIndex) { }
 *    onFinishing: function (event, currentIndex) { return true; }
 *    onInit: function (event, currentIndex) { }
 *    onStepChanged: function (event, currentIndex, priorIndex) { }
 *    onStepChanging: function (event, currentIndex, newIndex) { return true; }
 *    preloadContent: false
 *    saveState: false
 *    showFinishButtonAlways: false
 *    startIndex: 0
 *    stepsContainerTag: "div"
 *    stepsOrientation: 0
 *    suppressPaginationOnFocus: true
 *    theme: null
 *    titleTemplate: "<span class="number">#index#.</span> #title#"
 *    transitionEffect: 0
 *    transitionEffectSpeed: 200
 **/

(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ,"jqm", "steps"], function ( $, jqm, steps ) {
			factory( $, root, doc ,steps);
			return $.mobile.wizard;
		});
	} else {
		// Browser globals
		factory( root.jQuery, root, doc, root.jQuery.fn.steps);
	}
}( this, document, function ( jQuery, window, document, steps ) {
	

$.widget( "mobile.wizard", {

	initSelector: "div[data-role='wizard']",

	options: $.extend(steps.defaults,{
		theme: null,
		mini: null,
		enhanced: false,
		enableCancelButton: true,
		"labelCancel": "取消",
		"labelCurrent": "current step:",
		"labelFinish": "完成",
		"labelLoading": "正在加载 ...",
		"labelNext": "下一步",
		"labelPagination": "Pagination",
		"labelPrevious": "上一步",
	}),
	// 创建wiget对象
	_create: function() {
		var wiz = this.element,
			o = this.options,
			k;
		// set to labels[opt]
		for (k in o) {
			if (k.match("^label") && k != "labels") {
				o.labels[k.substr(5).toLowerCase()] = o[k];
			}
		}
		if ( !this.options.enhanced ) {
			this._enhance();
		}

		this.refresh();
	},
	// 构造dom结构
	_enhance: function() {
		this.element.steps(this.options);
		this._setOptions( this.options );
	},
	// 更新控件状态
	refresh: function() {

	},
	// 根据设置更新class
	_setOptions: function( options ) {
		this._super( options );
	},
	// 获取控件
	widget: function() {
		return this.element;
	}

});

}));
