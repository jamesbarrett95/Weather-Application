$('#search').keyup(function(e){
  if(e.keyCode == 13) {
    $('button').click();
  }
});

$('button').click(function() {
  var $searchField = $('#search');
  var $submitButton = $('#button');

  $searchField.prop("disabled", true);
  // Lodaing functionality not working
  $submitButton.attr("disabled", true).val("Loading...");

  var url = "http://api.openweathermap.org/data/2.5/forecast/weather/";
  var city = $searchField.val();

  var data = {
    q : city,
    APPID : "d408a4f66848e2c8e5747679380bf726",
  }

  function callback(data) {
    var div = document.getElementById("result");
    console.log(data);
    $("#result").empty().addClass("border");
    $("#result").append("The weather for: " + data.city.name + "<br>");

    for (var i = 0; i < 5; i++) {
      var time = data.list[i].dt_txt.slice(10) + " //";
      var weather = data.list[i].weather[0].description + " //";
      var windSpeed = "Wind Speed: " + data.list[i].wind.speed;
      $("#result").append("<p>" + time + ' ' + weather + ' ' + windSpeed + "</p>");
    }

    $searchField.prop("disabled", false);
    $submitButton.attr("disabled", false).val("Search");

    var div = document.getElementById("result");



  }

  $.getJSON(url, data, callback);
});
