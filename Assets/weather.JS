//add weather API root and key variables
var weatherApiKey = "b93cfee2cf6c4ff52b56ed5c856c3976";
var weatherApiRoot = 'https://api.openweathermap.org';
var historyCities = [];
var startCity = $('#Start');
var forecastDiv = document.querySelector(".Weather-Display")
var cityID = $('#PrevCities')
var previousCity = $('#previousHistory')
var clearHist = $('#clear')
var currentWeather = $('.Current-Weather')

async function clearLocalStorage(){
  localStorage.clear();
}

if (localStorage.getItem("cityHistory")) {
  historyCities = JSON.parse(localStorage.getItem("cityHistory"))
  renderCities()
}


//function to take the name of a new city and get longitude and latitude 
async function getCordinates(event) {
  event.preventDefault();

  
  //pulling city name if typed in the City name
  let inputLocation = document.getElementById("Location").value

  if(!inputLocation){
    alert('Input City')
  }
  var cityName = inputLocation.trim()

  var cityCordinatesAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + weatherApiKey
  const response = await fetch(cityCordinatesAPI);
  const data = await response.json();
  var longitude = data[0].lon
  var latitude = data[0].lat
  historyCities.push(data[0].name);
  localStorage.setItem("cityHistory", JSON.stringify(historyCities))
  renderCities()
  getStartWeatherData(data[0].name, longitude, latitude)
  getCurrentWeatherData(data[0].name, longitude, latitude)
  
}

//using the existing tiles to get city name then get the courdinates. 
async function oldCordinates(event) {
  event.preventDefault();
  forecastDiv.innerHTML = ""
  //pulling city name if typed in the City name
  //https://www.w3schools.com/jsref/event_target.asp
     
  let cityName = event.target.innerText
  //let cityName = inputLocation.trim()
  var cityCordinatesAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + weatherApiKey
  const response = await fetch(cityCordinatesAPI);
  const data = await response.json();
  var longitude = data[0].lon
  var latitude = data[0].lat
 
  getStartWeatherData(data[0].name, longitude, latitude)
  getCurrentWeatherData(data[0].name, longitude, latitude)
}

function renderCities() {
  var historyDiv = document.getElementById("previousHistory");

  historyDiv.innerHTML = ""
  for (i = 0; i < historyCities.length; i++) {
    var newBtn = document.createElement("button")
    newBtn.setAttribute("class", "btn btn-info");
    newBtn.setAttribute("id", "PrevCities")
    newBtn.textContent = historyCities[i];

    historyDiv.append(newBtn)
  }
}

// Function to pull 5 day weather information.
async function getStartWeatherData(startingCity, longitude, latitude) {
  var startWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + weatherApiKey + '&units=imperial'

  const response = await fetch(startWeather);
  const data = await response.json();
  
  forecastDiv.innerHTML = ""

  //create for loops for all variables to have just needed data for next 5 days @ 3pm every day
  for (var i = 4; i < data.list.length; i += 8) {
    //everytime the loop is iterated a new empty div is created
    var divCard = document.createElement('div')
    divCard.className = "card"

  //using bootstrap card to hold data. 
    weatherCard = `
    
      <div class="card" >
        <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${startingCity}</h5>
          <p class="card-text">${data.list[i].weather[0].description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Temp: ${data.list[i].main.temp}</li>
          <li class="list-group-item">Wind Speed: ${data.list[i].wind.speed}</li>
          <li class="list-group-item">Humidity: ${data.list[i].main.humidity}</li>
          <li class="list-group-item">${data.list[i].dt_txt}</li>
        </ul>
      </div>
      </div>
      
    `

    //write the html content to the div card that was created
    divCard.innerHTML = weatherCard

    //append the div card to the forecast div
    forecastDiv.appendChild(divCard)
  }
}

async function getCurrentWeatherData(startingCity, longitude, latitude) {
  var startWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + weatherApiKey + '&units=imperial'


  const response = await fetch(startWeather);
  const data = await response.json();
  currentWeather.innerHTML = ""

    var divCard2 = document.createElement('div')
    divCard2.className = "card"

  //using bootstrap card to hold data. 
    weatherCard = `
    
      <div class="card" >
        <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${startingCity}</h5>
          <p class="card-text">${data.weather[0].description}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Temp: ${data.main.temp}</li>
          <li class="list-group-item">Wind Speed: ${data.wind.speed}</li>
          <li class="list-group-item">Humidity: ${data.main.humidity}</li>
          <li class="list-group-item">Weather now</li>
        </ul>
      </div>
      </div>
      
    `

    //write the html content to the div card that was created
    divCard2.innerHTML = weatherCard

    //append the div card to the forecast div
    currentWeather.append(weatherCard)
  
}

startCity.on('click', getCordinates);
previousCity.on('click', oldCordinates);
clearHist.on('click', clearLocalStorage);

