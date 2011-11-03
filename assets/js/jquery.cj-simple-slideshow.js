/*globals jQuery */
/*
 * CJ Simple Slideshow jQuery Plugin
 *
 * Copyright (c) 2011 Creative Juices Bo. Co.
 * Written by: Doug Jones (www.cjboco.com)
 * Licensed under the MIT.
 *
 * A Simple Cross-Fade Slideshow Plug-In for JQuery
 *
 * 1.0 - initial release
 *
 * Version History
 * --------------------------------------------------------------------------------
 * 3.1 (11-02-2011)
 *		Rewrote the plug-in (again).
 *		Fixed bad parameters calls (mixed o and sys).
 *		Removed "resume" call. Seemed redundant.
 * 3.0 (01-08-2011)
 *		Complete rewrite of the plugin structure.
 *		Added better link detection.
 *		Using jQuery to handle dissolves now (Dissolve amount
 *		is now tied in directly with fadeIn/fadeOut).
 *		Added pause options.
 * 2.1.1 (06-27-2009)
 *		Fixed the IE bugs.
 * 2.1 (06-24-2009)
 *		Stripped out a lot of the style features.
 *		It really didn't make sense to do it here, since it
 *		could be done easily with CSS. Plus is was causing
 *		issues with IE.
 * 2.0 (06-14-2009)
 *		Converted it to a JQuery plug-in.
 * 1.0 (10-02-2006)
 *		Initial release.
 *
 */
(function ($) {
	"use strict";

	$.cjSimpleSlideShow = function ($obj, settings) {

		var o = {
				// user defined options
				autoRun: true,
				delay: 5000,
				dissolve: 500,
				showCaptions: false,
				centerImage: false,
				allowPause: false,
				pauseText: 'Paused'
			},

			_set = function () {
				// sets the slide and handles dissolves
				var sys = $obj.data('system'),
					$show = $obj.find('.cj_slideshow_slide'),
					$slide = $show.eq(sys.current),
					$slideNext = $show.eq(sys.current + 1).length > 0 ? $show.eq(sys.current + 1) : $show.eq(0);
				$slide.stop().fadeOut(o.dissolve);
				$slideNext.stop().fadeIn(o.dissolve, function () {
					sys.current = $show.eq(sys.current + 1).length > 0 ? sys.current + 1 : 0;
					if (!sys.paused) {
						sys.timer = window.setTimeout(function () {
							_set();
						}, o.delay);
					}
					$obj.data('system', sys);
				});
			},

			_pause = function () {
				// pauses the slideshow
				var sys = $obj.data('system');
				if (sys.timer) {
					window.clearTimeout(sys.timer);
					sys.timer = null;
				}
				$obj.find('.cj_slideshow_pause').stop().fadeIn('fast');
				sys.paused = true;
				$obj.data('system', sys);
			},

			_start = function () {
				// starts our slideshow
				var sys = $obj.data('system');
				$obj.find('.cj_slideshow_pause').stop().fadeOut('fast');
				sys.timer = window.setTimeout(function () {
					_set();
				}, o.delay);
				sys.paused = false;
				$obj.data('system', sys);
			};

		// initializes our slideshow
		function init() {
			var sys = $obj.data('system'),
				$wrap, $pause;

			// do a check of the slide count, slideshows of 1 not worth it!
			if ($obj.find('img').length > 1) {

				$wrap = $('<div>').css({
					'position': 'relative',
					'display': 'block',
					'width': $obj.width() + 'px',
					'height': $obj.height() + 'px',
					'overflow': 'hidden',
					'cursor': 'pointer'
				}).addClass('cj_slideshow_wrapper');

				// find all the IMG tags (plus A tags)
				$obj.find('img').each(function (a, b) {
					var $img = $(b),
						$slide = $('<div>').css({
							'position': 'absolute',
							'top': '0px',
							'left': '0px',
							'display': a > 0 ? 'none' : 'block',
							'width': $obj.width() + 'px',
							'height': $obj.height() + 'px'
						}).addClass('cj_slideshow_slide'),
						$caption, url;

					// handle any links wrapping out image
					if ($img.parent().get(0).nodeName === 'A') {
						url = $img.parent().attr('href');
						$slide.bind('click', function () {
							document.location.href = url;
							return false;
						});
					}

					// set up pause?
					if (o.allowPause) {
						$slide.bind('mouseenter', function () {
							_pause();
						}).bind('mouseleave', function () {
							_start();
						});
					}

					// center our image?
					if (o.centerImage) {
						$img.css({
							'position': 'absolute',
							'top': o.centerImage ? parseInt(($obj.height() - $img.height()) / 2, 10) + 'px' : '0px',
							'left': o.centerImage ? parseInt(($obj.width() - $img.width()) / 2, 10) + 'px' : '0px'
						});
					}

					// apppend the image to our slide
					$slide.append($img);

					// do we need to show captions?
					if (o.showCaptions && $img.attr('alt').length > 0) {
						$caption = $('<span>').css({
							'position': 'absolute',
							'display': 'none',
							'width': '100%',
							'height': 'auto',
							'z-index': '5'
						}).addClass('cj_slideshow_caption').html($img.attr('alt'));
						$slide.append($caption);
					}

					// add the slide to the wrapper
					$wrap.append($slide);
				});

				// prepare the elemnt to show the slides
				$obj.html('').append($wrap);

				// do we need to add the pause?
				if (o.allowPause && o.pauseText.length > 0) {
					$pause = $('<div>').css({
						'position': 'absolute',
						'top': '5px',
						'left': '5px',
						'display': 'none',
						'z-index': '10'
					}).addClass('cj_slideshow_pause').html(o.pauseText);
					$obj.append($pause);
				}

				// save our system data
				sys.inited = true;

				return true;

			} else {

				return false;

			}
		}


		if (settings && typeof settings === 'object') {

			// extend our options and store locally
			o = $.extend(o, settings);
			$obj.data('options', o);
			$obj.data('system', {
				// function parameters
				version: '3.1',
				timer: null,
				current: 0,
				paused: false,
				inited: false
			});

			// init/autostart
			if (init() && o.autoRun) {
				_start();
			}

		} else if (settings && typeof settings === 'string') {

			// pull our settings
			o = $obj.data('options');

			// method call
			if (o) {
				switch (settings) {
				case 'start':
					_start();
					break;
				case 'pause':
					_pause();
					break;
				default:
					break;
				}
			}
		}

	};

	$.fn.extend({

		cjSimpleSlideShow: function (settings) {

			// call to the plug-in
			return this.each(function () {

				$.cjSimpleSlideShow($(this), settings);

			});

		}
	});

}(jQuery));