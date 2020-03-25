/**
 * Magiccart 
 * @category 	Magiccart 
 * @copyright 	Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license 	http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-06-30 14:27:05
 * @@Modify Date: 2015-11-09 12:04:14
 * @@Function:
 */

  /* Timer */
var mcTimer =1;
if (typeof(BackColor)=="undefined") BackColor = "white";
if (typeof(ForeColor)=="undefined") ForeColor= "black";
//if (typeof(DisplayFormat)=="undefined") DisplayFormat = "<span class='day'>%%D%%</span><span style='margin:0px 4px'>:</span><span class='hour'>%%H%%</span><span style='margin:0px 4px'>:</span><span class='min'>%%M%%</span><span style='margin:0px 4px'>:</span><span class='sec'>%%S%%</span>";
if (typeof(CountActive)=="undefined") CountActive = true;
if (typeof(FinishMessage)=="undefined") FinishMessage = "";
if (typeof(CountStepper)!="number") CountStepper = -1;
if (typeof(LeadingZero)=="undefined") LeadingZero = true;
CountStepper = Math.ceil(CountStepper);
if (CountStepper == 0) CountActive = false;
var SetTimeOutPeriod = (Math.abs(CountStepper)-1)*1000 + 990;
function calcage(secs, num1, num2) {
    s = ((Math.floor(secs/num1)%num2)).toString();
    if (LeadingZero && s.length < 2) s = "0" + s;
    return "<b>" + s + "</b>";
}
function CountBack(secs,iid,mcTimer) {
    if (secs < 0) {
        document.getElementById(iid).innerHTML = FinishMessage;
        // document.getElementById('caption'+mcTimer).style.display = "none";
        // document.getElementById('heading'+mcTimer).style.display = "none";
        return;
    }
    DisplayStr = DisplayFormat.replace(/%%D%%/g, calcage(secs,86400,100000));
    DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(secs,3600,24));
    DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
    DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));
    document.getElementById(iid).innerHTML = DisplayStr;
    if (CountActive) setTimeout(function(){CountBack((secs+CountStepper),iid,mcTimer)}, SetTimeOutPeriod);
}
/* End Timer */
 
function getMagicUrl($ctrl){
    var ctrl = $ctrl || ''; // if(typeof $path == 'undefined') {path =''}
    return Themecfg.general.baseUrl + ctrl;
}
function crossSlide(){
	jQuery("#crosssell-products-list").flexisel({vertical: false, visibleItems: 4});
}

jQuery(document).ready(function($) {
	/* Tabs in product detail */
	(function(selector){
		var $content = $(selector);
		var $child   = $content.children('.box-collateral');
		if(Themecfg.detail.inforTabs){
			var activeTab = Themecfg.detail.activeTab;
			var activeContent = $content.children('.box-collateral.'+activeTab);
			if(activeContent.length){
				activeContent.addClass('active');
			} else {
				$content.children('.box-collateral').first().addClass('active');
			}
		}

        var ul = jQuery('<ul class="toggle-tabs"></ul>');
		$.each($child, function(index, val) {
			var title = $(this).children('h2').first().text();
			if(!title) title = $(this).children('.form-add').children('h2').first().text(); // for review
			var active = $(this).hasClass('active') ? 'active': '';
                var li = jQuery('<li class="item '+ active +'"></li>');
                li.html(title);
                ul.append(li);
		});

        ul.insertBefore($content);
        var $tabs =  ul.children();
        $tabs.click(function(event) {
        	$(this).siblings().removeClass('active'); // $tabs.removeClass('active');
        	$(this).addClass('active');
        	$child.hide();
        	$child.eq($(this).index()).show();
        	var isUpsell = $child.eq($(this).index()).find('#upsell-product ul');
        	if(isUpsell.length) {
        		if(Themecfg.detail.upsellSlide) isUpsell.flexisel({clone: false,});
        	}
        });
	})('.product-view .product-collateral');

		if($.fn.flexisel !== undefined){
			$(".product-image-thumbs").bxSlider({slideWidth: 84, infiniteLoop: true, mode: Themecfg.detail.thumbSlide, moveSlides: 1, minSlides: 4, maxSlides: 4,pager:false, slideMargin: 12, responsiveBreakpoints : {480: 3, 640: 4, 768: 4, 900: 3}});
			if(Themecfg.detail.relatedSlide) $("#block-related").bxSlider({slideWidth: 270, infiniteLoop: false, moveSlides: 1, minSlides: 4, maxSlides: 4,pager:false, slideMargin: 20, responsiveBreakpoints : {480: 3, 640: 4, 768: 4, 900: 3}});
			if(Themecfg.detail.upsellSlide) $("#upsell-product ul").flexisel({clone: true});
			if(Themecfg.checkout.crosssellsSlide) $("#crosssell-products-list").flexisel({vertical: false, visibleItems: 4});
		}

	/* Light Box Image */
	if(Themecfg.detail.lightBox > 0){
	    $('.product-image-gallery .gallery-image').click(function(e) {
	        e.preventDefault();
	        var currentImage = $(this).data('zoom-image');
	        var gallerylist = [];
	        var gallery = $('.product-image-gallery .gallery-image').not('#image-main');

	        gallery.each(function(index, el) {
	        	var img_src = $(this).data('zoom-image');       
				if(img_src == currentImage){
					gallerylist.unshift({
						href: ''+img_src+'',
						title: $(this).find('img').attr("title"),
						openEffect	: 'elastic'
					});	
				}else {
					gallerylist.push({
						href: ''+img_src+'',
						title: $(this).find('img').attr("title"),
						openEffect	: 'elastic'
					});
				}    	
	        });
	        $.fancybox(gallerylist);
	    });
	}

	/* Back to Top */
	(function(selector){
		var $backtotop = $(selector);
		$backtotop.hide();
		var height =  $(document).height();
		$(window).scroll(function () {
			if ($(this).scrollTop() > height/10) {
				$backtotop.fadeIn();
			} else {
				$backtotop.fadeOut();
			}
		});

		$backtotop.click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	})('#backtotop');

	var $toggleTab  = $('.toggle-tab');
	$toggleTab.click(function(){
		var parent = $(this).closest('.parent-toggle-tab');
		if(!parent.length) parent = $(this).parent();
		parent.toggleClass('toggle-visible').find('.toggle-content').toggleClass('visible');
	});

});



