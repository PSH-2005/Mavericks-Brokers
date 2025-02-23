import React from "react";
import "./Pages.css";
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
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
const CONTRACT_ADDRESS = "0x2f8e6732C805eBC22a82c241254272f933de93aE";

const Concerts = () => {

  const [provider, setProvider] = useState(null);
  const { id } = useParams();

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
          if(parseInt(id)===i-1){
            console.log("Entered the lloop",occ)
            setOccasion(occ);
          }
          occasions.push(occ);
        }
        console.log("Occ",occasions)
        setOccasions(occasions);
        setToggle(true);
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
    <div className="min-h-screen bg-gradient-to-b text-black from-blue-50 to-white mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">
          Concerts
        </h1>
        <p className="text-lg text-blue-600 mb-8 text-center">
          Discover the latest concerts happening near you.
        </p>
  
        {/* Sort Component */}
        <div className="mb-8 text-blue-600">
          <Sort />
        </div>
  
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8 mx-auto items-center">
          {occasions.map((occ, index) => (
            <div className="transform hover:scale-105 transition-transform duration-300 max-w-[600px] mx-auto" key={index}>
              <Card

                occasion={occ}
                id={index + 1}
                tokenMaster={tokenMaster}
                provider={provider}
                account={account}
                toggle={toggle}
                setToggle={setToggle}
                setOccasion={setOccasion}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 
                border border-blue-100 overflow-hidden"
              />
            </div>
          ))}
        </div>
  
        {/* Seat Chart Modal */}
        {toggle && (
          <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 p-6">
              <SeatChart
                occasion={occasion}
                tokenMaster={tokenMaster}
                provider={provider}
                setToggle={setToggle}
                className="bg-white rounded-xl"
              />
            </div>
          </div>
        )}
  
        {/* IP Address Display */}
        <div className="mt-8 text-blue-600 text-center">
          <IPAddressDisplay className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default Concerts;
