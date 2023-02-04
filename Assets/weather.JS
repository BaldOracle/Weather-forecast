//add weather API root and key variables
var weatherApiKey = "b93cfee2cf6c4ff52b56ed5c856c3976";
var weatherApiRoot = 'https://api.openweathermap.org';
var historyCities = [];
if(localStorage.getItem("cityHistory"))
{
  historyCities = JSON.parse(localStorage.getItem("cityHistory"))
}
// var givenApiKey = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=b93cfee2cf6c4ff52b56ed5c856c3976'
console.log(weatherApiKey)

var startCity = $('#Start');
var forecastDiv = document.querySelector(".Weather-Display")

//function to take the name of a city and get longitude and latitude 
async function getCordinates(event) {
  event.preventDefault();
  //pulling city name if typed in the City name
  var inputLocation = document.getElementById("Location").value
  var cityName = inputLocation.trim()

  var cityCordinatesAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + weatherApiKey
  //console.log(cityCordinatesAPI)
  const response = await fetch(cityCordinatesAPI);
  const data = await response.json();
  var longitude = data[0].lon
  var latitude = data[0].lat
  historyCities.push(data[0].name);
  localStorage.setItem("cityHistory", JSON.stringify(historyCities))
  renderCities()
  getStartWeatherData(data[0].name, longitude, latitude)
}

renderCities()

function renderCities() {
  var historyDiv = document.getElementById("previousHistory");

  historyDiv.innerHTML =""
  for(i=0; i<historyCities.length; i++)
  {
    var newBtn = document.createElement("button")
    newBtn.setAttribute("class", "btn btn-info");
    newBtn.textContent = historyCities[i];

    historyDiv.append(newBtn)
  }
}

// Function to pull weather information at the starting point.
async function getStartWeatherData(startingCity, longitude, latitude) {
  var startWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + weatherApiKey + '&units=imperial'

  const response = await fetch(startWeather);
  const data = await response.json();
   

  forecastDiv.innerHTML = ""

  if (startingCity === null) {
    forecastDiv.textContent = "Create route first"
  }

  //create for loops for all variables to have just needed data for next 5 days @ 3pm every day
  for (var i = 4; i < data.list.length; i += 8) {
    //everytime the loop is iterated a new empty div is created
    var divCard = document.createElement('div')
    divCard.className = "card"

    //html card content
    weatherCard = `
    
            <div class="card-content">
              <div class="media is pulled-right">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">${startingCity}</p>
                  <p class="subtitle is-6">${data.list[i].weather[0].description}</p>
                </div>
              </div>
          
              <div class="content">
                <br>
                <p> Temp: ${data.list[i].main.temp}</p>
                <p> Wind Speed: ${data.list[i].wind.speed} </p>
                <p> Humidity: ${data.list[i].main.humidity}</p>
                <time datetime="2016-1-1">${data.list[i].dt_txt}</time>
              </div>
            </div>
            `

    //write the html content to the div card that was created
    divCard.innerHTML = weatherCard

    

  

//append the div card to the forecast div
forecastDiv.appendChild(divCard)
  }
}

startCity.on('click', getCordinates)


