
import { createRoot } from 'react-dom/client'
import {APIProvider} from '@vis.gl/react-google-maps';
import './index.css'
import App from './App.jsx'
import React from "react"
import { Provider } from './components/ui/provider'
import { MapProvider } from './contexts/MapContext';
import { HotelContextProvider } from './contexts/HotelContext';
import { EventContextProvider } from './contexts/EventContext';

createRoot(document.getElementById('root')).render(
  <APIProvider apiKey='AIzaSyDXMtvMx_eAJOvqW8KpULaW2C__wwv43Yc'>
    <Provider>
      <EventContextProvider>
      <HotelContextProvider>
      <MapProvider>
        <App/>
      </MapProvider>
      </HotelContextProvider>
      </EventContextProvider>
    </Provider>
  </APIProvider>
)
