/*

 * File: jquery.flexisel.js

 * Version: 1.0.2

 * Description: Responsive carousel jQuery plugin

 * Author: 9bit Studios

 * Copyright 2012, 9bit Studios

 * http://www.9bitstudios.com

 * Free to use and abuse under the MIT license.

 * http://www.opensource.org/licenses/mit-license.php

 */

(function ($) {

    $.fn.flexisel = function(options) {

    

        var defaults = $.extend({

            visibleItems : 4,

            animationSpeed : 200,

            autoPlay : false,

            autoPlaySpeed : 3000,

            pauseOnHover : true,

            setMaxWidthAndHeight : false,

            enableResponsiveBreakpoints : true,

            clone : false,

            itemSelector: null, // Item Selector

            margin : 30,

            moveSlide : 1,

            scroll: 'right', // option: 'left', 'right', 'top', 'bottom'

            vertical: false, // Mode vertical slide

            responsiveBreakpoints : {

                portrait: { 

                    changePoint:480,

                    visibleItems: 1

                }, 

                landscape: { 

                    changePoint:640,

                    visibleItems: 2

                },

                tablet: { 

                    changePoint:768,

                    visibleItems: 3

                }

            }

        }, options);

        

        /******************************

        Private Variables

         *******************************/

         

        var object = $(this);

        var objectParent = object.parent();

        var settings = $.extend(defaults, options);

        var itemsWidth; // Declare the global width of each item in carousel

        var itemsHeight; // Declare the global height of each item in carousel

        var canNavigate = true;

        var canNavigateLeft = true;

        //var canNavigateRight = true;

        var firstActive = 0;

        var itemsVisible    = settings.visibleItems; // Get visible items

        var itemsMoveSlide  = settings.moveSlide;   // Get move slide items

        var totalItems      = object.children().length; // Get number of elements

        var responsivePoints = [];

        

        /******************************

        Public Methods

        *******************************/

        var methods = {

            init : function() {

                return this.each(function() {

                    methods.appendHTML();

                    methods.setEventHandlers();

                    methods.initializeItems();

                });

            },

            

            /******************************

            Initialize Items

            Fully initialize everything. Plugin is loaded and ready after finishing execution

        *******************************/

            initializeItems : function() {

                var listParent = object.parent();

                var innerHeight = listParent.height();

                var childSet = object.children();

                if(settings.vertical){

                    methods.sortResponsiveObject(settings.responsiveBreakpoints);

                    innerHeight = objectParent.height(); // Set heights

                    itemsHeight = (innerHeight - settings.margin*(settings.visibleItems-1)) / settings.visibleItems;

                    childSet.height(itemsHeight);

                    childSet.css('marginTop', settings.margin);

                    listParent.css('maxHeight', innerHeight);

                    if (settings.clone) {

                        childSet.last().insertBefore(childSet.first());

                        childSet.last().insertBefore(childSet.first());

                        object.css({

                            'top' : -itemsHeight

                        });

                    }

                }else {

                    methods.sortResponsiveObject(settings.responsiveBreakpoints);   

                    var innerWidth = listParent.width(); // Set widths

                    itemsWidth = (innerWidth - settings.margin*(itemsVisible-1)) / itemsVisible;

                    childSet.width(itemsWidth);        

                    childSet.css('marginLeft', settings.margin);

                    if (settings.clone) {

                        childSet.last().insertBefore(childSet.first());

                        childSet.last().insertBefore(childSet.first());

                        object.css({

                            'left' : -itemsWidth

                        });

                    }               

                }

                object.fadeIn();

                $(window).trigger("resize"); // needed to position arrows correctly



            },

            

        /******************************

            Append HTML

            Add additional markup needed by plugin to the DOM

        *******************************/

            appendHTML : function() {

                if(settings.vertical){

                    object.addClass("nbs-flexisel-ul vertical");

                    object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner vertical'></div></div>");

                    if(settings.itemSelector){

                        object.find(settings.itemSelector).addClass("nbs-flexisel-item vertical");    

                    }else {

                        object.children().addClass("nbs-flexisel-item vertical");

                    }               

                }else {

                    object.addClass("nbs-flexisel-ul");

                    object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");

                    if(settings.itemSelector){

                        object.find(settings.itemSelector).addClass("nbs-flexisel-item");

                    }else {

                        object.children().addClass("nbs-flexisel-item");    

                    }                                   

                }



                if (settings.setMaxWidthAndHeight) {

                    var baseWidth = $(".nbs-flexisel-item img").width();

                    var baseHeight = $(".nbs-flexisel-item img").height();

                    $(".nbs-flexisel-item img").css("max-width", baseWidth);

                    $(".nbs-flexisel-item img").css("max-height", baseHeight);

                }

                if(settings.vertical){

                    $("<div class='nbs-flexisel-nav'><div class='nbs-flexisel-nav-top'></div><div class='nbs-flexisel-nav-bottom'></div></div>").insertAfter(object);

                }else {

                    $("<div class='nbs-flexisel-nav'><div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div></div>").insertAfter(object);               

                }

                if (settings.clone) {

                    var cloneContent = object.children().clone().addClass('clone');

                    object.append(cloneContent);

                }

            },

            /******************************

            Set Event Handlers

            Set events: click, resize, etc

            *******************************/

            setEventHandlers : function() {



                var listParent = object.parent();

                var childSet = object.children();

                if(settings.vertical){

                    var topArrow    = listParent.find($(".nbs-flexisel-nav-top"));

                    var bottomArrow = listParent.find($(".nbs-flexisel-nav-bottom"));

                }else {

                    var leftArrow   = listParent.find($(".nbs-flexisel-nav-left"));

                    var rightArrow  = listParent.find($(".nbs-flexisel-nav-right"));                

                }

                $(window).on("resize", function(event) {

                    var innerWidth = $(listParent).width();

                    var innerHeight = $(listParent).parent().parent().height();

                    if(settings.vertical){

                        methods.setResponsiveEventsVertical();  // add by DVN

                        itemsHeight = (innerHeight - settings.margin*(settings.visibleItems-1)) / settings.visibleItems;

                        childSet.height(itemsHeight);

                        if (settings.clone) {

                            object.css({

                                'top' : -itemsHeight -2*settings.margin

                            });

                        }else {

                            object.css({

                                'top' : -settings.margin

                            });

                        }                   

                    }else{

                        methods.setResponsiveEvents();  // change by DVN

                        itemsWidth = (innerWidth - settings.margin*(itemsVisible-1)) / itemsVisible;

                        childSet.width(itemsWidth);

                        if (settings.clone) {

                            object.css({

                                'left' : -itemsWidth -2*settings.margin

                            });

                        }else {

                            //*

                            object.css({

                                'left' : -settings.margin

                            });

                            //*/

                            /*

                            object.css({

                                'right' : settings.margin

                            });

                            */

                        }

                    }



                    if(settings.vertical){

                        var halfArrowWidth = (topArrow.width()) / 2;

                        var arrowMargin = (innerWidth / 2) - halfArrowWidth;

                        topArrow.css("left", arrowMargin + "px");

                        bottomArrow.css("left", arrowMargin + "px");

                    }else {

                        var halfArrowHeight = (leftArrow.height()) / 2;

                        var arrowMargin = (innerHeight / 2) - halfArrowHeight;

                        leftArrow.css("top", arrowMargin + "px");

                        rightArrow.css("top", arrowMargin + "px");                  

                    }



                });

                $(leftArrow).on("click", function(event) {

                    methods.scrollLeft();

                });

                $(rightArrow).on("click", function(event) {

                    methods.scrollRight();

                });

                

                $(topArrow).on("click", function(event) {

                    methods.scrollTop();

                });

                $(bottomArrow).on("click", function(event) {

                    methods.scrollBottom();

                });

                

                if (settings.pauseOnHover == true) {

                    $(".nbs-flexisel-item").on({

                        mouseenter : function() {

                            canNavigate = false;

                        },

                        mouseleave : function() {

                            canNavigate = true;

                        }

                    });

                }

                if (settings.autoPlay == true) {



                    setInterval(function() {

                        if (canNavigate == true){

                            if(settings.vertical){

                                if(settings.scroll == 'top') methods.scrollTop();

                                else methods.scrollBottom();                        

                            }else {

                                if(settings.scroll == 'right') methods.scrollRight();

                                else methods.scrollLeft();                          

                            }

                        }

                    }, settings.autoPlaySpeed);

                }



            },

            /******************************

            Set Responsive Events

            Set breakpoints depending on responsiveBreakpoints

            *******************************/            

            

            setResponsiveEvents: function() {

                var contentWidth = $('html').width();

                

                if(settings.enableResponsiveBreakpoints) {

                    

                    if(responsivePoints.length) var largestCustom = responsivePoints[responsivePoints.length-1].changePoint; // sorted array 

                    

                    for(var i in responsivePoints) {

                        

                        if(contentWidth >= largestCustom) { // set to default if width greater than largest custom responsiveBreakpoint 

                            itemsVisible = settings.visibleItems;

                            break;

                        }

                        else { // determine custom responsiveBreakpoint to use

                        

                            if(contentWidth < responsivePoints[i].changePoint) {

                                itemsVisible = responsivePoints[i].visibleItems;

                                break;

                            }

                            else

                                continue;

                        }

                    }

                }

            },



            /******************************

            Set Responsive Events

            Set breakpoints depending on responsiveBreakpoints

            *******************************/            

            

            setResponsiveEventsVertical: function() {

                var contentHeight = $('html').height();

                

                if(settings.enableResponsiveBreakpoints) {

    

                    if(responsivePoints.length) var largestCustom = responsivePoints[responsivePoints.length-1].changePoint; // sorted array          

                    for(var i in responsivePoints) {

                        

                        if(contentHeight >= largestCustom) { // set to default if width greater than largest custom responsiveBreakpoint 

                            itemsVisible = settings.visibleItems;

                            break;

                        }

                        else { // determine custom responsiveBreakpoint to use

                        

                            if(contentHeight < responsivePoints[i].changePoint) {

                                itemsVisible = responsivePoints[i].visibleItems;

                                break;

                            }

                            else

                                continue;

                        }

                    }

                }

            },

            

            /******************************

            Sort Responsive Object

            Gets all the settings in resposiveBreakpoints and sorts them into an array

            *******************************/            

            

            sortResponsiveObject: function(obj) {

                

                var responsiveObjects = [];

                

                for(var i in obj) {

                    responsiveObjects.push(obj[i]);

                }

                

                responsiveObjects.sort(function(a, b) {

                    return a.changePoint - b.changePoint;

                });

            

                responsivePoints = responsiveObjects;

            },

            

            /******************************

            Scroll Left

            *******************************/

            scrollLeft : function() {

                // if(childSet.length <= itemsVisible) return;

                if (object.position().left < -settings.margin) {

                    if (canNavigate == true) {

                        canNavigate = false;

                        var listParent = object.parent();

                        var innerWidth = listParent.width();

                        itemsWidth = (innerWidth - settings.margin* (itemsVisible-1)) / itemsVisible + settings.margin;

                        var childSet = object.children();

                            if(!settings.clone){

                            itemsMoveSlide = settings.moveSlide; // reset moveSlide   

                            if(itemsMoveSlide > firstActive) itemsMoveSlide = firstActive;

                            if(itemsMoveSlide > itemsVisible) itemsMoveSlide = itemsVisible;

                            firstActive -=  itemsMoveSlide;

                        }

                        object.animate({

                            'left' : "+=" + itemsWidth*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {

                                if (settings.clone) {

                                    childSet.slice(-itemsMoveSlide).insertBefore(

                                            childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                   

                                }

                                methods.adjustScroll();

                                canNavigate = true;

                                canNavigateLeft = true;

                            }

                        });

                    }

                }else {

                    // note: not effect

                    /*

                    var childSet = object.children();

                    childSet.last().insertBefore(

                    childSet.first().hide()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                   

                    methods.adjustScroll();

                    */

                }

            },

            /******************************

            Scroll Right

            *******************************/            

            scrollRight : function() {

                var childSet = object.children();

                if(!settings.clone){

                    itemsMoveSlide = settings.moveSlide; // reset moveSlide   

                    if(childSet.length <= itemsVisible) return;

                    var elcanNext = childSet.length - firstActive - itemsVisible;

                    if(itemsMoveSlide > elcanNext) itemsMoveSlide = elcanNext;

                    if(itemsMoveSlide > itemsVisible) itemsMoveSlide = itemsVisible;

                    firstActive +=  itemsMoveSlide;

                }

                var listParent = object.parent();

                var innerWidth = listParent.width();

                itemsWidth = (innerWidth - settings.margin* (itemsVisible-1)) / itemsVisible + settings.margin;

                var difObject = (itemsWidth - innerWidth);

                var objPosition = (object.position().left + ((totalItems-itemsVisible)*itemsWidth)-innerWidth);    

                if((difObject <= Math.ceil(objPosition)) && (!settings.clone)){

                    if (canNavigate == true) {

                        canNavigate = false;                    

                        object.animate({

                            'left' : "-=" + itemsWidth*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {                                

                                methods.adjustScroll();

                                canNavigate = true;

                            }

                        });

                    }

                } else if(settings.clone){

                    if (canNavigate == true) {

                        canNavigate = false;

                        object.animate({

                            'left' : "-=" + itemsWidth*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {                                

                                    childSet.slice(0, itemsMoveSlide).insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                

                                methods.adjustScroll();

                                canNavigate = true;

                            }

                        });

                    }

                }else {

                    if (canNavigateLeft == true) {

                        canNavigateLeft = false;    

                        object.animate({

                            'left' : "-=" + itemsWidth*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {

                                // childSet.slice(0, itemsMoveSlide).insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)

                                methods.adjustScroll();

                                canNavigateLeft = false;

                            }

                        });

                    }               

                };          

            },

            /******************************

            Adjust Scroll 

             *******************************/

            adjustScroll : function() {

                var listParent = object.parent();

                var childSet = object.children();

                if(settings.vertical){

                    var innerHeight = $(listParent).parent().parent().height();

                    itemsHeight = (innerHeight - settings.margin*(settings.visibleItems-1)) / settings.visibleItems;

                    childSet.height(itemsHeight);

                    if (settings.clone) {

                        object.css({

                            'top' : -(itemsHeight + settings.margin)*itemsMoveSlide - settings.margin

                        });

                    }

                }else {

                    var innerWidth = listParent.width();

                    itemsWidth = (innerWidth - settings.margin*(itemsVisible-1)) / itemsVisible;

                    childSet.width(itemsWidth);

                    if (settings.clone) {

                        object.css({

                            'left' : -(itemsWidth + settings.margin)*itemsMoveSlide - settings.margin

                        });

                    }

                }

            },

            

            /******************************

            Scroll Top Add by DVN

            *******************************/

            scrollTop : function() {

                if (object.position().top < -settings.margin) {

                    if (canNavigate == true) {

                        canNavigate = false;



                        var listParent = object.parent();

                        var innerHeight = $(listParent).parent().parent().height();



                        itemsHeight = (innerHeight - settings.margin*(settings.visibleItems-1)) / settings.visibleItems + settings.margin;



                        var childSet = object.children();



                        object.animate({

                            'top' : "+=" + ( itemsHeight )*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {

                                if (settings.clone) {

                                    childSet.slice(-itemsMoveSlide).insertBefore(

                                            childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                   

                                }

                                methods.adjustScroll();

                                canNavigate = true;

                            }

                        });

                    }

                }

            },

            /******************************

            Scroll Bottom Add by DVN

            *******************************/            

            scrollBottom : function() {

                var listParent = object.parent();

                var innerHeight = $(listParent).parent().parent().height();

                itemsHeight = (innerHeight - settings.margin*(settings.visibleItems-1)) / settings.visibleItems + settings.margin;

                var difObject = (itemsHeight - innerHeight);

                var objPosition = (object.position().top + ((totalItems-settings.visibleItems)*itemsHeight)-innerHeight);    

                

                if((difObject <= Math.ceil(objPosition)) && (!settings.clone)){

                    if (canNavigate == true) {

                        canNavigate = false;                    

                        object.animate({

                            'top' : "-=" + ( itemsHeight )*itemsMoveSlide

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {                                

                                methods.adjustScroll();

                                canNavigate = true;

                            }

                        });

                    }

                } else if(settings.clone){

                    if (canNavigate == true) {

                        canNavigate = false;

    

                        var childSet = object.children();

    

                        object.animate({

                            'top' : "-=" + itemsHeight

                        }, {

                            queue : false,

                            duration : settings.animationSpeed,

                            easing : "linear",

                            complete : function() {                                

                                    childSet.slice(0, itemsMoveSlide).insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                

                                methods.adjustScroll();

                                canNavigate = true;

                            }

                        });

                    }

                };                

            }

            

        };

        if (methods[options]) { // $("#element").pluginName('methodName', 'arg1', 'arg2');

            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof options === 'object' || !options) { // $("#element").pluginName({ option: 1, option:2 });

            return methods.init.apply(this);

        } else {

            $.error('Method "' + method + '" does not exist in flexisel plugin!');

        }

    };

})(jQuery);

