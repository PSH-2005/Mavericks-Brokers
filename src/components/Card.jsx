import { ethers } from 'ethers';
import React from 'react';
import './Card.css'; // import the new styling

const Card = ({ occasion, toggle, setToggle, setOccasion }) => {
  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  const formatCost = () => {
    try {
      return ethers.formatEther(occasion.cost.toString());
    } catch (error) {
      console.error("Error formatting cost:", error);
      return "0";
    }
  };

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{occasion.date}</strong><br />{occasion.time}
        </p>
        <h3 className='card__name'>{occasion.name}</h3>
        <p className='card__location'><small>{occasion.location}</small></p>
        <p className='card__cost'>
          <strong>{formatCost()}</strong> ETH
        </p>
        {occasion.tickets.toString() === "0" ? (
          <button type="button" className='card__button--out' disabled>
            Sold Out
          </button>
        ) : (
          <button type="button" className='card__button' onClick={togglePop}>
            View Seats
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
