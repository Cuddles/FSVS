
/*!
* 	@plugin 	FSVS - Full Screen Vertical Scroller
* 	@version 	2.0.0
* 	@home 		https://github.com/lukesnowden/FSVS
*
* 	Copyright 2014 Luke Snowden
* 	Released under the MIT license:
* 	http://www.opensource.org/licenses/mit-license.php
*/

;( function( $, w, d ){

	/**
	 * [fsvs extend the jQuery core to allow a public call to our plugin]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */

	$.fn.fsvs = function( _options ) {

		/**
		 * [options override our default settings with the developer settings]
		 * @type {[type]}
		 */

		var options = $.extend({
			speed 				: 500,
	        mouseSwipeDisance 	: 40,
	        mouseWheelDelay 	: false,
	        mouseDragEvents 	: true,
	        touchEvents 		: true,
	        arrowKeyEvents 		: true,
	        pagination 			: true,
	        nthClasses 			: 5,
	        detectHash 			: true
		}, _options );

		/**
		 * [fsvs description]
		 * @param  {[type]} _this [description]
		 * @param  {[type]} _i    [description]
		 * @return {[type]}       [description]
		 */

		var fsvs = function( _this, _i ) {

			/**
			 * [windowScrollTop description]
			 * @type {Number}
			 */

			var windowScrollTop = 0;

			/**
			 * [isCustomeScrollHandelerActive description]
			 * @type {Boolean}
			 */

			var isCustomScrollHandelerActive = false;

			/**
			 * [handelerInterval description]
			 * @type {[type]}
			 */

			var handelerInterval = null;

			/**
			 * [height description]
			 * @type {Number}
			 */

			var height = 0;

			/**
			 * [handelerStart description]
			 * @type {[type]}
			 */

			var handelerStart = false;

			/**
			 * [animated description]
			 * @type {Boolean}
			 */

			var animated = false;

			/**
			 * [jqElmOffset description]
			 * @type {Object}
			 */

			var jqElmOffset = {};

			/**
			 * [currentSlideIndex description]
			 * @type {Number}
			 */

			var currentSlideIndex = 0;

			/**
			 * [isYoungAndHip - you know I'm not talking about Internet Explorer]
			 * @return {Boolean} [description]
			 */

			var isYoungAndHip = function() {
				prefixes = ['Webkit','Moz','ms','O'];
			   	for( var i in prefixes ) {
			   		if( typeof document.getElementsByTagName( 'body' )[0].style[prefixes[i] + 'Transform' ] !== 'undefined' ) {
			   			return true;
			   		}
			   	}
			    return false;
			};

			/**
			 * [jqElm the FSVS jQuery object]
			 * @type {[type]}
			 */

			var jqElm = null;

			/**
			 * [isHijacked check if we are currently being hijacked]
			 * @return {Boolean} [description]
			 */

			var isHijacked = function() {
				return $('html').hasClass( 'hijacked' );
			};

			/**
			 * [canSlideUp from our position, can we slide up?]
			 * @return {[type]} [description]
			 */

			var canSlideUp = function() {
				return ( currentSlideIndex + 1 ) !== $( '> div > div', jqElm ).length;
			};

			/**
			 * [canSlideDown from our position, can we slide down?]
			 * @return {[type]} [description]
			 */

			var canSlideDown = function() {
				return currentSlideIndex !== 0;
			};

			/**
			 * [slideUp slide up mother trucker!]
			 * @return {[type]} [description]
			 */

			var slideUp = function() {
				if( canSlideUp() ) {
					slideToIndex( currentSlideIndex + 1 );
				}
			};

			/**
			 * [slideDown your going down!]
			 * @return {[type]} [description]
			 */

			var slideDown = function() {
				if( canSlideDown() ) {
					slideToIndex( currentSlideIndex - 1 );
				}
			};

			/**
			 * [slideToIndex go to slide, minus the 1]
			 * @return {[type]} [description]
			 */

			var slideToIndex = function( index ) {
				if( isYoungAndHip() ) {
					cssSlide( index );
				} else {
					animateSlide( index );
				}
			};

			/**
			 * [afterSlide ok, I've slid... what next]
			 * @return {[type]} [description]
			 */

			var afterSlide = function( index ) {
				bindScrollingEvent();
			};

			/**
			 * [beforeSlide description]
			 * @return {[type]} [description]
			 */

			var beforeSlide = function( index ) {

			};

			/**
			 * [isFirstSlide Cant he go instead? I don't want to go first!]
			 * @return {Boolean} [description]
			 */

			var isFirstSlide = function() {
				return currentSlideIndex === 0;
			};

			/**
			 * [isLastSlide last but not least... or is it?]
			 * @return {Boolean} [description]
			 */

			var isLastSlide = function() {
				return currentSlideIndex === ( $( '> div > div', jqElm ).length - 1 );
			};

			/**
			 * [hijackScreen description]
			 * @return {[type]} [description]
			 */

			var hijackScreen = function() {
				$("html, body").scrollTop( jqElmOffset.top );
				$('html').addClass( 'hijacked' );
			};

			/**
			 * [unjackScreen description]
			 * @return {[type]}           [description]
			 */
			var unjackScreen = function() {
				$('html').removeClass( 'hijacked' );
			};

			/**
			 * [scrollingDown description]
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 */

			var scrollingDown = function( e ) {
				return ! scrollingUp( e );
			};

			/**
			 * [scrollingUp description]
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 */

			var scrollingUp = function( e ) {
				return e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0;
			};

			/**
			 * [isChrome description]
			 * @reference http://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
			 * @return {Boolean} [description]
			 */

			var isChrome = function() {
				var isChromium = window.chrome,
				    vendorName = window.navigator.vendor;
				if( isChromium !== null && vendorName === "Google Inc." ) {
				   return true;
				}
				return false;
			};

			/**
			 * [nthClasses description]
			 * @param  {[type]} nthClassLimit [description]
			 * @return {[type]}               [description]
			 */

			var nthClasses = function( nthClassLimit ) {
				$( '> div > div', jqElm ).each( function( i ) {
					var nthClass = 'nth-class-' + ((i%options.nthClasses)+1);
					if( ! $(this).hasClass( nthClass ) ) $(this).addClass( nthClass );
				});
			};

			/**
			 * [enteredViewPortFromAbove description]
			 * @return {[type]} [description]
			 */

			var enteredViewPortFromAbove = function(e){
				if( ! isHijacked() ) {
					if( scrollingDown(e) && windowScrollTop == jqElmOffset.top ) {
						return true;
					}
				}
				return false;
			};

			/**
			 * [enteredViewPortFromBelow description]
			 * @return {[type]} [description]
			 */

			var enteredViewPortFromBelow = function(e) {
				if( ! isHijacked() ) {
					if( scrollingUp(e) && windowScrollTop == jqElmOffset.top ) {
						return true;
					}
				}
				return false;
			};

			/**
			 * [customScrollHandeler description]
			 * @param  {[type]}   e        [description]
			 * @param  {Function} callback [description]
			 * @return {[type]}            [description]
			 */

			var customScrollHandeler = function( e, callback ) {
				isCustomScrollHandelerActive = true;
				handelerInterval = setInterval( function(){
					if( ( Date.now() - handelerStart ) > 100 ) {
						isCustomScrollHandelerActive = false;
						clearInterval( handelerInterval );
					} else {
						callback(e);
					}
				}, 10 );
			}

			/**
			 * [mouseWheelHandler description]
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 */

			var mouseWheelHandler = function(e) {
				window.wheelEvent = e;
				handelerStart = Date.now();
				if( ! isCustomScrollHandelerActive ) {
					customScrollHandeler( false, function(){

						//@todo: only donw this for chrome while getting the rest working, then I'll sort the other browsers out

						var wheely = Number( ( Math.abs( window.wheelEvent.originalEvent.wheelDelta ) / 50 ).toFixed(0) );
						windowScrollTop = $(window).scrollTop();
						jqElmOffset = jqElm.offset();

						if( isHijacked() && ! animated && isFirstSlide() && wheely > 1 && ! scrollingDown( window.wheelEvent ) ) {
							window.wheelEvent.preventDefault();
							unjackScreen();
						} else if( isHijacked() && ! animated && isLastSlide() && wheely > 1 && scrollingDown( window.wheelEvent ) ) {
							window.wheelEvent.preventDefault();
							unjackScreen();
						} else if( isFirstSlide() && enteredViewPortFromAbove( window.wheelEvent ) ) {
							hijackScreen();
						} else if( isLastSlide() && enteredViewPortFromBelow( window.wheelEvent ) ) {
							hijackScreen();
						} else if( isHijacked() && ! animated && wheely > 1 ) {
							if( scrollingDown( window.wheelEvent ) ) {
								slideUp();
							} else {
								slideDown();
							}
						}
					});
				}
			};

			/**
			 * [bindScrollingEvent description]
			 * @return {[type]} [description]
			 */

			var bindScrollingEvent = function() {
				$(w).bind( 'wheel mousewheel DOMMouseScroll MozMousePixelScroll', mouseWheelHandler );
			};

			/**
			 * [unbindScrollingEvent description]
			 * @return {[type]} [description]
			 */

			var unbindScrollingEvent = function() {
				$(w).unbind( 'wheel mousewheel DOMMouseScroll MozMousePixelScroll', mouseWheelHandler );
			};

			/**
			 * [bindKeyArrows description]
			 * @return {[type]} [description]
			 */

			var bindKeyArrows = function() {
				w.onkeydown = function(e) {
					e = e || w.event;
				    if ( e.keyCode == '38' ) slideUp();
				    else if ( e.keyCode == '40' ) slideDown();
				};
			};

			/**
			 * [setDimentions description]
			 */

			var setDimentions = function() {
				var width = $(w).width();
				height = $(w).height();
				jqElm.width( width ).height( height );
				$( '> div > div', jqElm ).width( width ).height( height );
			};

			/**
			 * [setSpeed description]
			 * @param {[type]} _speed [description]
			 */

			var setSpeed = function( _speed ) {
				speed = _speed/1000;
				$( '> div', jqElm ).css({
					'-webkit-transition': 'all ' + speed + 's',
					'-moz-transition'	: 'all ' + speed + 's',
					'-o-transition'		: 'all ' + speed + 's',
					'transition'		: 'all ' + speed + 's'
				});
			};

			/**
			 * [cssSlide description]
			 * @param  {[type]} index [description]
			 * @return {[type]}       [description]
			 */

			var cssSlide = function( index ) {
				if( animated ) return;
				animated = true;
				beforeSlide( index );
				$( '> div', jqElm ).css({
					'-webkit-transform' : 'translate3d(0, -' + (index*height) + 'px, 0)',
					'-moz-transform' : 'translate3d(0, -' + (index*height) + 'px, 0)',
					'-ms-transform' : 'translate3d(0, -' + (index*height) + 'px, 0)',
					'transform' : 'translate3d(0, -' + (index*height) + 'px, 0)'
				});
				bodyTimeout = setTimeout( function(){
					animated = false;
					currentSlideIndex = index;
					afterSlide( index );
				}, options.speed );
			}

			/**
			 * [animateSlide description]
			 * @param  {[type]} index [description]
			 * @return {[type]}       [description]
			 */

			var animateSlide = function( index ) {
				if( animated ) return;
				animated = true;
				$( '> div', jqElm ).animate({
					top : '-' + (index*height) + 'px'
				}, options.speed, function() {
					animated = false;
					currentSlideIndex = index;
					afterSlide( index );
				});
			};

			/**
			 * [app play with me!]
			 * @type {Object}
			 */

			var app = function(){

				/**
				 * [slideUp how am I sliding up? as is?]
				 * @return {[type]} [description]
				 */

				this.slideUp = function() {
					slideUp();
				};

				/**
				 * [slideDown how am I sliding down? as is?]
				 * @return {[type]} [description]
				 */

				this.slideDown = function() {
					slideDown();
				};

				/**
				 * [slideTo description]
				 * @return {[type]} [description]
				 */

				this.slideTo = function( number ) {
					slideToIndex( number-1 );
				},

				/**
				 * [slideToIndex description]
				 * @return {[type]} [description]
				 */

				this.slideToIndex = function( index ) {
					slideToIndex( index );
				}

			};

			/**
			 * [init description]
			 * @param  {[type]} elm   [description]
			 * @param  {[type]} index [description]
			 * @return {[type]}       [description]
			 */

			var init = function( elm, index ) {

				jqElm = $( elm );

				setDimentions();
				bindScrollingEvent();
				setSpeed( options.speed );
				if( options.nthClasses ) nthClasses();
				if( options.arrowKeyEvents ) bindKeyArrows();
				jqElm.data( 'fsvs', new app() );
				$(w).resize( setDimentions );

			};

			init( _this, _i );

		};

		/**
		 * [description]
		 * @param  {[type]} i [description]
		 * @return {[type]}   [description]
		 */

		return this.each( function ( i ) {
			new fsvs( this, i  );
		});

	};

})( jQuery, window, document );