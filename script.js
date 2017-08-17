// Speech Recognition Variables
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphoneButton = document.querySelector(".fa-microphone");
const recognition = new SpeechRecognition();

const searchButton = document.getElementById('searchbutton');
const searchArea = document.getElementById('searcharea');
const resultsArea = document.getElementById('result');
const buttonSection = document.querySelector('.button-section');
const celsiusButton = document.getElementById('celsiusbutton');
const fahrenheitButton = document.getElementById('fahrenheitbutton');
const searchValue = document.querySelector('.searchresult');

const resultAreaChildren = Array.from(document.querySelector('.resultarea').children);

// This variable is global so we can attach it to our Celsius and Fahrenheit event listeners
const temperatures = [];


function toCelsius() {
  const temps = Array.from(resultsArea.querySelectorAll('.temp'));
  temps.map((temp, i) => {
    temp.innerHTML = temperatures[i];
  });
}

function toFahrenheit(tempArr) {  
  const temps = Array.from(resultsArea.querySelectorAll('.temp'));
  const converted = tempArr.map(temp => {
    return Math.round(temp * 9 / 5 + 32);  
  });

  temps.map((temp, i) => {
    temp.innerHTML = converted[i];
  });
}

async function getWeather() {
  searchButton.disabled = true;
  searchButton.textContent = 'Loading...';
  celsiusButton.disabled = true;
  // URL params
  const appid = "e384678fabc57f4af277fff449ee339c";
  const units = "metric";
  const city = searchArea.value;

  const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=${appid}&units=${units}`)
  const data = await response.json();
  // console.log(data);
  searchButton.disabled = false;
  searchButton.textContent = 'Search';  
  if(data.cod === "200") {
    searchValue.textContent = `Results for ${data.city.name}`  
    buttonSection.style.display = 'block';
    // Get only the first 5 arrays
    const newList = data.list.slice(0, 5);
    });

    // resultsArea.innerHTML = newList.map((result, i) => {
    //   const {dt_txt: time, main: temp, weather, wind} = result;
    //   temperatures.push(temp.temp);
    //   return `
    //     <p>${time} // <span class="temp">${temp.temp}</span> // ${weather[0].description} // ${wind.speed}</p>
    //   `   
    // }).join('');
  }
}

searchButton.addEventListener('click', getWeather);
searchArea.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) searchButton.click();
});

//Proper functions used to maintain lexical 'this'
celsiusButton.addEventListener('click', function() {
  this.disabled = true;
  fahrenheitButton.disabled = false;  
  toCelsius(temperatures);
});
fahrenheitButton.addEventListener('click', function() {
  this.disabled = true;
  celsiusButton.disabled = false;    
  toFahrenheit(temperatures);
});


// function toggleMicrophone() {
//   recognition.start();ton>Celsius</button>');
// var $fahrenheitButton = $('<button>Fahrenheit</button>');

// recognition.addEventListener('result', e => {
//   const transcript = Array.from(e.results)
//     .map(result => result[0])
//     .map(result => result.transcript)
//     .join('');
//   $searchField.val(transcript)
// }

//   function averageTemperature(temperatureArray) {
//     var sum = 0;
//     var average;
//     for (var i = 0, j = temperatureArray.length; i < j; i++) {
//       sum += temperatureArray[i];
//     }
//      average = sum / temperatureArray.length;
//      if(average > 20 && average < 25) {
//         $('body').addClass("hot");
//      } else if (average >= 25) {
//         $('body').addClass("very-hot");
//      } else if(average > 7 && average <= 20) {
//         $('body').addClass("cold");
//      } else {
//         $('body').addClass("freezing");
//      }
//   }

// microphoneButton.addEventListener('click', toggleMicrophone);
