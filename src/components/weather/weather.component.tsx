import React, { useContext, useEffect, useState } from 'react'
import { LocationContext } from '../../context/location-context';
import './weather.styles.scss'

import axios from 'axios';


export const Weather = () => {

    const [weather, setWeather] = useState<any>();

    const {location} = useContext(LocationContext)

    let units = 'metric'
    const API_KEY = process.env.REACT_APP_API_KEY;

    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    let sunriseTime = null;
    let sunsetTime = null;
    let timeofRecord = null;

    if(weather)
    {
        let sunrise = new Date(weather.sys.sunrise*1000);
        sunriseTime  = sunrise.toLocaleTimeString("en-US");

        let sunset = new Date(weather.sys.sunset*1000);
        sunsetTime  = sunset.toLocaleTimeString("en-US");

        let dt = new Date(weather.dt*1000);
        timeofRecord = dt.toLocaleTimeString("en-US");
    }
    

    useEffect(()=>{

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&exclude=alerts&appid=${API_KEY}`)
        .then(function (response) {
            // handle success
            console.log(response.data)            
            setWeather(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })

    },[location]);


  return (
    <>
    {
        weather && <div className='weather-box'>

        <h3>
            <span className='city'>{weather.name}</span>
            <span className='country'>{regionNames.of(weather.sys.country)}</span>
        </h3>
        
        <div className='weather-data'>
            <div className="temparature">

                <div className="actual-temp">{Math.round(weather.main.temp)}&#xb0;C</div>
                <div className="feels-like">Feels like {Math.round(weather.main.feels_like)}&#xb0;C</div>

            </div>

            <div className="icon">
                <div className="icon-label">{weather.weather[0].main}</div>
                <div className="icon-img"><img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/></div>
            </div>
        </div>

        <div className="key-value-row">
            <span className='label'>Sunrise</span>
            <span className='value'>{sunriseTime}</span>
        </div>

        <div className="key-value-row">
            <span className='label'>Sunset</span>
            <span className='value'>{sunsetTime}</span>
        </div>

        <div className="key-value-row">
            <span className='label'>Wind</span>
            <span className='value'>{weather.wind.speed}m/s</span>
        </div>

        <div className="key-value-row">
            <span className='label'>Visibility</span>
            <span className='value'>{weather.visibility}m</span>
        </div>

        <div className="key-value-row">
            <span className='label'>Humidity</span>
            <span className='value'>{weather.main.humidity}%</span>
        </div>

        <div className="key-value-row">
            <span className='label'>Cloudiness</span>
            <span className='value'>{weather.clouds.all}%</span>
        </div>

        <span className='timeof-record'>Data recorder at {timeofRecord}</span>

    </div>
    }
    </>
  )
}
