require("dotenv").config();

var keys = require('./keys.js');

// Get Node File System 
var fs = require('fs');
// Get Node Request
var request = require('request');
// Get Node Spotify
var Spotify = require('node-spotify-api');
// Get Node Twitter
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

// Get Liri command and data from the command prompt

var liriArgs = process.argv.slice(2);
var liriCommand = liriArgs[0];
var liriData = liriArgs[1];

// Main function to process the Liri Commands and Data entered from the command prompt

function liri(liriCommand, liriData) {
    switch (liriCommand) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            if (liriArgs.length === 1) {
                var song = "The Sign Ace of Base";
            } else if (liriArgs.length === 2) {
                var song = liriData;
            } else {
                var song = '';
                for (var i = 1; i < liriArgs.length; i++) {
                    song = song + ' ' + liriArgs[i];
                }
            }
            spotifyThisSong(song);
            break;
        case "movie-this":
            if (liriArgs.length === 1) {
                var movie = "Mr. Nobody";
            } else if (liriArgs.length === 2) {
                var movie = liriData;
            } else {
                var movie = '';
                for (var i = 1; i < liriArgs.length; i++) {
                    movie = movie + ' ' + liriArgs[i];
                }
            }    
            movieThis(movie); 
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("no choice");
    }
}

// Function to process the Liri my-tweets command and show the first 20 twitts.

function myTweets() {
    // Read in the key file.
    //var keys = require('./keys.js');
    // Read in the keyList and an assign the keys to the Twitter client
    //var keyList = keys.twitterKeys;

    
    //var client = new twitter({
    //    consumer_key: keyList.consumer_key,
    //    consumer_secret: keyList.consumer_secret,
    //    access_token_key: keyList.access_token_key,
    //    access_token_secret: keyList.access_token_secret
   // });
    // Assign the screen name and number of tweets to return.
    var params = {
        screen_name: liriData,
    };
    // Get the tweets
    client.get('statuses/user_timeline.json', params, function(error, tweets, response) {
        // Display the tweets and show error if there is an error
        if (!error) {
            if (tweets.length < 20) {
                var numberTweets = tweets.length;
            } else {
                var numberTweets = 20;
            }
            for (var i = 0; i < numberTweets; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('-----------');
            }
        } else {
            console.log('Error occurred: ' + error);
        }
    });
}

// Function to process the Liri spotify-this-song command and search for song.

function spotifyThisSong(song) {
    // Search for song 
    spotify.search({ type: 'track', query: song }, function(error, response) {
        // Display song details and show error if there is an error
        if (!error) {
            console.log('Artist Name: ' + response.tracks.items[0].artists[0].name);
            console.log('Song Name: ' + response.tracks.items[0].name);
            console.log('Preview URL: ' + response.tracks.items[0].preview_url);
            console.log('Album Name: ' + response.tracks.items[0].album.name);
        } else {
            console.log('Error occurred: ' + error);
        }
    });
}

function movieThis(movie) {
	// Search for movie
	    request('http://www.omdbapi.com/?t='+movie+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
        // Display song details and show error if there is an error
        if (!error && response.statusCode == 200) {
        	body = JSON.parse(body);
            console.log('Movie Title: ' + body.Title);
            console.log('Year Released: ' + body.Released);
            console.log('Rating: ' + body.Rated);
            console.log('Production Country: ' + body.Country);
            console.log('Language: ' + body.Language);
            console.log('Plot: ' + body.Plot);
            console.log('Actors: ' + body.Actors);
            console.log('Rotten Tomatoes Rating: ' + body.tomatoUserRating);
            console.log('Rotten Tomatoes URL: ' + body.tomatoURL);
        } else {
            console.log('Error occurred: ' + error);
        }
    });
}

// Function to process the Liri do what it says in the random file and run the correct Liri Command

function doWhatItSays() {
            fs.readFile(liriData, "utf8", function(error,response){
                // split the info on the file at the comma
                var liriArgs = response.split(',');
                // create new variables with the array data
                var liriCommand = liriArgs[0];
                var liriData = liriArgs[1];
                // run the main function again with the data from the file.
                liri(liriCommand,liriData);
            });
}

liri(liriCommand, liriData);
