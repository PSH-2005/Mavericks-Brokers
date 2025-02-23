import { ethers } from "ethers";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css"; 
import DialogButton from "@/DialogButton";
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
      <div className="nav__brand flex items-center gap-x-5">
        <h1 className="text-3xl italics">Mavericks Brokers</h1>
        <DialogButton/>
      </div>
      <div className="nav__links-container flex flex-row justify-between items-center gap-x-6">
        <ul className="nav__links flex flex-row justify-between items-center gap-x-6">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/concerts">Concerts</Link></li>
          <li><Link to="/sports">Sports</Link></li>
          <li><Link to="/hotels">Hotels</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
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
