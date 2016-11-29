// If enter button is clicked, trigger a button click
$('#search').keyup(function(e){
  if(e.keyCode == 13) {
    $('button').click();
  }
});

// Display Weather
$('button').click(function() {
  var $searchField = $('#search');
  var $submitButton = $('#button');

  // Disable button whilst data is being fetched
  $searchField.prop("disabled", true);
  $submitButton.attr("disabled", true).html("Loading...");

  // AJAX URL and data params
  var url = "http://api.openweathermap.org/data/2.5/forecast/weather/";
  var city = $searchField.val();
  var data = {
    q : city,
    APPID : "d408a4f66848e2c8e5747679380bf726",
  }

  // AJAX Callback
  function callback(data) {

    if(data.cod === "404") {
      $("#result").empty().addClass("border");
      $("#result").append("This area doesn't exist, please try again!");
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false).html("Search");
    } else {
      // Add border around result area and display user's city
      $("#result").empty().addClass("border");
      $("#result").append("The weather for: " + data.city.name + "<br>");

      // Grab first 5 weather entries and display them on the screen
      for (var i = 0; i < 5; i++) {
        var time = data.list[i].dt_txt.slice(10) + " //";
        var weather = data.list[i].weather[0].description + " //";
        var windSpeed = "Wind Speed: " + data.list[i].wind.speed;

        $("#result").append("<p>" + time + ' ' + weather + ' ' + windSpeed + "</p>");
      }

      // Re-enable button after API call is finished
      $searchField.prop("disabled", false);
      $submitButton.attr("disabled", false).html("Search");
    }
  }

// get JSON from API
$.getJSON(url, data, callback);
});
