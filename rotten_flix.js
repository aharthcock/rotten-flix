/*========================================================
** Global variables
*/

var page        = require('webpage').create()
  , page2       = require('webpage').create()
  , page3       = require('webpage').create()
  , url         = 'https://www.netflix.com/Login?locale=en-US'
  , tomatoUrl = "http://www.rottentomatoes.com/"
  , capturePath = 'test/'
  , notesPath = 'test/'
  , fs = require('fs');


/*========================================================
** Steps
*/


// Step 1
setTimeout(function() {
    console.log('---------------------------------');
    console.log("### STEP 1: Load '" + url + "'");

    page.open(url, function (status) {
        console.log(status + " opening the page");
        //page.render(capturePath + 'login_page.png');
    });

}, 0);

// Step 2
setTimeout(function() {
    console.log('---------------------------------');
    console.log("### STEP 2: Log into Netflix");

    page.evaluate(function() {
        document.getElementById('email').value = "ferrellkenneth@hotmail.com";
        document.getElementById('password').value = "oneson";
        document.getElementById('RememberMe').checked = false;
        document.getElementById('login-form-contBtn').click();
        });

    //page.render(capturePath + 'login_page_creds.png');
}, 5000);

// Step 3
setTimeout(function() {
    console.log('---------------------------------');
    console.log("### STEP 3: Choose Ken's profile");

    page.evaluate(function() {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelectorAll('[ng-click="switchProfile(profile)"]')[0].dispatchEvent(ev);
    });

    //page.render(capturePath + 'profile_page.png');
}, 10000);


page.onClosing = function(closingPage) {
    console.log('Netflix page has closed! URL: ' + closingPage.url);
};

// Step 4
setTimeout(function() {
    console.log('---------------------------------');
    console.log("### STEP 4: Url api request");
    var url2 = page.evaluate(function() {
    var baseUrl      = "http://www.netflix.com/api/shakti/4704ae20/wigenre?"
        genreId      = "genreId=" + 1365 + "&",
        getAllMovies = "from=0&to=100000";
        requestUrl   = baseUrl + genreId + getAllMovies
        return requestUrl;
    });
    console.log("Opening: " + url2);
    page2.open(url2, function () {
        //page.close();
        //page2.render(capturePath + 'api_page.png');
    });
}, 20000);

// Step 5

// must be locally accessible
var parseStr = "";
var movieTitle = "";
var allMoviesArray = [];

setTimeout(function() {
    console.log("Api page successfully loaded");
    console.log('---------------------------------');
    console.log("### STEP 5: Grab all move titles");

    var movies = page2.evaluate(function() {
    var string      = document.getElementsByTagName('pre')[0].textContent;
        //movies      = JSON.parse(string);
        return string;
    });

        parseStr   = JSON.parse(movies);
        //console.log(parseStr.catalogItems[10].title);
    for (i = 0; i < parseStr.catalogItems.length; i++) {
        movieTitle = parseStr.catalogItems[i].title;
        console.log(movieTitle);
        allMoviesArray.push(movieTitle)
    }

}, 25000);

// ===============================================
// let the magic begin!

setTimeout(function() {
    console.log(parseStr.catalogItems.length + " movies in this category!");
    //console.log(allMoviesArray)
}, 27000);

var page1 = require('webpage').create();

var words = allMoviesArray;
var counter = 0;
var scoresFinal = [];

//  don't load css
page1.onResourceRequested = function(requestData, request) {
    if ((/http:\/\/.+?\.css$/gi).test(requestData['url'])) {
        request.abort();
    }
};

// suppress annoying rotten tomatoes page errors
page1.onError = function(msg, trace) {
    console.error("");
};

// log new url
page1.onUrlChanged = function(targetUrl) {
    console.log('-');
    console.log('New URL: ' + targetUrl);
    console.log('-');
    if (targetUrl.indexOf("search") > -1) {
        console.log("On the search results page");
    }
};


// open rotten tomatoes page
setTimeout(function(){
    page1.open(tomatoUrl);
}, 30000);

setTimeout(function() {

// recursive function
function delayedLoop() {

    console.log('Tomato is searching for: ' + words[counter]);

    // string to search in rotten tomatoes
    var searchQuery = words[counter];
        // delay for x seconds
        setTimeout(function(){
            page1.evaluate(function(searchQuery){
                // run the search
                document.getElementById('mini_searchbox').value = searchQuery;
                document.querySelector(".searchBox button").click();
            }, searchQuery);
        }, 2000);

    // run x seconds after opening the page
    setTimeout(function(){
        //page1.render(capturePath + 'rotten' + i + '.png');
        var scores = page1.evaluate(function() {
            // if on search results page
            if (document.title.indexOf("Search Results") > -1) {
                var criticScore = document.querySelectorAll('.tmeter .tMeterIcon .tMeterScore')[0].textContent,
                    title       = document.querySelectorAll('.media_block_content .nomargin a')[0].textContent,
                    results     = title + " Critic Score: " + criticScore;
            }
            else {
                // otherwise search went straight to movie
                // grab scores
            var criticScore   = document.getElementById('all-critics-meter').textContent,
                userScore     = document.getElementsByClassName('popcorn')[0].textContent,
                title         = document.querySelectorAll('.movie_title span')[0].textContent,
                results       = title + " Critic Score: " + criticScore + "%" + " Audience Score: " + userScore + "%" ;
            }

            return results;

        });

        if(typeof scores === null) {
            console.log("-");
            console.log(counter + " result of " + parseStr.catalogItems.length);
            console.log("-");
            console.log("Movie isn't available in Rotten Tomatoes database");
            console.log("-");
            console.log("---------------------------------------------------------------------------");
            console.log("-");
        } else {
            console.log("-");
            console.log(counter + " result of " + parseStr.catalogItems.length);
            console.log("-");
            console.log("Ratings -- " + scores);
            console.log("-");
            console.log("---------------------------------------------------------------------------");
            console.log("-");
        }
        // push scores to array
        scoresFinal.push(scores);
    }, 7000)


    // stop recursion at end of array
    if (++counter > words.length) {
        // write scores from array to txt file
        try {
            fs.write(notesPath + "results.txt", scoresFinal, 'w');
        } catch(e) {
            console.log(e);
        }

        // exit phantom once recursion is finished
        phantom.exit();
    }

    // recursively call function every x seconds
    setTimeout(delayedLoop, 7500);
}

// begin recursion
delayedLoop();

}, 35000);