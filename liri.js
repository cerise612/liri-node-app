// pretty-print

var dotenv = require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

var command = process.argv[2];

// user prompt
// inquirer
//   .prompt([
//     {
//         type: "list",
//         name: "doingWhat",
//         message: "What Action Would You Like To Perform?",
//         choices: [
//           "my-tweets",
//           "spotify-this-song",
//           "movie-this",
//         ]
//     },
//   ]).then(function(res) {
//     switch (res.doingWhat) {
//     case res.doingWhat === "my-tweets":
//       getMyTweets();
//       break;
//     case res.doingWhat === "spotify-this-song":
//       getMeSpotify(functionData);
//       break;
//     case res.doingWhat === "movie-this":
//       getMeMovie(functionData);
//       break;
//     default:
//       console.log("LIRI doesn't know that");
//   };
//   });

// Writes to the log.txt file
// var getArtistNames = function(artist) {
//   return artist.name;
// };

// Function for running a Spotify search
var getMeSpotify = function(query) {
   var spotify = new Spotify(keys.spotify);

    if (query === "undefined") {
        query = "Welcome To The Jungle";
    }

    spotify.search({ type: 'track', query: query }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var song = data.tracks.items[0];

        stringSong = "\r\nspotify-this-song\r\nArtist: " + song.album.artists[0].name + "\r\nSong Name: " + song.name + "\r\nPreview URL: " + song.preview_url + "\r\nAlbum: " + song.album.name
        console.log(stringSong);

        fs.appendFile("log.txt", stringSong, function (err) {
            if (err) {
                return console.log(err);
            }
        });

    });

}
// Function for running a Twitter Search
var getMyTweets = function() {
 var client = new Twitter(keys.twitter);
    client.get('statuses/user_timeline', { screen_name: 'a1000strngeplce', count: 20 }, function (error, tweets, response) {
        fs.appendFile("log.txt", "my-tweets command:\r", function (err) {
            if (err) {
                return console.log(err);
            }
        });
        for (x in tweets) {
            console.log(tweets[x].text);
            fs.appendFile("log.txt", tweets[x].text + "\r", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
}

// Function for running a Movie Search
var getMeMovie = function(query) {
    if (query === "undefined") {
        query = "Mr Nobody";
    }
    request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            data = JSON.parse(body);
            stringMovie = "\r\nmovie-this\r\nTitle: " + data.Title + "\r\nYear: " + data.Year + "\r\nIMDB Rating: " + data.Ratings[0].Value + "\r\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\r\nProduced in: " + data.Country + "\r\nLanguage: " + data.Language + "\r\nPlot: " + data.Plot + "\r\nActors: " + data.Actors
            console.log(stringMovie);
            fs.appendFile("log.txt", stringMovie, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
};

var doWhat = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);

    });
};

if (process.argv.length > 3) {
    var query = process.argv.slice(3).join(" ");
} else {
    query = "undefined"
}
if (command === "my-tweets") {
    getMeSpotify();
} else if (command === "spotify-this-song") {
    getMyTweets(query);
} else if (command === "movie-this") {
    getMeMovie(query);
} else if (command === "do-what-it-says") {
    doWhat(query);
} else {
    console.log("Invalid command");
}


