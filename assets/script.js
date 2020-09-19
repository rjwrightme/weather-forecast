const apiKey = "7ce89d87b02459231922b9a81bb734f6";
let cityName = "Sydney";
const todayQuery = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

// temporarily set API call to new location Button
$("#addLocation").click(function () {
  $.ajax({
    url: todayQuery,
    method: "GET",
  }).done(function (response) {
    console.log(response);
    renderToday(response);
  });
});

function renderToday(data) {
  // Change City Name = data.name
  $("#city").text(data.name);
  // Update all the stats
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
}

function renderForecast(lat, long) {
  const forecastQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
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

function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// Either a function or a jQuery call to toggle side menu
// The same for the new city menu
