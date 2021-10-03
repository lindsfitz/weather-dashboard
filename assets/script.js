
//current weather for main weather card; one call for future forecast cards
var today = moment().format("MMMM Do, YYYY");
var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];

//call function to pull past searches from localstorage and display them along left side of page
init();

$("#search-button").on("click", function(){
    var searchInput = $("#search-value").val();
    $("#search-value").val("")
    //place search weather function w searchInput as argument
    weatherSearch(searchInput);
    saveSearch(searchInput);
})

//adds listener to entire div and if a button from a past search is clicked, the text within becomes the new search input
$("#history").on("click", function(event){
    // element = event.target
    newInput = $(event.target).text()
    weatherSearch(newInput)
    
})

//function to pull the data from the weather API and create elements to display the information 
function weatherSearch(input) {
    $("#current").empty();
    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q="+input+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        var cityname,temp,wind,humidity,icon;
        cityname = $("<h2>").addClass("city-name").text(data.name+"  -  "+today);
        var iconLink = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
        icon = $('<img>').attr('src',iconLink).attr("style","width:40px;height:40px;")
        temp = $("<p>").text("Temp: "+data.main.temp+"℉");
        wind = $("<p>").text("Wind: "+data.wind.speed+"MPH");
        humidity = $("<p>").text("Humidity: "+data.main.humidity+"%");

        $("#current").append(cityname,icon,temp,wind,humidity);    
        
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        forecastSearch(lat,lon);
    })
}

//pulling the data from the weather API to display the 5 day forcast. Includes an if statement to color code the UV index and a for loop to create the elements for each of the 5 days and append to the page. 
function forecastSearch(lat,lon) {
    $("#fiveday").empty();
    $('#fivedayHeader').empty();
    var APIurl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=adf080c4900ab48938f6770e1ae7a9c0&units=imperial"
    fetch(APIurl)
    .then(response => {return response.json()})
    .then(data => {
        var uvIndex = data.current.uvi;
        var uvIndexEl = $("<p>").text("UV Index: " + uvIndex);
        if (uvIndex < 3) {
            uvIndexEl.addClass("low-index")
        } else if (uvIndex > 2 && uvIndex < 6) {
            uvIndexEl.addClass("moderate-index")
        } else if (uvIndex > 5 && uvIndex < 8) {
            uvIndexEl.addClass("high-index")
        } else if (uvIndex > 7 && uvIndex < 11) {
            uvIndexEl.addClass("very-high-index")
        } else {uvIndexEl.addClass("extreme-index")}

        $("#current").append(uvIndexEl).attr("style","border: 1px solid black");

        
        var divHeader = $("<h3>").text("5 Day Forecast:")
        $("#fivedayHeader").append(divHeader);

        for (let i = 1; i < (data.daily.length-2); i++) {
            var temp = $("<p>").addClass("card-text").text("Temp: "+data.daily[i].temp.day+"℉");
            var wind = $("<p>").addClass("card-text").text("Wind: "+data.daily[i].wind_speed+"MPH");
            var humidity = $("<p>").addClass("card-text").text("Humidity: "+data.daily[i].humidity+"%");
            var iconLink = "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+"@2x.png";
            var icon = $('<img>').attr('src',iconLink).attr("style","width:30px;height:30px;")
            

            var cardBody = $("<div>").addClass("card-body");
            var cardDiv = $("<div>").addClass("card mt5").attr("style","width:11rem;");
            var date = moment().add(i,"days").format("MMM Do, YYYY");
            var cardDate = $("<h5>").addClass("card-title").text(date);

            $(cardBody).append(cardDate,icon,temp,wind,humidity);
            $(cardDiv).append(cardBody);
            $("#fiveday").append(cardDiv);
        }
    })
}


//function to save the past searches as buttons on the left side and save them in local storage so they can be displayed on page refresh. if statement to make sure there are no repeat searches listed 
function saveSearch(searchInput) {
   if (!searchHistory.includes(searchInput)) {
    var searchButton = $("<button>").addClass("list-group-item list-group-item-action").attr("style","width:15rem").text(searchInput);
     $("#history").append(searchButton);
    searchHistory.push(searchInput);
   } else {return}
    localStorage.setItem("search-history",JSON.stringify(searchHistory));
}


//on page load, pull history from local storage and create buttons
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