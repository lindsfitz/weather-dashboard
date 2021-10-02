// var apiKey = adf080c4900ab48938f6770e1ae7a9c0;
//One call:
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=adf080c4900ab48938f6770e1ae7a9c0


//current weather for main weather card; one call for future forecast cards
var today = moment().format("MMM Do, YYYY")

$("#search-button").on("click", function(){
    var searchInput = $("#search-value").val();
    //place search weather function w searchInput as argument
    weatherSearch(searchInput);
}
)


function weatherSearch(input) {
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q="+input+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        console.log(data);

        var cityname = $("<h2>").addClass("city-name").text(data.name+"  -  "+today)
        var temp = $("<p>").text("Temp: "+data.main.temp+"℉")
        var wind = $("<p>").text("Wind: "+data.wind.speed+"MPH")
        var humidity = $("<p>").text("Humidity: "+data.main.humidity+"%")


        $("#current").append(cityname,temp,wind,humidity)    
        
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        forecastSearch(lat,lon);
    })


}

function forecastSearch(lat,lon) {
    var APIurl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        console.log(data);
        for (let i = 1; i < (data.daily.length-2); i++) {
            var temp = $("<p>").addClass("card-text").text(daily[i].temp.day)
            
        }

    })
}