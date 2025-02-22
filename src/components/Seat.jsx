import React from 'react';

const Seat = ({ seatNumber, seatsTaken, selected, buyHandler }) => {
  const isTaken = seatsTaken.find(seat => Number(seat) === seatNumber);
  let className = "occasion__seats";
  if (isTaken) {
    className = "occasion__seats--taken";
  } else if (selected) {
    className += " occasion__seats--selected";
  }
  return (
    <div onClick={() => buyHandler(seatNumber)} className={className}>
      {seatNumber}
    </div>
  );
};

export default Seat;
