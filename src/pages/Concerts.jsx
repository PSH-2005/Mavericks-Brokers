import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import Sort from "../components/Sort";
import Card from "../components/Card";
import SeatChart from "../components/SeatChart";
import IPAddressDisplay from "../components/ipAdressDisplay";
import TokenMaster from "../abis/TokenMaster.json";

const CONTRACT_ADDRESS = "0x2f8e6732C805eBC22a82c241254272f933de93aE";

const Concerts = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        if (typeof window.ethereum === "undefined") {
          setError("Please install MetaMask or another Web3 wallet");
          setLoading(false);
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) setAccount(accounts[0]);

        const tokenMaster = new ethers.Contract(CONTRACT_ADDRESS, TokenMaster, provider);
        setTokenMaster(tokenMaster);

        const totalOccasions = await tokenMaster.totalOccasions();
        const occasionsData = [];
        for (let i = 1; i <= totalOccasions; i++) {
          const occ = await tokenMaster.getOccasion(i);
          if (parseInt(id) === i - 1){ 
            setOccasion(occ);
            setToggle(occ);
          }
          occasionsData.push(occ);
        }
        setOccasions(occasionsData);

        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts.length > 0 ? accounts[0] : null);
          if (!accounts.length) setError("Please connect your wallet");
        });

        window.ethereum.on("chainChanged", () => window.location.reload());
      } catch (error) {
        setError(error.code === 4001 ? "Please connect your wallet to continue" : "Error connecting to blockchain. Please try again.");
        console.error("Error loading blockchain data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="text-center text-red-600 mt-4">{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="max-w-full">
      <div className="min-h-[150px] flex flex-col justify-center">
  <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">
    Concerts
  </h1>
  <h2 className="text-4xl text-blue-600 mb-8 text-center">
    Discover the latest concerts happening near you.
  </h2>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {occasions.map((occ, index) => (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-blue-100 overflow-hidden">
              <Card occasion={occ} id={index + 1} tokenMaster={tokenMaster} provider={provider} account={account} toggle={toggle} setToggle={setToggle} setOccasion={setOccasion} />
            </motion.div>
          ))}
        </div>

        {toggle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6">
              <SeatChart occasion={occasion} tokenMaster={tokenMaster} provider={provider} setToggle={setToggle} />
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-blue-600 text-center">
          <IPAddressDisplay />
        </motion.div>
      </div>
    // </div>
  );
};

export default Concerts;
