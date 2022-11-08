import React, { useContext, useEffect, useState } from 'react'
import { LocationContext } from '../../context/location-context';
import './weather.styles.scss'

import axios from 'axios';
import { WiSunrise, WiSunset, WiStrongWind, WiHumidity, WiSmallCraftAdvisory, WiCloudy, WiRain } from "react-icons/wi";

export const Weather = () => {

    const [weather, setWeather] = useState<any>();
    const {location} = useContext(LocationContext);

    //state to store error flag
    const [dataError, setDataError] = useState(false);

    //persisting unit
    const storedUnit = localStorage.getItem("unit");
    const [unit, setUnit] = useState(storedUnit?storedUnit:'metric');

    const API_KEY = process.env.REACT_APP_API_KEY;

    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    let sunriseTime = null;
    let sunsetTime = null;
    let timeofRecord = null;

    let tempUnit = '';
    let speedUnit = '';

    switch(unit)
    {
        case 'metric':{
            speedUnit = 'm/s'
            tempUnit = '°C'
            break
        }

        case 'standard':{
            speedUnit = 'm/s'
            tempUnit = 'K'
            break
        }

        case 'imperial':{
            speedUnit = ' miles/hour'
            tempUnit = '°F'
            break
        }

        default:
            break
    }

    if(weather)
    {
        let sunrise = new Date(weather.sys.sunrise*1000);
        sunriseTime  = sunrise.toLocaleTimeString("en-US");

        let sunset = new Date(weather.sys.sunset*1000);
        sunsetTime  = sunset.toLocaleTimeString("en-US");

        let dt = new Date(weather.dt*1000);
        timeofRecord = dt.toLocaleTimeString("en-US");
    }
    
    const unitChange = (newUnit:string)=>{
        if(newUnit!==unit)
        {
            setUnit(newUnit)
            localStorage.setItem("unit", newUnit);
        }
    }

    useEffect(()=>{

        //get weather data of location if location changes and not empty string
        location!=='' && axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&exclude=alerts&appid=${API_KEY}`)
        .then(function (response) {
            // handle success            
            setWeather(response.data)
            setDataError(false);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            setDataError(true);
        })

        

    },[location, unit]);


  return (
    <>
    {
        weather && <div className='weather-box'>

        <h3>
            <span className='city'>{weather.name}</span>
            <span className='country'>{regionNames.of(weather.sys.country)}</span>
        </h3>

        <div className="units">
            <button className={`outline ${unit==='standard' ? "active" : ""}`} onClick={()=>unitChange('standard')}>Standard</button>
            <button className={`outline ${unit==='metric' ? "active" : ""}`} onClick={()=>unitChange('metric')}>Metric</button>
            <button className={`outline ${unit==='imperial' ? "active" : ""}`} onClick={()=>unitChange('imperial')}>Imperial</button>
        </div>
        
        <div className='weather-data'>
            <div className="temparature">

                <div className="actual-temp">{Math.round(weather.main.temp)}{tempUnit}</div>
                <div className="feels-like">Feels like {Math.round(weather.main.feels_like)}{tempUnit}</div>

            </div>

            <div className="icon">
                <div className="icon-label">{weather.weather[0].main}</div>
                <div className="icon-img"><img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/></div>
            </div>
        </div>

        {
            weather.rain?(
                <div className="key-value-row">
                    <span className='label'><WiRain/> Rain</span>
                    <span className='value'>{weather.rain['1h']}mm</span>
                </div>
            ):''
        }

        <div className="key-value-row">
            <span className='label'><WiSunrise className='wicon'/> Sunrise</span>
            <span className='value'>{sunriseTime}</span>
        </div>

        <div className="key-value-row">
            <span className='label'><WiSunset className='wicon'/> Sunset</span>
            <span className='value'>{sunsetTime}</span>
        </div>

        <div className="key-value-row">
            <span className='label'><WiStrongWind className='wicon'/> Wind</span>
            <span className='value'>{weather.wind.speed}{speedUnit}</span>
        </div>

        <div className="key-value-row">
            <span className='label'><WiSmallCraftAdvisory className='wicon'/> Visibility</span>
            <span className='value'>{weather.visibility}m</span>
        </div>

        <div className="key-value-row">
            <span className='label'><WiHumidity className='wicon'/> Humidity</span>
            <span className='value'>{weather.main.humidity}%</span>
        </div>

        <div className="key-value-row">
            <span className='label'><WiCloudy className='wicon'/> Cloudiness</span>
            <span className='value'>{weather.clouds.all}%</span>
        </div>

        <span className='timeof-record'>Data recorded at {timeofRecord}</span>

    </div>
    }
    {
        !weather && dataError && <div className='weather-box error'>Error fetching data!!</div>
    }
    </>
  )
}
