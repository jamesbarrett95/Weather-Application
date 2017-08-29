// Speech Recognition Variables
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const microphoneButton = document.querySelector('.fa-microphone')
const recognition = new SpeechRecognition()

const searchButton = document.getElementById('searchbutton')
const searchArea = document.getElementById('searcharea')
const resultsArea = document.getElementById('result')
const buttonSection = document.querySelector('.button-section')
const celsiusButton = document.getElementById('celsiusbutton')
const fahrenheitButton = document.getElementById('fahrenheitbutton')
const searchValue = document.querySelector('.searchresult')

const timesContainer = document.querySelector('.times > div:first-of-type')
const temperatureContainer = document.querySelector('.temperature > div:first-of-type')
const descriptionContainer = document.querySelector('.description > div:first-of-type')
const windContainer = document.querySelector('.wind > div:first-of-type')
// This variable is global so we can attach it to our Celsius and Fahrenheit event listeners
let temps = []

function toCelsius () {
  const tempSpans = Array.from(resultsArea.querySelectorAll('.temp'))
  tempSpans.map((temp, i) => {
    temp.innerHTML = temps[i]
  })
}

function toFahrenheit (tempArr) {
  const tempSpans = Array.from(resultsArea.querySelectorAll('.temp'))
  const converted = tempArr.map(temp => {
    return Math.round(temp * 9 / 5 + 32)
  })

  tempSpans.map((temp, i) => {
    temp.innerHTML = converted[i]
  })
}

async function getWeather () {
  searchButton.disabled = true
  searchButton.textContent = 'Loading...'
  celsiusButton.disabled = true
  // URL params
  const appid = 'e384678fabc57f4af277fff449ee339c'
  const units = 'metric'
  const city = searchArea.value
  const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast/?q=${city}&appid=${appid}&units=${units}`)
  const data = await response.json()
  searchButton.disabled = false
  searchButton.textContent = 'Search'
  if (data.cod === '200') {
    searchValue.innerHTML = `Search result for <span class="highlight">${data.city.name}</span>`
    resultsArea.style.display = 'flex'
    buttonSection.style.display = 'block'    

    // Get only the first 5 arrays
    const newList = data.list.slice(0, 5)

    // Get data we actually need from the API
    const times = newList.map(result => result.dt_txt.slice(11))
    const descriptions = newList.map(result => result.weather[0].description)
    const temperatures = newList.map(result => result.main.temp)
    temps = temperatures
    const windSpeeds = newList.map(result => result.wind.speed)

    // Set innerHTML in results area
    timesContainer.innerHTML = times.map(time => `<p>${time}</p>`).join('')
    temperatureContainer.innerHTML = temperatures.map(temp => `<p><span class='temp'>${temp}</span></p>`).join('')
    descriptionContainer.innerHTML = descriptions.map(desc => `<p>${desc}</p>`).join('')
    windContainer.innerHTML = windSpeeds.map(wind => `<p>${wind}</p>`).join('')

    averageTemperature(temperatures)
  } else if (data.cod === '404') {
    searchValue.innerHTML = `There are no results for <span class='error'>${searchArea.value}</span>`
  }
}

searchButton.addEventListener('click', getWeather)
searchArea.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) searchButton.click()
})

// Proper functions used to maintain lexical 'this'
celsiusButton.addEventListener('click', function () {
  this.disabled = true
  fahrenheitButton.disabled = false
  toCelsius(temps)
})
fahrenheitButton.addEventListener('click', function () {
  this.disabled = true
  celsiusButton.disabled = false
  toFahrenheit(temps)
})

function toggleMicrophone () {
  recognition.start()

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    searchArea.value = transcript
    // Fake a button click
    searchButton.click()
  })
}

function averageTemperature (temperatureArray) {
  document.body.className = ''
  const total = temperatureArray.reduce((sum, value) => {
    return sum + value
  }, 0)
  const average = total / temperatureArray.length
  if (average > 20 && average < 25) {
    document.body.classList.add('hot')
  } else if (average >= 25) {
    document.body.classList.add('very-hot')
  } else if (average > 7 && average <= 20) {
    document.body.classList.add('cold')
  } else {
    document.body.classList.add('freezing')
  }
}

microphoneButton.addEventListener('click', toggleMicrophone)
