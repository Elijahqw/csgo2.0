$(document).ready(function() {

//put your discog user here
var username="banklinphones";

 $(function () {
    var $chk = $("#grpChkBox input:checkbox"); 
    var $tbl = $("#someTable");
    var $tblhead = $("#someTable th");
 
    $chk.prop('checked', true); 
 
    $chk.click(function () {
        var colToHide = $tblhead.filter("." + $(this).attr("name"));
        var index = $(colToHide).index();
        $tbl.find('tr :nth-child(' + (index + 1) + ')').toggle();
    });
});

  $(function () {
    var $chk = $("#grpChkBox-tracklist input:checkbox"); 
    var $tbl = $("#someOtherTable");
    var $tblhead = $("#someOtherTable th");
 
    $chk.prop('checked', true); 
 
    $chk.click(function () {
        var colToHide = $tblhead.filter("." + $(this).attr("name"));
        var index = $(colToHide).index();
        $tbl.find('tr :nth-child(' + (index + 1) + ')').toggle();
    });
});



    $(".discogs-loading").show();
     $(".header").hide();
    $(".blink_me").hide();



    url = "https://api.discogs.com/users/"+username+"/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=0&per_page=0";
    jQuery.getJSON(url, function(data) {
        $(".discogs-loading").hide();
        $(".blink_me").show();
          $(".header").show();
        if (data.pagination.items > 1) {
            
            
            $collection_range = ((data.pagination.pages));
            //page_id = $('#myRange').val();
            page_id = Math.floor((Math.random() * data.pagination.pages) + 1);

            $slider = $('#myRange');
            $slider.attr('max', $collection_range);
            $slider.change(function(){
                page_id = $('#myRange').val();
                
            });
            
            
            console.log("select random page : " + page_id + " / " + ((data.pagination.pages)));
            page_url = "https://api.discogs.com/users/"+username+"/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=" + page_id + "&per_page=1";
            jQuery.getJSON(page_url, function(datapage) {
                console.log("get page from collection at : " + page_url);
                label = "";
                if (typeof(datapage.releases[0].basic_information.labels) != 'undefined') {
                    $.each(datapage.releases[0].basic_information.labels, function(cle, valeur) {
                        label = label.concat(valeur.name + ' - ' + valeur.catno + ', ');
                    })
                    lastIndex = label.lastIndexOf(",");
                    label = label.substring(0, lastIndex);
                }
                image = '<tr><td style="width:135px"><img border="1" class="discogs-link" data-href="http://www.discogs.com/release/' + datapage.releases[0].basic_information.id + '" height="125" width="125" src="' + datapage.releases[0].basic_information.cover_image + '"></td><td nowrap>' + datapage.releases[0].basic_information.artists[0].name + ' - ' + datapage.releases[0].basic_information.title + '<br><br>Label: ' +label+ '<br>Format: ' + datapage.releases[0].basic_information.formats[0].name + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + '<br><span class="country"></span><br>Released: ' + datapage.releases[0].basic_information.year + '<br><span class="genre"></span><br><span class="style"></span></td></tr>';
                console.log('get release at ' + datapage.releases[0].basic_information.resource_url);
                release_url = datapage.releases[0].basic_information.resource_url;
                date_ajout = datapage.releases[0].date_added;
                added_since = moment(date_ajout, "YYYY-MM-DD").fromNow();
                console.log('release added to collection on ' + date_ajout);
                var logtext = datapage.releases[0].basic_information.labels[0].name + ' | ' + datapage.releases[0].basic_information.artists[0].name + ' | ' + datapage.releases[0].basic_information.title + ' | ' + datapage.releases[0].basic_information.formats[0].name + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + ' | ' + datapage.releases[0].basic_information.year;
                console.log(logtext);
                $(".date").text('playing item nÂ°' + page_id + '/' + data.pagination.pages + ' added to collection ' + added_since);
                $("#test").val(logtext);
                jQuery.getJSON(release_url, function(tube) {
                    tracklist = tube.tracklist;
                    console.log('get tracklist :');
                    track = "";
                    //tracklist
                    $.each(tracklist, function(cle, valeur) {
                        if (typeof(valeur.artists) == 'undefined') {
                            artist = "";
                        } else {
                            artist = valeur.artists[0].name;
                        }
                        console.log(valeur.position + '-' + valeur.title);
                        track = track.concat('<tr><td>' + valeur.position + ' ' + artist + ' - ' + valeur.title + '</td></tr>');
                    })
                    $(track).appendTo("#track-collection");
                    console.log("----------------COMPANIES-ETC----------------------");
                    //companies, etc
                    if (typeof(tube.companies) == 'undefined') {
                        companies = "";
                    } else {
                        $.each(tube.companies, function(cle, valeur) {
                            console.log(valeur.entity_type_name + ' - ' + valeur.name);
                        })
                    }
                    console.log("----------------CREDITS----------------------------");
                    //credits                  
                    if (typeof(tube.extraartists) == 'undefined') {
                        extrainfo = "";
                    } else {
                        $.each(tube.extraartists, function(cle, valeur) {
                            console.log(valeur.role + '-' + valeur.name);
                        })
                    }
                    console.log("------------------NOTES--------------------------");
                    //notes
                    console.log(tube.notes);
                    console.log("--------------------------------------------");
                    //if no video
                    if (typeof(tube.videos) == 'undefined') {
                        console.log("error no video found. reloading....");
                        $(".date").text(" sorry no video found, page will refresh quickly...");
                        $(".discogs-link").css("-webkit-animation", "none");
                        $(".discogs-link").css("-moz-animation", "none");
                        $(".discogs-link").css("animation", "none");
                        setTimeout(function() {
                            window.location.reload(1);
                        }, 3500);
                    }
                    link = YouTubeUrlNormalize(tube.videos[0].uri);
                    videoframe = '<iframe type="text/html" id="yt" width="125" height="75" src="' + link + '?autoplay=1&enablejsapi=1"></iframe>';
                    $(videoframe).appendTo("#videotube");
                    console.log('get video url: ' + link);
                    var vi_id = getVidId(link);
                    console.log('get video id: ' + vi_id);
                    //display info country, genre, style
                    $(".country").text('Country: ' + tube.country);
                    if (typeof(tube.genres) != 'undefined') {
                        genres = "";
                        $.each(tube.genres, function(cle, valeur) {
                            genres = genres.concat(valeur + ', ');
                        })
                        lastIndex = genres.lastIndexOf(",");
                        genres = genres.substring(0, lastIndex);
                        $(".genre").text('Genre: ' + genres);
                    }
                    if (typeof(tube.styles) != 'undefined') {
                        styles = "";
                        $.each(tube.styles, function(cle, valeur) {
                            styles = styles.concat(valeur + ', ');
                        })
                        lastIndex = styles.lastIndexOf(",");
                        styles = styles.substring(0, lastIndex);
                        $(".style").text('Style: ' + styles);
                    }
                    //refresh at end of video length
                    var refreshtime = (tube.videos[0].duration) * 1000;
                    console.log('get video length: ' + refreshtime);
                    setTimeout(function() {
                        window.location.reload(1);
                    }, refreshtime);
                })
                $(image).appendTo("#discogs-collection");
                $(".discogs-link").click(function() {
                    window.open($(this).data("href"));
                });
            })
        } else {
            $("#discogs-collection").appendTo("<tr class='discogs-error'><td>Error! Something is up with the Discogs API.</td></tr>");
        }
    });
});



$(document).ready(function(){
    
    var username="banklinphones";


  
$slider = $('#myRange');
$($slider).change(function()
                     {
                page_id = $('#myRange').val();
                page_url = "https://api.discogs.com/users/"+username+"/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=" + page_id + "&per_page=1";
    
    
    //try this out replaced append with append seems to sortof work.
    jQuery.getJSON(url, function(data) {
        $(".discogs-loading").hide();
        $(".blink_me").show();
          $(".header").show();
        if (data.pagination.items > 1) {
            
            
            $collection_range = ((data.pagination.pages));
            page_id = $('#myRange').val();
                        //page_id = Math.floor((Math.random() * data.pagination.pages) + 1);

            $slider = $('#myRange');
            $slider.attr('max', $collection_range);
            $slider.change(function(){
                page_id = $('#myRange').val();
                
            });
            
			
			//rate_limit_leftover = X-Discogs-Ratelimit-Remaining;
			//console.log("rate limit", rate_limit_leftover);
            
            page_url = "https://api.discogs.com/users/"+username+"/collection/folders/0/releases?callback=&sort=added&sort_order=desc&page=" + page_id + "&per_page=1";
            jQuery.getJSON(page_url, function(datapage) {
                console.log("get page from collection at : " + page_url);
					
                label = "";
                if (typeof(datapage.releases[0].basic_information.labels) != 'undefined') {
                    $.each(datapage.releases[0].basic_information.labels, function(cle, valeur) {
                        label = label.concat(valeur.name + ' - ' + valeur.catno + ', ');
                    })
                    lastIndex = label.lastIndexOf(",");
                    label = label.substring(0, lastIndex);
                }
			
                image = '<tr><td style="width:135px"><img border="1" class="discogs-link" data-href="http://www.discogs.com/release/' + datapage.releases[0].basic_information.id + '" height="125" width="125" src="' + datapage.releases[0].basic_information.getThumbnail+label+ '<br>Format: ' + datapage.releases[0].basic_information.formats[0].name + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ', ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + '<br><span class="country"></span><br>Released: ' + datapage.releases[0].basic_information.year + '<br><span class="genre"></span><br><span class="style"></span></td></tr>';
                console.log('get release at ' + datapage.releases[0].basic_information.resource_url);
                release_url = datapage.releases[0].basic_information.resource_url;
                date_ajout = datapage.releases[0].date_added;
                added_since = moment(date_ajout, "YYYY-MM-DD").fromNow();
                console.log('release added to collection on ' + date_ajout);
				console.log("image info " + image);
                var logtext = datapage.releases[0].basic_information.labels[0].name + ' | ' + datapage.releases[0].basic_information.artists[0].name + ' | ' + datapage.releases[0].basic_information.title + ' | ' + datapage.releases[0].basic_information.formats[0].name + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[0] + ' | ' + datapage.releases[0].basic_information.formats[0].descriptions[1] + ' | ' + datapage.releases[0].basic_information.year;
                console.log(logtext);
                $(".date").text('playing item nÂ°' + page_id + '/' + data.pagination.pages + ' added to collection ' + added_since);
                $("#test").val(logtext);
                jQuery.getJSON(release_url, function(tube) {
                    tracklist = tube.tracklist;
                    console.log('get tracklist :');
                    track = "";
                    //tracklist
                    $.each(tracklist, function(cle, valeur) {
                        if (typeof(valeur.artists) == 'undefined') {
                            artist = "";
                        } else {
                            artist = valeur.artists[0].name;
                        }
                        console.log(valeur.position + '-' + valeur.title);
                        track = track.concat('<tr><td>' + valeur.position + ' ' + artist + ' - ' + valeur.title + '</td></tr>');
                    })
                    $(track).replaceWith("#track-collection");
                 
                    console.log("----------------COMPANIES-ETC----------------------");
                    //companies, etc
                    if (typeof(tube.companies) == 'undefined') {
                        companies = "";
                    } else {
                        $.each(tube.companies, function(cle, valeur) {
                            console.log(valeur.entity_type_name + ' - ' + valeur.name);
                        })
                    }
                    console.log("----------------CREDITS----------------------------");
                    //credits                  
                    if (typeof(tube.extraartists) == 'undefined') {
                        extrainfo = "";
                    } else {
                        $.each(tube.extraartists, function(cle, valeur) {
                            console.log(valeur.role + '-' + valeur.name);
                        })
                    }
                    console.log("------------------NOTES--------------------------");
                    //notes
                    console.log(tube.notes);
                    console.log("--------------------------------------------");
                    //if no video
                    if (typeof(tube.videos) == 'undefined') {
                        console.log("error no video found. reloading....");
                        $(".date").text(" sorry no video found, page will refresh quickly...");
                        $(".discogs-link").css("-webkit-animation", "none");
                        $(".discogs-link").css("-moz-animation", "none");
                        $(".discogs-link").css("animation", "none");
                        setTimeout(function() {
                            window.location.reload(1);
                        }, 3500);
                    }
                    link = YouTubeUrlNormalize(tube.videos[0].uri);
                    videoframe = '<iframe type="text/html" id="yt" width="125" height="75" src="' + link + '?autoplay=1&enablejsapi=1"></iframe>';
                    $(videoframe).appendTo("#videotube");
                    console.log('get video url: ' + link);
                    var vi_id = getVidId(link);
                    console.log('get video id: ' + vi_id);
                    //display info country, genre, style
                    $(".country").text('Country: ' + tube.country);
                    if (typeof(tube.genres) != 'undefined') {
                        genres = "";
                        $.each(tube.genres, function(cle, valeur) {
                            genres = genres.concat(valeur + ', ');
                        })
                        lastIndex = genres.lastIndexOf(",");
                        genres = genres.substring(0, lastIndex);
                        $(".genre").text('Genre: ' + genres);
                    }
                    if (typeof(tube.styles) != 'undefined') {
                        styles = "";
                        $.each(tube.styles, function(cle, valeur) {
                            styles = styles.concat(valeur + ', ');
                        })
                        lastIndex = styles.lastIndexOf(",");
                        styles = styles.substring(0, lastIndex);
                        $(".style").text('Style: ' + styles);
                    }
                    //refresh at end of video length
                    var refreshtime = (tube.videos[0].duration) * 1000;
                    console.log('get video length: ' + refreshtime);
                    setTimeout(function() {
                        window.location.reload(1);
                    }, refreshtime);
                })
                $(image).appendTo("#discogs-collection");
                $(".discogs-link").click(function() {
                    window.open($(this).data("href"));
                });
            })
        } else {
            $("#discogs-collection").append("<tr class='discogs-error'><td>Error! Something is up with the Discogs API.</td></tr>");
        }
    });
    	//attempt to hide any repeat videos
		var videotubeCount = $("videotube").length;
    	if ($("#videotube").length >1){
			$("videotube:last-child").show;
			$("videotube:nth-child(videotubeCount)").hide;
		}

});
      
});


