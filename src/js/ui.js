tenementDoors.ui = {

	init: function(){
		//this.setupHeaderChanges();
		this.setupNavigation();
		this.setupSlidingPanels();
	},

	setupNavigation: function() {
		
		console.log( "setupNavigation!" );

    // $('.menu-trigger').click(function() {
    //   var $body = $('body');
    //   $body.toggleClass('nav-active');
      
    //   // change menu text
    //   $('span.menu-trigger-txt').text(function(i, v){
    //      return v === 'menu' ? 'close' : 'menu'
    //   })

    // });

		// var navTrigger = $('.menu-nav-icon');

		// navTrigger.on('click', function() {
		// 	$(this).toggleClass('active');
		// });

		var $body = $('body');
		var $navBtn = $('.js-nav-btn');

		$navBtn.click(function(){
			$(this).toggleClass("menu-active");
			$body.toggleClass("menu-active");
		});


  },

	setupSlidingPanels: function() {
		
		console.log( "setupSlidingPanels!" );

		//First the variables our app is going to use need to be declared
		//References to DOM elements
		var $window = $(window);
		var $document = $(document);
		var $body = $("body");
		//Only links that starts with #
		var $navButtons = $("nav a").filter("[href^=#]");
		var $navGoPrev = $(".js-go-prev");
		var $navGoNext = $(".js-go-next");
		var $slidesContainer = $(".slides-wrapper");
		var $slides = $(".slide");
		var $currentSlide = $slides.first();

		//Animating flag - is our app animating
		var isAnimating = false;

		//The height of the window
		var pageHeight = $window.innerHeight();

		//Key codes for up and down arrows on keyboard. We'll be using this to navigate change slides using the keyboard
		var keyCodes = {
			UP  : 38,
			DOWN: 40
		}

		//Going to the first slide
		goToSlide($currentSlide);

  	//	Adding event listeners
		$window.on("resize", onResize).resize();
		$window.on("mousewheel DOMMouseScroll", onMouseWheel);
		$document.on("keydown", onKeyDown);
		
		$navButtons.on("click", onNavButtonClick);
		$navGoPrev.on("click", goToPrevSlide);
		$navGoNext.on("click", goToNextSlide);


		/* #TODO bin this */
		// var self  = this;
		// $document.touchwipe({
							
		// min_move_x: 50,            
		// min_move_y: 15,            
		// preventDefaultEvents: true});
		/*
		*   Internal functions
		* */


  	//When a button is clicked - first get the button href, and then slide to the container, if there's such a container
  
		function onNavButtonClick(event) {
			//The clicked button
			var $button = $(this);

			//The slide the button points to
			var $slide = $($button.attr("href"));

			//If the slide exists, we go to it
			if($slide.length) {
				goToSlide($slide);
				event.preventDefault();
			}

		}

		// Getting the pressed key. Only if it's up or down arrow, we go to prev or next slide and prevent default behaviour
		// This way, if there's text input, the user is still able to fill it
		function onKeyDown(event) {

			var PRESSED_KEY = event.keyCode;

			if(PRESSED_KEY == keyCodes.UP) {
				goToPrevSlide();
				event.preventDefault();
			}
			else if(PRESSED_KEY == keyCodes.DOWN) {
				goToNextSlide();
				event.preventDefault();
			}

		}

  	// When user scrolls with the mouse, we have to change slides
		function onMouseWheel(event) {
			//Normalize event wheel delta
			var delta = event.originalEvent.wheelDelta / 30 || -event.originalEvent.detail;

			//If the user scrolled up, it goes to previous slide, otherwise - to next slide
			if(delta < -1) {
				goToNextSlide();
			}
			else if(delta > 1) {
				goToPrevSlide();
			}

		}

  	// If there's a previous slide, slide to it
		function goToPrevSlide() {
			if($currentSlide.prev().length)
			{
				goToSlide($currentSlide.prev());
			}
		}

  	// If there's a next slide, slide to it
		function goToNextSlide(){
			if($currentSlide.next().length)
			{
				goToSlide($currentSlide.next());
			}
		}

		// Actual transition between slides
		function goToSlide($slide) {
			//If the slides are not changing and there's such a slide
			$currentSlide.removeClass('slide-active');
			if(!isAnimating && $slide.length) {
				//setting animating flag to true
				isAnimating = true;
				$currentSlide = $slide;

				//Sliding to current slide
				TweenLite.to($slidesContainer, 1, {scrollTo: {y: pageHeight * $currentSlide.index() }, onComplete: onSlideChangeEnd, onCompleteScope: this});

				//Animating menu items
				TweenLite.to($navButtons.filter(".active"), 0.5, {className: "-=active"});

				TweenLite.to($navButtons.filter("[href=#" + $currentSlide.attr("id") + "]"), 0.5, {className: "+=active"});

				var dataName = $currentSlide.data('name');
				console.log(dataName);

				$body.addClass(dataName);
				
				var classList = $body.attr('class').split(' ');

				$.each(classList, function(id, item) {
					if (item.indexOf('slide-') == 0) $body.removeClass(item);
				});

				$body.addClass(dataName); // zoom-16, zoom-17, zoom-18 etc.
				
				
				$currentSlide.addClass('slide-active');

			}
		}

  /*
  *   Once the sliding is finished, we need to restore "isAnimating" flag.
  *   You can also do other things in this function, such as changing page title
  * */
  function onSlideChangeEnd()
  {
    isAnimating = false;
  }

  /*
  *   When user resize it's browser we need to know the new height, so we can properly align the current slide
  * */
  function onResize(event)
  {

    //This will give us the new height of the window
    var newPageHeight = $window.innerHeight();

    /*
    *   If the new height is different from the old height ( the browser is resized vertically ), the slides are resized
    * */
    if(pageHeight !== newPageHeight)
    {
      pageHeight = newPageHeight;

      //This can be done via CSS only, but fails into some old browsers, so I prefer to set height via JS
      TweenLite.set([$slidesContainer, $slides], {height: pageHeight + "px"});

      //The current slide should be always on the top
      TweenLite.set($slidesContainer, {scrollTo: {y: pageHeight * $currentSlide.index() }});
    }

  }


	}

}