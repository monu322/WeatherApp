import React, { useState, useRef, useContext } from 'react'
import './searchbar.styles.scss'

import axios from 'axios';

import { LocationContext } from '../../context/location-context';

type locationType = {
  name: string
  state:string
  country: string
  lat:number
  lon:number
}

export const Searchbar = () => {

    let timerId:any = null;
    const API_KEY = process.env.REACT_APP_API_KEY;


    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const [locations, setLocations] = useState([])
    const {setLocation} = useContext(LocationContext)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const searchFieldRef = useRef<HTMLInputElement>(null)

    const locationClick = (location:string)=>{
      //persisting location with localstorage
      localStorage.setItem("location", location);
      setLocation(location);
      setShowSuggestions(false)
      searchFieldRef.current!.value= location.split(',')[0]
    }

    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{
        
        //debouncing the city search API call
        //clear any previous timers
        if(timerId) clearTimeout(timerId)

        // start a new timer and make the api call
	      timerId  =  setTimeout(()=>{

          // Make a request for city names with user query if search field is not empty
          e.target.value!=='' && axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${e.target.value}&limit=10&appid=${API_KEY}`)
          .then(function (response) {
            // handle success

            console.log('api response', response.data)

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
              locations.map(({lat, lon, name, state, country}: locationType)=>(
                <li key={lat+lon} onClick={()=>locationClick(name+','+state+','+country)}>{name}, {state}, {regionNames.of(country)}</li>
              ))
            }
          </ul>
        </div>:''

        }

          {
            (locations.length===0 && !showSuggestions)?<div className="search-suggestions"><ul><li>Sorry, no results found!</li></ul></div>:''

          }
    </div>
  )
}
