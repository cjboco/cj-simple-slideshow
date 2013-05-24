/*globals window,document,jQuery */
/*
 * CJ Simple Slideshow jQuery Plugin
 *
 * Copyright (c) 2011 Creative Juices Bo. Co.
 * Written by: Doug Jones (www.cjboco.com)
 * Licensed under the MIT.
 *
 * A Simple Cross-Fade Slideshow Plug-In for JQuery
 *
 * Version History
 * --------------------------------------------------------------------------------
 * 3.2    (05-24-2013)
 *        Updated plug-in structure.
 *		  Minor issue with cursor showing link, even when it wasn't a link.
 *        Replaced all $.bind() with $.on().
 * 3.1   (11-02-2011)
 *		  Rewrote the plug-in (again).
 *		  Fixed bad parameters calls (mixed o and sys).
 *		  Removed "resume" call. Seemed redundant.
 * 3.0   (01-08-2011)
 *		  Complete rewrite of the plugin structure.
 *		  Added better link detection.
 *		  Using jQuery to handle dissolves now (Dissolve amount
 *		  is now tied in directly with fadeIn/fadeOut).
 *		  Added pause options.
 * 2.1.1 (06-27-2009)
 *		  Fixed the IE bugs.
 * 2.1   (06-24-2009)
 *		  Stripped out a lot of the style features.
 *		  It really didn't make sense to do it here, since it
 *		  could be done easily with CSS. Plus is was causing
 *		  issues with IE.
 * 2.0   (06-14-2009)
 *		  Converted it to a JQuery plug-in.
 * 1.0   (10-02-2006)
 *		  Initial release.
 *
 */ (function ($) {
	"use strict";

	$.fn.extend({

		cjSimpleSlideShow: function (settings) {

			var options = $.extend({
				autoRun: true,
				delay: 5000,
				dissolve: 500,
				showCaptions: false,
				centerImage: false,
				allowPause: false,
				pauseText: "Paused"
			}, settings),
				sys = {
					version: '3.0',
					timer: null,
					current: 0,
					paused: false
				};

			function setSlide($obj) {
				var o = options,
					$show = $obj.find(".cj_slideshow_slide"),
					$slide = $show.eq(sys.current),
					$slideNext = $show.eq(sys.current + 1).length > 0 ? $show.eq(sys.current + 1) : $show.eq(0);
				$slide.stop().fadeOut(o.dissolve);
				$slideNext.stop().fadeIn(o.dissolve, function () {
					sys.current = $show.eq(sys.current + 1).length > 0 ? sys.current + 1 : 0;
					if (!sys.paused) {
						sys.timer = window.setTimeout(function () {
							setSlide($obj);
						}, o.delay);
					}
				});
			}

			function pause($obj) {
				if (sys.timer) {
					window.clearTimeout(sys.timer);
					sys.timer = null;
				}
				$obj.find(".cj_slideshow_pause_wrapper").stop().fadeIn("fast");
				sys.paused = true;
			}

			function resume($obj) {
				var o = options;
				$obj.find(".cj_slideshow_pause_wrapper").stop().fadeOut("fast");
				sys.timer = window.setTimeout(function () {
					setSlide($obj);
				}, o.delay);
				sys.paused = false;
			}

			function start($obj) {
				var o = options;
				sys.timer = window.setTimeout(function () {
					setSlide($obj);
				}, o.delay);
			}

			function init($obj) {
				if ($obj.find("img").length > 1) {
					var o = options,
						$wrap = $("<div>").css({
							"position": "absolute",
							"display": "block",
							"width": $obj.width() + "px",
							"height": $obj.height() + "px",
							"overflow": "hidden"
						}).addClass("cj_slideshow_wrapper"),
						$span, $div;
					$obj.find("img").each(function (a) {
						var $this = $(this),
							$slide = $('<div>').css({
								"position": "absolute",
								"top": "0px",
								"left": "0px",
								"display": a > 0 ? "none" : "block",
								"width": $obj.width() + "px",
								"height": $obj.height() + "px"
							}).addClass("cj_slideshow_slide"),
							href;
						if ($this.parent().get(0).nodeName === "A") {
							href = $this.parent().attr("href");
							$slide.on("click", function () {
								document.location.href = href;
								return false;
							}).css({
								"cursor": "pointer"
							});
						}
						if (o.allowPause) {
							$slide.on("mouseenter", function () {
								pause($obj);
							}).on("mouseleave", function () {
								resume($obj);
							});
						}
						if (o.centerImage) {
							$this.css({
								"position": "absolute",
								"top": o.centerImage ? parseInt(($obj.height() - $this.height()) / 2, 10) + "px" : "0px",
								"left": o.centerImage ? parseInt(($obj.width() - $this.width()) / 2, 10) + "px" : "0px"
							});
						}
						$slide.append($this);
						if (o.showCaptions && $this.attr("alt").length > 0) {
							$span = $("<span>").css({
								"position": "absolute",
								"display": "none",
								"width": "100%",
								"height": "auto",
								"z-index": "5"
							}).addClass("cj_slideshow_caption").html($this.attr("alt"));
							$slide.append($span);
						}
						$wrap.append($slide);
					});
					$obj.html("").append($wrap);
					if (o.allowPause && o.pauseText.length > 0) {
						$div = $("<div>").css({
							"position": "absolute",
							"top": "5px",
							"left": "5px",
							"display": "none",
							"z-index": "10"
						}).addClass("cj_slideshow_pause_wrapper").html(o.pauseText);
						$obj.append($div);
					}
					return true;
				} else {
					return false;
				}
			}


			// call to the plug-in
			return this.each(function () {
				var o = options,
					$this = $(this);
				if (o.dissolve > o.delay) {
					o.dissolve = o.delay;
				}
				if (init($this) && o.autoRun) {
					start($this);
				}
			});

		}
	});

}(jQuery));