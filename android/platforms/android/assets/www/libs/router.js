
define(['jquery', 'underscore', 'backbone', 'require'],
	function($, _, Backbone, require){

		var thisRouter;
		var Router = Backbone.Router.extend({

			
		  	routes: {
		  		"": 'frameInit',					//初始进入
		    	"search/:query":        "search",  	// #search/kiwis
		    	"search/:query/p:page": "search",  	// #search/kiwis/p7
		    	":pageId/(:templateId).tmpl": "_testTemplate",
		    	":pageId/(:templateId).tmpl/*agrs": "_testTemplate",

		    	":page": "routePage",				// 默认方式
		    	":page/:action": "routePage",
		    	":page/action/*args": "routePage",
		    	"*actions": "defaultAction",
		    	"routePages": "routePages",	   		// 多页面路由
		    	"routePages/*args": "routePages",	//多页面路由带参数
		    	"(*url.html)": "jqmPage"            //默认方式
		  	},

		  	initialize: function(){
		  		console.log('router init');
		  		this.frameClassPrefix = "frame-";	//页面容器前缀
				// this.frameFullId = "frame-full";		//全屏容器ID
				this.defaultFrame = "frame-page";
				this.framePageDefaultPath = ["page", "startPage", "main", "render"];	//框架，页面默认目录，默认加载页面(目录），默认文件名，默认调用方法
				// this.frameDefaultPages = ["menu", "logo"];	//主页加载页面
				this.framePageActiveClass = "ui-page-active";	//JQM激活页面CSS类

				this.pageNum = 1;	//切换页面的数量，用于routePages
				this.lastRoutePages = [];	//最后一次路由的页面
				thisRouter = this;
				this.views = {};

		  		thisRouter.on('clearAll', this.clearAll);
		  		thisRouter.on('clearView', this.clearView);

		  		thisRouter.on('ready', function (evPageView, pageAct, actionArgs) {
		  			console.log('router ready');
					var pageAct = pageAct || this.framePageDefaultPath[3];
					if (evPageView.status == 'routed') {
					}
					else {
						evPageView[pageAct](actionArgs);
						evPageView.status = 'routed';
					}
					// 切换页面前触发route信号
					evPageView.trigger("route", pageAct, actionArgs);
					var $page = thisRouter.changePage(evPageView, pageAct);
					thisRouter.pageNum--;
					evPageView.trigger("routed", pageAct, actionArgs);
					if (thisRouter.pageNum == 0) {
						thisRouter.trigger("routed", evPageView, pageAct, actionArgs);
					}

				});
		  	},

		  	search: function(query, page) {
		    	//...
		  	},

		  	_testTemplate: function(){
		  		console.log("_testTemplate arguments:", arguments);
		  		var pagePath = this.framePageDefaultPath[0] + "/" +
		  			pageId + "/" + (templateId || "page") + ".html";
		  		var argMap = {}, argList = [];
		  		if (typeof (args) != 'undefined') {
		  			argList = args.split("/");
		  			while (argList.length >= 2) {
		  				argMap[argList.shift()] = argList.shift();
		  			}
		  		}
		  		console.log("templage argument map:", argMap);
		  		var thisRouter = this;
		  		require(["text!" + pagePath], function (tmpl) {
		  			var pageView = _.template(tmpl)(argMap);
		  			var $page = thisRouter.changePage(pageView);
		  		});
		  	},

		  	routePages: function(iPages){
		  		var pages = this.frameDefaultPages;
		  		if(iPages){
		  			pages = iPages.split('/');
		  		}
		  		console.log('routePages:', pages);
		  		var pagePathArray = [];
		  		_.extend(pagePathArray, this.framePageDefaultPath.split(0,3));
		  		var thisRouter = this;
		  		this.lastRoutePages = pages;
		  		thisRouter.pageNum = this.lastRoutePages.length;
		  		$(pages).each(function(n, pageId){
		  			pagePathArray[1] = pageId;		// 设置页面目录
		  			var pagePath = pagePathArray.join('/');
		  			var existView = thisRouter.views[pageId];
		  			if(existView){
		  				thisRouter.trigger('ready', existView);
		  			}else{
		  				require([pagePath], function(PageView){
		  					var pageView = new PageView();
		  					if($.inArray(pageId, thisRouter.reloadPages) == -1){
		  						thisRouter.views[pageId] = pageView;
		  					}
		  				})
		  			}
		  		})
		  	},

		  	clearAll: function(){
		  		for(var i in thisRouter.views){
		  			thisRouter.views[i].remove();
		  		}
		  		thisRouter.views = {};
		  	},

		  	clearView: function(pageId){
		  		delete thisRouter.views[pageId];
		  	},

		  	frameInit: function (args) {
				var pages = this.frameDefaultPages;
				this.routePage();
			},

			changePage: function (view, action, actionArgs, opts) {
				var thisRouter = this;
				//根据frame-*获取构建位置
				var $frameBlock = undefined;
				var $page;
				//支持静态页面
				if (typeof (view) == "string") {
					$page = $(view);
				}
				else {
					$page = view.$el;
				}
				var pageClass = $page.attr("class");		
				if (pageClass) {
					$.each($page.attr("class").split(" "), function (i, cl) {
						if (cl.match(new RegExp("^" + thisRouter.frameClassPrefix)) != null) {
							$frameBlock = $("#" + cl);
						}
					});
				}
				if ($frameBlock && $frameBlock.length) {
					// ...
				}
				else {
					console.error("目标页面容器不存在，请检查页面" + "class='frame-*'", "属性");
					return false;
				}
				//			console.debug("start:===========================");			
				//			console.debug($("body").html());
				//			console.debug("end:------------------------------");

				// 如果目标区域存在激活页面，隐藏
				var activePage = $frameBlock.find("." + this.framePageActiveClass).not("#" + $page.attr("id"));
				if (activePage.length != 0) {
					activePage.removeClass(this.framePageActiveClass);
				}

				//插入dom
				var $existPage = $frameBlock.find("#" + $page.attr("id"));

				// 无法判定是否有新数据，每次都重新构建页面
				if ($existPage.length != 0) {
					// 判断是否重新构建了页面
					if ($page[0] == $existPage[0]) {
						//					$page = $existPage;
					}
					else {
						$existPage.remove();
						$frameBlock.html($page);
						view.delegateEvents();
						$page.page();
					}
				}
				else {

					// $frameBlock.append($page);
					// $page.page();
					$frameBlock.html($page);
				}


				// 将全屏层前移
				// var $frameFull = $("#" + this.frameFullId)
				// if ($frameBlock.attr("id") == $frameFull.attr("id")) {
				// 	$frameFull.css({
				// 		"display": "block"
				// 	});

				// }
				// else {
				// 	$frameFull.css({
				// 		"display": "none"
				// 	});
				// };
				// console.debug("Router# Page#" + $page.attr("id") + " => PageContainer#" + $frameBlock.attr("id"));
				//data-transition	fade | flip | flow | pop | slide | slidedown | slidefade | slideup | turn | none
				// var transition = $page.data("transition") || $frameBlock.data("transition") || "none";
				// if ($page.data("role") == 'dialog') {
				// 	transition = $page.data("transition") || "fade";
				// }
				/*
				var activePage = $frameBlock.find("." + this.framePageActiveClass);
				activePage.each(function(n, el){
					if($(el).attr("id") != $page.attr("id")) {
						$(el).removeClass(thisRouter.framePageActiveClass);
					}
				});
				*/
				//点击标识当前进入哪个页面
				// app.currentPage = $page.attr("id");
				// app.trigger("menuClassToggle", app.currentPage);
				/*
				$page.addClass(this.framePageActiveClass);
	
				// jqm兼容性处理
				var pcInst = $frameBlock.pagecontainer("instance" ) ||  $frameBlock.pagecontainer().pagecontainer("instance" );
				var $prePage = pcInst.activePage;
				pcInst.activePage = $page;
				$.mobile.activePage = $page;
				// 切换内部页面时调用jqm页面清理机制
				if($prePage) $prePage.page("bindRemove");
				*/
				return $page;
			},

			routePage: function (pageId, pageAction, args) {
				// var balanceArr = ['publicInformationProcess', 'publicInformationProcessResend', 'publicInfomationSetup', 'accountType','accountTypeFinish', 'idType', 'idTypeFinish', 'changePublicInfo', 'balanceEntrance', 'publicFinalResult'];
				// if (!balanceArr.includes(pageId) && pageId) {
					// app.trigger('outBalanceEntrance');
				// }
				var that = this;
				// var pageAct = pageAction || this.framePageDefaultPath[3];//render
				pageId = pageId || this.framePageDefaultPath[1];//startPage
				// if (typeof args == 'undefined') args = "";
				var pagePath = this.framePageDefaultPath[0] + "/" +//page
					pageId + "/" +
					this.framePageDefaultPath[2];//main
				var actionArgs = [];
				if (typeof (args) == 'string') {
					actionArgs = args.split("/");
				} else {
					actionArgs = args;
				}
				this.lastRoutePages = [pageId];
				thisRouter.pageNum = this.lastRoutePages.length;

				var existView = thisRouter.views[pageId];
				if (existView) {
					thisRouter.trigger("ready", existView, pageAction, actionArgs);
				}
				else {
					require([pagePath], function (PageView) {
						/* 对象初始化的参数于具体调用函数参数相同 */
						var pageView = new PageView(actionArgs);
						// 使用上层的pageId
						//var pageId = pageView.$el.attr("id");
						if ($.inArray(pageId, thisRouter.reloadPages) == -1) {
							thisRouter.views[pageId] = pageView;
						}

					});
				}
			},

			jqmPage: function (url, options) {

				//由jqm切换页面，什么都不需要做，静静的让hash变更
			}

		});
		return Router;
	}
)
	