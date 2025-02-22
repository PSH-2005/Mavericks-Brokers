import { useEffect, useState } from 'react'
import React from 'react'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ occasion, tokenMaster, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)
  const [ticketCount, setTicketCount] = useState(0)
  const [userIP, setUserIP] = useState('')

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMaster.getSeatsTaken(occasion.id)
    setSeatsTaken(seatsTaken)
  }

  const getIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setUserIP(data.ip)
    } catch (error) {
      console.error("Error fetching IP:", error)
      // Fallback IP for development/testing
      setUserIP('0.0.0.0')
    }
  }

  const checkTicketCount = async () => {
    if (!userIP) return
    try {
      const count = await tokenMaster.getTicketsByIP(occasion.id, userIP)
      setTicketCount(count)
    } catch (error) {
      console.error("Error checking ticket count:", error)
    }
  }

  const buyHandler = async (_seat) => {
    if (!userIP) {
      alert("Unable to determine IP address. Please try again.")
      return
    }

    if (ticketCount >= 5) {
      alert("You have reached the maximum ticket limit (5) for this occasion.")
      return
    }

    setHasSold(false)

    try {
      const signer = await provider.getSigner()
      const transaction = await tokenMaster.connect(signer).mint(
        occasion.id,
        _seat,
        userIP,
        { value: occasion.cost }
      )
      await transaction.wait()
      setHasSold(true)
      
      // Update ticket count after successful purchase
      checkTicketCount()
    } catch (error) {
      console.error("Error purchasing ticket:", error)
      alert("Error purchasing ticket. Please try again.")
    }
  }

  useEffect(() => {
    getSeatsTaken()
    getIP()
  }, [hasSold])

  useEffect(() => {
    if (userIP) {
      checkTicketCount()
    }
  }, [userIP, occasion.id])

  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__info">
          <p>Your IP: {userIP}</p>
          <p>Tickets purchased for this event: {ticketCount}/5</p>
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