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
   

<footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
        <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                    <a href="#" class=" hover:underline">About</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Careers</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Brand Center</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Blog</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                    <a href="#" class="hover:underline">Discord Server</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Twitter</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Facebook</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Contact Us</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                    <a href="#" class="hover:underline">Privacy Policy</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Licensing</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Terms &amp; Conditions</a>
                </li>
            </ul>
        </div>
        <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Download</h2>
            <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                    <a href="#" class="hover:underline">iOS</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Android</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">Windows</a>
                </li>
                <li class="mb-4">
                    <a href="#" class="hover:underline">MacOS</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-300 sm:text-center">© 2023 <a href="https://flowbite.com/">Flowbite™</a>. All Rights Reserved.
        </span>
        <div class="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span class="sr-only">Facebook page</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                    </svg>
                  <span class="sr-only">Discord community</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                  <span class="sr-only">Twitter page</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                  </svg>
                  <span class="sr-only">GitHub account</span>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/>
                </svg>
                  <span class="sr-only">Dribbble account</span>
              </a>
        </div>
      </div>
    </div>
</footer>

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