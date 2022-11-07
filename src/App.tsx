import React, { useState } from 'react';
import './App.scss';

import { Logo } from './components/logo/logo.component';
import { Searchbar } from './components/searchbar/searchbar.component';
import { Weather } from './components/weather/weather.component';

import { LocationContext } from './context/location-context';

function App() {

  const [location, setLocation] = useState('')
  const [units, setUnits] = useState('metric')

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
