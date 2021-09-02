

//----------------------------------------
!function(){"use strict";/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
function a(b,d){function e(a,b){return function(){return a.apply(b,arguments)}}var f;if(d=d||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=d.touchBoundary||10,this.layer=b,this.tapDelay=d.tapDelay||200,this.tapTimeout=d.tapTimeout||700,!a.notNeeded(b)){for(var g=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],h=this,i=0,j=g.length;j>i;i++)h[g[i]]=e(h[g[i]],h);c&&(b.addEventListener("mouseover",this.onMouse,!0),b.addEventListener("mousedown",this.onMouse,!0),b.addEventListener("mouseup",this.onMouse,!0)),b.addEventListener("click",this.onClick,!0),b.addEventListener("touchstart",this.onTouchStart,!1),b.addEventListener("touchmove",this.onTouchMove,!1),b.addEventListener("touchend",this.onTouchEnd,!1),b.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(b.removeEventListener=function(a,c,d){var e=Node.prototype.removeEventListener;"click"===a?e.call(b,a,c.hijacked||c,d):e.call(b,a,c,d)},b.addEventListener=function(a,c,d){var e=Node.prototype.addEventListener;"click"===a?e.call(b,a,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(b,a,c,d)}),"function"==typeof b.onclick&&(f=b.onclick,b.addEventListener("click",function(a){f(a)},!1),b.onclick=null)}}var b=navigator.userAgent.indexOf("Windows Phone")>=0,c=navigator.userAgent.indexOf("Android")>0&&!b,d=/iP(ad|hone|od)/.test(navigator.userAgent)&&!b,e=d&&/OS 4_\d(_\d)?/.test(navigator.userAgent),f=d&&/OS [6-7]_\d/.test(navigator.userAgent),g=navigator.userAgent.indexOf("BB10")>0;a.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(d&&"file"===a.type||a.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(a.className)},a.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!c;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},a.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},a.prototype.determineEventType=function(a){return c&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},a.prototype.focus=function(a){var b;d&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type&&"month"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},a.prototype.updateScrollParent=function(a){var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},a.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a},a.prototype.onTouchStart=function(a){var b,c,f;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],d){if(f=window.getSelection(),f.rangeCount&&!f.isCollapsed)return!0;if(!e){if(c.identifier&&c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault(),!0},a.prototype.touchHasMoved=function(a){var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},a.prototype.onTouchMove=function(a){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},a.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},a.prototype.onTouchEnd=function(a){var b,g,h,i,j,k=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(a.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,g=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,f&&(j=a.changedTouches[0],k=document.elementFromPoint(j.pageX-window.pageXOffset,j.pageY-window.pageYOffset)||k,k.fastClickScrollParent=this.targetElement.fastClickScrollParent),h=k.tagName.toLowerCase(),"label"===h){if(b=this.findControl(k)){if(this.focus(k),c)return!1;k=b}}else if(this.needsFocus(k))return a.timeStamp-g>100||d&&window.top!==window&&"input"===h?(this.targetElement=null,!1):(this.focus(k),this.sendClick(k,a),d&&"select"===h||(this.targetElement=null,a.preventDefault()),!1);return d&&!e&&(i=k.fastClickScrollParent,i&&i.fastClickLastScrollTop!==i.scrollTop)?!0:(this.needsClick(k)||(a.preventDefault(),this.sendClick(k,a)),!1)},a.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},a.prototype.onMouse=function(a){return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0},a.prototype.onClick=function(a){var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},a.prototype.destroy=function(){var a=this.layer;c&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},a.notNeeded=function(a){var b,d,e,f;if("undefined"==typeof window.ontouchstart)return!0;if(d=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!c)return!0;if(b=document.querySelector("meta[name=viewport]")){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(d>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(g&&(e=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),e[1]>=10&&e[2]>=3&&(b=document.querySelector("meta[name=viewport]")))){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===a.style.msTouchAction||"manipulation"===a.style.touchAction?!0:(f=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],f>=27&&(b=document.querySelector("meta[name=viewport]"),b&&(-1!==b.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))?!0:"none"===a.style.touchAction||"manipulation"===a.style.touchAction?!0:!1)},a.attach=function(b,c){return new a(b,c)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?(module.exports=a.attach,module.exports.FastClick=a):window.FastClick=a}();


//----------------------------------------
function weekpicker() {
    var dateText = 'Please select',
        display = $('#week-start');
    display.text(dateText);

    $('#weekpicker').weekpicker({
        firstDay: 6,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        yearRange: '1957:2012',
        minDate: new Date(1957, 0, 5),
        maxDate: new Date(2012, 3, 27),
        onSelect: function (dateText, startDateText, startDate, endDate, inst) {
            display.text(startDateText);
            generate_url(startDateText);
            populate_top_twenty();
        }
    });

    //generate url hash based on selection
    function generate_url(startDateText) {
        var url = window.location.href,
                separator = (url.indexOf("?") === -1) ? "" : "?",
                newParam = separator + 'date=' + startDateText;
        newUrl = url.replace(newParam, "");
        newUrl = newParam;
        window.location.hash = newUrl;
    };
    $('.ui-datepicker-current-day').click();

    //hack for no date formatting on latest date initially
    /*removeTodayHighlighting();
     $('#weekpicker').on('click', function () {
     if ($('#playlist_generator:hidden')) {
     removeTodayHighlighting();
     };
     });*/
    //can't get working! Datepicker select bug?
    /*$('#weekpicker select').change(function () {
     alert("ayy");
     });
     //actual reformat code
     function removeTodayHighlighting() {
     $('#weekpicker').find(".ui-datepicker-current-day a").removeClass("ui-state-hover ui-state-active");
     $('#weekpicker').find(".ui-datepicker-current-day").removeClass("ui-datepicker-current-day");
     };*/

    function populate_top_twenty() {
        $('#weekpicker .loading-overlay').show();
        //can't query JSON at https://uk-charts-archive.wikia.com/ as prop=extracts not recognised by WikiMedia API
        //have to parse JSON
        //can improve Solar System!! Only need URL-raw as below. Also Wiki URL can be queried with inprop
        var wikiChartAPI_URL_raw = 'https://uk-charts-archive.wikia.com/api.php?action=parse&format=json&page=';
        var chart_parse = $('#week-start').text();
        var wikiChartAPI_URL = wikiChartAPI_URL_raw + 'UK_Singles_%26_Album_Chart_(' + chart_parse + ')&callback=?';
        $.ajax({
            url: wikiChartAPI_URL,
            dataType: 'json',
            success: function (data) {
                //populate data from Wiki API JSON file
                var json_node = $(data.parse.text);
                var output = $((json_node)[0]["*"])[0];
                var table_output = $(output).find('table:first-of-type');
                $("#wikichart").empty().append(table_output);
                //format table further
                $("#wikichart tr").addClass("song-row").wrapInner("<td><table style='width: 100%;'><tr class='song-wrapper'></tr></table></td>");
                //remove unneeded output below top 20
                $("#wikichart tr.song-row:nth-of-type(1n+22)").remove();
                //format different table columns parsed
                if ($("#wikichart tr.song-row:first-of-type th").length == 5) {
                    $("#wikichart tr.song-wrapper").addClass("five-columns");
                } else if ($("#wikichart tr.song-row:first-of-type th").length == 6) {
                    $("#wikichart tr.song-wrapper").addClass("six-columns");
                } else if ($("#wikichart tr.song-row:first-of-type th").length == 7) {
                    $("#wikichart tr.song-wrapper").addClass("seven-columns");
                } else if ($("#wikichart tr.song-row:first-of-type th").length == 10) {
                    $("#wikichart tr.song-wrapper").addClass("five-columns");
                } else if ($("#wikichart tr.song-row:first-of-type th").length == 11) {
                    $("#wikichart tr.song-wrapper").addClass("six-columns");
                } else if ($("#wikichart tr.song-row:first-of-type th").length == 12) {
                    $("#wikichart tr.song-wrapper").addClass("seven-columns");
                };
                //extract artist + song data based on columns
                if ($("#wikichart tr.song-row:first-of-type tr.song-wrapper").hasClass("seven-columns")) {
                    //seven-columns
                    var artist_array = $.makeArray($('#wikichart').find('table td:nth-of-type(6)'));
                    var song_array = $.makeArray($('#wikichart').find('table td:nth-of-type(7)'));
                } else if ($("#wikichart tr.song-row:first-of-type tr.song-wrapper").hasClass("six-columns")) {
                    //six-columns
                    var artist_array = $.makeArray($('#wikichart').find('table td:nth-of-type(5)'));
                    var song_array = $.makeArray($('#wikichart').find('table td:nth-of-type(6)'));
                } else if ($("#wikichart tr.song-row:first-of-type tr.song-wrapper").hasClass("five-columns")) {
                    //five-columns
                    var artist_array = $.makeArray($('#wikichart').find('table td:nth-of-type(4)'));
                    var song_array = $.makeArray($('#wikichart').find('table td:nth-of-type(5)'));
                };

                //remove rest of unneeded output
                $("#wikichart > table~*").remove();
                //format all forward-slashes
                $("#wikichart tr.song-wrapper td").each(function () {
                    if ($(this).text().indexOf('/') > 0) {
                        $(this).text($(this).text().replace(/\//g, ' / '));
                    };
                });

                function arayLooper(token) {
                    //loop through arrays, with promise resolver
                    var promises = [];
                    for (var i = 0; i < 20; i++) {
                        function stringCleanser(string) {
                            return string
                            //need to remove '%' 
                            .replace('%', '')
                            //need to remove ' &' and ' And'; replace with '+'
                            .replace(' &', '+').replace(' And', '+')
                            //need to remove ' Ft', ' ft', ' Ft.', ' ft.' and all following info; replace with '+'                            
                            .split(' Ft')[0].replace(' Ft', '+').split(' ft')[0].replace(' ft', '+').split(' Ft.')[0].replace(' Ft.', '+').split(' ft.')[0].replace(' ft.', '+')
                            //need to remove slashes and all following info; replace with '+'
                            .split(/\//g)[0].replace(/\//g, '+')
                            //need to remove spaces; replace with '+'
                            .replace(/\s+/g, '+')
                            //need to remove words in brackets (); replace with '+'
                            .replace(/ *\([^)]*\) */g, '+');
                        };
                        
                        var artist = stringCleanser($(artist_array[i]).text());                       
                        // console.log(artist);
                        var song = stringCleanser($(song_array[i]).text());
                        // console.log(song);
                        
                        /* find censored-starred single words and curly-braces {} then remove them */
                        /* replace between two +'s */
                        var song_word = song.split("+");
                        for (var j = 0; j < song_word.length; j++) {
                            if (song_word[j].indexOf('*') != -1 || song_word[j].indexOf('{') != -1 || song_word[j].indexOf('}') != -1) {
                                song_word[j] = "";
                            }
                        };
                        song = song_word.join("+");
                        var spotify_url = "https://api.spotify.com/v1/search?q=" + artist + song + "&type=track&market=GB&limit=1";
                        //console.log(spotify_url);
                        //spotify call - wrap in loop-handler for correct order retrieval
                        function loop_handler(loop_number) {
                            //call ajax as variable for promise resolver
                            var request = $.ajax({
                                url: spotify_url,
                                //new! authorization required - use token here
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("Authorization", "Bearer " + token)
                                },
                                dataType: 'json',
                                success: function (data) {
                                    ///get Spotify ID if exists, push into array
                                    //if no song ID create div
                                    if (data.tracks.items[0] === undefined) {
                                        //iframe create
                                        var $no_song = $("<tr class='no-song-wrapper'><td colspan='3'><div><div class='no-song'>No song found on Spotify!</div></div></td></tr>");
                                        $("#wikichart tr.song-row:nth-of-type(" + (loop_number + 2) + ") tr.song-wrapper").after($no_song);
                                    } else if (data.tracks.items[0].hasOwnProperty("id")) {
                                        //attach loading div
                                        var $load_song = $("<tr class='load-wrapper'><td colspan='3'><div>" +
                                        "<div class='load-song'>Loading song...</div>" +    
                                        "</div></td></tr>");
                                        $("#wikichart tr.song-row:nth-of-type(" + (loop_number + 2) + ") tr.song-wrapper").after($load_song);
                                        //query Spotify ID
                                        var id_output = data.tracks.items[0].id;
                                        //console.log(id_output);
                                        //insert Spotify src
                                        var spotifyAPI_SRC = 'https://open.spotify.com/embed?uri=spotify:track:' + id_output;
                                        //console.log(spotifyAPI_SRC);
                                        //iframe create
                                        var $iframe = $("<iframe>", {"src": "", "frameborder": "0", "allowtransparency": "true", "allow": "encrypted-media"});
                                        //attach 'load' before iframe starts loading
                                        $iframe.on('load', function () {
                                            $("#wikichart tr.song-row:nth-of-type(" + (loop_number + 2) + ") tr.load-wrapper td").hide();
                                        });
                                        $iframe.attr("src", spotifyAPI_SRC);
                                        $("#wikichart tr.song-row:nth-of-type(" + (loop_number + 2) + ") tr.song-wrapper").after($iframe);
                                    }
                                }
                            });
                            //push to promise resolver array
                            promises.push(request);
                        }//end loop-handler
                        loop_handler(i);
                    };//end for-loop
                    //when all promises resolved
                    $.when.apply(null, promises).done(function () {
                        $("#wikichart iframe").wrap("<tr class='iframe-wrapper'><td colspan='3'></td></tr>");
                        $('#weekpicker .loading-overlay').hide();
                    });
                };

                //localhost switch
                var hostName = location.hostname;
                var token;
                if (hostName === "localhost") {
                    token = "";
                    arayLooper(token);
                } else {
                    //new! authorization required - wrap in token request post
                    $.ajax({
                        url: 'spotify-connect.php',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        success: function (tokenParsed) {
                            token = tokenParsed;
                            arayLooper(token);
                        }
                    });
                };            
            }
        });
    };
};


//Replace all SVG images with inline SVG
//Not my code! Regularly use this from:
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
function svg_go() {
    $('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });
};


//INITIALISE
$(document).ready(function () {
    weekpicker();
    svg_go();
});

//----------------------------------------
(function($, undefined) {

  $.widget('lugolabs.weekpicker', {
    _weekOptions: {
      showOtherMonths:   true,
      selectOtherMonths: true
    },

    _create: function() {
      var self = this;
      this._dateFormat = this.options.dateFormat || $.datepicker._defaults.dateFormat;
      var date = this._initialDate();
      this._setWeek(date);
      var onSelect = this.options.onSelect;
      this._picker = $(this.element).datepicker($.extend(this.options, this._weekOptions, {
        onSelect: function(dateText, inst) {
          self._select(dateText, inst, onSelect);
        },
        beforeShowDay: function(date) {
          return self._showDay(date);
        },
        onChangeMonthYear: function(year, month, inst) {
          self._selectCurrentWeek();
        }
      }));
      $(document)
        .on('mousemove',  '.ui-datepicker-calendar tr', function() { $(this).find('td a').addClass('ui-state-hover'); })
        .on('mouseleave', '.ui-datepicker-calendar tr', function() { $(this).find('td a').removeClass('ui-state-hover'); });
      this._picker.datepicker('setDate', date);
    },

    _initialDate: function() {
      if (this.options.currentText) {
        return $.datepicker.parseDate(this._dateFormat, this.options.currentText);
      } else {
		if (window.location.hash) {
			//set _initialDate based on URL hash
			var url_hash = window.location.hash.substr(1).replace('date=','').split('/');
			url_date = url_hash[2] + ',' + url_hash[1] + ',' + url_hash[0];
			return new Date(url_date);
		} else {
			//default date
			return new Date(2000, 0, 1);
		};
      }
    },

    _select: function(dateText, inst, onSelect) {
      this._setWeek(this._picker.datepicker('getDate'));
      var startDateText = $.datepicker.formatDate(this._dateFormat, this._startDate, inst.settings);
      this._picker.val(startDateText);
      if (onSelect) onSelect(dateText, startDateText, this._startDate, this._endDate, inst);
    },

    _showDay: function(date) {
      var cssClass = date >= this._startDate && date <= this._endDate ? 'ui-datepicker-current-day' : '';
      return [true, cssClass];
    },

    _setWeek: function(date) {
      var year = date.getFullYear(),
        month = date.getMonth(),
        day   = date.getDate() - date.getDay() - 1;
		if (date.getDay() == 6) {
			//this is saturday do you code here.
    	  	this._startDate = new Date(year, month, day + 7);
	      	this._endDate   = new Date(year, month, day + 13);
		} else {
	    	this._startDate = new Date(year, month, day);
      		this._endDate   = new Date(year, month, day + 6);
		}
    },

    _selectCurrentWeek: function() {
      $('.ui-datepicker-calendar')
        .find('.ui-datepicker-current-day a')
        .addClass('ui-state-active');
    }
  });

})(jQuery);

//----------------------------------------
/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */
window.Modernizr=function(a,b,c){function d(a){t.cssText=a}function e(a,b){return d(x.join(a+";")+(b||""))}function f(a,b){return typeof a===b}function g(a,b){return!!~(""+a).indexOf(b)}function h(a,b){for(var d in a){var e=a[d];if(!g(e,"-")&&t[e]!==c)return"pfx"==b?e:!0}return!1}function i(a,b,d){for(var e in a){var g=b[a[e]];if(g!==c)return d===!1?a[e]:f(g,"function")?g.bind(d||b):g}return!1}function j(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+z.join(d+" ")+d).split(" ");return f(b,"string")||f(b,"undefined")?h(e,b):(e=(a+" "+A.join(d+" ")+d).split(" "),i(e,b,c))}function k(){o.input=function(c){for(var d=0,e=c.length;e>d;d++)E[c[d]]=!!(c[d]in u);return E.list&&(E.list=!(!b.createElement("datalist")||!a.HTMLDataListElement)),E}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),o.inputtypes=function(a){for(var d,e,f,g=0,h=a.length;h>g;g++)u.setAttribute("type",e=a[g]),d="text"!==u.type,d&&(u.value=v,u.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(e)&&u.style.WebkitAppearance!==c?(q.appendChild(u),f=b.defaultView,d=f.getComputedStyle&&"textfield"!==f.getComputedStyle(u,null).WebkitAppearance&&0!==u.offsetHeight,q.removeChild(u)):/^(search|tel)$/.test(e)||(d=/^(url|email)$/.test(e)?u.checkValidity&&u.checkValidity()===!1:u.value!=v)),D[a[g]]=!!d;return D}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var l,m,n="2.8.3",o={},p=!0,q=b.documentElement,r="modernizr",s=b.createElement(r),t=s.style,u=b.createElement("input"),v=":)",w={}.toString,x=" -webkit- -moz- -o- -ms- ".split(" "),y="Webkit Moz O ms",z=y.split(" "),A=y.toLowerCase().split(" "),B={svg:"http://www.w3.org/2000/svg"},C={},D={},E={},F=[],G=F.slice,H=function(a,c,d,e){var f,g,h,i,j=b.createElement("div"),k=b.body,l=k||b.createElement("body");if(parseInt(d,10))for(;d--;)h=b.createElement("div"),h.id=e?e[d]:r+(d+1),j.appendChild(h);return f=["&#173;",'<style id="s',r,'">',a,"</style>"].join(""),j.id=r,(k?j:l).innerHTML+=f,l.appendChild(j),k||(l.style.background="",l.style.overflow="hidden",i=q.style.overflow,q.style.overflow="hidden",q.appendChild(l)),g=c(j,a),k?j.parentNode.removeChild(j):(l.parentNode.removeChild(l),q.style.overflow=i),!!g},I=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b)&&c(b).matches||!1;var d;return H("@media "+b+" { #"+r+" { position: absolute; } }",function(b){d="absolute"==(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle).position}),d},J=function(){function a(a,e){e=e||b.createElement(d[a]||"div"),a="on"+a;var g=a in e;return g||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(a,""),g=f(e[a],"function"),f(e[a],"undefined")||(e[a]=c),e.removeAttribute(a))),e=null,g}var d={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return a}(),K={}.hasOwnProperty;m=f(K,"undefined")||f(K.call,"undefined")?function(a,b){return b in a&&f(a.constructor.prototype[b],"undefined")}:function(a,b){return K.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=G.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(G.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(G.call(arguments)))};return d}),C.flexbox=function(){return j("flexWrap")},C.flexboxlegacy=function(){return j("boxDirection")},C.canvas=function(){var a=b.createElement("canvas");return!(!a.getContext||!a.getContext("2d"))},C.canvastext=function(){return!(!o.canvas||!f(b.createElement("canvas").getContext("2d").fillText,"function"))},C.webgl=function(){return!!a.WebGLRenderingContext},C.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:H(["@media (",x.join("touch-enabled),("),r,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=9===a.offsetTop}),c},C.geolocation=function(){return"geolocation"in navigator},C.postmessage=function(){return!!a.postMessage},C.websqldatabase=function(){return!!a.openDatabase},C.indexedDB=function(){return!!j("indexedDB",a)},C.hashchange=function(){return J("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},C.history=function(){return!(!a.history||!history.pushState)},C.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},C.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},C.rgba=function(){return d("background-color:rgba(150,255,150,.5)"),g(t.backgroundColor,"rgba")},C.hsla=function(){return d("background-color:hsla(120,40%,100%,.5)"),g(t.backgroundColor,"rgba")||g(t.backgroundColor,"hsla")},C.multiplebgs=function(){return d("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(t.background)},C.backgroundsize=function(){return j("backgroundSize")},C.borderimage=function(){return j("borderImage")},C.borderradius=function(){return j("borderRadius")},C.boxshadow=function(){return j("boxShadow")},C.textshadow=function(){return""===b.createElement("div").style.textShadow},C.opacity=function(){return e("opacity:.55"),/^0.55$/.test(t.opacity)},C.cssanimations=function(){return j("animationName")},C.csscolumns=function(){return j("columnCount")},C.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return d((a+"-webkit- ".split(" ").join(b+a)+x.join(c+a)).slice(0,-a.length)),g(t.backgroundImage,"gradient")},C.cssreflections=function(){return j("boxReflect")},C.csstransforms=function(){return!!j("transform")},C.csstransforms3d=function(){var a=!!j("perspective");return a&&"webkitPerspective"in q.style&&H("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b){a=9===b.offsetLeft&&3===b.offsetHeight}),a},C.csstransitions=function(){return j("transition")},C.fontface=function(){var a;return H('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&0===g.indexOf(d.split(" ")[0])}),a},C.generatedcontent=function(){var a;return H(["#",r,"{font:0/0 a}#",r,':after{content:"',v,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},C.video=function(){var a=b.createElement("video"),c=!1;try{(c=!!a.canPlayType)&&(c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(d){}return c},C.audio=function(){var a=b.createElement("audio"),c=!1;try{(c=!!a.canPlayType)&&(c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(d){}return c},C.localstorage=function(){try{return localStorage.setItem(r,r),localStorage.removeItem(r),!0}catch(a){return!1}},C.sessionstorage=function(){try{return sessionStorage.setItem(r,r),sessionStorage.removeItem(r),!0}catch(a){return!1}},C.webworkers=function(){return!!a.Worker},C.applicationcache=function(){return!!a.applicationCache},C.svg=function(){return!!b.createElementNS&&!!b.createElementNS(B.svg,"svg").createSVGRect},C.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==B.svg},C.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(w.call(b.createElementNS(B.svg,"animate")))},C.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(w.call(b.createElementNS(B.svg,"clipPath")))};for(var L in C)m(C,L)&&(l=L.toLowerCase(),o[l]=C[L](),F.push((o[l]?"":"no-")+l));return o.input||k(),o.addTest=function(a,b){if("object"==typeof a)for(var d in a)m(a,d)&&o.addTest(d,a[d]);else{if(a=a.toLowerCase(),o[a]!==c)return o;b="function"==typeof b?b():b,"undefined"!=typeof p&&p&&(q.className+=" "+(b?"":"no-")+a),o[a]=b}return o},d(""),s=u=null,function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=s.elements;return"string"==typeof a?a.split(" "):a}function e(a){var b=r[a[p]];return b||(b={},q++,a[p]=q,r[q]=b),b}function f(a,c,d){if(c||(c=b),k)return c.createElement(a);d||(d=e(c));var f;return f=d.cache[a]?d.cache[a].cloneNode():o.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!f.canHaveChildren||n.test(a)||f.tagUrn?f:d.frag.appendChild(f)}function g(a,c){if(a||(a=b),k)return a.createDocumentFragment();c=c||e(a);for(var f=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)f.createElement(h[g]);return f}function h(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?f(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function i(a){a||(a=b);var d=e(a);return!s.shivCSS||j||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||h(a,d),a}var j,k,l="3.7.0",m=a.html5||{},n=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,o=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,p="_html5shiv",q=0,r={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",j="hidden"in a,k=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){j=!0,k=!0}}();var s={elements:m.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:l,shivCSS:m.shivCSS!==!1,supportsUnknownElements:k,shivMethods:m.shivMethods!==!1,type:"default",shivDocument:i,createElement:f,createDocumentFragment:g};a.html5=s,i(b)}(this,b),o._version=n,o._prefixes=x,o._domPrefixes=A,o._cssomPrefixes=z,o.mq=I,o.hasEvent=J,o.testProp=function(a){return h([a])},o.testAllProps=j,o.testStyles=H,o.prefixed=function(a,b,c){return b?j(a,b,c):j(a,"pfx")},q.className=q.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(p?" js "+F.join(" "):""),o}(this,this.document);


//----------------------------------------
//Facebook
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Twitter
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
	t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  t._e = [];
  t.ready = function(f) {
	t._e.push(f);
  };
  return t;
}(document, "script", "twitter-wjs"));