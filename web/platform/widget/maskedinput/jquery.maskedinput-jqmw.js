/*! 
 * based jQuery Masked Input Plugin 1.4.0
 * this is jQuery Masked Input widget wrap
 */

/**
 * 
 * @example
 *   <input id="phoneAutoclearFalse" type="text" data-mask="(999) 999-9999" data-autoclear="false">
 *   events:
 *    completed: //输入完成时触发
 *    
 *   options(in dom data-optkey):
 *    autoclear: true,//为输入完成焦点移出时自动清除
 *    placeholder: "",//一位占位符，如_
 *    maskDefine:"",//增加校验类型，如'{"~":"[+-]"}'，注意内部要使用双引号。
 *                  //默认{9: "[0-9]", a: "[A-Za-z]", *: "[A-Za-z0-9]"}
 *    mask:"",	//校验码,如aaa-999-***
 *    
 **/

(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ,"jqm", "maskedInput"], function ( $, jqm, maskedInput ) {
			factory( $, root, doc ,maskedInput);
			return $.fn.inputmask;
		});
	} else {
		// Browser globals
		factory( root.jQuery, root, doc, $.mask);
	}
}( this, document, function ( jQuery, window, document, maskedInput ) {
	

$.widget( "mobile.maskedinput", {

	initSelector: "input[data-mask]",

	options: {
		theme: null,
		mini: null,
		enhanced: false,
		autoclear: true,
		dataName: "rawMaskFn",
		placeholder: "",
		maskDefine:"",
		mask:"",
		completed: function () {
			this.trigger("completed");
		}
	},
	// 创建wiget对象
	_create: function() {
		var o = this.options;
		
		o.definitions = $.extend({}, $.mask.definitions);
		if(o.maskDefine) {
			o.definitions = $.extend(o.definitions, o.maskDefine);
		}
		if ( !this.options.enhanced ) {
			this._enhance();
		}

		this.refresh();
	},
	// 构造dom结构
	_enhance: function() {
		var $elem = this.element;
		this.options.mask = this.options.mask + "";
		
		$elem.mask(this.options.mask, this.options);
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
