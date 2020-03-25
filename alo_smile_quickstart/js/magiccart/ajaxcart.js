/**
 * Magiccart 
 * @category    Magiccart 
 * @copyright   Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license     http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-06-30 14:27:05
 * @@Modify Date: 2015-05-24 14:39:10
 * @@Function:
 */
"use strict";
(function () {
    jQuery.fn.magiccart = function(options) {
    
        var defaults = jQuery.extend({
            miniCartWrap : '.miniCartWrap',
            wrapPopupAjaxcart : 'popupAjaxcart',
            miniMainCart : 'mini-maincart',
            miniContentCart : '.mini-contentCart', // '.mini-maincart',
            tickerMiniCart : '.mini-maincart', // 'a.top-link-cart',
            buttonCart : 'button.btn-cart',
            fly : false,
            loading : '',
            url : null,  
            updateUrl : null,   
            isProductView : 0,
            product_id : 0,
            notification : null,
            timeOut : 10000,
        }, options);
        
        /******************************
        Private Variables
         *******************************/
         
        var object      = null;
        // var baseUrl     = null;
        var settings    = jQuery.extend(defaults, options);
        var popupAjaxcart   = '';
        var bgPopup         = '';
        var loading         = '';
        var notification    = '';
        var popupWidth; // Declare the global width of each item in carousel
        var popupHeight; // Declare the global height of each item in carousel
        
        /******************************
        Public Methods
        *******************************/
        var methods = {
            init : function() {
                return this.each(function() {
                    methods.ajaxCartShoppCartLoad('button.btn-cart');
                });
            },
            
            /******************************
            Initialize Items
            Fully initialize everything. Plugin is loaded and ready after finishing execution
        *******************************/
            // initialize : function(options) {
            //     Object.extend(settings, options);
            // },

            getMagicUrl: function($ctrl){
                var ctrl = $ctrl || ''; // if(typeof $path == 'undefined') {path =''}
                var url = Themecfg.general.baseUrl;
                return url + ctrl;
            },

            ajaxCartShoppCartLoad: function(buttonClass){
                if(settings.isProductView) return;
                $$(buttonClass).each(function(element){
                        if(element.getAttribute('onclick')){
                            var attr = document.createAttribute('magiccartEvent');
                            attr.value =  element.getAttribute('onclick').toString(); 
                            element.attributes.setNamedItem(attr);
                        }        
                        element.onclick = '';
                    element.stopObserving('click');
                        Event.observe(element, 'click', this.searchIdAndSendAjax );
                }.bind(this));  
                methods.createMinicart();
                methods.createPopup();
            },

            sendAjax : function(idProduct, param, magiccartEvent, element) {
                // console.log(this);
                if(idProduct) {
                    var postData = 'product_id=' + idProduct;           
                    postData = this.addProductParam(postData);
                    if('' == postData) 
                        return true;
                    new Ajax.Request(settings.url, {
                        method: 'post',
                        postBody : postData,
                        onCreate: function (request) {
                            if(!popupAjaxcart){
                                popupAjaxcart = jQuery('#'+settings.wrapPopupAjaxcart);
                                notification = jQuery('#toPopup', popupAjaxcart)
                                loading = jQuery('.loading', popupAjaxcart);
                                bgPopup = jQuery('.overlay', popupAjaxcart);
                            } 
                            popupAjaxcart.show();
                            bgPopup.hide();
                            loading.show();
                            notification.hide();

                        },
                        onSuccess: function(transport) {
                            if (transport.responseText.isJSON()) {
                                var response = transport.responseText.evalJSON();
                                if (response.error) {
                                    alert(response.error);
                                }else{
                                    if(response.redirect) {
                                         //if IE7
                                        if (document.all && !document.querySelector) {
                                            magiccartEvent = magiccartEvent.substring(21, magiccartEvent.length-2)
                                            eval(magiccartEvent);
                                        }
                                        else{
                                            eval(magiccartEvent);    
                                        }
                                        return true;
                                    }
                                    this.showPopup(response.dataOption,response.add_to_cart,response.action);
                                    var maxHeight = parseInt($$('html')[0].getHeight()/4);
                                    var height  = notification.height();
                                    if(!(height <= maxHeight)) {
                                    notification.setStyle({
                                        overflowY : 'scroll', 
                                        maxHeight : maxHeight + 'px'
                                    });
                                    } 
                                    if(response.add_to_cart === '1'){
                                        this.updateCount(response.count); 
                                        this.updateShoppingCart(); 
                                        this.updateSidebarCart(); 
                                        this.updateMinicart();
                                    }    
                                }
                            }
                        }.bind(this),
                        onFailure: function()
                        {
                            this.hideAnimation();
                            eval(magiccartEvent);
                        }.bind(this)    
                    });
                }
            }, 
            
            addProductParam: function(postData) {
                var form = $('product_addtocart_form');
                if($$('#toPopup #product_addtocart_form')[0]){
                    form = $$('#toPopup #product_addtocart_form')[0];
                }  
                if(form) {
                    var validator = new Validation(form);
                    if (validator.validate()) postData += "&" + jQuery(form).serialize();
                    else return '';
                }
                postData += '&IsProductView=' + settings.isProductView;
                return postData;
            }, 
            
            createPopup : function(){
                jQuery('body').append('<div id="'+settings.wrapPopupAjaxcart+'" style="display: none"><div id="toPopup"></div><div class="loading"></div><div class="overlay"></div><div>');
            },
            
            showPopup : function(data,isadd,action){
                var popupStatus     = 0;
                var notification    = jQuery('#toPopup', popupAjaxcart).html(data);
                var btnContinue     = jQuery('button.cart-continue', notification);
                // setTimeout(function(){
                    if(popupStatus == 0) { 
                        loading.fadeOut('normal');
                        popupAjaxcart.fadeIn(500); 
                        bgPopup.css("opacity", "0.7");
                        bgPopup.fadeIn(100);
                        notification.fadeIn(100);
                        popupStatus = 1;
                    }
                // },200);
                if(isadd=='1'){
                    setTimeout(function(){
                        if(popupStatus == 1) {
                            popupAjaxcart.fadeOut("normal");
                            popupStatus = 0; 
                        }
                    },settings.timeOut);
                    btnContinue.click(function() {
                        if(popupStatus == 1) {
                            popupAjaxcart.fadeOut("normal");
                            popupStatus = 0; 
                        }
                    });
                } else{ // if(isadd=='0')
                    // action options inPopup       
                    var btnCart  = jQuery('button.btn-cart', notification);
                    btnCart.click(function(){ eval(action) });
                    var btnCancel = jQuery('button.btn-cancel', notification);
                    btnCancel.click(function(){ popupAjaxcart.fadeOut("normal").children('#toPopup').empty() });
                }
                bgPopup.click(function() {
                        if(popupStatus == 1) {
                            popupAjaxcart.fadeOut("normal").children('#toPopup').empty();
                            popupStatus = 0; 
                        }
                    });
            },
            
            updateSidebarCart : function() {
                if($$('.block-cart')[0]){
                    var url = this.getMagicUrl('magicshop/ajax/cart');
                    new Ajax.Updater($$('.block-cart')[0], url, {
                        method: 'post'
                    }); 
                    return true; 
                }
            },
            
            updateCount : function(count) {
                var topLinkCart = $$('a.top-link-cart')[0];
                if(topLinkCart){
                    var pos = topLinkCart.innerHTML.indexOf("(");
                    if(pos >= 0 && count) {
                        topLinkCart.innerHTML =  topLinkCart.innerHTML.substring(0, pos) + count;    
                    }
                    else{
                        if(count) topLinkCart.innerHTML =  topLinkCart.innerHTML + count;     
                    }
                };
            },
            
            updateShoppingCart : function() { // add cart in page checkout 
                if($$('body.checkout-cart-index div.cart')[0]){
                    var url = this.getMagicUrl('magicshop/ajax/checkout');
                    new Ajax.Request(url, {
                        method: 'post',
                        onSuccess: function(transport) {
                           if(transport.responseText) {
                                var response = transport.responseText;
                                var holderDiv = document.createElement('div');
                                holderDiv = $(holderDiv);
                                holderDiv.innerHTML = response; 
                                $$('body.checkout-cart-index div.cart')[0].innerHTML = holderDiv.childElements()[0].innerHTML;
                                if (typeof Themecfg != 'undefined'){ // for alothemes
                                    if(Themecfg.checkout.crosssellsSlide) crossSlide();
                                    methods.ajaxCartShoppCartLoad('button.btn-cart');
                                }
                            }       
                        }.bind(this),
                    });
                 }
            }, 

            createMinicart: function() {
                var mnCart = jQuery(settings.tickerMiniCart);
                if(mnCart.length) {
                    var container = mnCart.parent().children('.' +settings.miniMainCart);
                    if(!container.length){
                        container = document.createElement('div');
                        container = jQuery(container);
                        container.addClass(settings.miniMainCart);
                        container.hide();
                        if(mnCart.parent()){
                            mnCart.parent().append(container);
                            this.updateMinicart();   
                        }
                    }
                    mnCart.parent().mouseover(this.showMinicart);
                    mnCart.parent().mouseout(this.hideMinicart);
                    container.parent().mouseover(this.showMinicart);
                    container.parent().mouseout(this.hideMinicart); 
                    return;
                }
            },

            showMinicart: function() {
               jQuery(settings.miniContentCart).stop(true, true).delay(200).slideDown(200);
            },
            
            hideMinicart: function() {
                jQuery(settings.miniContentCart).stop(true, true).delay(200).fadeOut(500);
            },
            
            updateMinicart: function(ajax) {
                var url = this.getMagicUrl('magicshop/ajax/reloadCart');
                var element = $$( '.' +settings.miniMainCart)[0].parentNode;
                new Ajax.Updater(element, url, {
                    method: 'post'
                }); 
            },

            searchIdAndSendAjax: function(event) {
                // console.log(this);
                var element = Event.element(event);
                if(settings.fly) methods.showAnimation(element);
                event.preventDefault();
                var addToLinc = 'add-to-links';
                if($('confirmBox')) {
                    jQuery(function($) {
                        $.confirm.hide();
                    })
                }
                if(!element.hasClassName('button')) {
                    element = $(element.parentNode.parentNode);    
                }
                var magiccartEvent = element.getAttribute('magiccartEvent');
                var idProduct = '';
                if(settings.isProductView && settings.product_id) idProduct = settings.product_id;
                var el = $(element.parentNode.parentNode); 
                if(el){
                    if(idProduct){
                        methods.sendAjax(idProduct, '', magiccartEvent, element); 
                        return;             
                    }else {
                        idProduct = methods.searchInPriceBox(el, magiccartEvent, element, idProduct);              
                    }

                }    
                if(idProduct == '') {
                    el = $(element.parentNode.parentNode.parentNode);
                    if(el) {
                        idProduct = methods.searchInPriceBox(el, magiccartEvent, element, idProduct);     
                    }
                }   
                if(idProduct == '') {
                    el = $(element.parentNode);
                    var child  = el.getElementsByClassName(addToLinc)[0];
                    if(child) {
                        var childNext = child.childElements()[0];
                        if(childNext) {
                            childNext = childNext.childElements()[0];    
                        }
                        if(childNext) {
                            idProduct = childNext.href.match(/product(.?)+form_key/)[0].replace(/[^\d]/gi, '');
                        }
                        if(parseInt(idProduct) > 0) {
                            var tmp = parseInt(idProduct); 
                            methods.sendAjax(tmp, '', magiccartEvent, element);
                            return true;
                        }
                         else{
                            idProduct = '';    
                        }
                    }
                }
                if(idProduct == '' && $$("input[name='product']")[0] && $$("input[name='product']")[0].value) {
                    idProduct = $$("input[name='product']")[0].value;
                    if(parseInt(idProduct) > 0) {
                        var tmp = parseInt(idProduct); 
                        methods.sendAjax(tmp, '', magiccartEvent, element);
                        return true;
                    }     
                }
                
                if(idProduct == '' && magiccartEvent) {
                    var productString = '/product/';
                    var posStart = magiccartEvent.indexOf(productString);
                    if(posStart) {
                        var posFinish = magiccartEvent.indexOf('/', posStart + productString.length);
                        if(posFinish) {
                            var idProduct = magiccartEvent.substring(posStart + productString.length, posFinish);
                               if(parseInt(idProduct) > 0) {
                                    var tmp = parseInt(idProduct); 
                                    methods.sendAjax(tmp, '', magiccartEvent, element);
                                    return true;
                               }
                            else {
                                idProduct = '';    
                            }
                        }
                    }
                }   
                if(idProduct == '') {
                     //if IE7
                    if (document.all && !document.querySelector) {
                        magiccartEvent = magiccartEvent.substring(21, magiccartEvent.length-2)
                    }
                    eval(magiccartEvent);    
                }
            },
            
            searchInPriceBox: function(parent, magiccartEvent, element, idProduct) {
                if(parent.getElementsByClassName('special-price')[0])
                {
                    var child = parent.getElementsByClassName('special-price')[0];
                    var elementInt = 1;
                }
                else
                {
                    var child = parent.getElementsByClassName('price-box')[0];
                    var elementInt = 0;
                }

                if(child) {
                    var childNext = child.childElements()[elementInt];
                    if(childNext){
                        idProduct = childNext.id.replace(/[^\d]/gi, '');
                    }
                    if(!idProduct || idProduct == '') {
                        child.childElements()[0].childElements().each(function(childNext) {
                            idProduct = childNext.id.replace(/[a-z-]*/, '');
                            if(parseInt(idProduct) > 0) {
                                return idProduct;     
                            }    
                        }.bind(this));
                    }
                    if(!idProduct || idProduct == '') {
                        child.select(".price").each(function(childNext) {
                        if(childNext.id)
                            idProduct = childNext.id.replace(/[a-z-]*/, '');
                            if(parseInt(idProduct) > 0) {
                                return idProduct;     
                            }    
                        }.bind(this));
                    }
                    if(parseInt(idProduct) > 0) {
                         var tmp = parseInt(idProduct); 
                         this.sendAjax(tmp, '', magiccartEvent, element);
                         return idProduct;
                    }
                    else {
                        idProduct = '';    
                    }
                } 
                return ''; 
            },

            showAnimation: function(element) {
                var cart=jQuery(settings.tickerMiniCart);
                var currentImg = {};
                if(jQuery('.product-view').length>0){
                    if(jQuery('#qty').val()>0 && jQuery('.validation-failed').length==0){
                        var currentImg = jQuery('.product-view').find('.product-image img');
                    } else {
                        jQuery('.qty').each(function() { // Grouped Product
                            if(jQuery(this).val()) {
                                var currentImg = jQuery('.product-view').find('.product-image img');
                                return false; // break each jQuery;
                            }
                        });
                    }
                }else{
                    var currentImg = jQuery(element).parents('.item').find('.product-image img');
                }
                if(currentImg.length){
                    var imgclone = currentImg.clone()
                        .offset({ top:currentImg.offset().top, left:currentImg.offset().left })
                        .addClass('imgfly')
                        .css({'opacity':'0.7', 'position':'absolute', 'height':'180px', 'width':'180px', 'z-index':'1000'})
                        .appendTo(jQuery('body'))
                        .animate({
                            'top': cart.offset().top + 10,
                            'left':cart.offset().left + 10,
                            'width':55,
                            'height':55
                        }, 1000, 'easeInOutExpo');
                    imgclone.animate({'width':0, 'height':0});
                }
               
            } 
        };
        if (methods[options]) { // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);
        } else {
            $.error('Method "' + method + '" does not exist in magiccart plugin!');
        }
    }
})(jQuery);
