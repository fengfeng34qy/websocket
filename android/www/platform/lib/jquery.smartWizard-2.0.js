/*
 * SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * 
 */
 
(function($){
    $.fn.smartWizard = function(action) {
        var options = $.extend({}, $.fn.smartWizard.defaults, action);
        var args = arguments;
        
        return this.each(function(){
                var obj = $(this);
                var curStepIdx = options.selected;
                var steps = $("ul > li > a", obj); // Get all anchors in this array
                var contentWidth = 0;
                var loader,msgBox,elmActionBar,elmStepContainer,btNext,btPrevious,btFinish,btReturn;
                
                elmActionBar = $('.actionBar',obj);
                if(elmActionBar.length == 0){
                  elmActionBar = $('<div></div>').addClass("actionBar");                
                }

                msgBox = $('.msgBox',obj);
                if(msgBox.length == 0){
                  msgBox = $('<div class="msgBox"><div class="content"></div><a href="#" class="close" style="display:none;">X</a></div>');
                  elmActionBar.append(msgBox);                
                }
                
                $('.close',msgBox).click(function() {
                    msgBox.fadeOut("normal");
                    return false;
                });

                // Method calling logic
                if (!action || action === 'init' || typeof action === 'object') {
                  if (obj.data('smartWizard')) {
                      /* 不重新构建对象 */
                  }
                  else {
                      obj.data('smartWizard', obj);
                      init();
                  }
                }else if (action === 'showMessage') {
                  //showMessage(Array.prototype.slice.call( args, 1 ));
                  var ar =  Array.prototype.slice.call( args, 1 );
                  showMessage(ar[0]);
                  return true;
                }else if (action === 'setError') {
                  var ar =  Array.prototype.slice.call( args, 1 );
                  setError(ar[0].stepnum,ar[0].iserror);
                  return true;
                }else if (action === 'skipTo') {
                   var ar =  Array.prototype.slice.call( args, 1 );
                   steps.eq(ar[0]-1).click();
                   return true;
                }else if (action === 'enable') {
                   var ar =  Array.prototype.slice.call( args, 1 );
                    $(steps.eq(ar[0]-1), obj).removeClass("selected").removeClass("disabled").addClass("done"); 
                    $(steps.eq(ar[0]-1), obj).attr("isDone",1); 
                   return true;
                }else if (action === 'disable') {
                   var ar =  Array.prototype.slice.call( args, 1 );
                    $(steps.eq(ar[0]-1), obj).removeClass("selected").removeClass("done").addClass("disabled"); 
                    $(steps.eq(ar[0]-1), obj).attr("isDone",0);                 
                   return true;
                } else {
                  $.error( 'Method ' +  action + ' does not exist' );
                }
                
                function init(){
                  var allDivs =obj.children('div'); //$("div", obj);                
                  obj.children('ul').addClass("anchor");
                  allDivs.addClass("content");
                  // Create Elements
                  //loader = $('<div style="display:none">Loading</div>').addClass("loader");
                  elmActionBar = $('<div></div>').addClass("actionBar");
                  elmStepContainer = $('<div></div>').addClass("stepContainer");
                  btNext = $('<a>'+options.labelNext+'</a>').attr("href","#").addClass("buttonNext ui-btn");
                  btPrevious = $('<a>'+options.labelPrevious+'</a>').attr("href","#").addClass("buttonPrevious ui-btn");
                  btFinish = $('<a>'+options.labelFinish+'</a>').attr("href","#").addClass("buttonFinish ui-btn");
				  btReturn=$('<a>'+options.labelReturn+'</a>').attr("href","#").addClass("buttonReturn ui-btn");
                  //if(options.labelReturn!=null){
                 	// btReturn=$("<a>"+options.labelReturn+'</a>').attr("href","#").addClass("buttonReturn");
                 // }
                  // highlight steps with errors
                  
                  if(options.errorSteps && options.errorSteps.length>0){
                    $.each(options.errorSteps, function(i, n){
                      setError(n,true);
                    });
                  }
                  
                  elmStepContainer.append(allDivs);
                  elmActionBar.append(loader);
                  obj.append(elmStepContainer);
                  obj.append(elmActionBar); 
                  elmActionBar.append(btReturn).append(btPrevious).append(btNext).append(btFinish); 
                  contentWidth = elmStepContainer.width();

                  $(btNext).click(function() {
                      //doForwardProgress();
					  doBackwardProgress();
                      return false;
                  }); 
                  $(btPrevious).click(function() {
					  //doBackwardProgress();
					  doForwardProgress();
                      return false;
                  }); 
                  if(btReturn!=null){
	                  $(btReturn).click(function(){
	                  	if($.isFunction(options.onReturnStep)) {
	                        options.onReturnStep.call(this);
	                        //doFirstProgress();
	                      }
	                  	return false;
	                  });
                  }
                  $(btFinish).click(function() {
                      if(!$(this).hasClass('buttonDisabled')){
                         if($.isFunction(options.onFinish)) {
                            if(!options.onFinish.call(this,$(steps))){
                              return false;
                            }
                         }else{
                           var frm = obj.parents('form');
                           if(frm && frm.length){
                             frm.submit();
                           }                         
                         }                      
                      }

                      return false;
                  }); 
                  
                  $(steps).bind("click", function(e){
                      // console.log(e.originalEvent);
                      if(typeof options.allowClick === "function"){
                          options.noClick = options.allowClick();
                      }

                     //允许禁用
                      if(options.noClick){
                          if(e.originalEvent != undefined){
                              return false;
                          }
                      }
                      if(steps.index(this) == curStepIdx){
                        return false;                    
                      }
                      var nextStepIdx = steps.index(this);
                      var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
                      if(isDone == 1){
                      	 //进入下一步前 回调onNextStep的函数
	                 	  if($.isFunction(options.onNextStep)&&nextStepIdx>curStepIdx) {
							  var j = curStepIdx;
							  var k = 0;
							  for(var i=0;i<nextStepIdx-curStepIdx;i++){
								  if(!options.onNextStep.call(this,$(steps.eq(j), obj))){
									k++;
								  }
								  j++;
							  }
							  if(k!=0){
								  return false;
							  }else
							  {
		                      	LoadContent(nextStepIdx);
		                      }
		                      
	                 	  }else{
	                      		LoadContent(nextStepIdx);
	                      }
                                           
                      }
                      return false;
                  }); 
                  
                  // Enable keyboard navigation                 
                  if(options.keyNavigation){
                      $(document).keyup(function(e){
                          if(e.which==39){ // Right Arrow
                            doForwardProgress();
                          }else if(e.which==37){ // Left Arrow
                            doBackwardProgress();
                          }
                      });
                  }
                  //  Prepare the steps
                  prepareSteps();
                  // Show the first slected step
                  LoadContent(curStepIdx);                  
                }

                function prepareSteps(){
                  if(!options.enableAllSteps){
                    $(steps, obj).removeClass("selected").removeClass("done").addClass("disabled"); 
                    $(steps, obj).attr("isDone",0);                 
                  }else{
                    $(steps, obj).removeClass("selected").removeClass("disabled").addClass("done"); 
                    $(steps, obj).attr("isDone",1); 
                  }

            	    $(steps, obj).each(function(i){
                        $($(this).attr("href"), obj).hide();
                        $(this).attr("rel",i+1);
                  });
                }
                
                function LoadContent(stepIdx){
                    var selStep = steps.eq(stepIdx);
                    var ajaxurl = options.contentURL;
                    var hasContent =  selStep.data('hasContent');
                    stepNum = stepIdx+1;
                    if(ajaxurl && ajaxurl.length>0){
                       if(options.contentCache && hasContent){
                           showStep(stepIdx);                          
                       }else{
                           $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: ({step_number : stepNum}),
                            dataType: "text",
                            beforeSend: function(){ loader.show(); },
                            error: function(){loader.hide();},
                            success: function(res){ 
                              loader.hide();       
                              if(res && res.length>0){  
                                 selStep.data('hasContent',true);            
                                 $($(selStep, obj).attr("href"), obj).html(res);
                                 showStep(stepIdx);
                              }
                            }
                          }); 
                      }
                    }else{
                      showStep(stepIdx);
                    }
                }
                
                function showStep(stepIdx){
                    var selStep = steps.eq(stepIdx); 
                    var curStep = steps.eq(curStepIdx);
                    if(stepIdx != curStepIdx){
                      if($.isFunction(options.onLeaveStep)) {
                        if(!options.onLeaveStep.call(this,$(curStep))){
                          return false;
                        }
                      }
                    }     
                    elmStepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight());               
                    if(options.transitionEffect == 'slide'){
                      $($(curStep, obj).attr("href"), obj).slideUp("fast",function(e){
                            $($(selStep, obj).attr("href"), obj).slideDown("fast");
                            curStepIdx =  stepIdx;                        
                            SetupStep(curStep,selStep);
                          });
                    } else if(options.transitionEffect == 'fade'){                      
                      $($(curStep, obj).attr("href").match(/#.{1,}/)+"", obj).fadeOut("fast",function(e){
                            $($(selStep, obj).attr("href").match(/#.{1,}/)+"", obj).fadeIn("fast");
                            curStepIdx =  stepIdx;                        
                            SetupStep(curStep,selStep);                           
                          });                    
                    } else if(options.transitionEffect == 'slideleft'){
                        var nextElmLeft = 0;
                        var curElementLeft = 0;
                        if(stepIdx > curStepIdx){
                            nextElmLeft1 = contentWidth + 10;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                        } else {
                            nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
                        }
                        if(stepIdx == curStepIdx){
                            nextElmLeft1 = $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();                           
                        }else{
                            $($(curStep, obj).attr("href"), obj).animate({left:curElementLeft},"fast",function(e){
                              $($(curStep, obj).attr("href"), obj).hide();
                            });                       
                        }

                        $($(selStep, obj).attr("href"), obj).css("left",nextElmLeft1);
                        $($(selStep, obj).attr("href"), obj).show();
                        $($(selStep, obj).attr("href"), obj).animate({left:nextElmLeft2},"fast",function(e){
                          curStepIdx =  stepIdx;                        
                          SetupStep(curStep,selStep);                      
                        });
                    } else{

                    	$($(curStep, obj).attr("href").match(/#.{1,}/)+"", obj).css("display","none");
                    	$($(selStep, obj).attr("href").match(/#.{1,}/)+"", obj).css("display","block");
                    	//ie7不支持
//                        $($(curStep, obj).attr("href"), obj).hide(); 
//                        $($(selStep, obj).attr("href"), obj).show();
                        curStepIdx =  stepIdx;                        
                        SetupStep(curStep,selStep);
                    }
                    return true;
                }
                
                function SetupStep(curStep,selStep){
                   $(curStep, obj).removeClass("selected");
                   $(curStep, obj).addClass("done");
                   
                   $(selStep, obj).removeClass("disabled");
                   $(selStep, obj).removeClass("done");
                   $(selStep, obj).addClass("selected");
                   $(selStep, obj).attr("isDone",1);
                   adjustButton();
                   if($.isFunction(options.onShowStep)) {
                      if(!options.onShowStep.call(this,$(selStep))){
                        return false;
                      }
                   } 
                }                
               //跳转到第一步
              function doFirstProgress() {

				var stepIdx = 0;
				var selStep = steps.eq(stepIdx);
				stepNum = stepIdx + 1;
				var selStep = steps.eq(stepIdx);
				var curStep = steps.eq(curStepIdx);
				//删除控件自身高度计算
				elmStepContainer.height($($(selStep, obj).attr("href"), obj)
						.outerHeight());
				$($(curStep, obj).attr("href"), obj).hide();
				$($(selStep, obj).attr("href"), obj).show();
				curStepIdx = stepIdx;
				for(var i=0;i<steps.length;i++){
					if(i!=stepIdx){
					$(steps.eq(i), obj).removeClass("selected");
					$(steps.eq(i), obj).removeClass("done");
					$(steps.eq(i), obj).attr("isDone", 0);
					$(steps.eq(i), obj).addClass("disabled");
					}
				}
				$(selStep, obj).removeClass("disabled");
				$(selStep, obj).removeClass("done");
				$(selStep, obj).addClass("selected");
				$(selStep, obj).attr("isDone", 1);
				
				adjustButton();

			}
			//暂时改成后退按钮，原来是前进按钮
                function doForwardProgress(){
                 // var nextStepIdx = curStepIdx + 1;
				   var nextStepIdx = curStepIdx -1;
				  for (var i = 0; i < steps.length; i++) {
					 // if(steps.length <= nextStepIdx){
						if(0 > nextStepIdx){
						
						if(!options.cycleSteps){
						  return false;
						}                  
						//nextStepIdx = 0;
					     nextStepIdx = steps.length - 1
					  }
					  if (!$(steps.eq(nextStepIdx), obj).hasClass('disabled')){
						  break;
					  }
					  //nextStepIdx++;
					  nextStepIdx--;
				  }
				  if (!!$(steps.eq(nextStepIdx), obj).hasClass('disabled')){
					  return false;
				  }
                  //进入下一步前 回调onNextStep的函数
                  if($.isFunction(options.onPreviousStep)) {
                      if(!options.onPreviousStep.call(this,$(steps.eq(curStepIdx), obj))){
                        return false;
                      }else{
                      	LoadContent(nextStepIdx);
                      }
                   }else{//没有onNextStep回调函数 直接执行加载页面
                   		LoadContent(nextStepIdx);
                   }           
                }
                
				//暂时改成前进按钮，原来是后退按钮
				
                function doBackwardProgress(){
                 // var nextStepIdx = curStepIdx-1;
				 var nextStepIdx = curStepIdx+1;
				  for (var i = 0; i < steps.length; i++) {
					 // if(0 > nextStepIdx){
						if(steps.length <= nextStepIdx){
						if(!options.cycleSteps){
						  return false;
						}
						//nextStepIdx = steps.length - 1;
					      
					         nextStepIdx = 0;
					}
					  if (!$(steps.eq(nextStepIdx), obj).hasClass('disabled')){
						  break;
					  }
					  //nextStepIdx--;
					  nextStepIdx++;
					  
					  
				  }
				  if (!!$(steps.eq(nextStepIdx), obj).hasClass('disabled')){
					  return false;
				  }
                  //进入下一步前 回调onNextStep的函数
                  if($.isFunction(options.onNextStep)) {
                      if(!options.onNextStep.call(this,$(steps.eq(curStepIdx), obj))){
                        return false;
                      }else{
                      	LoadContent(nextStepIdx);
                      }
                   }else{//没有onNextStep回调函数 直接执行加载页面
                   		LoadContent(nextStepIdx);
                   }
                }  
                
                function adjustButton(){
                  if(!options.cycleSteps){                
                    if(0 >= curStepIdx){
                      $(btPrevious).addClass("buttonDisabled");
                    }else{
                      $(btPrevious).removeClass("buttonDisabled");
                    }
                    if((steps.length-1) <= curStepIdx){
                      $(btNext).addClass("buttonDisabled");
                    }else{
                      $(btNext).removeClass("buttonDisabled");
                    }
                  }
                  // Finish Button 
                  if(!steps.hasClass('disabled') || options.enableFinishButton){
                    $(btFinish).removeClass("buttonDisabled");
                  }else{
                    $(btFinish).addClass("buttonDisabled");
                  }
                  
                  if(options.enableFinishButtonOnlyLastStep){
                  	if((steps.length-1) <= curStepIdx){
                      $(btFinish).removeClass("buttonDisabled");
                    }else{
                      $(btFinish).addClass("buttonDisabled");
                    }
                  }
                }
                
                function showMessage(msg){
                  $('.content',msgBox).html(msg);
              		msgBox.show();
                }
                
                function setError(stepnum,iserror){
                  if(iserror){                    
                    $(steps.eq(stepnum-1), obj).addClass('error')
                  }else{
                    $(steps.eq(stepnum-1), obj).removeClass("error");
                  }                                   
                }                        
        });  
    };  
 
    // Default Properties and Events
    $.fn.smartWizard.defaults = {
          selected: 0,  // Selected Step, 0 = first step   
          keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
          enableAllSteps: true,
          transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
          contentURL:null, // content url, Enables Ajax content loading
          contentCache:true, // cache step contents, if false content is fetched always from ajax url
          cycleSteps: false, // cycle step navigation
          enableFinishButton: false, // make finish button enabled always
          enableFinishButtonOnlyLastStep: true, // make finish button enabled only last step
          errorSteps:[],    // Array Steps with errors
          labelNext:'下一步', 
		  labelPrevious:'上一步',
		  labelFinish:'完成',
          labelReturn:'取消',
          onPreviousStep : null,
          onLeaveStep: null, // triggers when leaving a step
          onShowStep: null,  // triggers when showing a step
          onFinish: null,  // triggers when Finish button is clicked
          onReturnStep:null,//labelReturn 点击时触发回调函数
          onNextStep:null//点击下一步时 触发回调函数
    };    
    
})(jQuery);