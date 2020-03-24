'use strict';
// Express
const express = require('express');

const superagent = require('superagent');

// initialize a server
const server = express();


// Cross Origin Resource Sharing
const cors = require('cors');
server.use(cors()); // give access

// get all environment variable you need
require('dotenv').config();
const PORT = process.env.PORT || 3000;
//heek ba3ref aleshi eli bedi a7oto be .env ta3ti
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;


// Make the app listening
server.listen(PORT, () => console.log('Listening at port 3000'));



server.get('/', (request, response) => {
    response.status(200).send('App is working CLAAAAASS');
});

/* {
    "search_query": "lynwood",
    "formatted_query": "lynood,... ,WA, USA",
    "latitude": "47.606210",
    "longitude": "-122.332071"
  }
*/


server.get('/location', locationHandler);

function Location(city, locationData){
    this.formatted_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
    this.search_query = city;
}

function locationHandler(request, response){
    // Read the city from the user (request) and respond
    let city = request.query['city'];
    //the promise
    getLocationData(city)

    //all of the above will wait until the promise happen
        .then( (data) => {
            response.status(200).send(data);
        });
        //ma3na alabel kolo
        //when the promise happen get the data yhen send it as a response to the city request

}
//i will call this function in thelocation handler
function getLocationData(city){
    //GEOCODE_API_KEY 7ateto badal alkey 3ashan alnas ma tshofo
    //o ro7et 3ala .env o 3arafto honak la2no al . env ma 7ada beshofo eza 3melet push bekoon 5as bjehazi fa8a6
//o kaman 5aleet {city} 3ashan yekoon dynamic o yest2bel ay variable
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json&limit=1`;

    // Superagent
   //ma3naha go git the data
    //a tool that allows you to go to ant Api call the Api give the data and give it to us as a response
    return superagent.get(url)
    //when you get the data then console.log it
    //ma3naha data recieved   
    .then( (data) => {
            //3melna .body to give us the actual data not all of the object
            //we assign the data we got to a variable then this variable is the one that will be shown

            let location = new Location(city, data.body);
            return location;
        });
    }



server.get('/weather', weatherHandler);

function Weather(day){
    this.time = new Date(day.time*1000).toDateString();
    this.forecast = day.summary;
}

function weatherHandler(request, response){
    let lat = request.query['latitude'];
    let lng = request.query['longitude'];
    getWeatherData(lat, lng)
    .then( (data) => {
        response.status(200).send(data);
    });
    
}

function getWeatherData(lat, lng){
    const url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}`;
    return superagent.get(url)
        .then( (weatherData) => {
            console.log(weatherData.body.daily.data);
            //be alweather esta5damna map la2no aktar men obj mo zzay aloc obj wa7ad
            let weather = weatherData.body.daily.data.map((day) => new Weather(day));
            return weather;
    });
}



server.use('*', (request, response) => {
    response.status(404).send('Sorry, not found');
});

server.use((error, request, response) => {
    response.status(500).send(error);
});


//promises
//i do something i wait for the data when the data get back which will
//be returned to me
//then i need to hand it to the function
//i dont give u the data but i promise u wgen the data recieved i will give it to you
//had ta3reef alpromises
