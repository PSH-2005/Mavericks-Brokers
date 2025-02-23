import { useContext,useState,createContext,ReactNode } from "react";
// interface Event{
//     id:string;
//     name:string;
//     description:string;
//     image:string;
//     location:string;
//     city:string;
//     start_date:string;
//     end_date:string
// }
// interface EventContextProps {
//     events:Event[],
//     setEvents:React.Dispatch<React.SetStateAction<Event[]>>;
// }
const EventContext=createContext(undefined)

export const EventContextProvider=({ children })=>{
    const [events,setEvents]=useState([])
    console.log(events)
    return (    
    <EventContext.Provider value={{events,setEvents}}>
        {children}
    </EventContext.Provider>
    )
}

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useMapContext must be used within a MapProvider');
  return context;
};
