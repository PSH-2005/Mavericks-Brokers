import React from "react";
import "./Pages.css";
import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Input, Card, Tab, Alert} from './components';
import abi from "../abis/HotelBookingContract.json";
import HotelCard from "@/components/HotelCard";
import { Container,Heading } from "@chakra-ui/react";
const HotelBookingApp = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [hotels, setHotels] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [availableRooms, setAvailableRooms] = useState({});

  const [newHotel, setNewHotel] = useState({
    name: '',
    standardRoomCount: '',
    deluxeRoomCount: '',
    suiteRoomCount: '',
    standardRoomCost: '',
    deluxeRoomCost: '',
    suiteCost: '',
    location: '',
    image: ''
  });

  // Unified loadHotels function that accepts an optional contract instance
  const loadHotels = async (contractInstanceParam) => {
    const instance = contractInstanceParam || contract;
    if (!instance) {
      setError("Contract not initialized");
      return;
    }
    try {
      const allHotels = await instance.getAllHotels();
      console.log("allHotels", allHotels);
      setHotels(allHotels);
    } catch (err) {
      console.error("Error loading hotels:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask to use this application");
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        const signer = await providerInstance.getSigner();
        const address = await signer.getAddress();

        const contractAddress = "0x144C49E527006B24a052d87Dc029E3786f8398A3";
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);

        setProvider(providerInstance);
        setContract(contractInstance);
        setAccount(address);

        // Load hotels using the local contract instance
        await loadHotels(contractInstance);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const loadAvailableRooms = async (hotelId, date) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      const rooms = {};
      const tiers = ['STANDARD', 'DELUXE', 'SUITE'];
      for (let i = 0; i < tiers.length; i++) {
        const available = await contract.getAvailableRooms(hotelId, i, date);
        const availableRoomsCount = Number(available);
        rooms[tiers[i]] = Array.from({ length: availableRoomsCount }, (_, index) => index + 1);

      }
      setAvailableRooms(prev => ({
        ...prev,
        [hotelId]: rooms
      }));
    } catch (err) {
      console.error("Error loading available rooms:", err);
      setError(err.message);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      const tx = await contract.addHotel(
        newHotel.name,
        newHotel.standardRoomCount,
        newHotel.deluxeRoomCount,
        newHotel.suiteRoomCount,
        ethers.parseEther(newHotel.standardRoomCost),
        ethers.parseEther(newHotel.deluxeRoomCost),
        ethers.parseEther(newHotel.suiteCost),
        newHotel.location,
        newHotel.image
      );
      await tx.wait();
      await loadHotels();
      setNewHotel({
        name: '',
        standardRoomCount: '',
        deluxeRoomCount: '',
        suiteRoomCount: '',
        standardRoomCost: '',
        deluxeRoomCost: '',
        suiteCost: '',
        location: '',
        image: ''
      });
    } catch (err) {
      console.error("Error adding hotel:", err);
      setError(err.message);
    }
  };

  const handleBookRoom = async (hotelId, tier, roomNumber) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      const hotel = hotels.find(h => h.id.toString() === hotelId.toString());
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      let cost;
      let tierIndex;
      switch(tier) {
        case 'STANDARD':
          cost = hotel.standardRoomCost;
          tierIndex = 0;
          break;
        case 'DELUXE':
          cost = hotel.deluxeRoomCost;
          tierIndex = 1;
          break;
        case 'SUITE':
          cost = hotel.suiteCost;
          tierIndex = 2;
          break;
        default:
          throw new Error("Invalid room tier");
      }
      const tx = await contract.bookRoom(
        hotelId,
        tierIndex,
        selectedDate,
        1,
        { value: cost }
      );
      await tx.wait();
      await loadAvailableRooms(hotelId, selectedDate);
    } catch (err) {
      console.error("Error booking room:", err);
      setError(err.message);
    }
  };

  const RoomList = ({ hotelId, tier, rooms = [] }) => (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {rooms.map(roomNumber => (
        <Button
          key={roomNumber}
          onClick={() => handleBookRoom(hotelId, tier, roomNumber)}
          className="text-sm"
        >
          Room {roomNumber}
        </Button>
      ))}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="container mx-auto px-4 py-8 text-blue-400" bgColor="gray.50">
      <Heading fontSize="1.9rem" color="navy" m="3" fontWeight="thin" p="4" borderBottom="0.5px solid"
      shadow="md" borderColor="navy">Explore Hotels +</Heading>
      <Container className="border-b" gap='3' display="flex" fontWeight="thin" color="grey">
        <Tab isActive={activeTab === 'browse'} onClick={() => setActiveTab('browse')}>
          Browse Hotels
        </Tab>
        <Tab isActive={activeTab === 'add'} onClick={() => setActiveTab('add')}>
          Add Hotel
        </Tab>
      </Container>

      {error && <Alert message={error} className="mb-4" />}

      {activeTab === 'browse' && (
        <Container mt="5" w="90%" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-space-around">
          {hotels.map(hotel => (
            <Card key={hotel.id.toString()}>
              <img
                src={
                  "data:image/jpeg;base64,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"}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{hotel.name}</h2>
                <p className="text-gray-600 mb-4">{hotel.location}</p>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    loadAvailableRooms(hotel.id, e.target.value);
                  }}
                  label="Select Date"
                />
                {selectedDate && availableRooms[hotel.id] && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Standard Rooms</h3>
                    <RoomList
                      hotelId={hotel.id}
                      tier="STANDARD"
                      rooms={availableRooms[hotel.id].STANDARD}
                    />
                    <h3 className="font-bold mb-2">Deluxe Rooms</h3>
                    <RoomList
                      hotelId={hotel.id}
                      tier="DELUXE"
                      rooms={availableRooms[hotel.id].DELUXE}
                    />
                    <h3 className="font-bold mb-2">Suites</h3>
                    <RoomList
                      hotelId={hotel.id}
                      tier="SUITE"
                      rooms={availableRooms[hotel.id].SUITE}
                    />
                  </div>
                )}
              </div>
            </Card>
    //         <HotelCard name={hotel.name} location={hotel.location} />
    //         <Card.Root maxW="sm" minW="85%" h="450px" shadow="xl">
    //   <Image
    //     src={props.image?props.image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
    //     alt={props.name} 
    //     h="50%"
    //   />
    //   <Card.Body gap="0.5" h="50%" shadow={"md"}>
    //     <Card.Title>{props.name}</Card.Title>
    //     <RatingGroup.Root readOnly count={5} defaultValue={3} size="sm" colorPalette="yellow">
    //         <RatingGroup.HiddenInput />
    //         <RatingGroup.Control>
    //         {Array.from({ length: 5 }).map((_, index) => (
    //         <RatingGroup.Item key={index} index={index + 1}>
    //             <RatingGroup.ItemIndicator/>
    //         </RatingGroup.Item>
    //     ))}
    //   </RatingGroup.Control>
    // </RatingGroup.Root>
    //     <Card.Description>
    //       This sofa is perfect for modern tropical spaces, baroque inspired
    //       spaces. Located in {props.location}
    //     </Card.Description>
    //   </Card.Body>
    //   <Card.Footer p="2" gap="2" display="flex" justifyContent="space-between" alignItems="center" >
    //     <Button variant="solid" w="1/2" h="12" bgColor={"blue.900"}>Book Now</Button>
    //     <Text textStyle="2xl" fontWeight="light" letterSpacing="tight" mt="2" color="grey" >
    //       $450
    //     </Text>

    //     {/* <Button variant="ghost">Add to cart</Button> */}
    //   </Card.Footer>
    // </Card.Root>
          ))}
        </Container>
      )}

      {activeTab === 'add' && (
        <Card className="max-w-2xl mt-20 ml-[300px] mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Add New Hotel</h2>
          <form onSubmit={handleAddHotel}
          className="mx-auto ml-[300px]"
          >
            <Input
              label="Hotel Name"
              value={newHotel.name}
              onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Standard Rooms"
                type="number"
                min="0"
                value={newHotel.standardRoomCount}
                onChange={(e) => setNewHotel({ ...newHotel, standardRoomCount: e.target.value })}
                required
              />
              <Input
                label="Standard Room Cost (ETH)"
                type="number"
                step="0.001"
                min="0"
                value={newHotel.standardRoomCost}
                onChange={(e) => setNewHotel({ ...newHotel, standardRoomCost: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deluxe Rooms"
                type="number"
                min="0"
                value={newHotel.deluxeRoomCount}
                onChange={(e) => setNewHotel({ ...newHotel, deluxeRoomCount: e.target.value })}
                required
              />
              <Input
                label="Deluxe Room Cost (ETH)"
                type="number"
                step="0.001"
                min="0"
                value={newHotel.deluxeRoomCost}
                onChange={(e) => setNewHotel({ ...newHotel, deluxeRoomCost: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Suites"
                type="number"
                min="0"
                value={newHotel.suiteRoomCount}
                onChange={(e) => setNewHotel({ ...newHotel, suiteRoomCount: e.target.value })}
                required
              />
              <Input
                label="Suite Cost (ETH)"
                type="number"
                step="0.001"
                min="0"
                value={newHotel.suiteCost}
                onChange={(e) => setNewHotel({ ...newHotel, suiteCost: e.target.value })}
                required
              />
            </div>
            <Input
              label="Location"
              value={newHotel.location}
              onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
              required
            />
            <Input
              label="Image URL"
              value={newHotel.image}
              onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })}
              required
            />
            <Button type="submit" className="w-full mt-4">
              Add Hotel
            </Button>
          </form>
        </Card>
      )}
    </Container>
  );
};

export default HotelBookingApp;

