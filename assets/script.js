const apiKey = "7ce89d87b02459231922b9a81bb734f6";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
let forecastData;

// temporarily set API call to new location Button
$("#newCityButton").click(function (e) {
  e.preventDefault();
  // Show loading screen
  loadingSpinner();
  let cityName = $("#cityInput").val();
  const todayQuery = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  $.ajax({
    url: todayQuery,
    method: "GET",
  }).done(function (response) {
    console.log(response);
    renderToday(response);
  });
});

function loadingSpinner() {
  $("#addLocationModal").hide();
  $("#weatherContainer").hide();
  $("#loadingSpinner").show();
}

function showWeather() {
  $("#loadingSpinner").hide();
  $("#addLocationModal").hide();
  $("#weatherContainer").show();
}

function showNewCity() {
  $("#loadingSpinner").hide();
  $("#weatherContainer").hide();
  $("#addLocationModal").show();
}

function renderToday(data) {
  // Update all the DOM elements with API data
  $("#city").text(data.name);
  $("#todayTemp").text(`${Math.round(data.main.temp)}°C`);
  $("#todayHighLow").text(
    `${Math.round(data.main.temp_max)}° | ${Math.round(data.main.temp_min)}°`
  );
  $("#todayCondition").text(titleCase(data.weather[0].description));
  $("#todayHumid").text(data.main.humidity + "%");
  $("#todayWind").text(data.wind.speed + "km/h");
  // Call renderForecast to Update 5 day forecast names
  // Call renderGraphics to update weather visuals
  renderGraphics(data.weather[0].main, data.weather[0].description);
  requestForecast(data.coord.lat, data.coord.lon);
}

function requestForecast(lat, long) {
  const forecastQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
  $.ajax({
    url: forecastQuery,
    method: "GET",
  }).done(function (response) {
    forecastData = response;
    $("#todayUV").text(response.current.uvi);
    if (response.current.uvi > 8) {
      $("#todayUV").css("background-color", "#D26060");
    } else if (response.current.uvi > 5) {
      $("#todayUV").css("background-color", "#E4A23E");
    } else {
      $("#todayUV").css("background-color", "#A2D17E");
    }
    renderForecast(response);
    showWeather();
  });
}

function renderForecast(data) {
  // loop through the next 5 days and add elements to the DOM
  for (let i = 1; i < 6; i++) {
    const newDiv = $("<div>");
    const day = $("<p>");
    const newIcon = $("<img>");
    const temp = $("<p>");
    const humidity = $("<p>");

    // Set Day of Week
    $(day).text(timestampDay(data.daily[i].dt));
    $(day).addClass("day");
    $(newDiv).addClass("futureForecast");
    $(temp).text(Math.round(data.daily[i].temp.max) + "°");
    $(temp).addClass("temp");
    $(humidity).text(`Humidity: ${data.daily[i].humidity}%`);
    $(humidity).addClass("humidity");
    switch (data.daily[i].weather[0].main) {
      case "Clouds":
        if (data.daily[i].weather[0].description.includes("overcast")) {
          $(newIcon).attr("src", "assets/images/cloud.svg");
        } else {
          // use partly cloudy icon
          $(newIcon).attr("src", "assets/images/partly-cloudy.svg");
        }
        break;
      case "Clear":
        $(newIcon).attr("src", "assets/images/sun.svg");
        break;
      case "Rain":
      case "Drizzle":
        $(newIcon).attr("src", "assets/images/rain.svg");
        break;
      case "Thunderstorm":
        $(newIcon).attr("src", "assets/images/thunderstorm.svg");
        break;
      case "Snow":
        $(newIcon).attr("src", "assets/images/snow.svg");
        break;
      default:
        $(newIcon).attr("src", "assets/images/cloud.svg");
    }
    // Append all the new elements to our newDiv
    $(newDiv).append(day, newIcon, temp, humidity);
    // Finally append our completed newDiv to the DOM
    $("#weekForecast").append(newDiv);
  }
}

// Function to get Day of week from UNIX timestamp
function timestampDay(timestamp) {
  let date = new Date(timestamp * 1000);
  return daysOfWeek[date.getDay()];
}

// Function to change the visual appearance to reflect the current weather
function renderGraphics(weather, desc) {
  // Remove previously added classes if any
  $("body").removeClass();
  $("#weatherIcon").removeClass();

  // Change visuals based on weather
  switch (weather) {
    case "Clouds":
      $("#bgFooter").css("fill", "#B3C7C3");
      if (desc.includes("overcast")) {
        // use cloud icon
        $("#weatherIcon").attr("src", "assets/images/cloud.svg");
        $("body").addClass("cloudy");
        $("#weatherIcon").addClass("cloud");
      } else {
        // use partly cloudy icon
        $("#weatherIcon").attr("src", "assets/images/partly-cloudy.svg");
        $("body").addClass("partlyCloudy");
      }
      break;
    case "Clear":
      $("body").addClass("sunny");
      $("#bgFooter").css("fill", "#99D9BE");
      $("#weatherIcon").attr("src", "assets/images/sun.svg");
      break;
    case "Rain":
    case "Drizzle":
      $("body").addClass("rain");
      $("#bgFooter").css("fill", "#B3C7C3");
      $("#weatherIcon").attr("src", "assets/images/rain.svg");
      $("#weatherIcon").addClass("cloud");
      break;
    case "Thunderstorm":
      $("body").addClass("tstorm");
      $("#bgFooter").css("fill", "#96ABAE");
      $("#weatherIcon").attr("src", "assets/images/thunderstorm.svg");
      $("#weatherIcon").addClass("cloud");
      break;
    case "Snow":
      $("body").addClass("cloudy");
      $("#bgFooter").css("fill", "#B3C7C3");
      $("#weatherIcon").attr("src", "assets/images/snow.svg");
      $("#weatherIcon").addClass("cloud");
      break;
    // For all other cases, go with these cloudy defaults
    default:
      $("#weatherIcon").attr("src", "assets/images/cloud.svg");
      $("body").addClass("cloudy");
      $("#bgFooter").css("fill", "#B3C7C3");
      $("#weatherIcon").addClass("cloud");
  }
}

// Function takes a string for input and returns it in Title Case Format
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// Either a function or a jQuery call to toggle side menu
// The same for the new city menu
