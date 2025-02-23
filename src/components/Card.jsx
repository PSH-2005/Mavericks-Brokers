import { ethers } from 'ethers';
import React from 'react';

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
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100">
      <div className="p-6 space-y-4">
        {/* Date and Time */}
        <div className="text-blue-600 font-medium">
          <span className="block text-lg">{occasion.date}</span>
          <span className="text-blue-400">{occasion.time}</span>
        </div>

        {/* Event Name */}
        <h3 className="text-xl font-bold text-blue-900 line-clamp-2">
          {occasion.name}
        </h3>

        {/* Location */}
        <p className="text-blue-500 text-sm">
          {occasion.location}
        </p>

        {/* Cost */}
        <p className="text-lg font-semibold text-blue-700">
          {formatCost()} <span className="text-blue-500">ETH</span>
        </p>

        {/* Button */}
        {occasion.tickets.toString() === "0" ? (
          <button
            type="button"
            disabled
            className="w-full py-3 px-6 bg-gray-200 text-gray-500 rounded-lg font-medium 
            cursor-not-allowed transition-colors duration-300"
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            onClick={togglePop}
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium 
            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
            shadow-md hover:shadow-lg"
          >
            View Seats
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;