import { Container, Box, Input, IconButton, VStack, Text, HStack } from '@chakra-ui/react';
import { useState,useEffect } from 'react';
import { LuMic } from 'react-icons/lu';
import useAudioHook from '@/hooks/AudioHook';
import axios from "axios"
import { useMapContext } from '@/contexts/MapContext';
import { useHotelContext } from '@/contexts/HotelContext';
import { useEventContext } from '@/contexts/EventContext';
// interface Message{
//     text:string;
//     fromUser:boolean;
// }
// // interface Coordinates{
// //     lat:number;
// //     lng:number
// //   }
// interface Hotel{
//     city:string,
//     hotel_star:number,
//     user_rating:number,
//     image:string,
//     location:string;
//     name:string;
//   }
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
// interface UseAudioHookReturn {
//     isRecording: boolean;
//     transcript: string;
//     startRecording: () => Promise<void>;
//     stopRecording: () => void;
// }
  
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [send,setSend]=useState(false)

  const [isRecording,setIsRecording,transcript,setTranscript,startRecording,stopRecording]=useAudioHook()

  const {hotels,setHotels}=useHotelContext()
  const{events,setEvents}=useEventContext()
  const {setCoordinates,setCenter,setMapType,setMarkerList} =useMapContext()

  useEffect(()=>{
    async function fetchCoordinates(text) {
      try{
      const {data}=await axios.post("https://fastapi-backend-z25y.onrender.com/get-coordinates",{text})
      console.log(data);
      if(data.result){
        const results=data.result
        console.log(results)
        for(var i=0;i<results.length;i++){
          if(results[i].function_name=="render_from_location_name"){
            setCoordinates({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
            setCenter({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
          }
          else if(results[i].function_name=="change_map_type"){
            setMapType(results[i].result.map_type)
          }
          else if(results[i].function_name=="get_nearby_places"){
            setCoordinates({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
            setCenter({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
            const markers=results[i].result.coordinates.map((element)=>{
              return (
                {lat:element[0],lng:element[1]}
              )
            })
            console.log(markers)
            setMarkerList(markers)
          }
          else if(results[i].function_name=="fetch_events"){
            setEvents(results[i].result.message.events.map((event)=>({name:event.name,description:event.description,location:event.location,image:event.image,id:event.id})))
            setHotels([]);
          }
          else if(results[i].function_name=="fetch_hotels"){
            setHotels(results[i].result.message.hotels.map((hotel)=>({name:hotel.name,location:hotel.location,image:hotel.image})))
          }
        }
      }
      else{
        console.log(data.message)
        setMessages((prev) => [...prev, { text: data.message, fromUser: false }]);
      }
    }
      catch(err){
        console.log("There was an error",err.message)
      }
    }
    if(send){
      fetchCoordinates(input)
      setInput('')
      setSend(false);
    }
  },[send])

  useEffect(()=>{
    setInput(transcript)
    if (transcript.trim() !== '') {
        setMessages((prev) => [...prev, { text: transcript, fromUser: true }]);
        setSend(true)
      }
  },[transcript])

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages((prev) => [...prev, { text: input, fromUser: true }]);
      setSend(true)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Container maxW="md" p={4} borderRadius="lg" boxShadow="lg" bg="white" h="full">
      <VStack spaceY={4} height="full">
        <Box
          w="100%"
          flex="1"
          overflowY="auto"
          p={3}
          bg="gray.100"
          borderRadius="lg"
          boxShadow="inner"
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              bg={msg.fromUser ? 'white' : 'navy'}
              alignSelf={msg.fromUser ? 'flex-start' : 'flex-end'}
              color={msg.fromUser?"grey":"white"}
              borderRadius="sm"
              p={2.5}
              mb={2}
              maxW="80%"
            >
              <Text>{msg.text}</Text>
            </Box>
          ))}
        </Box>

        <HStack w="100%">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            bg="gray.50"
            _focus={{ bg: 'white',outline:"navy", borderColor:"navy"}}
          />
          <IconButton
            colorScheme="green"
            aria-label="Record voice"
            size="md"
            borderRadius="full"
            bgColor="navy"
            onClick={isRecording ? ()=>stopRecording() : ()=>startRecording()}
          >
            <LuMic/>
            </IconButton>
        </HStack>
        {/* {transcript && (
                    <p className="mt-4 p-2 rounded">Review: {transcript}</p>
        )} */}
            <Container color="grey" borderTop="0.5px solid black" borderColor="navy" p="2" display="flex" justifyContent="center">
                <h2 className="text-xl font-bold mb-4">Record & Transcribe Audio</h2>
            </Container>
      </VStack>
    </Container>
  );
};

export default ChatBot;