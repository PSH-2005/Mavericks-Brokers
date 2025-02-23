import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { DrawerRoot,DrawerBackdrop,DrawerTrigger,
  DrawerCloseTrigger,DrawerContent,DrawerBody, DrawerFooter,DrawerTitle,
  DrawerHeader,DrawerActionTrigger
 } from '@/components/ui/drawer';
import  ChatBot  from './components/ChatBot';
import useAudioHook from './hooks/AudioHook';
import CardList from './components/CardList';
import { useHotelContext } from './contexts/HotelContext';
import { useEventContext } from './contexts/EventContext';
import MapComponent from './components/MapComponent';
// interface Coordinates{
//   lat:number;
//   lng:number
// }
// interface Hotel{
//   city:string,
//   hotel_star:number,
//   user_rating:number,
//   images:string,
//   location:string;
//   name:string;
// }
const triangleCoords = [
  { lat: 25.774, lng: -80.19 },
  { lat: 18.466, lng: -66.118 },
  { lat: -33.860664, lng: -64.757 },
  { lat: 25.774, lng: -80.19 },
];

const polygonOptions = {
  paths: triangleCoords,
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
};
function DialogButton() {
  // const [text,setText]=useState<string>("")
  // const [send,setSend]=useState<boolean>(false)
  // const [renderText,setRenderText]=useState<string>("");
  // const [coordinates,setCoordinates]=useState<Coordinates>({ lat: -33.860664, lng: 151.208138 })
  // const [center,setCenter]=useState<Coordinates>({ lat: -33.860664, lng: 151.208138 })
  // const [mapType,setMapType]=useState<string>("roadmap")
  // const [markerList,setMarkerList]=useState<Coordinates[]>([]);
  // const [zoom, setZoom]=useState<number>(13);
  // const [hotels,setHotels]=useState<Hotel[]>([])
  // Audio
  const {hotels}=useHotelContext()
  const {events}=useEventContext()
  const [isRecording,setIsRecording,transcript,setTranscript,startRecording,stopRecording]=useAudioHook();
  useEffect(()=>{
    async function callBackend(){
      const {data}=await axios.get("https://fastapi-backend-z25y.onrender.com/api/hello")
      console.log(data)
    }
    callBackend()
  },[])
  // useEffect(()=>{
  //   async function fetchCoordinates(text:string) {
  //     try{
  //     const {data}=await axios.post("http://localhost:8000/get-coordinates",{text})
  //     console.log(data);
  //     if(data.result){
  //       const results=data.result
  //       console.log(results)
  //       for(var i=0;i<results.length;i++){
  //         if(results[i].function_name=="render_from_location_name"){
  //           setCoordinates({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
  //           setCenter({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
  //         }
  //         else if(results[i].function_name=="change_map_type"){
  //           setMapType(results[i].result.map_type)
  //         }
  //         else if(results[i].function_name=="get_nearby_places"){
  //           setCoordinates({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
  //           setCenter({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
  //           const markers=results[i].result.coordinates.map((element:number[])=>{
  //             return (
  //               {lat:element[0],lng:element[1]}
  //             )
  //           })
  //           console.log(markers)
  //           setMarkerList(markers)
  //         }
  //         else if(results[i].function_name=="fetch_hotels"){
  //           setHotels(results[i].result.message.hotels.map((hotel:Hotel)=>({name:hotel.name,location:hotel.location})))
  //         }
  //       }
  //     }
  //     else{
  //       console.log(data.message)
  //       setRenderText(data.message)
  //     }
  //   }
  //     catch(err:any){
  //       console.log("There was an error",err.message)
  //     }
  //   }
  //   if(send){
  //     fetchCoordinates(text)
  //     setSend(false);
  //   }
  // },[send])
  return (
    <DrawerRoot size="xl">
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="outline" size="xl" className='text-white hover:text-blue-500'>
            <span className='text-white hover:text-blue-500'>
          Open Drawer
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent display="flex" flexDir="row" bg="transparent" outline="none">
          <Container flex="0.9" display="flex"  p="0" bg="transparent" flexDir='column' maxW='400px'>
            <Box h="sm" bgColor="black" w="full" p="1" animation="slide-from-right-full 700ms"
            borderLeftRadius="10px" zIndex={10}> 
              <MapComponent/>
            </Box>
            {hotels.length>0 || events.length>0?
            <Box h="sm" bgColor="white" w="full" p="2" animation="slide-from-top-full 700ms"
              borderLeftRadius="10px"> 
              <CardList/>
            </Box>:
              null
            }
          </Container>
          <Container flex="1" bgColor="white" display="flex" alignItems="center" p="4">
            <ChatBot/>
          </Container>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default DialogButton