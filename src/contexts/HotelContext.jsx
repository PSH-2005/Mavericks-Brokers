import { useContext,useState,createContext,ReactNode } from "react";
// interface Hotel{
//     city:string,
//     hotel_star:number,
//     user_rating:number,
//     image:string,
//     location:string;
//     name:string;
// }
// interface HotelContextProps {
//     hotels:Hotel[],
//     setHotels:React.Dispatch<React.SetStateAction<Hotel[]>>;
// }
const HotelContext=createContext(undefined)

export const HotelContextProvider=({ children })=>{
    const [hotels,setHotels]=useState([])
    return (    
    <HotelContext.Provider value={{hotels,setHotels}}>
        {children}
    </HotelContext.Provider>
    )
}

export const useHotelContext = () => {
  const context = useContext(HotelContext);
  if (!context) throw new Error('useMapContext must be used within a MapProvider');
  return context;
};
