

/* AGE VERIFICATION */

// give 'er
jQuery(document).ready(function($){
  checkCookie();
  console.log('instagramming');
  var instagramming = setTimeout(function(){
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
  },5000);
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
    gram += '<div class="col-lg-3 col-xs-6"><a href="' + grams[i].source + '" target="_blank"><img class="gram-img img-responsive" src="' 
    + grams[i].photo + '" alt="' 
    + grams[i].text + '" /></a></div>';
  }
  $('.instagram').html(gram);
}
