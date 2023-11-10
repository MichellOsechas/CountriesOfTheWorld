const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
const title = document.querySelector('.title');

let countries = [];

// Funcion que pide todos los paises
const getCountries = async () => {
  // Llamo a la API Rest Countries
  // Transformo la respuesta a JSON
  const response = await (await fetch('https://restcountries.com/v3.1/all', {method: 'GET'})).json()
    
    // Guardo el array de los paises recibido dentro de contries
    countries = response;
    console.log(countries);

    setTimeout(() => {
      loader.classList.add('hidden')
      body.classList.add('show-flex')
    }, 1000)
  
   // countries = data.filter(country => country.name.common.indexOf(searchInput.value) )
  }
  getCountries();

const getClimates = async (nombre) => {
  
  const responseClimate = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nombre}&lang=es&appid=88da22064aae277ab985f7314df2c6ee&units=metric`, {method: 'GET'})).json()
  return responseClimate;

}

// Evento de escucha del input
searchInput.addEventListener('input', async e => {
  container.innerHTML = ''
  
  if (searchInput.length !== 0) {
    title.classList.add ('title-hidden')
  }
  
  const filteredCountries = countries.filter(element => element.name.common.toLowerCase().startsWith(e.target.value.toLowerCase()));
  console.log(filteredCountries);
  
  if (searchInput.value === '') {
    container.innerHTML = ''
 } else if (filteredCountries.length > 10) {
    const message = document.createElement('div')
    message.classList.add ('message-error')
    message.innerHTML = `
    <p>Demasiados paises, especifica mejor tu respuesta</p>
    `
    container.append(message)
  } else if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    
    filteredCountries.forEach(element => {
        const name = element.name.common;
        const img = element.flags.png;

        const countrys = document.createElement('div')
        countrys.classList.add ('pais')
        countrys.innerHTML = 
        `
        <img src="${element.flags.png}"/>
        <span>${element.name.common}</span>
        `;
        container.append (countrys)
    });

  } else if (filteredCountries.length === 1) {
    const clima = await getClimates(filteredCountries[0].name.common)
    console.log(clima);
    const idClima = clima.weather[0].icon

    const info = document.createElement('div')
    info.classList.add ('info-pais')
    info.innerHTML = 
    `
    <div class= "img-country">
    <img class= "img-country" src="${filteredCountries[0].flags.png}">
    </div>
    <div class="info-country">
    <h1>${filteredCountries[0].name.common}</h1>
    <p>${filteredCountries[0].capital}</p>
    <p>${filteredCountries[0].population.toLocaleString()} habitantes</p>
    <p>${filteredCountries[0].region}</p>
    <p>${filteredCountries[0].timezones}</p>
    <p class="info-climate">${clima.main.temp} Celcius</p>

    <div class= "info-clima">
    <img class="idClima" src="https://openweathermap.org/img/wn/${idClima}@2x.png">
    <p class="info-clima-nom">${clima.weather[0].description}</p>
    </div>
    
    </div>
    `;
    container.append (info)
    
  } 

});