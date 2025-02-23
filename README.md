[![Contributors](https://img.shields.io/github/contributors/PSH-2005/aaj?style=flat-square)](https://github.com/PSH-2005/aaj/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/PSH-2005/aaj?style=flat-square)](https://github.com/PSH-2005/aaj/commits/main)
[![Move Language](https://img.shields.io/badge/Move-Language-red?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJaTTEyIDIwQzcuNTgxNzIgMjAgNCAxNi40MTgzIDQgMTJDNCAxMC40MjI3IDQuNDQwNDMgOC45NDk3OCA1LjE5NzggNy42OTc0N0w3LjY5NzQ3IDUuMTk3OEM4Ljk0OTc4IDQuNDQwNDMgMTAuNDIyNyA0IDEyIDRDMTYuNDE4MyA0IDIwIDcuNTgxNzIgMjAgMTJDMjAgMTYuNDE4MyAxNi40MTgzIDIwIDEyIDIwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)](https://github.com/move-language/move)
[![IPFS](https://img.shields.io/badge/IPFS-Enabled-blue.svg?style=flat-square&logo=ipfs)](https://ipfs.io/)
[![Module](https://img.shields.io/badge/Module-Verified-green.svg?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxNi4xN0w0LjgzIDEyTDMuNDEgMTMuNDFMOSAxOUwyMSA3TDE5LjU5IDUuNTlMOSAxNi4xN1oiIGZpbGw9IndoaXRlIi8+PC9zdmc+)](https://explorer.aptoslabs.com/txn/0xfd71f336763eab3cec382344c3785a1bbaa5702738101ebb04b05de2b11ca5b1?network=testnet)

# Maverick Brokers

**Decentralized Ticketing & Travel Assistant Platform**

Maverick Brokers is a blockchain-based ticketing system designed to revolutionize event management. Every sale and minting of a ticket is recorded directly on the blockchain, ensuring complete transparency and reducing corruption risks that often plague traditional event booking platforms. Each ticket is minted as a unique, non-resellable NFT to guarantee authenticity and to curb bot-driven hoarding. Additionally, Maverick Brokers leverages IPFS to store a hashed version of the buyer’s private IP address, enforcing a strict limit of five tickets per event per buyer. To enhance the user experience, the platform integrates an AI assistant that provides travel-related recommendations—rendered consistently through custom JavaScript parsers.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture Flow](#architecture-flow)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Maverick Brokers addresses key issues in ticket sales by using blockchain technology to:

- **Record every transaction on-chain:** This ensures transparency and helps reduce fraudulent practices.
- **Mint tickets as non-resellable NFTs:** Each ticket is unique and secure, deterring bot agents and unsafe practices such as sharing wallet credentials.
- **Leverage IPFS for privacy:** A hashed version of the buyer’s IP address is stored on IPFS, enabling the system to verify purchase limits while preserving privacy.
- **Integrate an AI travel assistant:** The AI assistant uses a master prompt to output travel-related data in JSON format, which is parsed by custom JavaScript functions to generate informational cards, hotel recommendations, and map views.

---

## Features

- **Wallet Integration & On-Chain Transparency:**  
  Every ticket sale and minting transaction is securely recorded on the Ethereum blockchain, reducing corruption risks by eliminating discrepancies between available and sold tickets.

- **NFT Ticket Minting:**  
  Tickets are minted as non-resellable NFTs to guarantee uniqueness and authenticity, deterring bot-driven hoarding and unsafe practices.

- **IPFS-Based Purchase Tracking:**  
  A hashed version of the buyer’s private IP address is stored on IPFS. This allows the system to enforce a strict limit of five tickets per event per buyer without compromising user privacy.

- **AI-Powered Travel Assistance:**  
  The platform integrates an AI assistant that returns travel-related data in a controlled JSON format. Custom JavaScript functions then render this data into informational cards, hotel recommendations, and mapped locations based on predefined criteria.

---

## Architecture Flow

1. **Ticket Purchase Workflow:**  
   - **Wallet Connection:** Users securely connect their Ethereum wallet.
   - **Ticket Minting:** On purchase, a ticket is minted as a non-resellable NFT and recorded on-chain.
   - **IPFS Integration:** The buyer’s hashed IP address is stored on IPFS to track and enforce purchase limits.

2. **AI Travel Assistant Workflow:**  
   - **Query & JSON Response:** The AI assistant is triggered via a master prompt and returns travel data in JSON format.
   - **Custom Rendering:** Bespoke JavaScript functions parse the JSON to generate informational cards, hotel recommendations, and map views.

---

## Technologies Used

- **Frontend:**  
  - TypeScript  
  - Express JS  
  - Chakra UI, Shadcn, Tailwind CSS

- **Backend & APIs:**  
  - Fast API  
  - Postgres

- **Blockchain & Smart Contracts:**  
  - Solidity  
  - Ethereum

- **Storage & Decentralized Data:**  
  - IPFS

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Ethereum wallet (e.g., MetaMask)
- Fast API and Postgres installed on your system
- Solidity development environment (e.g., Hardhat)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/maverick-brokers.git
   cd maverick-brokers

2. **For the backend:**
  
    ```bash
    cd backend
    npm install

3. **For the frontend:**
    ```bash
    cd ../frontend
    npm install
