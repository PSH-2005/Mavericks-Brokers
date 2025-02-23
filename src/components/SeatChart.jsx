import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { ethers } from 'ethers';
import Seat from './Seat';
import { keccak256, toUtf8Bytes } from "ethers";

const SeatChart = ({ occasion, tokenMaster, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState([]);
  const [hasSold, setHasSold] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [localIP, setLocalIP] = useState('');
  const [hashedIP, setHashedIP] = useState('');
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Ref for the scrollable container
  const scrollContainerRef = useRef(null);

  const getLocalIPAddress = async () => {
    try {
      const RTCPeerConnection =
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection;
      if (!RTCPeerConnection) {
        throw new Error('WebRTC is not supported in this browser');
      }
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      await pc.createOffer().then((offer) => pc.setLocalDescription(offer));
      return new Promise((resolve, reject) => {
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) return;
          const localIP = ice.candidate.candidate.split(' ')[4];
          if (localIP.indexOf('.') !== -1) {
            pc.onicecandidate = null;
            pc.close();
            resolve(localIP);
          }
        };
        setTimeout(() => {
          pc.close();
          reject(new Error('Failed to get local IP: Timeout'));
        }, 5000);
      });
    } catch (err) {
      throw new Error(`Failed to get local IP: ${err.message}`);
    }
  };

  const hashIPAddress = (ip) => keccak256(toUtf8Bytes(ip));

  const getSeatsTaken = async () => {
    try {
      const taken = await tokenMaster.getSeatsTaken(occasion.id);
      setSeatsTaken(taken);
    } catch (err) {
      console.error(err);
      setError("Failed to load seats taken");
    }
  };

  const checkTicketCount = async () => {
    if (!hashedIP) return;
    try {
      const count = await tokenMaster.getTicketsByIP(occasion.id, hashedIP);
      setTicketCount(Number(count));
    } catch (error) {
      console.error("Error checking ticket count:", error);
      setError("Failed to check ticket count");
    }
  };

  const buyHandler = async (seatNumber) => {
    // Toggle selection if the same seat is clicked.
    if (selectedSeat === seatNumber) {
      setSelectedSeat(null);
      return;
    }
    setSelectedSeat(seatNumber);

    if (!hashedIP) {
      setError("Unable to verify device identity. Please try again.");
      setSelectedSeat(null);
      return;
    }
    if (ticketCount >= 5) {
      setError("You have reached the maximum ticket limit (5) for this occasion.");
      setSelectedSeat(null);
      return;
    }
    setHasSold(false);
    setError(null);
    try {
      const signer = await provider.getSigner();
      const transaction = await tokenMaster.connect(signer).mint(
        occasion.id,
        seatNumber,
        hashedIP,
        { value: occasion.cost }
      );
      await transaction.wait();
      setHasSold(true);
      checkTicketCount();
      setSelectedSeat(null);
      getSeatsTaken();
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      setError("");
      setSelectedSeat(null);
    }
  };

  // Enable arrow key scrolling.
  const handleKeyDown = (e) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 20;
    if (e.key === 'ArrowDown') {
      scrollContainerRef.current.scrollTop += scrollAmount;
    } else if (e.key === 'ArrowUp') {
      scrollContainerRef.current.scrollTop -= scrollAmount;
    }
  };

  useEffect(() => {
    const initializeIP = async () => {
      try {
        const ip = await getLocalIPAddress();
        setLocalIP(ip);
        const hashed = hashIPAddress(ip);
        setHashedIP(hashed);
      } catch (err) {
        setError(err.message);
      }
    };
    initializeIP();
    getSeatsTaken();
  }, [hasSold]);

  useEffect(() => {
    if (hashedIP) {
      checkTicketCount();
    }
  }, [hashedIP, occasion.id]);

  // Split seats into left and right blocks.
  const totalSeats = Number(occasion.maxTickets);
  const leftSeatsCount = Math.ceil(totalSeats / 2);
  const leftSeats = Array.from({ length: leftSeatsCount }, (_, i) => i + 1);
  const rightSeats = Array.from({ length: totalSeats - leftSeatsCount }, (_, i) => leftSeatsCount + i + 1);

  return (
    <div className="occasion text-black ">
      <div className="occasion__seating " style={{ position: 'relative' }}>
        {/* Close button positioned at the top right */}
        <div
          className="close-btn-container text-bold"
          style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
          onClick={() => setToggle(false)}
        >
          <span className="close-icon">&times;</span>
          <div className="close-tooltip">Close Tab</div>
        </div>

        <h1 className="occasion__title text-center text-bold">{occasion.name} Seating Map</h1>
        <div className="occasion__info">
          <p className='text-center text-bold'>Device: {localIP ? 'Verified' : 'Not detected'}</p>
          <p className='text-center text-bold'>Tickets: {ticketCount}/5</p>
          {error && <p className="occasion__error">{error}</p>}
        </div>
        {/* Stage with blue border and light grey background */}
        <div 
          className="occasion__stage" 
          style={{ 
            // border: '2px solid blue', 
            backgroundColor: 'lightgrey',
            padding: '10px', 
            borderRadius: '5px', 
            textAlign: 'center', 
            marginBottom: '10px',
            color: 'black'
          }}
        >
          <strong>STAGE</strong>
        </div>
        {/* Scrollable seating area */}
        <div 
          className="scrollable-section" 
          ref={scrollContainerRef} 
          tabIndex="0"
          onKeyDown={handleKeyDown}
          style={{ 
            overflowY: 'auto', 
            height: '400px', 
            padding: '10px' 
          }}
        >
          <div className="occasion__hallway flex gap-y-10">
            {/* Left Walkway with blue border and light grey background */}
            <br/>
            <div 
              className="occasion__walkway occasion__walkway--left"
              style={{ 
                // border: '2px solid blue', 
                backgroundColor: 'lightgrey',
                padding: '5px', 
                borderRadius: '5px', 
                marginBottom: '10px',
                color: 'black'
              }}
            >
              <span>WALKWAY</span>
            </div>
            <div className="occasion__seatsWrapper items-center justify-center mx-auto pl-[100px] text-center gap-y-10">
              <div className="occasion__seatsContainer flex flex-wrap gap-2 max-w-[400px] justify-center items-center">
                {leftSeats.map(seatNum => (
                  <Seat
                    key={seatNum}
                    seatNumber={seatNum}
                    seatsTaken={seatsTaken}
                    selected={selectedSeat === seatNum}
                    buyHandler={buyHandler}
                    className="seat"
                  />
                ))}
              </div>
              {/* Middle Walkway */}
              {/* <div 
                className="occasion__walkway occasion__walkway--middle"
                style={{ 
                  // border: '2px solid blue', 
                  backgroundColor: 'lightgrey',
                  padding: '5px', 
                  borderRadius: '5px', 
                  margin: '10px 0',
                  color: 'black'
                }}
              >
                <span>WALKWAY</span>
              </div> */}
              <br/>
              <br/>
              <div className="occasion__seatsContainer occasion__seatsContainer flex flex-wrap gap-2 max-w-[400px] justify-center items-center">
                {rightSeats.map(seatNum => (
                  <Seat
                    key={seatNum}
                    seatNumber={seatNum}
                    seatsTaken={seatsTaken}
                    selected={selectedSeat === seatNum}
                    buyHandler={buyHandler}
                    className="seat"
                  />
                ))}
              </div>
            </div>
            {/* Right Walkway */}
            <div 
              className="occasion__walkway occasion__walkway--right"
              style={{ 
                // border: '2px solid blue', 
                backgroundColor: 'lightgrey',
                padding: '5px', 
                borderRadius: '5px', 
                marginTop: '10px',
                color: 'black'
              }}
            >
              <span>WALKWAY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatChart;