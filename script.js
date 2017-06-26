// Speech Recognition Variables
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphoneButton = document.querySelector(".fa-microphone");
const recognition = new SpeechRecognition();

// Gather buttons and search area
var $searchField = $('#searcharea');
var $submitButton = $('#searchbutton');
var $celsiusButton = $('<button>Celsius</button>');
var $fahrenheitButton = $('<button>Fahrenheit</button>');

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');
  $searchField.val(transcript);
  $('button').click();
});

function toggleMicrophone() {
  recognition.start();
}

// If enter button is clicked, trigger a button click
$('#searcharea').keyup(function(e){
  if(e.keyCode == 13) {
    $('button').click();
  }
});

// Display Weather
$('button').click(function() {

  // Grabs all tempeature units
  var spans = document.getElementsByClassName("temp");
  // Array to hold current temperature values
  var temperatureArray = [];

  // Disable button whilst data is being fetched
  $searchField.prop("disabled", true);
  $submitButton.attr("disabled", true).html("Loading...");

  // AJAX URL and data params
  var url = "http://api.openweathermap.org/data/2.5/forecast/";
  var city = $searchField.val();
  var data = {
    q : city,
    appid : "e384678fabc57f4af277fff449ee339c",
    units : "metric"
  }

  function toCelsius(arr, spans) {
    for(var i = 0; i < arr.length; i++) {
      arr[i] = Math.round((arr[i] - 32) * (5 / 9));
    }
    for(var i = 0; i < spans.length; i++) {
      spans[i].innerHTML = arr[i] + "&#8451";
    }
    $fahrenheitButton.attr("disabled", false);
    $celsiusButton.attr("disabled", true);
  }

  function toFahrenheit(arr, spans) {
    for(var i = 0; i < arr.length; i++) {
      arr[i] = Math.round((arr[i] * (9 / 5)) + 32);
    }
    for(var i = 0; i < spans.length; i++) {
      spans[i].innerHTML = arr[i] + "&#8457";
    }
    $celsiusButton.attr("disabled", false);
    $fahrenheitButton.attr("disabled", true);
  }

  function averageTemperature(temperatureArray) {
    var sum = 0;
    var average;
    for (var i = 0, j = temperatureArray.length; i < j; i++) {
      sum += temperatureArray[i];
    }
     average = sum / temperatureArray.length;
     if(average > 20 && average < 25) {
        $('body').addClass("hot");
     } else if (average >= 25) {
        $('body').addClass("very-hot");
     } else if(average > 7 && average <= 20) {
        $('body').addClass("cold");
     } else {
        $('body').addClass("freezing");
     }
  }

  // AJAX Callback
  function callback(data) {
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
        $("#result").append("<p>" + time + ' // ' + '<span class="temp">' + temp + '&#8451' + '</span>' + ' // ' + weather + ' // ' + windSpeed + "</p>");
      }

      averageTemperature(temperatureArray);

      $("#result").append($celsiusButton);
      $("#result").append($fahrenheitButton);

      // Re-enable button after API call is finished
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false).html("Search");


    $celsiusButton.attr("disabled", true);

    $($fahrenheitButton).click(function() {
      toFahrenheit(temperatureArray, spans);
    });

    $($celsiusButton).click(function() {
      toCelsius(temperatureArray, spans);
    });

  }
// get JSON from API
$.getJSON(url, data, callback)
  .fail(function() {
    $("#result").empty().addClass("border");
    $("#result").append("This area doesn't exist, please try again!");
    $searchField.prop("disabled", false);
    $submitButton.attr("disabled", false).html("Search");
  })
});

microphoneButton.addEventListener('click', toggleMicrophone);
