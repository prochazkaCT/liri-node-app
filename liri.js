// Node module imports needed to run the functions
require("dotenv").config();    
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var liriInput= process.argv[2];
var input = process.argv[3];

// Commands for the liri app
switch(liriInput) {
    case "my-tweets": 
    myTweets(); 
    break;
        
    case "spotify-this-song": 
    spotifyThisSong(); 
    break;
    
    case "movie-this": 
    movieThis(); 
    break;
        
    case "do-what-it-says": 
    doWhatItSays(); 
    break;
        
    // Instructions displayed in terminal to the user if nothing is inputted
	default: console.log("\r\n" +"To use LIRI, you can type in the following commands after 'node liri.js'." + "\n" + "If the song or movie name has more than one word, put the name in quotation marks." + "\n" + "For example, node liri.js spotify-this-song 'all hands on the bad one'" +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says."+"\r\n");
};

//Tweet function
//please don't make me tweet anymore -- it works ;) 
function myTweets () {
	var params = {
		screen_name: 'BettyBo86449136',
		count: 7
	}
	if(input == null){
		input = params;
	}
	client.get("statuses/user_timeline/", params, function(error, data, response){
		if (!error && response.statusCode == 200) {
			for(var i = 0; i < data.length; i++) {
				var twitterResults = 
				"@" + data[i].user.screen_name + ": " + 
				data[i].text + "\r\n" + 
				data[i].created_at + "\r\n" + 
				"------------------------------ " + i + " ------------------------------" + "\r\n";
				console.log(twitterResults);
				log(twitterResults); // calling log function to print results to log.txt file
			}
		}  else {
			console.log("Error :"+ error);
			return;
		}
	});
}

//Spotify function 
function spotifyThisSong() {
	if (input == null) {
		//hard coded the default
		return console.log("Artist: Ace of Base \nSong: 'The Sign' \nAlbum: 'Greatest Hits' \nPreview Link: 'https://open.spotify.com/track/3DYVWvPh3kGwPasp7yjahc'");
	}
	params = input;
	spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
			var songInfo = data.tracks.items;
			console.log(data);
			for (var i = 0; i < 10; i++) {
			 	if (songInfo[i] != undefined) {
			 		var spotifyResults =
			 		"Artist: " + songInfo[i].artists[0].name + "\r\n" +
			 		"Song: " + songInfo[i].name + "\r\n" +
			 		"Album: " + songInfo[i].album.name + "\r\n" +
			 		"Preview Link: " + songInfo[i].preview_url + "\r\n" + 
                    "     ----------------------------------       ------------------------------------               " + "\r\n";
			 		console.log(spotifyResults);
			 		log(spotifyResults); // // calling log function to print results to log.txt file
			 	}
			}
		}	else {
			console.log("Error :"+ err);
			return;
			}
	});
};
	
// Movie function
function movieThis(){
	if(input == null){
		input = 'mr nobody';
	}
    var params = input;
    request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy",  
    function (error, response, body) {
		if (!error && response.statusCode == 200) {
            // console.log(JSON.parse(body));
			var movieResults =
			"---------------Movie Results-----------------" + "\r\n" +
			"Title: " + JSON.parse(body).Title +"\r\n"+
			"Year: " + JSON.parse(body).Year +"\r\n"+
            "Imdb Rating: " + JSON.parse(body).imdbRating +"\r\n"+
            "Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating +"\r\n"+
			"Country: " + JSON.parse(body).Country +"\r\n"+
			"Language: " + JSON.parse(body).Language +"\r\n"+
			"Plot: " + JSON.parse(body).Plot + "\r\n"+
			"Actors: " + JSON.parse(body).Actors +"\r\n"+
			"---------------End of Movie Results ----------" + "\r\n";
			console.log(movieResults);
			log(movieResults); // calling log function to print results to log.txt file
			} else {
				console.log("Error :"+ error);
				return;
			}
	});
};


// Do What It Says function, uses the read and writes module to access the random.txt file and executes based on the code below:
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data){
		if (error) {
            console.log("Error occurred" + error);
        } else {
            var doWhatItSays = data.split(",");
                if (doWhatItSays[0] === 'spotify-this-song') {
                input = doWhatItSays[1];
                params = input;
                console.log("The song to search is: " + params);
				spotifyThisSong(params);
				log(params); // calling log function to print results to log.txt file
				}
        }
	});
}

//The log function that records the results when called above 
function log(logResults) {
	fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
			throw error;
	    }
    });
}

//the end :) 