$('button').click(function() {
  var city = $('#search').val();

  var url = "http://api.openweathermap.org/data/2.5/forecast/weather/";

  var data = {
    q : city,
    APPID : "d408a4f66848e2c8e5747679380bf726",
  }

  function callback(data) {
    console.log(data);
    $("#result").empty().addClass("border");
    $("#result").append("The weather for: " + data.city.name);
  }

  $.getJSON(url, data, callback);

});
