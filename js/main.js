$(document).ready(function() {
    var sizeScreenTablet = 975,
        sizeScreenMobile = 755,
        w_window = $(window).width(),
        h_height = $(window).height(),
        header = $('header'),
        btn_contact = $('.btn_contact'),
        loading = $('.loading'),
        circle = $('.loading .circle');

    if (typeof asset == "undefined" || asset == null) {
        window.asset = window.location.href;
    }

    const calcWinsize = () => winsize = { width: $(window).width(), height: $(window).height() };
    calcWinsize();

    // detect 

    function isMobile() {
        var mdDetect = new MobileDetect(window.navigator.userAgent);
        if (mdDetect.phone() !== null) {
            return true;
        } else {
            return false;
        }
    }
    isMobile();

    function isTablet() {
        var mdDetect = new MobileDetect(window.navigator.userAgent);
        if (mdDetect.tablet() !== null) {
            return true;
        } else {
            return false;
        }
    }
    isTablet();

    function isDesktop() {
        var mdDetect = new MobileDetect(window.navigator.userAgent);
        if (mdDetect.mobile() == null && mdDetect.phone() == null && mdDetect.tablet() == null) {
            return true;
        }
    }
    isDesktop();
    
    function setScrollbar(){
        if(isMobile() == false){
            Scrollbar.initAll();
        }else{
            Scrollbar.destroyAll()
        }
    }
    setScrollbar();
    // slider js
    var body = $('body'),
        footer = $('footer'),
        name = $('.name'),
        contact = $('.contact'),
        contact_text = $('.contact .contact__info div'),
        section = $('section'),
        sc_current = $('section.current'),
        sc_current_index = $('section.current').index(),
        slider_wrap = $('.slider'),
        text_wrap = $('.textbottom'),

        intro = $('.info'),
        intro_text = $('.info .info__intro'),

        slide = $('.slide', slider_wrap),
        slide_img_wrap = $('.slide .slide__img', slider_wrap),
        slide_img = $('.slide .slide__img img', slider_wrap),

        slide_title = $('.slide .slide__title div', slider_wrap),
        slide_title_small = $('.slide__title-small .char', text_wrap),
        slide_title_small_number = $('.text__number', text_wrap),
        slide_title_small_top = $('.text__info-top', text_wrap),
        slide_title_small_bottom = $('.text__info-bottom', text_wrap),

        slide_current = $('.slide--current', slider_wrap),
        slide_current_bg = slide_current.attr('data-background'),
        slide_img_current = $('.slide--current .slide__img img', slider_wrap),
        slide_title_small_current = $('.slide__title-small.t--active .char', text_wrap),

        overlay = $('.overlay', slider_wrap),
        flag = true,
        flag_loading = false,
        splittext = false,
        slide_easing = Power3.easeInOut,
        text_easing_in = Back.easeOut.config(0),
        text_easing_out = Back.easeIn.config(0),
        timescale = 1,
        timescale_reverse = 1.4,

        tlLoading = new TimelineMax({ onComplete: function() { flag_loading = true } }),
        tlIntro = new TimelineMax({delay: 1.5, onComplete: function() { flag = true } }),
        tlSlide = new TimelineMax({ onComplete: function() { flag = true } }),
        tlIntroSlide = new TimelineMax({ onComplete: function() { flag = true } }),
        tlContact = new TimelineMax({paused: true});

    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded($('img'), resolve);
        });
    };

    function setBGOverlay() {
        slide.each(function(index) {
            var bg = $(this).attr('data-background');
            $(this).find('.overlay').css({
                'background': bg
            })
        })
    }

    function splitText(element, type = null) {
        var mySplitText = new SplitText(element, {
                type: (type == null) ? "lines,words,chars" : type,
                charsClass: "char",
                wordsClass: "word",
            }),
            myCharsSplitText = mySplitText.chars;

        intro_text_word = $('.info .info__intro .word');
        intro_text_char = $('.info .info__intro .char');

        contact_text_word = $('.contact .contact__info .word');
        contact_text_char_icon = $('.contact .textbottom .text__icon img');
        contact_text_char_small = $('.contact .textbottom .char');

        slide_title_current = $('.slide--current .slide__title .char', slider_wrap);
        slide_title_small = $('.slide__title-small .char', text_wrap);
        slide_title_small_current = $('.slide__title-small.t--active .char', text_wrap);

        splittext = true;
    }

    function animationIntro(direction) {
        if (direction == 'in') {
            y_from = '90%';
            y_to = '0%';
            autoalpha_from = 0;
            autoalpha_to = 1;
            timescale = 1;
        } else {
            y_from = '0%';
            y_to = '-90%';
            autoalpha_from = 1;
            autoalpha_to = 0;
            timescale = timescale_reverse;
        }
        if (flag_loading == true) {
            tlIntro.staggerFromTo(intro_text_word, 1.2, { y: y_from, autoAlpha: autoalpha_from, ease: slide_easing }, { y: y_to, autoAlpha: autoalpha_to, ease: slide_easing }, 0.04);
            tlIntro.timeScale(timescale).play();
        }
    }


    var canvas_contact = document.getElementById("canvas_contact");
    var ctx = canvas_contact.getContext("2d");
    var piTwo = Math.PI * 2;
    var vw, vh;
    var dpr = window.devicePixelRatio || 1;
    onResize();

    var covering = false;
    var isActive = false;

    // window.addEventListener("resize", onResize);

    function createRipple(event) {
        if (isActive) return;
        isActive = true;
        covering = !covering;

        var x = event.clientX;
        var y = event.clientY;

        var dx = x < vw / 2 ? vw - x : x;
        var dy = y < vh / 2 ? vh - y : y;

        var radius = Math.sqrt(dx * dx + dy * dy);
        var alpha = covering ? 0 : 1;

        var ripple = {
            alpha: alpha,
            radius: 0,
            x: x,
            y: y
        };

        TweenMax.to(ripple, 0.85, {
            alpha: 1,
            radius: radius,
            ease: Power4.easeIn,
            onUpdate: drawRipple,
            onComplete: setInactive,
            callbackScope: ripple,
        });
    }

    function drawRipple() {
        ctx.clearRect(0, 0, vw, vh);
        ctx.globalCompositeOperation = "source-over";
        if (!covering) {
            ctx.beginPath();
            ctx.rect(0, 0, vw, vh);
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fill();
            ctx.globalCompositeOperation = "destination-out";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, piTwo, false);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
    }

    function setInactive() {
        isActive = false;
    }

    function onResize() {
        vw = window.innerWidth;
        vh = window.innerHeight;
        canvas_contact.width  = vw * dpr;
        canvas_contact.height = vh * dpr;
        TweenMax.set(canvas_contact, { width: vw, height: vh});
        ctx.scale(dpr, dpr);
    }

    function animationContact() {
        tlContact.staggerFromTo(contact_text_word, 0.8, { y: '100%',autoAlpha: 0, ease: slide_easing }, { y: '0%',autoAlpha: 1, ease: slide_easing }, 0.04, '-=0.3')
            .fromTo(contact_text_char_icon, 0.5, { y: '100%', autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, '-=0.4')
            .staggerFromTo(contact_text_char_small, 0.5, { y: '100%', autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, 0.02, '-=0.9');
        
        tlContact.reverse();
    }
       
    function animationSlide(slide_prev, slide_active, direction) {
        if (direction == 'up') {
            y_from = '-110%';
            y_to = '110%';
            y_title_from = '-30%';
            y_title_to = '30%';
            scale_from = 0.8;
        } else {
            y_from = '110%';
            y_to = '-110%';
            y_title_from = '30%';
            y_title_to = '-30%';
            scale_from = 1.2;
        }
        var slide_prev_index = slide_prev.index(),
            slide_next_index = slide_active.index(),
            overlay_prev = $('.overlay', slide_prev),
            slide_title_prev = $('.slide__title .char', slide_prev),
            slide_title_small_prev = $('.slide__title-small.tsmall-' + slide_prev_index + ' .char'),
            slide_img_prev = $('.slide__img img', slide_prev),

            slide_active_bg = slide_active.attr('data-background'),

            overlay_active = $('.overlay', slide_active),
            slide_img_wrap_active = $('.slide__img', slide_active),
            slide_img_active = $('.slide__img img', slide_active),
            slide_title_active = $('.slide__title .char', slide_active),
            slide_title_small_active = $('.slide__title-small.tsmall-' + slide_next_index + ' .char');

        tlSlide.fromTo(overlay_prev, 3, { y: y_from, ease: slide_easing }, { y: y_to, ease: slide_easing })
            .fromTo(slide_img_prev, 1.5, { y: '0%', ease: slide_easing }, { y: y_to, ease: slide_easing }, '-=2.2')
            .staggerFromTo(slide_title_prev, 0.8, { y: '0%', autoAlpha: 1, ease: text_easing_out }, { y: y_title_to, autoAlpha: 0, ease: text_easing_out }, 0.05, '-=2.4')
            .staggerFromTo(slide_title_small_prev, 0.5, { y: '0%', autoAlpha: 1, ease: text_easing_out }, { y: y_to, autoAlpha: 0, ease: text_easing_out }, 0.02, '-=2.4')
            .to(body, 0.8, { backgroundColor: slide_active_bg }, '-=0.6')
            .fromTo(overlay_active, 3, { y: y_from, scale: scale_from, ease: slide_easing }, { y: y_to, scale: 1, ease: slide_easing }, '-=1.8')
            .fromTo(slide_img_active, 1.5, { y: y_from, ease: slide_easing }, { y: '0%', ease: slide_easing }, '-=2')
            .fromTo(slide_img_active, 1.5, { scale: scale_from }, { scale: 1 }, '-=1.2')
            .staggerFromTo(slide_title_active, 0.8, { y: y_title_from, autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, 0.05, '-=0.8')
            .staggerFromTo(slide_title_small_active, 0.5, { y: y_from, autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, 0.02, '-=2')
        tlSlide.timeScale(2).play();
    }

    function activeSlideFirst(slide_active) {
        flag = false;
        var slide_next_index = slide_active.index(),
            slide_active_bg = slide_active.attr('data-background'),
            y_from = '110%',
            y_to = '-110%',
            y_title_from = '30%';
            y_title_to = '-30%';
            scale_from = 1.1,

            slide_title_small_prev = $('.tsmall-intro .char'),
            overlay_active = $('.overlay', slide_active),
            slide_img_wrap_active = $('.slide__img', slide_active),
            slide_img_active = $('.slide__img img', slide_active),
            slide_title_active = $('.slide__title .char', slide_active),
            slide_title_small_active = $('.slide__title-small.tsmall-' + slide_next_index).find('.char');

        tlIntroSlide.to(body, 1, { backgroundColor: slide_active_bg })
            .staggerFromTo(slide_title_small_prev, 0.5, { y: '0%', autoAlpha: 1, ease: text_easing_out }, { y: y_to, autoAlpha: 0, ease: text_easing_out }, 0.02, '-=0.8')
            .fromTo(overlay_active, 3, { y: y_from, scale: scale_from, ease: slide_easing }, { y: y_to, scale: 1, ease: slide_easing }, '-=1.8')
            .fromTo(slide_img_active, 1.5, { y: y_from, ease: slide_easing }, { y: '0%', ease: slide_easing }, '-=2.4')
            .fromTo(slide_img_active, 1.5, { scale: scale_from }, { scale: 1 }, '-=1.2')
            .staggerFromTo(slide_title_active, 1.5, { y: y_title_from, autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, 0.1, '-=1.2')
            .staggerFromTo(slide_title_small_active, 0.5, { y: y_title_from, autoAlpha: 0, ease: text_easing_in }, { y: '0%', autoAlpha: 1, ease: text_easing_in }, 0.02, '-=2')
        tlIntroSlide.timeScale(2).play();
    }

    function activeSlide(_this, direction) {
        flag = false;
        slide_prev = $('.slide--current');
        if (direction == 'up') {
            if (_this.index() != 0) {
                console.log('up');
                _this.prev().addClass('slide--current').siblings().removeClass('slide--current');
            } else {
                slide.last().addClass('slide--current').siblings().removeClass('slide--current');
            }
        } else {
            if (_this.index() <= _this.siblings().size() - 1) {
                console.log('down');
                _this.next().addClass('slide--current').siblings().removeClass('slide--current');
            } else {
                slide.first().addClass('slide--current').siblings().removeClass('slide--current');
            }
        }
        slide_active = $('.slide--current');
        animationSlide(slide_prev, slide_active, direction);
    }

    
    function handleUp(slide_active) {
        if (sc_current_index == 0) {
            
            return;
        } else {
            if (!tlSlide.isActive()) {
                activeSlide(slide_active, 'up');
            }
        }
    }

    function handleDown(slide_active) {
        if (sc_current_index == 0) {
            if (!tlIntro.isActive()) {
                animationIntro(direction = 'out');
                setTimeout(function() {
                    section.removeClass('current');
                    slider_wrap.addClass('current');
                    activeSlideFirst(slide_active);
                    sc_current_index = $('section.current').index();
                }, 1600)
            }
        } else {
            if (!tlSlide.isActive()) {
                activeSlide(slide_active, 'down');
            }
        }
    }

    function scrollSlide(event) {
        var slide_active = $('.slide.slide--current', slider_wrap);
        if (flag == true && !contact.hasClass('active')) {
            if(event.originalEvent.wheelDelta >= 0) {
                handleUp(slide_active);
            }else{
                handleDown(slide_active);
            }
        } else { return }
    }

    btn_contact.click(function(e) {
        e.stopPropagation();
        if(!tlContact.isActive()){
            $(this).toggleClass('active');
            contact.toggleClass('active');
            if(slide.hasClass('slide--show')){
                console.log('btn_close_gallery');
                setTimeout(() => {
                    btn_close_gallery.toggleClass('active');
                },400)
            }
            if(tlContact.reversed()){
                createRipple(e);
                TweenMax.delayedCall(0.6, function() {
                    tlContact.timeScale(timescale).restart();
                    header.addClass('white');
                });
            }else{
                tlContact.timeScale(timescale_reverse).reverse();
                TweenMax.delayedCall(0.2, function() {
                    createRipple(e);
                });
                TweenMax.delayedCall(0.8, function() {
                    header.removeClass('white');
                });
            }
        }
    });
    
    $(window).on('mousewheel', function (event) {
        var slide_active = $('.slide.slide--current');
        var slide_gallery = $(".slide__gallery",slide_active);
        if(slide_active.hasClass('slide--show')){
            slide_gallery.trigger('scroll');
        }else{
            scrollSlide(event);
        }
    });
    

    var btn_close_gallery = $('.btn_close_gallery');
    $('.show-gallery').on('click', function(e) {
        e.preventDefault();
        var slide_active = $('.slide.slide--current');
        slide_active.toggleClass('slide--show');
        btn_close_gallery.toggleClass('active');
        preloadImages().then(() => {
            setPaddingImgGallery(slide_active);
        });
    });

    btn_close_gallery.on('click', function(e) {
        e.preventDefault();
        var slide_active = $('.slide.slide--current');
        slide_active.removeClass('slide--show');
        btn_close_gallery.removeClass('active');
    }); 


    function setPaddingImgGallery(slide_active){
        let img_gallery = $('.slide__gallery img',slide_active);
        let img_length = img_gallery.length;
        img_gallery.eq(Math.round(img_length/2)).addClass('padding_top');
    }

    // swipe js
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    let distance = 50;

    const gestureZone = document.getElementById('gestureZone');

    gestureZone.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    gestureZone.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        var slide_active = $('.slide.slide--current', slider_wrap);
        var slide_gallery = $(".slide__gallery",slide_active);
        if (touchendX <= touchstartX - distance) {
            //Swiped left
        }
        if (touchendX >= touchstartX + distance) {
            //Swiped right
        }
        if (touchendY <= touchstartY - distance) {
            //Swiped up
            if(slide_active.hasClass('slide--show')){
                slide_gallery.trigger('scroll');
            }else{
                handleDown(slide_active);
            }
        }
        if (touchendY >= touchstartY + distance) {
            //Swiped down
            if(slide_active.hasClass('slide--show')){
                slide_gallery.trigger('scroll');
            }else{
                handleUp(slide_active);
            }
        }
        if (touchendY === touchstartY) {
            //tap
        }
    }
    

    ////////////CUSTOM CUSOR POINTER MOUSE////////////////////////////////////
    var cursor = $(".cursor"),

        cursor_top_default = $(window).height()/2,
        cursor_left_default = $(window).width()/2,

        ease_cursor = 0.2;

    TweenMax.set(cursor, {top: cursor_top_default, left: cursor_left_default });
    
    var pos = {x:cursor_left_default, y:cursor_top_default},
        mouse = { x: cursor_left_default, y: cursor_top_default },
        page = { x: cursor_left_default, y: cursor_top_default };
   
    function updateCursor(){
        pos.x += (mouse.x - pos.x) * ease_cursor;
        pos.y += (mouse.y - pos.y) * ease_cursor;
        TweenMax.set(cursor, {
            left: pos.x  - cursor.width() / 2,
            top: pos.y - cursor.height() / 2
        });
    }

    $(document).on("mousemove", function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        page.x = e.pageX;
        page.y = e.pageY;
    });
    
    TweenMax.ticker.addEventListener('tick', updateCursor);
    TweenMax.ticker.fps(100);

    $('.link').on("mouseenter", function() {
        cursor.addClass("link-hovered");
    });
    $(".link").on("mouseleave", function() {
        cursor.removeClass("link-hovered");
    });

    $('.link-small').hover(function() {
        cursor.addClass("link-small");
    }, function() {
       cursor.removeClass("link-small");
    });
    $('.link-large').hover(function() {
        cursor.addClass("link-large");
    }, function() {
       cursor.removeClass("link-large");
    });
    
    $('.link-more').hover(function() {
        cursor.addClass("link-more");
        if($(this).hasClass('link-plus')){
            cursor.addClass("link-plus");
        }
    }, function() {
        cursor.removeClass("link-more");
        if($(this).hasClass('link-plus')){
            cursor.removeClass("link-plus");
        }
    });
    
    $('.link-drag').hover(function() {
        cursor.addClass("link-drag");
    }, function() {
        cursor.removeClass("link-drag");
    });
    

    function setCursorHide(){
        if(isMobile() == false && isTablet() == false){
            cursor.removeClass('hide');
        }else{
            cursor.addClass('hide');
        }
    }
    setCursorHide();

    // animation scroll/swipe text
    var tlScrollText = new TimelineMax({repeat: -1});
    var textscroll = $('footer .textaction span');
    function setTextAction(){
        if(isDesktop() == true){
            tlScrollText.fromTo(textscroll, 2, {y: '-100%',ease:Linear.easeNone}, {y: '100%',ease:Linear.easeNone});
        }else{
            tlScrollText.fromTo(textscroll, 2, {y: '100%',ease:Linear.easeNone}, {y: '-100%',ease:Linear.easeNone});
        }
    }

    WebFont.load({
        custom: {
            families: ['fmain', 'cb', 'ceb'],
            urls: [asset + 'scss/fonts.css']
        }
    });

    preloadImages().then(() => {
        $('.svg').svgToInline();
    });
    
    function init() {
        splitText(slide_title);
        splitText(slide_title_small_number);
        splitText(slide_title_small_top);
        splitText(slide_title_small_bottom);
        splitText(intro_text, 'lines,words');
        splitText(contact_text);

        TweenMax.set(slide_title_current, { autoAlpha: 1 });
        TweenMax.set(slide_img_current, { y: '0%' });
        TweenMax.set(body, { backgroundColor: '#fff' });
        TweenMax.set(slide_title_small, { y: '-100%', autoAlpha: 0 });
        TweenMax.set(slide_title_small_current, { y: '0%', autoAlpha: 1 });

        setBGOverlay();
        animationIntro(direction = 'in');
        animationContact();

        setTextAction();
    }


    $(window).load(function() {
        circle.removeClass('active');
        tlLoading.to(circle, 1.4, { width: '250vh', height: '250vh', ease: Power4.easeInOut})
                    .to(loading, 1.4, { zIndex: -1 }, '-=1.4');
        init();
    });
    $(window).resize(function() {
        calcWinsize();
        isMobile();
        isTablet();
        isDesktop();
        setScrollbar();
        setCursorHide();
        setTextAction();
        if(!btn_contact.hasClass('active')){
            contact.removeClass('active');
        }
        if (intro.hasClass('current')) {
            location.reload();
        }
    });
})