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
            <Card.Root maxW="sm" minW="85%" h="450px" shadow="xl">
                <Image
                    src={hotel.image?hotel.image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
                    alt={hotel.name} 
                    h="50%"
                />
                <Card.Body gap="0.5" h="50%" shadow={"md"}>
                    <Card.Title>{hotel.name}</Card.Title>
                    <RatingGroup.Root readOnly count={5} defaultValue={3} size="sm" colorPalette="yellow">
                        <RatingGroup.HiddenInput />
                            <RatingGroup.Control>
                                {Array.from({ length: 5 }).map((_, index) => (
                                <RatingGroup.Item key={index} index={index + 1}>
                            <RatingGroup.ItemIndicator/>
                                </RatingGroup.Item>
                                ))}
                            </RatingGroup.Control>
                     </RatingGroup.Root>
                    <Card.Description>
                        This sofa is perfect for modern tropical spaces, baroque inspired
                            spaces. Located in {hotel.location}
                    </Card.Description>
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
                </Card.Body>
                <Card.Footer p="2" gap="2" display="flex" justifyContent="space-between" alignItems="center" >
                    <Button variant="solid" w="1/2" h="12" bgColor={"blue.900"}>Book Now</Button>
                        <Text textStyle="2xl" fontWeight="light" letterSpacing="tight" mt="2" color="grey" >
                            $450
                        </Text>

        {/* <Button variant="ghost">Add to cart</Button> */}
                </Card.Footer>
                </Card.Root>
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

