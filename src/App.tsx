import React, { useState } from 'react';
import './App.scss';

import { Logo } from './components/logo/logo.component';
import { Searchbar } from './components/searchbar/searchbar.component';
import { Weather } from './components/weather/weather.component';

import { LocationContext } from './context/location-context';

function App() {

  //check local storage for location, if null store empty string in location state, if not empty store to context
  let storedLocation = localStorage.getItem("location");
  const [location, setLocation] = useState(storedLocation?storedLocation:'')

  return (
    <div className="App">
      
        <Logo/>
        <LocationContext.Provider value={{location, setLocation}}>
          <Searchbar/>
          <Weather/>
        </LocationContext.Provider>
      
    </div>
  );
}

export default App;
