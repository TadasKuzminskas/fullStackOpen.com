import {useEffect, useState} from 'react';
import axios from 'axios';



const SearchFilter = ({handleFilter}) => {
  return <form>
    <div>find countries <input onChange={handleFilter}/></div>
  </form>
}


const WeatherComponent = ({filteredCountry}) => {

  const [isLoading, setLoading] = useState(true);
  const [weather, setWeather] = useState([]);
  const capitalLatitude = filteredCountry.capitalInfo.latlng[0]
  const capitalLongitude = filteredCountry.capitalInfo.latlng[1]

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalLatitude}&lon=${capitalLongitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`).then(response => {
      console.log("weather data fetched");
      setWeather(response.data);
      setLoading(false);
    })
  }, [])

  if (isLoading) {
    return <div>Loading weather data...</div>
  }
  const weatherIconLink = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  const temperature = (weather.main.temp - 273.15).toPrecision(3)

  return <div>
      <h2>Weather in {filteredCountry.capital}</h2>
      <p>temperature {temperature} Celcius</p>
      <img src={weatherIconLink}/>
      <p>wind {weather.wind.speed} m/s</p>
  </div>

}


const CountryInfo = ({filteredCountry}) => {

   const languages = {...filteredCountry.languages}
   const output = Object.values(languages) //This was a total pain. Might be a good Idea to include a hint.
   const flag = filteredCountry.flags.png

  return <div>
      <h1><b>{filteredCountry.name.common}</b></h1>
      <p>capital {filteredCountry.capital}</p>
      <p>area {filteredCountry.area}</p>
      <h4><b>languages:</b></h4>
      <ul>
      {output.map(language => 
        <li key={language}>{language}</li> //Not sure about the unique key, because it was not listed in the API
        )}
      </ul>
      <img src={flag}/>
      <WeatherComponent filteredCountry={filteredCountry}/>
  </div>

}

const CountriesList = ({filteredCountries, handleSetCountry}) => {

  if (filteredCountries.length === 1) {
    return <CountryInfo filteredCountry={filteredCountries[0]}/>
  } else if (filteredCountries.length <= 10) {
    return <div>
    {filteredCountries.map(country => 
      <p key={country.area}>{country.name.common}  
      <button type='show' onClick={() => handleSetCountry(country)}>show</button>
      </p> //not sure abou the key here as well used .area because I doubt that there exists a country with the same area. 
      
      )}
  </div>
  } else {
     return <div>Too many matches, specify another filter</div>
  }
}


const App = () =>  {

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      console.log("api data fetched");
      setCountries(response.data);
    })
  }, [])

  const handleFilter = (event) => {
    const filteredData = countries.filter((country) => {
      if (!event.target.value) {
        return '';
      } else {
        return country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      }
    })
    setFilteredCountries(filteredData)
  }

  const handleSetCountry = (event) => { 
    let emptyArray = []; // I needed to pass it to an empty array to set it to filtered countries. Looks funky, I know, but counldn't figure out another way.
    emptyArray.push(event);
    setFilteredCountries(emptyArray)
  }

  return (
    <div>
      <h1>Countries App</h1>
    <SearchFilter handleFilter={handleFilter}/>
    <CountriesList filteredCountries={filteredCountries} handleSetCountry={handleSetCountry}/>
    </div>
  )}

export default App;
