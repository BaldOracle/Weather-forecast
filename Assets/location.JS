var inputLocation = ''
var start = $('#Start');
//Variables needed for location API 
var cityName = ''
var stateCode = ''
var countryCode = ''
var limit = ''
var zipCode = ''
var longitude = ''

var ApiKey = "b93cfee2cf6c4ff52b56ed5c856c3976";
var weatherApiRoot = 'https://api.openweathermap.org';

var locationAPI = ''

console.log('location.js ' + inputLocation)
// function takeInput(event) {
//     event.preventDefault();
//     //pulling city name if typed in the City name
//     var inputLocation = document.getElementById("Location").value
//     var cityName = inputLocation.trim()
//     console.log('input location: ' + cityName);

//     // How do I take cityName value out of the function?
//     return cityName

//     //Why won't the getCordinates function work?
//     getCordinates()
// }

console.log('out of the function: ' + cityName)

async function getCordinates(event) {
    event.preventDefault();
    //pulling city name if typed in the City name
    var inputLocation = document.getElementById("Location").value
    var cityName = inputLocation.trim()

    var cityCordinatesAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + ApiKey
    console.log(cityCordinatesAPI)
    const response = await fetch(cityCordinatesAPI);
    const data = await response.json();
    var longitude = data[0].lon
    var latitude = data[0].lat

    var startingLong = localStorage.setItem("StartLongitude", longitude);
    var startingLat = localStorage.setItem("StartLatitude", latitude);


}

//$( document ).ready(function() {});
// start.on('click', function (){

//     console.log('input location: ' + inputLocation);
// })

start.on('click', getCordinates)
