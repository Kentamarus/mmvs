$(function(){    
    Browser.init();
    Site.init();     
});

$(window).scroll(function() {
	var obj = $("nav");
	($(this).scrollTop()> 50) ? obj.addClass("fix") : obj.removeClass("fix");
	
//	var a = "active";
//	var li = $(".nav li").removeClass(a);
//	li.filter("[data-start]").addClass(a);
	
});

$(window).load(function() {
	if (location.hash.length> 0)
		{
			var target_top= $(location.hash).offset().top;
			$('html, body').animate({scrollTop:target_top}, 'slow');
		}
});

jQuery.fn.hoverItem = function(options) {
    var clazz = { 
		item:"active-hover", 
		item_prev:"prev",
		item_next:"next",
		list : $.extend({}, options)
	}	
    $(this).hover(function(){            
        var item = $(this);
		
        сlear();
		var index = item.index();
        item.addClass(clazz.item);
        item.prev().addClass(clazz.item_prev);
        item.next().addClass(clazz.item_next);
		clazz.list.collect.each(function(){
			var t = $(this);
			var current = t.find("li").eq(index);
			current.addClass(clazz.item);
			current.prev().addClass(clazz.item_prev);
			current.next().addClass(clazz.item_next);
		});
    }, function(){
        var item = $(this);
        сlear(); 
    });
    
    function сlear()
    {
        clazz.list.collect.find("li").removeClass(clazz.item).removeClass(clazz.item_prev).removeClass(clazz.item_next);
    }
};


var Site = new function () {		
	this.sliderOrganization = function(){
		var show_count = 5;
        if ($("body").width() > 1024) { show_count = 5; } 
        else if ($("body").width() > 768)  { show_count = 3;}
        else if ($("body").width() > 639)  { show_count = 2;}
        else show_count = 1;
        
		  $('.aboutCompany .slider').slick(
			{
				dots: false,
				infinite: true,
				speed: 300,
				slidesToShow: show_count				
			});
	 },
	this.broadcast = function(){
		$(".broadcast li").hoverItem({
			collect: $(".broadcast ul")
		});		
	},
	this.ourServices = function(){
		var clazz = "active";
		var item = $(".our-services .item-col");
		item.hover(function() {
            var t = $(this).find(".image img");
            t.attr("src", t.data("hover"));
        }, function() {
            var t = $(this);
			if (t.hasClass(clazz)) return;
			t = t.find(".image img");
            t.attr("src", t.data("load"));
		});
		 
		 var _ = item.filter("."+clazz);
		 if (_.length>0)
			 {
				var t = _.find(".image img");
				t.attr("src", t.data("hover"));
			 }
	},
    this.init = function(){		
        this.sliderOrganization();
		this.broadcast();
		this.ourServices();
		
		$("a[data-rel='m_PageScroll2id']").mPageScroll2id({
            scrollSpeed: 500,
            offset: 100
        });
		
        $(".navbar-toggle").bind("click", function(e){
            e.preventDefault();
            var obj = $(this).closest(".container").find("#navbar");
            var visible = ["0px", "330px"];
            if (!obj.hasClass("in"))
                {
                    obj.addClass("collapse in").animate({height:visible[1]},500);
                } else obj.animate({height:visible[0]},500, function(){ $(this).removeClass("in")});

            return false;
        }); 
        
		$(".nav li a").bind("click", function(){
			var t = $(this);
			var a = "active";
			t.closest(".nav").find("li").removeClass(a);
			t.parent().addClass(a);
			
			if ($("body").hasClass("mobile")){
				var sub = t.parent().find(".submenu");
				  if  (sub.length>0){ 
				  	sub.show();
					return;
				  }
				  sub.hide();
				
				  var obj = $("#navbar");
				  var visible = ["0px", "330px"];
				  obj.animate({height:visible[0]},500, function(){ obj.removeClass("in")});
			}
		});
		
        //smooth scroll to top
//        $(".cd-top").on('click', function(event){
//            event.preventDefault();
//            $('body,html').animate({
//                scrollTop: 0 ,
//                }, 700
//            );
//        });    
        
	 	$('input[type=tel]').mask("+7(999) 999-9999");
               
     	$(".call-back-form").each(function() {
            var it = $(this);
            it.validate({
                rules: {
                    name: {
                        required: true
                    },
                    phone: {
                        required: true
                    },
                    email: {
                        required: true
                    }
                },
                messages: {},
                errorPlacement: function(error, element) {},
                submitHandler: function(form) {
                    var thisForm = $(form);
                    
                    thisForm.find("input[type=tel]").removeClass("focus");
                    thisForm.find(".mask").removeClass("active");
                    										
                    $.ajax({
                        type: "POST",
                        url: "back-end/main.php",
                        data: thisForm.serialize()
                    }).done(function() {
                        
                        $(this).find("input").val("");                                           
                        
                        if (thisForm.find("[type='submit']").data("successful") != undefined) {
                            thisForm.parent().animate({height: 0}, 500, function() {$(".thanks").show();});
                        } else  $('#callForm').modal({show: 'true'}).find(".call-answer").addClass("small-window");

                        setTimeout(function() {
                            $('.modal').modal('hide');
                            $.magnificPopup.close();
                        }, 3000);                    
                        $(".call-back-form").trigger("reset");
                    });
                    return false;
                },
                success: function() {},
                highlight: function(t, errorClass) {
                    $(t).addClass('error'); 
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).removeClass('error');                    
                }
            })
        });
        
	 	$('.call').magnificPopup({
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 200,
            callbacks: {
                beforeOpen: function() {
                   this.st.mainClass = this.st.el.attr('data-effect');
                }
              },
              midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.            
        });  
        
    };
};


var Browser = new function() {
    var data = {
        $b: null,
        is: {
            mobile: false,
            Andorid: false,
            iPod: false,
            iPad: false
        }
    }
    this.getData = function() {
        return data;
    };
    this.init = function() {
        var t = this;
        data.$b = $("body");
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("ipad") > 0) {
            data.$b.addClass("iPad");
            data.is.iPad = true;
        } else if (ua.indexOf("android") > 0) {
            data.$b.addClass("Android");            
            data.is.Andorid = true;
        } else if (ua.indexOf("ipod") > 0) {
            data.$b.addClass("iPod");            
            data.is.iPod = true;
        } else if (ua.indexOf("iphone") > 0) data.$b.addClass("iPhone");
        if (ua.indexOf('firefox') > 0) {
            data.$b.addClass("Firefox");
        }
        if (data.is.mobile) t.orientation();
        if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
            data.$b.addClass("Safari");
        }
        if (ua.indexOf('MSIE 8.') > 0) {
            data.$b.addClass("ie8");
        }
        if (ua.indexOf('MSIE 9.') > 0) {
            data.$b.addClass("ie9");
        }
        if (ua.indexOf(' OPR/') > 0) {
            data.$b.addClass("Opera");
        }
        if (ua.indexOf('MSIE 10.') > 0) {
            data.$b.addClass("ie10");
        } else if ((ua.indexOf('Trident') > 0) && (navigator.userAgent.indexOf('rv:11.') > 0)) data.$b.addClass("ie11");
        
        
        if (this.isIPhone() || this.isAndroid())
            {
                data.$b.addClass("mobile");
            }                        
        
        this.viewPort();
    };
    this.isIpad = function() {
        var ua = navigator.userAgent.toLowerCase();
        data.$b = $("body");
        if (ua.indexOf("ipad") > 0) data.$b.addClass("iPad");
        return (data.$b.hasClass("iPad"));
    };
    this.isIPhone = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("iphone") > 0) data.$b.addClass("iPhone");
        return (data.$b.hasClass("iPhone"));
    };
    this.isAndroid = function() {
        return (data.$b.hasClass("Android"));
    };
    this.orientation = function() {
        var or = ["orX", "orY"];
        var c = [data.$b.innerHeight(), data.$b.innerWidth()]
        if (c[0] > c[1]) {
            data.$b.removeClass(or[0]);
            data.$b.addClass(or[1]);
        } else {
            data.$b.removeClass(or[1]);
            data.$b.addClass(or[0]);
        }
    };
    this.viewPort = function() {
        var def = document.querySelector("meta[name=viewport]");
        var view = "<meta name='viewport' content='width=399'>";
        if (def != null) {            
            if (this.isIpad()) { 
                def.remove();
                view = '<meta name="viewport" content="maximum-scale=1.0, initial-scale=1.0, user-scalable=0">';
            } 
//            else 
//                if (this.isIPhone())
//                    {
//                        def.remove();
//                        view = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">';
//                    }
        };     
        jQuery('head').append(view);
    }
}