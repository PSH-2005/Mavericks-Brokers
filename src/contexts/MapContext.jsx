import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface Coordinates {
//   lat: number;
//   lng: number;
// }

// interface MapContextProps {
//   text: string;
//   setText: React.Dispatch<React.SetStateAction<string>>;
//   send: boolean;
//   setSend: React.Dispatch<React.SetStateAction<boolean>>;
//   renderText: string;
//   setRenderText: React.Dispatch<React.SetStateAction<string>>;
//   coordinates: Coordinates;
//   setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
//   center: Coordinates;
//   setCenter: React.Dispatch<React.SetStateAction<Coordinates>>;
//   mapType: string;
//   setMapType: React.Dispatch<React.SetStateAction<string>>;
//   markerList: Coordinates[];
//   setMarkerList: React.Dispatch<React.SetStateAction<Coordinates[]>>;
//   zoom: number;
//   setZoom: React.Dispatch<React.SetStateAction<number>>;
// }

const MapContext = createContext(undefined);

export const MapProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [send, setSend] = useState(false);
  const [renderText, setRenderText] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: -33.860664, lng: 151.208138 });
  const [center, setCenter] = useState({ lat: -33.860664, lng: 151.208138 });
  const [mapType, setMapType] = useState("roadmap");
  const [markerList, setMarkerList] = useState([]);
  const [zoom, setZoom] = useState(13);

  return (
    <MapContext.Provider
      value={{
        text,
        setText,
        send,
        setSend,
        renderText,
        setRenderText,
        coordinates,
        setCoordinates,
        center,
        setCenter,
        mapType,
        setMapType,
        markerList,
        setMarkerList,
        zoom,
        setZoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMapContext must be used within a MapProvider');
  return context;
};