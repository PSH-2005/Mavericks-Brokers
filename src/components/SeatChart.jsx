import { useEffect, useState } from 'react'
import React from 'react'
import { ethers } from 'ethers'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'
import { keccak256, toUtf8Bytes } from "ethers";
const SeatChart = ({ occasion, tokenMaster, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)
  const [ticketCount, setTicketCount] = useState(0)
  const [localIP, setLocalIP] = useState('')
  const [hashedIP, setHashedIP] = useState('')
  const [error, setError] = useState(null)

  const getLocalIPAddress = async () => {
    try {
      const RTCPeerConnection = window.RTCPeerConnection || 
                               window.webkitRTCPeerConnection || 
                               window.mozRTCPeerConnection

      if (!RTCPeerConnection) {
        throw new Error('WebRTC is not supported in this browser')
      }

      const pc = new RTCPeerConnection({ iceServers: [] })
      pc.createDataChannel('')

      await pc.createOffer().then(offer => pc.setLocalDescription(offer))

      return new Promise((resolve, reject) => {
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) return

          const localIP = ice.candidate.candidate.split(' ')[4]
          if (localIP.indexOf('.') !== -1) {
            pc.onicecandidate = null
            pc.close()
            resolve(localIP)
          }
        }

        // Add timeout to prevent hanging
        setTimeout(() => {
          pc.close()
          reject(new Error('Failed to get local IP: Timeout'))
        }, 5000)
      })
    } catch (err) {
      throw new Error(`Failed to get local IP: ${err.message}`)
    }
  }


  const hashIPAddress = (ip) => {
    console.log("IP in the frontend:", ip);

    // Convert IP address to bytes and hash it
    const hashed = keccak256(toUtf8Bytes(ip));

    console.log("Hashed IP in the backend:", hashed);
    return hashed 
  };

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id)
    setSeatsTaken(seatsTaken)
  }

  const checkTicketCount = async () => {
    if (!hashedIP) return
    try {
      const count = await tokenMaster.getTicketsByIP(occasion.id, hashedIP)
      setTicketCount(count)
    } catch (error) {
      console.error("Error checking ticket count:", error)
      setError("Failed to check ticket count")
    }
  }

  const buyHandler = async (_seat) => {
    if (!hashedIP) {
      setError("Unable to verify device identity. Please try again.")
      return
    }

    if (ticketCount >= 5) {
      setError("You have reached the maximum ticket limit (5) for this occasion.")
      return
    }

    setHasSold(false)
    setError(null)

    try {
      const signer = await provider.getSigner()
      const transaction = await tokenMaster.connect(signer).mint(
        occasion.id,
        _seat,
        hashedIP,
        { value: occasion.cost }
      )
      await transaction.wait()
      setHasSold(true)
      checkTicketCount()
    } catch (error) {
      console.error("Error purchasing ticket:", error)
      setError("Failed to purchase ticket. Please try again.")
    }
  }

  useEffect(() => {
    const initializeIP = async () => {
      try {
        const ip = await getLocalIPAddress()
        setLocalIP(ip)
        const hashed = hashIPAddress(ip)
        setHashedIP(hashed)
      } catch (err) {
        setError(err.message)
      }
    }

    initializeIP()
    getSeatsTaken()
  }, [hasSold])

  useEffect(() => {
    if (hashedIP) {
      checkTicketCount()
    }
  }, [hashedIP, occasion.id])

  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__info">
          <p>Device ID: {localIP ? '✓ Verified' : 'Not detected'}</p>
          <p>Tickets purchased for this event: {ticketCount}/5</p>
          {error && <p className="occasion__error">{error}</p>}
        </div>

        <div className="occasion__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(occasion.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(occasion.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div>
  );
}

export default SeatChart;