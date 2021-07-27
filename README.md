# CJ Simple Slideshow 3.1
## A Simple Cross-Fade Slideshow Plug-In for JQuery

Copyright (c) 2011 Creative Juices Bo. Co.
Written by: Doug Jones (www.cjboco.com)
Licensed under the MIT.

View [online demo](http://cjboco.github.io/cj-simple-slideshow/).

Activating the slideshow is pretty much the same a previous versions, you need to call
the plug-in by placing a load wrapper in your code, like so...

```
$("#MySlideShow").cjSimpleSlideShow();
...or, place on onload in your body tag, like so:
```

<body onload="$('#MySlideShow').cjSimpleSlideShow();">
But this method is so un-jquery like, don't you think? If you want to pass some options, you might do something like this:

```
$("#MySlideShow").cjSimpleSlideShow({
    autoRun: false,
    delay: 6000, // miliseconds
    dissolve: 300 // miliseconds
});
// delay the slideshow and then start it later...
$("#MySlideShow").cjSimpleSlideShow("start");
```


### User Options

You have a few options that you can pass to the plug-in. These change basic functionality and are listed below:

Argument       |Description                                                        |Default|
---------------|-------------------------------------------------------------------|--------
autoRun         |Determines if the slideshow starts automatically. If you set this to false, then you will need to start the slideshow by calling `$("#MySlideShow").start();` |true |
delay           |The delay in miliseconds between slide transitions.                |5000
dissolve        |The amount of time in miliseconds that it takes to do the transition between slides. |500
showCaptions    |Determines wether or not to display the slide captions. If set to true, the plug-in will use the value of the images ALT tag for the slide caption. |true
centerImage     |If you have variable sized images, then you can use this option to center the image withing you slideshow box.               |false
allowPause      |If the user mouse's over the slideshow, this option will pause the dissolves until the user's mouse leaves the container.      |false
pauseText      | If allowPause is true, then you can supply text to display while the slideshow is paused. You may also pass, HTML, but this hasn't been thoroughly tested.|"Paused"

### Methods

You have a few methods that you can use with the plug-in. These effect operational functionality and are listed below:

Method |Description                                                      |Example Usage                                  |
------ | --------------------------------------------------------------- | ----------------------------------------------| 
start  |Starts the slideshow if you passed the option "autoStart: false".|`$("#MySlideShow").cjSimpleSlideShow("start");`|
pause  |Initiates a pause in the slideshow.                              |`$("#MySlideShow").cjSimpleSlideShow("pause");`|



### Classes

You have a few classes that you can use with the plug-in. These effect style of variouls elements and are listed below:

Class                  |Description|
-----------------------|-----------------------------------------------------------------------------------|
cj_slideshow_wrapper   | This block wraps the entire slideshow. You should be able to play around with borders, background and margins, but it has not been thoroughly tested.|
cj_slideshow_slide     | This block wraps each slide. It's primarily used to "dissolve" each slide as well as set the overall position. I wouldn't recomend playing around with it, but it's listed here for your coding enjoyment.|
cj_slideshow_caption   | If your image has a "ALT" attribute with text, then the plug-in will use this block to hold the text. You should be able to style everything about this block with no worries about conflicting with the functionality. Initially it is set to with a position to the upper, left hand corner (5px away).|
cj_slideshow_pause     | If you have the allowPause set to true and have supplied some text in the pauseText, then this block will hold your text. You should be able to style everything about this block with no worries about conflicting with the functionality. Initially the text is set to Paused.|

# 