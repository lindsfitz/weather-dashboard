// var apiKey = adf080c4900ab48938f6770e1ae7a9c0;
//One call:
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=adf080c4900ab48938f6770e1ae7a9c0


//current weather for main weather card; one call for future forecast cards
var today = moment().format("MMMM Do, YYYY");
var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];

init();

$("#search-button").on("click", function(){
    var searchInput = $("#search-value").val();
    $("#search-value").val("")
    //place search weather function w searchInput as argument
    weatherSearch(searchInput);
    saveSearch(searchInput);
})

$("#history").on("click", function(event){
    // element = event.target
    newInput = $(event.target).text()
    weatherSearch(newInput)
    
})

function weatherSearch(input) {
    $("#current").empty();
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q="+input+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        var cityname,temp,wind,humidity;
        cityname = $("<h2>").addClass("city-name").text(data.name+"  -  "+today);
        temp = $("<p>").text("Temp: "+data.main.temp+"℉");
        wind = $("<p>").text("Wind: "+data.wind.speed+"MPH");
        humidity = $("<p>").text("Humidity: "+data.main.humidity+"%");

        $("#current").append(cityname,temp,wind,humidity);    
        
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        forecastSearch(lat,lon);
    })
}

function forecastSearch(lat,lon) {
    $("#fiveday").empty();
    var APIurl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        console.log(data)
        for (let i = 1; i < (data.daily.length-2); i++) {
            var temp = $("<p>").addClass("card-text").text("Temp: "+data.daily[i].temp.day+"℉");
            var wind = $("<p>").addClass("card-text").text("Wind: "+data.daily[i].wind_speed+"MPH");
            var humidity = $("<p>").addClass("card-text").text("Humidity: "+data.daily[i].humidity+"%");

            var cardBody = $("<div>").addClass("card-body");
            var cardDiv = $("<div>").addClass("card").attr("style","width:12rem;");
            var date = moment().add(i,"days").format("MMMM Do, YYYY");
            var cardDate = $("<h5>").addClass("card-title").text(date);

            $(cardBody).append(cardDate,temp,wind,humidity);
            $(cardDiv).append(cardBody);
            $("#fiveday").append(cardDiv);
        }
    })
}

function saveSearch(searchInput) {
   if (!searchHistory.includes(searchInput)) {
    var searchButton = $("<button>").addClass("list-group-item list-group-item-action").attr("style","width:15rem").text(searchInput);
     $("#history").append(searchButton);
    searchHistory.push(searchInput);
   } else {return}
    localStorage.setItem("search-history",JSON.stringify(searchHistory));
}

function init() {
    var savedHistory = JSON.parse(localStorage.getItem("search-history")) || [];
    if (savedHistory === null) {
        return;
    } else {
        for (let i = 0; i < savedHistory.length; i++) {
            var searchButton = $("<button>").addClass("list-group-item list-group-item-action historyBtn").attr("style","width:15rem").text(savedHistory[i]);
            $("#history").append(searchButton);
        }
    }
}