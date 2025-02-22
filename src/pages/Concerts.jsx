import React from "react";
import "./Pages.css";
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from "../components/Navigation";
import Sort from '../components/Sort';
import Card from '../components/Card';
import SeatChart from '../components/SeatChart';
import IPAddressDisplay from '../components/ipAdressDisplay';
import CreateEvents from '../components/CreateEvents';
import TokenMaster from '../abis/TokenMaster.json';
import Cardd from '../components/cardd';
import Sports from './Sports.jsx';
import Hotels from "./Hotels";
import About from "./About";
import Contact from "./Contact";

const CONTRACT_ADDRESS = "0xA6C0d559a31838b3f3Ef940cF3bBD22C8f70c1fa";

const Concerts = () => {
    const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBlockchainData = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError("Please install MetaMask or another Web3 wallet");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }

        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name);

        const tokenMaster = new ethers.Contract(
          CONTRACT_ADDRESS,
          TokenMaster,
          provider
        );
        setTokenMaster(tokenMaster);

        const totalOccasions = await tokenMaster.totalOccasions();
        const occasions = [];
        for (let i = 1; i <= totalOccasions; i++) {
          const occ = await tokenMaster.getOccasion(i);
          occasions.push(occ);
        }
        setOccasions(occasions);

        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setError("Please connect your wallet");
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (error) {
        if (error.code === 4001) {
          setError("Please connect your wallet to continue");
        } else {
          console.error("Error loading blockchain data:", error);
          setError("Error connecting to blockchain. Please try again.");
        }
      }
    } catch (error) {
      console.error("Fatal error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header>
          <Navigation account={account} setAccount={setAccount} />
          <h2 className="header__title"><strong>Event</strong> Tickets</h2>
        </header>
        <div className="text-center mt-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="page">
      <h1>Concerts</h1>
      <p>Discover the latest concerts happening near you.</p>
      
      <Sort />
      <div className="cards">
        {occasions.map((occ, index) => (
          <Card
            occasion={occ}
            id={index + 1}
            tokenMaster={tokenMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
      <IPAddressDisplay />
    </div>

  );
};

export default Concerts;
