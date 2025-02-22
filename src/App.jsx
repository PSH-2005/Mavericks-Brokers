import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Sort from './components/Sort';
import Card from './components/Card';
import SeatChart from './components/SeatChart';

// ABIs
import TokenMaster from './abis/TokenMaster.json';

const CONTRACT_ADDRESS = "0x31540674be8Cd140AA6e4Be3E207c8fF4E60fCA3";

function App() {
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
      // Check if ethereum object exists
      if (typeof window.ethereum === 'undefined') {
        setError("Please install MetaMask or another Web3 wallet");
        setLoading(false);
        return;
      }

      // Setup provider first - Updated for ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          setAccount(account);
        }

        // Get network
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name);

        // Setup contract - Updated for ethers v6
        const tokenMaster = new ethers.Contract(
          CONTRACT_ADDRESS,
          TokenMaster,
          provider
        );
        setTokenMaster(tokenMaster);

        // Load occasions
        const totalOccasions = await tokenMaster.totalOccasions();
        const occasions = [];

        for (var i = 1; i <= totalOccasions; i++) {
          const occasion = await tokenMaster.getOccasion(i);
          occasions.push(occasion);
        }

        setOccasions(occasions);

        // Setup account change listener
        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setError("Please connect your wallet");
          }
        });

        // Setup network change listener
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
          <h2 className="header__title bg-red-300"><strong>Event</strong> Tickets</h2>
        </header>
        <div className="text-center mt-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title bg-red-300"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
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
    </div>
  );
}

export default App;