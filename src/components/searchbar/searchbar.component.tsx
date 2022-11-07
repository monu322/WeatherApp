import React, { useState, useRef } from 'react'
import './searchbar.styles.scss'

import axios from 'axios';

type locationType = {
  name: string
  state:string
  country: string
  lat:number
  lon:number
}

export const Searchbar = () => {

    let timerId:any = null;
    const API_KEY = '8601f519a6317c021be8016d0ee1fc24';

    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const searchFieldRef = useRef<HTMLInputElement>(null)

    const locationClick = (location:string)=>{
      
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&exclude=alerts&appid=${API_KEY}`)
      .then(function (response) {
        // handle success
        console.log(response.data)

        searchFieldRef.current!.value= response.data.name
        setShowSuggestions(false)
        setWeather(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })

    }

    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
        
        //debouncing the city search API call
        //clear any previous timers
        if(timerId) clearTimeout(timerId)

        // start a new timer and make the api call
	      timerId  =  setTimeout(()=>{
          console.log(e.target.value)

          // Make a request for city names with user query
          axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=${API_KEY}`)
          .then(function (response) {
            // handle success
            console.log(response.data)
            setShowSuggestions(true)
            setLocations(response.data)
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })

        }, 500)
    }


  return (
    <div className='searchbar'>
        <input 
          onChange={(e)=>handleSearch(e)} 
          placeholder='Enter location e.g London' 
          className='search-field' 
          type="text" 
          name="location"
          ref={searchFieldRef}
          required
        />
        <button className='search-button'>Find</button>

        {
          (locations.length>0 && showSuggestions)?<div className="search-suggestions">
          <ul>
            {
              locations.map((location: locationType)=>(
                <li onClick={()=>locationClick(location.name+','+location.state+','+location.country)}>{location.name}, {location.state}, {regionNames.of(location.country)}</li>
              ))
            }
          </ul>
        </div>:''
          
        }
    </div>
  )
}
