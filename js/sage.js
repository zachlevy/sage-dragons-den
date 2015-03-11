

/* AGE VERIFICATION */

// give 'er
jQuery(document).ready(function($){
  checkCookie();
  console.log('instagramming');
  $('.instagram').on('willLoadInstagram', function(event, options) {
    //console.log(options);
  });
  $('.instagram').on('didLoadInstagram', function(event, response) {
    //console.log(response);
    //console.log(cleanGrams(response));
    renderGrams(cleanGrams(response));
  });
  $('.instagram').instagram({
    clientId: 'adceaa299bc64ec485ea296b51c6302a',
    accessToken: '278615182.adceaa2.0d6f47831ca842769b292fd6737d9dd0',
    userId: 961352253
  });
  getTweets();
});

// from the internet
function checkCookie() {
  var splash=getCookie("splash");
  //var splash=getCookie("none");
  if (splash!="true") {
    // if the cookie does not exist
    jQuery('#ageVerification').modal('show');
    console.log('not verified');
  } else {
    // if the cookie exists 
    console.log('verified');
  }
}

// from the internet
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

// set teh cookie splash=true
function ageVerified(){
  days=3; // number of days to keep the cookie
  myDate = new Date();
  myDate.setTime(myDate.getTime()+(days*60*60*24*1000));
  document.cookie = 'splash=true; expires=' + myDate.toGMTString();
  console.log("cookie set");
  console.log(document.cookie = 'splash=true; expires=' + myDate.toGMTString());
}

// change the date into a sexy format
function parseInstagramDate (uncleanDate) {
  var system_date = new Date(uncleanDate*1000);
  var user_date = new Date();
  //console.log('uncleanDate: ' + system_date);
  //console.log('currentDate: ' + user_date);

  var diff = Math.floor((user_date - system_date) / 1000);
  if (diff <= 1) {return "just now";}
  if (diff < 20) {return diff + " seconds ago";}
  if (diff < 40) {return "half a minute ago";}
  if (diff < 60) {return "less than a minute ago";}
  if (diff <= 90) {return "one minute ago";}
  if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
  if (diff <= 5400) {return "1 hour ago";}
  if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
  if (diff <= 129600) {return "1 day ago";}
  if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
  if (diff <= 777600) {return "1 week ago";}
  return "over a week ago";
  //return cleanDate;
}
// clean response
function cleanGrams (uncleanGrams) {
  var cleanGrams = new Array();
  for (var i = 0; i < uncleanGrams.data.length; i++) {
    if (uncleanGrams.data[i].type == 'image') {
      var gram = {};
      gram['id'] = uncleanGrams.data[i].id;
      gram['type'] = uncleanGrams.data[i].type; 
      if (typeof(uncleanGrams.data[i].caption) != 'undefined' && uncleanGrams.data[i].caption != null) {
        gram['text'] = uncleanGrams.data[i].caption.text;
      } else {
        gram['text'] = '';
      }
      gram['photo'] = uncleanGrams.data[i].images.standard_resolution.url;
      gram['source'] = uncleanGrams.data[i].link;
      gram['likes'] = uncleanGrams.data[i].likes.count;
      gram['time'] = parseInstagramDate(uncleanGrams.data[i].created_time);
      gram['userId'] = uncleanGrams.data[i].user.id;      
      gram['user'] = uncleanGrams.data[i].user.username;
      gram['userPhoto'] = uncleanGrams.data[i].user.profile_picture;
      gram['userName'] = uncleanGrams.data[i].user.full_name;
      cleanGrams.push(gram);
    }     
  }
  return cleanGrams;
}

function renderGrams (grams) {
  var gramsLimit = 4;
  var gram = ''
  for (i = 0; i < gramsLimit; i++) {
    gram += '<div class="col-sm-3 col-xs-6"><a href="' + grams[i].source + '" target="_blank"><img class="gram-img img-responsive" src="' 
    + grams[i].photo + '" alt="' 
    + grams[i].text + '" /></a></div>';
  }
  $('.instagram').html(gram);
}



// get the tweets from a given user
function getTweets () {
    var cb = new Codebird;
    cb.setConsumerKey("rOYGLRGZQUym42rXE6uQ", "Oabxou4OHKOQjgT8TuJxShe4Qs1uKW7rm4wHgPtYEDM");
    cb.setToken("1020706052-9FOTQn0eipHFA4yhmOLEFLijjJpJh3f6sFwSBV2", "BGcXkEq4TY63cChd6I0ovCIBvU79ymeQDpp5vV7IzNXZ3");
    cb.__call(
        "statuses_userTimeline",
        {
            screen_name: 'sagemixology',
            count: 1,
        },
        function (reply) {
            renderTweets(cleanTweets(reply));
        }
    );
};

function renderTweets (tweets) {
    var tweetText = "";
    console.log(tweets[0].text);
    console.log(tweets[0].time);
    console.log(tweets[0].username);
    console.log(tweets[0].screenname);

    tweetText += "<span class=\"twitter-text\">" + tweets[0].text + "</span>";
    tweetText += "<span class=\"twitter-ago\">" + tweets[0].time + " - <a href=\"http://twitter.com/" + tweets[0].screenname + "\" target=\"_blank\">" + tweets[0].username + "</a></span>";
    
    document.getElementById('sage-tweet').innerHTML=tweetText;
    
}


// cleans the api response
function cleanTweets(uncleanTweets) {
    var cleanTweets = new Array();
    //console.log(uncleanTweets);
    for (var i = 0; i < uncleanTweets.length; i++) {
        var tweet = {};
        tweet['id'] = uncleanTweets[i]['id'];
        tweet['text'] = uncleanTweets[i]['text'];
        tweet['username'] = uncleanTweets[i]['user']['name'];
        tweet['screenname'] = uncleanTweets[i]['user']['screen_name'];
        tweet['userimg'] = uncleanTweets[i]['user']['profile_image_url'];
        tweet['time'] = parseTwitterDate(uncleanTweets[i]['created_at']);
        tweet['retweets'] = uncleanTweets[i]['retweet_count'];
        tweet['favs'] = uncleanTweets[i]['favorite_count'];
        tweet['links'] = uncleanTweets[i]['entities']['urls'];
        tweet['mentions'] = uncleanTweets[i]['entities']['user_mentions'];
        tweet = tweetLinks(tweet);
        cleanTweets.push(tweet);
    }
    return cleanTweets;
    //console.log(cleanTweets)
}

function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "over a week ago";
}

function tweetLinks (tweet) {
    if (typeof tweet['mentions'] !== 'undefined' && tweet['mentions'].length > 0) {
        for (var i = 0; i < tweet['mentions'].length; i++) {
            tweet['text'] = tweet['text'].replace('@'
                + tweet['mentions'][i]['screen_name'], 
                '<a href="http://twitter.com/'
                + tweet['mentions'][i]['screen_name']
                + '" target="_blank">@'
                + tweet['mentions'][i]['screen_name']
                + '</a>');
        }
    }
    if (typeof tweet['links'] !== 'undefined' && tweet['links'].length > 0) {
        for (var i = 0; i < tweet['links'].length; i++) {
            tweet['text'] = tweet['text'].replace(
                tweet['links'][i]['url'], 
                '<a href="' + tweet['links'][i]['url'] + '" target="_blank">' + tweet['links'][i]['display_url'] + '</a>'
                );
        }
    }
    return tweet;
}

// from http://widgets.twimg.com/j/1/widget.js
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();