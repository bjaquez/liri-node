require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var myKeys = require("./keys.js");
var spotify = new Spotify(myKeys.spotify);



var command = process.argv[2];
var request = require("request");
var artist = process.argv.slice(3).join("+");
var concertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
var moment = require('moment');
var movieName = process.argv.slice(3).join("+");
var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
var songName = process.argv.slice(3).join("+");



switch (command) {
    case "concert-this":
        console.log(artist + " concert:");
        request(concertUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var concertData = JSON.parse(body);
                var venue = concertData[0].venue.name;
                var location = concertData[0].venue.city;
                var date = moment(concertData[0].datetime).format("MM/DD/YYYY");
                console.log("Venue: " + venue); 
                console.log("Location: " + location); 
                console.log("Date: " + date);
            }
        })

        break;
    case "spotify-this-song":
        songCall(songName);
        break;

    case "movie-this":
        console.log("movie");
        request(movieUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var movieData = JSON.parse(body);
                // console.log(movieData);
                console.log("Title: " + movieData.Title);
                console.log("Year: " + movieData.Year);
                console.log(movieData.Ratings[0].Source + " Rating: " + movieData.Ratings[0].Value);
                console.log(movieData.Ratings[1].Source + " Rating: " + movieData.Ratings[1].Value);
                console.log("Country: " + movieData.Country);
                console.log("Language: " + movieData.Language);
                console.log("Plot: " + movieData.Plot);
                console.log("Actors: " + movieData.Actors);

            }
        })
        break;
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            else {
                console.log(data);
                var songTxt = (data.slice(19, data.length - 1));
                songCall(songTxt);

                // split the data to grab the title and pass it throuhg the songCall function
            }
        })
        break;
    default:
        break;
}

function songCall(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //   console.log(data.tracks.items[0]);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song name: " + data.tracks.items[0].name);
        if (data.tracks.items[0].preview_url === "null") {
            console.log("Sorry spotify has no preview for this song :( ")
        }
        else {
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
        }


    });
}