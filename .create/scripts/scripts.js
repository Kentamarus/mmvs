$(function(){    
    Browser.init();
    Site.init();     
});

var Site = new function () {
//	 this.parseUrl = function() {
//        switch (location.hash) {
//        case "#callAnswer":
//            $.magnificPopup.open({
//                items: {
//                    src: "#callAnswer"
//                },
//                type: "inline"
//            }, 0)
//        }
//    },
	 this.sliderOrganization = function(){
		var show_count = 5;
        if ($("body").width() > 1024) { show_count = 5; } 
        else if ($("body").width() > 768)  { show_count = 3;}
        else if ($("body").width() > 639)  { show_count = 2;}
        else show_count = 1;
        
//        $('.multiple-items').slick({
//            infinite: true,
//            dots: false,
//            slidesToShow: show_count,
//            slidesToScroll: show_count,
//        }); 
		  $('.multiple-items').slick(
			{
				dots: false,
				infinite: true,
				speed: 300,
				slidesToShow: show_count				
			});
	 },
    this.init = function(){
		this.parseUrl();
        this.sliderOrganization();
        $(".navbar-toggle").bind("click", function(e){
            e.preventDefault();
            var obj = $(this).closest(".container").find("#navbar");
            var visible = ["52px", "295px"];
            if (!obj.hasClass("in"))
                {
                    obj.addClass("collapse in").animate({height:visible[1]},500);
                } else obj.animate({height:visible[0]},500, function(){ $(this).removeClass("in")});

            return false;
        }); 
        
        //smooth scroll to top
        $(".cd-top").on('click', function(event){
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0 ,
                }, 700
            );
        });    
        
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
                    
                    $(this).find("input").val("");
                    var value = [{
                        old: '.people',
                        id: "people"
                    }, {
                        old: '.phone',
                        id: "phone"
                    }, {
                        old: '.email',
                        id: "email"
                    }];
                    var temp = null;
                    for (i = 0; i < 3; i++) {
                        temp = thisForm.find(value[i].old);
                        if (temp != undefined) {
                            var newForm = thisForm.find(value[i].old).attr("id", value[i].id).attr("name", value[i].id);
                            thisForm.find(value[i].old).html(newForm);
                        }
                    }    
                    
                    thisForm.find("input[type='tel']").val("+375 " + thisForm.find("input[type='tel']").val());                    
                    var str = thisForm.serialize();
                    thisForm.find("input").val("");                                      
					    					
                    $.ajax({
                        type: "POST",
                        url: "back-end/main.php",
                        data: str
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
    this.data = {};    
    this.getData = function() {
        return this.data;
    };
    this.init = function() {
        var t = this;
        var data = this.data;
        
        data.$b = $("body");
        data.navigator = navigator.userAgent.toLowerCase();
        data.clazz = {
            mobile : "mobile"
        };
        data.list = [
            {  tool:'ipad', clazz:'iPad'},
            {  tool:'android', clazz:'android'},
            {  tool:'ipod', clazz:'iPod'},
            {  tool:'iphone', clazz:'iPhone'},
            {  tool:'firefox', clazz:'firefox'},            
            {  tool:'msie 8.', clazz:'ie8'},
            {  tool:'msie 9.', clazz:'ie9'},
            {  tool:'msie 10.', clazz:'ie10'},
            {  tool:' opr/', clazz:'opera'}            
            ];
        
        for (i =0; i< data.list.length; i++)
            {
                if (data.navigator.indexOf(data.list[i].tool) > 0) 
                {
                    data.$b.addClass(data.list[i].clazz);
                    
                    if (data.list[i].tool=='android' || data.list[i].tool == 'iphone') 
                    {
                        t.orientation();
                        data.$b.addClass(data.clazz.mobile);
                    }
                }
            }                
        
        if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && !this.isIpad()) {
            data.$b.addClass("safari");
        } 
        else if ((data.navigator.indexOf('Trident') > 0) && (data.navigator.indexOf('rv:11.') > 0)) data.$b.addClass("ie11");                             
                
        this.viewPort();
    };
    this.isIpad = function() { return this.check(this.data.list[0]); };
    this.isAndroid = function() { return this.check(this.data.list[1]); };
    this.isIpod = function() { return this.check(this.data.list[2]); };
    this.isIphone = function() { return this.check(this.data.list[3]); };
    
    this.check = function(pos)
    {
        if (this.data.navigator.indexOf(pos.tool) > 0) this.data.$b.addClass(pos.clazz);
        return (this.data.$b.hasClass(pos.clazz));
    };        
    this.orientation = function() {
        var or = ["orX", "orY"];
        var data = this.data;
        var c = [data.$b.innerHeight(), data.$b.innerWidth()];
        (c[0] > c[1]) ? data.$b.removeClass(or[0]) : data.$b.removeClass(or[1]);
        (c[0] > c[1]) ? data.$b.addClass(or[1]) : data.$b.addClass(or[0]);            
    };
    this.viewPort = function() {
        var def = document.querySelector("meta[name=viewport]");
        var view = '<meta name="viewport" content="width=980">';
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