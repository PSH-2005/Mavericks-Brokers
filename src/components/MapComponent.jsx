import React,{useState} from 'react'
import { Map,AdvancedMarker} from '@vis.gl/react-google-maps';
import { useMapContext } from '@/contexts/MapContext';

const MapComponent = () => {
    const { center, zoom, setCenter, setZoom,coordinates,mapType,markerList } = useMapContext();
  return (
  <Map
      defaultZoom={13}
      zoom={zoom}
      mapId={'ad42606e9487d04c'}
      className='h-full w-full rounded'
      center={center}
      mapTypeId={mapType}
      onCameraChanged={ (ev) =>{
      console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      setZoom(ev.detail.zoom)
      setCenter(ev.detail.center)
    }
        }>
      <AdvancedMarker
          position={coordinates}>    
      </AdvancedMarker>
      {markerList.map((element,index)=>{
        return (
          <AdvancedMarker key={index} position={element}>
          </AdvancedMarker>
        )
      })}
    </Map>
  )
}

export default MapComponent