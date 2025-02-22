import { ethers } from "ethers";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css"; 

const Navigation = ({ account, setAccount }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectHandler = async () => {
    try {
      setIsConnecting(true);
      if (!window.ethereum) {
        alert("Please install MetaMask to connect!");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const connectedAccount = ethers.utils.getAddress(accounts[0]);
        setAccount(connectedAccount);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert(error.code === 4001 ? "Please connect your wallet" : "Error connecting to wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="nav">
      <div className="nav__brand">
        <h1>Mavericks Bookers</h1>
      </div>
      <div className="nav__links-container">
        <ul className="nav__links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/concerts">Concerts</Link></li>
          <li><Link to="/sports">Sports</Link></li>
          <li><Link to="/hotels">Hotels</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
        <input className="nav__search" type="text" placeholder="Find experiences" />
        {account ? (
          <button className="nav__connect">{account.slice(0, 6) + "..." + account.slice(-4)}</button>
        ) : (
          <button className="nav__connect" onClick={connectHandler} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
