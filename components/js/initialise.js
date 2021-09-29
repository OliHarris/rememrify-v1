function weekpicker() {
  var total = 20;
  var totalText = "UK Top " + total + " Chart";
  $("#chart-total").text(totalText);

  $("#weekpicker").weekpicker({
    firstDay: 6,
    changeMonth: true,
    changeYear: true,
    dateFormat: "dd/mm/yy",
    yearRange: "1957:2012",
    minDate: new Date(1957, 0, 5),
    maxDate: new Date(2012, 3, 27),
    onSelect: function (dateText, startDateText, startDate, endDate, inst) {
      $("#week-start").text(startDateText);
      //generate url hash based on selection
      window.location.hash = "date=" + startDateText;
      populate_top_twenty();
    },
  });
  $(".ui-datepicker-current-day").click();

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
    $("#weekpicker .loading-overlay").show();
    //can't query JSON at https://uk-charts-archive.wikia.com/ as prop=extracts not recognised by WikiMedia API
    //have to parse JSON
    //can improve Solar System!! Only need URL-raw as below. Also Wiki URL can be queried with inprop
    var wikiChartAPI_URL_raw =
      "https://uk-charts-archive.wikia.com/api.php?action=parse&format=json&page=";
    var chart_parse = $("#week-start").text();
    var wikiChartAPI_URL =
      wikiChartAPI_URL_raw +
      "UK_Singles_%26_Album_Chart_(" +
      chart_parse +
      ")&callback=?";
    $.ajax({
      url: wikiChartAPI_URL,
      dataType: "json",
      success: function (data) {
        //populate data from Wiki API JSON file
        var json_node = $(data.parse.text);
        var output = $(json_node[0]["*"])[0];
        var table_output = $(output).find("table:first-of-type");
        $("#wikichart").empty().append(table_output);
        //format table further
        $("#wikichart tr:first-of-type")
          .addClass("info-row")
          .wrapInner(
            "<td><table style='width: 100%;'><tr class='wrapper'></tr></table></td>"
          );
        $("#wikichart tr+tr")
          .addClass("song-row")
          .wrapInner(
            "<td><table style='width: 100%;'><tr class='wrapper'></tr></table></td>"
          );
        //remove unneeded output below total
        $(
          "#wikichart tr.song-row:nth-of-type(1n+" + (total + 2) + ")"
        ).remove();
        //format different table columns parsed
        if ($("#wikichart tr.info-row th").length == 5) {
          $("#wikichart tr.wrapper").addClass("five-columns");
        } else if ($("#wikichart tr.info-row th").length == 6) {
          $("#wikichart tr.wrapper").addClass("six-columns");
        } else if ($("#wikichart tr.info-row th").length == 7) {
          $("#wikichart tr.wrapper").addClass("seven-columns");
        } else if ($("#wikichart tr.info-row th").length == 10) {
          $("#wikichart tr.wrapper").addClass("five-columns");
        } else if ($("#wikichart tr.info-row th").length == 11) {
          $("#wikichart tr.wrapper").addClass("six-columns");
        } else if ($("#wikichart tr.info-row th").length == 12) {
          $("#wikichart tr.wrapper").addClass("seven-columns");
        }
        //extract artist + song data based on columns
        if ($("#wikichart tr.info-row tr.wrapper").hasClass("seven-columns")) {
          //seven-columns
          var artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(6)")
          );
          var song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(7)")
          );
        } else if (
          $("#wikichart tr.info-row tr.wrapper").hasClass("six-columns")
        ) {
          //six-columns
          var artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(5)")
          );
          var song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(6)")
          );
        } else if (
          $("#wikichart tr.info-row tr.wrapper").hasClass("five-columns")
        ) {
          //five-columns
          var artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(4)")
          );
          var song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(5)")
          );
        }

        //remove rest of unneeded output
        $("#wikichart > table~*").remove();
        //format all forward-slashes
        $("#wikichart tr.wrapper td").each(function () {
          if ($(this).text().indexOf("/") > 0) {
            $(this).text($(this).text().replace(/\//g, " / "));
          }
        });

        (function arrayLooper() {
          //loop through arrays, with promise resolver
          var promises = [];
          for (var i = 0; i < total; i++) {
            function stringCleanser(string) {
              return (
                string
                  //need to remove '%'
                  .replace("%", "")
                  //need to remove ' &' and ' And'; replace with '+'
                  .replace(" &", "+")
                  .replace(" And", "+")
                  //need to remove ' Ft', ' ft', ' Ft.', ' ft.' and all following info; replace with '+'
                  .split(" Ft")[0]
                  .replace(" Ft", "+")
                  .split(" ft")[0]
                  .replace(" ft", "+")
                  .split(" Ft.")[0]
                  .replace(" Ft.", "+")
                  .split(" ft.")[0]
                  .replace(" ft.", "+")
                  //need to remove slashes and all following info; replace with '+'
                  .split(/\//g)[0]
                  .replace(/\//g, "+")
                  //need to remove spaces; replace with '+'
                  .replace(/\s+/g, "+")
                  //need to remove words in brackets (); replace with '+'
                  .replace(/ *\([^)]*\) */g, "+")
                  //need to replace double-quotes with single-quotes
                  .replace(/"/g, "'")
              );
            }

            var artist = stringCleanser($(artist_array[i]).text());
            // console.log(artist);
            var song = stringCleanser($(song_array[i]).text());
            // console.log(song);

            /* find censored-starred single words and curly-braces {} then remove them */
            /* replace between two +'s */
            var song_word = song.split("+");
            for (var j = 0; j < song_word.length; j++) {
              if (
                song_word[j].indexOf("*") != -1 ||
                song_word[j].indexOf("{") != -1 ||
                song_word[j].indexOf("}") != -1
              ) {
                song_word[j] = "";
              }
            }
            song = song_word.join("+");
            var spotify_url =
              "https://api.spotify.com/v1/search?q=" +
              artist +
              song +
              "&type=track&market=GB&limit=1";
            //console.log(spotify_url);
            //spotify call - wrap in loop-handler for correct order retrieval
            function loop_handler(loop_number) {
              //new! authorization required - wrap in token request post
              //call ajax as variable for promise resolver
              var request = $.ajax({
                url: "spotify-connect.php",
                method: "POST",
                data: $.param({ spotify_url: spotify_url }),
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },
                success: function (output) {
                  var data = JSON.parse(output);
                  ///get Spotify ID if exists, push into array
                  //if no song ID create div
                  if (!data.tracks.items[0]) {
                    //iframe create
                    var $no_song = $(
                      "<tr class='no-song-wrapper'><td colspan='3'><div><div class='no-song'>No song found on Spotify!</div></div></td></tr>"
                    );
                    $(
                      "#wikichart tr.song-row:nth-of-type(" +
                        loop_number +
                        ") tr.wrapper"
                    ).after($no_song);
                  } else if (data.tracks.items[0]) {
                    //attach loading div
                    var $load_song = $(
                      "<tr class='load-wrapper'><td colspan='3'><div>" +
                        "<div class='load-song'>Loading song...</div>" +
                        "</div></td></tr>"
                    );
                    $(
                      "#wikichart tr.song-row:nth-of-type(" +
                        loop_number +
                        ") tr.wrapper"
                    ).after($load_song);
                    //query Spotify ID
                    var id_output = data.tracks.items[0].id;
                    //console.log(id_output);
                    //insert Spotify src
                    var spotifyAPI_SRC =
                      "https://open.spotify.com/embed?uri=spotify:track:" +
                      id_output;
                    //console.log(spotifyAPI_SRC);
                    //iframe create
                    var $iframe = $("<iframe>", {
                      src: spotifyAPI_SRC,
                      frameborder: "0",
                      allowtransparency: "true",
                      allow: "encrypted-media",
                    });
                    //attach 'load' before iframe starts loading
                    $iframe.on("load", function () {
                      $(
                        "#wikichart tr.song-row:nth-of-type(" +
                          loop_number +
                          ") tr.load-wrapper"
                      ).hide();
                    });
                    $(
                      "#wikichart tr.song-row:nth-of-type(" +
                        loop_number +
                        ") tr.wrapper"
                    ).after($iframe);
                    $iframe.wrap(
                      "<tr class='iframe-wrapper'><td colspan='3'></td></tr>"
                    );
                  }
                },
              });
              //push to promise resolver array
              promises.push(request);
            } //end loop-handler
            loop_handler(i + 2);
          } //end for-loop
          //when all promises resolved
          $.when.apply(null, promises).done(function () {
            $("#weekpicker .loading-overlay").hide();
          });
        })();
      },
    });
  }
}

//Replace all SVG images with inline SVG
//Not my code! Regularly use this from:
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
function svg_go() {
  $("img.svg").each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr("id");
    var imgClass = $img.attr("class");
    var imgURL = $img.attr("src");
    $.get(
      imgURL,
      function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find("svg");
        // Add replaced image's ID to the new SVG
        if (typeof imgID !== "undefined") {
          $svg = $svg.attr("id", imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== "undefined") {
          $svg = $svg.attr("class", imgClass + " replaced-svg");
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr("xmlns:a");
        // Replace image with new SVG
        $img.replaceWith($svg);
      },
      "xml"
    );
  });
}

function check_dev() {
  //localhost switch for live-reload
  var hostName = location.hostname;
  if (hostName === "127.0.0.1") {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//localhost:35729/livereload.js";
    document.body.appendChild(script);
  }
}

//INITIALISE
$(document).ready(function () {
  weekpicker();
  svg_go();
  check_dev();
});
