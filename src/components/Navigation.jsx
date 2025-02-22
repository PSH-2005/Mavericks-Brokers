import { ethers } from 'ethers';
import React, { useState } from 'react';

const Navigation = ({ account, setAccount }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectHandler = async () => {
    try {
      setIsConnecting(true);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert("Please install MetaMask to connect!");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts && accounts.length > 0) {
        // In ethers v6, getAddress is on the ethers object directly
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
      }

    } catch (error) {
      console.error("Connection error:", error);
      if (error.code === 4001) {
        alert("Please connect your wallet to continue");
      } else {
        alert("Error connecting to wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Mavericks Bookers</h1>

        <input 
          className='nav__search' 
          type="text" 
          placeholder='Find millions of experiences' 
        />

        <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </nav>
  );
};

export default Navigation;