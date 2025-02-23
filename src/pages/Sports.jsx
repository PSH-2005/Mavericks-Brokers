import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from "../components/Navigation";
import Sort from '../components/Sort';
import Card from '../components/Card';
import SportsABI from '../abis/SportsMaster.json';

const CONTRACT_ADDRESS = "0xC47eE019A7a7AEB1e53C19723e3aEd6C1C84E7E9";

const Sports = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [sportsMaster, setSportsMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAccountsChanged = (accounts) => {
    if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
      setError("Please connect your wallet");
    }
  };

  const loadOccasions = async (contract) => {
    try {
      const totalOccasions = await contract.totalOccasions();
      const occasions = [];
      for (let i = 1; i <= totalOccasions; i++) {
        const occ = await contract.getOccasion(i);
        if (occ) {
          occasions.push(occ);
        }
      }
      setOccasions(occasions);
    } catch (err) {
      console.error("Error loading occasions:", err);
      setError("Failed to load events");
    }
  };

  const loadBlockchainData = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError("Please install MetaMask or another Web3 wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);

        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name);

        const sportsContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SportsABI,
          provider
        );
        setSportsMaster(sportsContract);

        await loadOccasions(sportsContract);

        // Setup event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
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
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const renderContent = () => {
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <header>
            <Navigation account={account} setAccount={setAccount} />
          </header>

          <h1 className="text-4xl font-bold text-blue-900 mb-2 text-center">
            Sports Events
          </h1>
          <p className="text-lg text-blue-600 mb-8 text-center">
            Book tickets for upcoming sports events
          </p>

          <div className="mb-8 text-blue-600">
            <Sort />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8 mx-auto items-center">
            {occasions.map((occ, index) => (
              <div 
                className="transform hover:scale-105 transition-transform duration-300 max-w-[600px] mx-auto" 
                key={index}
              >
                <Card
                  occasion={occ}
                  id={index + 1}
                  tokenMaster={sportsMaster}
                  provider={provider}
                  account={account}
                  toggle={toggle}
                  setToggle={setToggle}
                  setOccasion={setOccasion}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-100 overflow-hidden"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default Sports;