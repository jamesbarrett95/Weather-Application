// If enter button is clicked, trigger a button click
$('#searcharea').keyup(function(e){
  if(e.keyCode == 13) {
    $('button').click();
  }
});

// Display Weather
$('button').click(function() {

  // Array to hold current temperature values
  var temperatureArray = [];

  // Gather buttons and search area
  var $searchField = $('#searcharea');
  var $submitButton = $('#searchbutton');
  var $celsiusButton = $('<button>Celsius</button>');
  var $fahrenheitButton = $('<button>Fahrenheit</button>');

  // Disable button whilst data is being fetched
  $searchField.prop("disabled", true);
  $submitButton.attr("disabled", true).html("Loading...");

  // AJAX URL and data params
  var url = "http://api.openweathermap.org/data/2.5/forecast/weather/";
  var city = $searchField.val();
  var data = {
    q : city,
    APPID : "d408a4f66848e2c8e5747679380bf726",
    units : "metric",
  }

  function toCelsius(arr) {
    for(var i = 0; i < arr.length; i++) {
      arr[i] = Math.round((arr[i] - 32) * (5 / 9));
    }
    $fahrenheitButton.attr("disabled", false);
    $celsiusButton.attr("disabled", true);
    return arr;
  }

  function toFahrenheit(arr) {
    for(var i = 0; i < arr.length; i++) {
      arr[i] = Math.round((arr[i] * (9 / 5)) + 32);
    }
    $celsiusButton.attr("disabled", false);
    $fahrenheitButton.attr("disabled", true);
    return arr;
  }

  // AJAX Callback
  function callback(data) {
    // If the API throws an error object, display a user friendly message
    if(data.cod === "404") {
      $("#result").empty().addClass("border");
      $("#result").append("This area doesn't exist, please try again!");
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false).html("Search");
      // Otherwise, display the weather information
    } else {
      // Add border around result area and display user's city
      $("#result").empty().addClass("border");
      $("#result").append("The weather for: " + data.city.name + "<br>");

      // Grab first 5 weather entries and display them on the screen
      for (var i = 0; i < 5; i++) {
        var time = data.list[i].dt_txt.slice(10);
        var temp = Math.round(data.list[i].main.temp);
        var weather = data.list[i].weather[0].description;
        var windSpeed = "Wind Speed: " + data.list[i].wind.speed;
        temperatureArray.push(temp);
        $("#result").append("<p>" + time + ' // ' + temp + ' // ' + weather + ' // ' + windSpeed + "</p>");
      }

      $("#result").append($celsiusButton);
      $("#result").append($fahrenheitButton);

      // Re-enable button after API call is finished
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false).html("Search");
    }


    $celsiusButton.attr("disabled", true);

    $($fahrenheitButton).click(function() {
      var fahrenheitArray = toFahrenheit(temperatureArray);
      console.log(fahrenheitArray);
      console.log(temperatureArray);
    });

    $($celsiusButton).click(function() {
      var celsiusArray = toCelsius(temperatureArray);
      console.log(celsiusArray);
      console.log(temperatureArray);
    });
  }

// get JSON from API
$.getJSON(url, data, callback);
});
