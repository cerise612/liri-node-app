// pretty-print

require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

// user prompt
inquirer
  .prompt([
    {
        type: "list",
        name: "doingWhat",
        message: "What Action Would You Like To Perform?",
        choices: [
          "my-tweets",
          "spotify-this-song",
          "movie-this",
        ]
    },
  ]).then(function(res) {
    switch (res.doingWhat) {
    case res.doingWhat === "my-tweets":
      getMyTweets();
      break;
    case res.doingWhat === "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case res.doingWhat === "movie-this":
      getMeMovie(functionData);
      break;
    default:
      console.log("LIRI doesn't know that");
  };
  });

// Writes to the log.txt file
var getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "Redbone";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

// Function for running a Twitter Search
var getMyTweets = function() {
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: "athousandstrangeplaces"
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};

// Function for running a Movie Search
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mrs Doubtfire";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};




