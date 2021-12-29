const weekpicker = () => {
  const total = 20;
  const totalText = `UK Top ${total} Chart`;
  $("#chart-total").text(totalText);

  const populate_history = () => {
    // add another check to only call if History pane empty (no call on arrow use)
    if ($("#history-output").hasClass("no-content")) {
      $("#history-output").removeClass("no-content");
      $("#history-output").find("li").remove();
      $("#history-output").append(
        "<li class='loading-history'><hr />Loading...</li>"
      );
      const wikipediaAPI_URL_raw =
        "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
      const detailed_date_array = [];
      $("#weekpicker")
        .find(".ui-datepicker-current-day")
        .each((index, element) => {
          // don't count first detection on load
          if (!$(element).hasClass("ui-datepicker-days-cell-over")) {
            detailed_date_array.push(
              `${("0" + $(element)[0].innerText).slice(-2)}/${(
                "0" +
                (parseInt($(element)[0].dataset.month) + 1)
              ).slice(-2)}/${$(element)[0].dataset.year}`
            );
          }
        });
      // only call wiki API if seven days
      if (detailed_date_array.length === 7) {
        const events_array = [];
        //need promise resolver for AJAX in loop
        const promises = [];
        detailed_date_array.forEach((dateValue, index, arr) => {
          const day = dateValue.split("/")[0];
          const month = dateValue.split("/")[1];
          const year = dateValue.split("/")[2];
          const wikipediaAPI_URL = `${wikipediaAPI_URL_raw}/${month}/${day}`;
          //create day/month array based on selection then cross-reference against API with anything in year field
          //call ajax as variable for promise resolver
          const request = $.ajax({
            url: wikipediaAPI_URL,
            dataType: "json",
            success: (data) => {
              // find results
              data.events.forEach((eventValue, index, arr) => {
                // find year instances amongst returned data
                if (eventValue.year === parseInt(year)) {
                  events_array.push({
                    date: dateValue,
                    text: eventValue.text,
                  });
                }
              });
            },
            error: (jqXhr, textStatus, errorMessage) => {
              // error callback
              console.log(errorMessage);
            },
          });
          //push to promise resolver array
          promises.push(request);
        });
        //when all promises resolved
        $.when.apply(null, promises).done(() => {
          $("#history-output").find("li.loading-history").remove();
          if (events_array.length === 0) {
            // if no results
            $("#history-output").append(
              "<li class='no-history'><hr />No significant events found!</li>"
            );
          } else {
            // if results
            $("#history-output").find("li.no-history").remove();
            const events_array_sorted = events_array.sort((a, b) => {
              a = a.date.split("/").reverse().join("");
              b = b.date.split("/").reverse().join("");
              return a.localeCompare(b);
            });
            events_array_sorted.forEach((sortedEvent, index, arr) => {
              $("#history-output").append(
                `<li><hr /><strong>
                  ${sortedEvent.date}
                  </strong><br />
                  ${sortedEvent.text}
                  </li>`
              );
            });
          }
        });
      }
    }
  };

  const populate_top_twenty = () => {
    $("#weekpicker .loading-overlay").show();
    //can't query JSON at https://uk-charts-archive.wikia.com/ as prop=extracts not recognised by WikiMedia API
    //have to parse JSON
    //can improve Solar System!! Only need URL-raw as below. Also Wiki URL can be queried with inprop
    const wikiChartAPI_URL_raw =
      "https://uk-charts-archive.wikia.com/api.php?action=parse&format=json&page=";
    const date_selected = $("#week-start").text();
    const wikiChartAPI_URL = `${wikiChartAPI_URL_raw}UK_Singles_%26_Album_Chart_(${date_selected})&callback=?`;
    $.ajax({
      url: wikiChartAPI_URL,
      dataType: "json",
      success: (data) => {
        //populate data from Wiki API JSON file
        const json_node = $(data.parse.text);
        const output = $(json_node[0]["*"])[0];
        const table_output = $(output).find("table:first-of-type");
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
        $(`#wikichart tr.song-row:nth-of-type(1n+${total + 2})`).remove();
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
        let artist_array;
        let song_array;
        if ($("#wikichart tr.info-row tr.wrapper").hasClass("seven-columns")) {
          //seven-columns
          artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(6)")
          );
          song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(7)")
          );
        } else if (
          $("#wikichart tr.info-row tr.wrapper").hasClass("six-columns")
        ) {
          //six-columns
          artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(5)")
          );
          song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(6)")
          );
        } else if (
          $("#wikichart tr.info-row tr.wrapper").hasClass("five-columns")
        ) {
          //five-columns
          artist_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(4)")
          );
          song_array = $.makeArray(
            $("#wikichart").find("table td:nth-of-type(5)")
          );
        }

        //remove rest of unneeded output
        $("#wikichart > table~*").remove();
        //format all forward-slashes
        $("#wikichart tr.wrapper td").each((index, element) => {
          if ($(element).text().indexOf("/") > 0) {
            $(element).text($(element).text().replace(/\//g, " / "));
          }
        });

        (arrayLooper = () => {
          //loop through arrays, with promise resolver
          const promises = [];
          for (let i = 0; i < total; i++) {
            const stringCleanser = (string) => {
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
            };

            const artist = stringCleanser($(artist_array[i]).text());
            // console.log(artist);
            let song = stringCleanser($(song_array[i]).text());
            // console.log(song);

            /* find censored-starred single words and curly-braces {} then remove them */
            /* replace between two +'s */
            const song_word = song.split("+");
            for (let j = 0; j < song_word.length; j++) {
              if (
                song_word[j].indexOf("*") != -1 ||
                song_word[j].indexOf("{") != -1 ||
                song_word[j].indexOf("}") != -1
              ) {
                song_word[j] = "";
              }
            }
            song = song_word.join("+");
            const spotify_url = `https://api.spotify.com/v1/search?q=${artist}${song}&type=track&market=GB&limit=1`;
            //console.log(spotify_url);
            //spotify call - wrap in loop-handler for correct order retrieval
            const loop_handler = (loop_number) => {
              //new! authorization required - wrap in token request post
              //call ajax as variable for promise resolver
              const request = $.ajax({
                url: "spotify-connect.php",
                method: "POST",
                data: $.param({ spotify_url: spotify_url }),
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                },
                success: (output) => {
                  const data = JSON.parse(output);
                  ///get Spotify ID if exists, push into array
                  //if no song ID create div
                  if (!data.tracks.items[0]) {
                    //iframe create
                    const $no_song = $(
                      "<tr class='no-song-wrapper'><td colspan='3'><div><div class='no-song'>No song found on Spotify!</div></div></td></tr>"
                    );
                    $(
                      `#wikichart tr.song-row:nth-of-type(
                      ${loop_number}
                        ) tr.wrapper`
                    ).after($no_song);
                  } else if (data.tracks.items[0]) {
                    //attach loading div
                    const $load_song = $(
                      `<tr class='load-wrapper'><td colspan='3'><div>
                        <div class='load-song'>Loading song...</div>
                        </div></td></tr>`
                    );
                    $(
                      `#wikichart tr.song-row:nth-of-type(
                      ${loop_number}
                      ) tr.wrapper`
                    ).after($load_song);
                    //query Spotify ID
                    const id_output = data.tracks.items[0].id;
                    //console.log(id_output);
                    //insert Spotify src
                    const spotifyAPI_SRC = `https://open.spotify.com/embed?uri=spotify:track:${id_output}`;
                    //console.log(spotifyAPI_SRC);
                    //iframe create
                    const $iframe = $("<iframe>", {
                      src: spotifyAPI_SRC,
                      frameborder: "0",
                      allowtransparency: "true",
                      allow: "encrypted-media",
                    });
                    //attach 'load' before iframe starts loading
                    $iframe.on("load", () => {
                      $(
                        `#wikichart tr.song-row:nth-of-type(
                        ${loop_number}
                          ) tr.load-wrapper`
                      ).hide();
                    });
                    $(
                      `#wikichart tr.song-row:nth-of-type(
                        ${loop_number}
                        ) tr.wrapper`
                    ).after($iframe);
                    $iframe.wrap(
                      "<tr class='iframe-wrapper'><td colspan='3'></td></tr>"
                    );
                  }
                },
                error: (jqXhr, textStatus, errorMessage) => {
                  // error callback
                  console.log(errorMessage);
                },
              });
              //push to promise resolver array
              promises.push(request);
            }; //end loop-handler
            loop_handler(i + 2);
          } //end for-loop
          //when all promises resolved
          $.when.apply(null, promises).done(() => {
            $("#weekpicker .loading-overlay").hide();
          });
        })();
      },
      error: (jqXhr, textStatus, errorMessage) => {
        // error callback
        console.log(errorMessage);
      },
    });
  };

  $("#weekpicker").weekpicker({
    firstDay: 6,
    changeMonth: true,
    changeYear: true,
    dateFormat: "dd/mm/yy",
    yearRange: "1957:2012",
    minDate: new Date(1957, 0, 5),
    maxDate: new Date(2012, 3, 27),
    onUpdateDatepicker: (inst) => {
      populate_history();
    },
    onSelect: (dateText, startDateText, startDate, endDate, inst) => {
      $("#week-start").text(startDateText);
      //generate url hash based on selection
      window.location.hash = `date=${startDateText}`;
      populate_top_twenty();
      $("#history-output").addClass("no-content");
    },
  });
  $(".ui-datepicker-current-day").click();
};

//Replace all SVG images with inline SVG
//Not my code! Regularly use this from:
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
const svg_go = () => {
  $("img.svg").each((index, element) => {
    const $img = $(element);
    const imgID = $img.attr("id");
    const imgClass = $img.attr("class");
    const imgURL = $img.attr("src");
    $.get(
      imgURL,
      (data) => {
        // Get the SVG tag, ignore the rest
        let $svg = $(data).find("svg");
        // Add replaced image's ID to the new SVG
        if (typeof imgID !== "undefined") {
          $svg = $svg.attr("id", imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== "undefined") {
          $svg = $svg.attr("class", `${imgClass} replaced-svg`);
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr("xmlns:a");
        // Replace image with new SVG
        $img.replaceWith($svg);
      },
      "xml"
    );
  });
};

const check_dev = () => {
  //localhost switch for live-reload
  const hostName = location.hostname;
  if (hostName === "127.0.0.1") {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//localhost:35729/livereload.js";
    document.body.appendChild(script);
  }
};

//INITIALISE
$(document).ready(() => {
  weekpicker();
  svg_go();
  check_dev();
});
