import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Sort from './components/Sort';
import Card from './components/Card';
import SeatChart from './components/SeatChart';
import IPAddressDisplay from './components/ipAdressDisplay';
import CreateEvents from './components/CreateEvents';
import TokenMaster from './abis/TokenMaster.json';
import Cardd from './components/cardd';
import Home from "./pages/Home";
import Concerts from "./pages/Concerts";
import Sports from "./pages/Sports";
import Hotels from "./pages/Hotels";
import About from "./pages/About";
import Contact from "./pages/Contact";

const CONTRACT_ADDRESS = "0xA6C0d559a31838b3f3Ef940cF3bBD22C8f70c1fa";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBlockchainData = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError("Please install MetaMask or another Web3 wallet");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }

        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name);

        const tokenMaster = new ethers.Contract(
          CONTRACT_ADDRESS,
          TokenMaster,
          provider
        );
        setTokenMaster(tokenMaster);

        const totalOccasions = await tokenMaster.totalOccasions();
        const occasions = [];
        for (let i = 1; i <= totalOccasions; i++) {
          const occ = await tokenMaster.getOccasion(i);
          occasions.push(occ);
        }
        setOccasions(occasions);

        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setError("Please connect your wallet");
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        if (error.code === 4001) {
          setError("Please connect your wallet to continue");
        } else {
          console.error("Error loading blockchain data:", error);
          setError("Error connecting to blockchain. Please try again.");
        }
      }
    } catch (error) {
      console.error("Fatal error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header>
          <Navigation account={account} setAccount={setAccount} />
          <h2 className="header__title"><strong>Event</strong> Tickets</h2>
        </header>
        <div className="text-center mt-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className=''>
      
      <header><Router>
      <Navigation account={account} setAccount={setAccount} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concerts" element={<Concerts />} />
          <Route path="/concerts/:id" element={<Concerts />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
      </header>
</div>
  );
}

export default App;

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Box, Button } from '@chakra-ui/react';
// import { Container } from '@chakra-ui/react';
// import { DrawerRoot,DrawerBackdrop,DrawerTrigger,
//   DrawerCloseTrigger,DrawerContent,DrawerBody, DrawerFooter,DrawerTitle,
//   DrawerHeader,DrawerActionTrigger
//  } from '@/components/ui/drawer';
// import  ChatBot  from './components/ChatBot';
// import useAudioHook from './hooks/AudioHook';
// import CardList from './components/CardList';
// import { useHotelContext } from './contexts/HotelContext';
// import { useEventContext } from './contexts/EventContext';
// import MapComponent from './components/MapComponent';
// // interface Coordinates{
// //   lat:number;
// //   lng:number
// // }
// // interface Hotel{
// //   city:string,
// //   hotel_star:number,
// //   user_rating:number,
// //   images:string,
// //   location:string;
// //   name:string;
// // }
// const triangleCoords = [
//   { lat: 25.774, lng: -80.19 },
//   { lat: 18.466, lng: -66.118 },
//   { lat: -33.860664, lng: -64.757 },
//   { lat: 25.774, lng: -80.19 },
// ];

// const polygonOptions = {
//   paths: triangleCoords,
//   strokeColor: "#FF0000",
//   strokeOpacity: 0.8,
//   strokeWeight: 2,
//   fillColor: "#FF0000",
//   fillOpacity: 0.35,
// };
// function App() {
//   // const [text,setText]=useState<string>("")
//   // const [send,setSend]=useState<boolean>(false)
//   // const [renderText,setRenderText]=useState<string>("");
//   // const [coordinates,setCoordinates]=useState<Coordinates>({ lat: -33.860664, lng: 151.208138 })
//   // const [center,setCenter]=useState<Coordinates>({ lat: -33.860664, lng: 151.208138 })
//   // const [mapType,setMapType]=useState<string>("roadmap")
//   // const [markerList,setMarkerList]=useState<Coordinates[]>([]);
//   // const [zoom, setZoom]=useState<number>(13);
//   // const [hotels,setHotels]=useState<Hotel[]>([])
//   // Audio
//   const {hotels}=useHotelContext()
//   const {events}=useEventContext()
//   const [isRecording,setIsRecording,transcript,setTranscript,startRecording,stopRecording]=useAudioHook();
//   useEffect(()=>{
//     async function callBackend(){
//       const {data}=await axios.get("https://fastapi-backend-z25y.onrender.com/api/hello")
//       console.log(data)
//     }
//     callBackend()
//   },[])
//   // useEffect(()=>{
//   //   async function fetchCoordinates(text:string) {
//   //     try{
//   //     const {data}=await axios.post("http://localhost:8000/get-coordinates",{text})
//   //     console.log(data);
//   //     if(data.result){
//   //       const results=data.result
//   //       console.log(results)
//   //       for(var i=0;i<results.length;i++){
//   //         if(results[i].function_name=="render_from_location_name"){
//   //           setCoordinates({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
//   //           setCenter({lat:results[i].result.coordinates[0],lng:results[i].result.coordinates[1]})
//   //         }
//   //         else if(results[i].function_name=="change_map_type"){
//   //           setMapType(results[i].result.map_type)
//   //         }
//   //         else if(results[i].function_name=="get_nearby_places"){
//   //           setCoordinates({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
//   //           setCenter({lat:results[i].result.coordinates[0][0],lng:results[i].result.coordinates[0][1]})
//   //           const markers=results[i].result.coordinates.map((element:number[])=>{
//   //             return (
//   //               {lat:element[0],lng:element[1]}
//   //             )
//   //           })
//   //           console.log(markers)
//   //           setMarkerList(markers)
//   //         }
//   //         else if(results[i].function_name=="fetch_hotels"){
//   //           setHotels(results[i].result.message.hotels.map((hotel:Hotel)=>({name:hotel.name,location:hotel.location})))
//   //         }
//   //       }
//   //     }
//   //     else{
//   //       console.log(data.message)
//   //       setRenderText(data.message)
//   //     }
//   //   }
//   //     catch(err:any){
//   //       console.log("There was an error",err.message)
//   //     }
//   //   }
//   //   if(send){
//   //     fetchCoordinates(text)
//   //     setSend(false);
//   //   }
//   // },[send])
//   return (
//     <DrawerRoot size="xl">
//       <DrawerBackdrop />
//       <DrawerTrigger asChild>
//         <Button variant="outline" size="xl" className='text-red'>
//           Open Drawer
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent display="flex" flexDir="row" bg="transparent" outline="none">
//           <Container flex="0.9" display="flex"  p="0" bg="transparent" flexDir='column' maxW='400px'>
//             <Box h="sm" bgColor="black" w="full" p="1" animation="slide-from-right-full 700ms"
//             borderLeftRadius="10px" zIndex={10}> 
//               <MapComponent/>
//             </Box>
//             {hotels.length>0 || events.length>0?
//             <Box h="sm" bgColor="white" w="full" p="2" animation="slide-from-top-full 700ms"
//               borderLeftRadius="10px"> 
//               <CardList/>
//             </Box>:
//               null
//             }
//           </Container>
//           <Container flex="1" bgColor="white" display="flex" alignItems="center" p="4">
//             <ChatBot/>
//           </Container>
//       </DrawerContent>
//     </DrawerRoot>
  // </Container>
//   )
// }

// export default App