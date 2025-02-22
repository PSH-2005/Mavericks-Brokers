import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CreateEvents = ({ tokenMaster, provider }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    maxTickets: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const owner = await tokenMaster.owner();
        console.log("Owner in the contract:", owner);

        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("User address:", address);

        // Ensure both addresses have the correct checksum format
        setIsOwner(ethers.getAddress(owner) === ethers.getAddress(address));
      } catch (error) {
        console.error("Error checking ownership:", error);
        setIsOwner(false);
      }
    };

    if (provider && tokenMaster) {
      checkOwnership();
    }
  }, [provider, tokenMaster]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // Convert cost to wei using ethers v6 method
      const costInWei = ethers.parseEther(formData.cost.toString());

      // Get signer
      const signer = await provider.getSigner();

      // Create transaction
      const transaction = await tokenMaster.connect(signer).list(
        formData.name,
        costInWei,
        formData.maxTickets,
        formData.date,
        formData.time,
        formData.location
      );

      // Wait for transaction to be confirmed
      await transaction.wait();

      setMessage({
        type: 'success',
        content: 'Event created successfully!'
      });

      // Reset form fields
      setFormData({
        name: '',
        cost: '',
        maxTickets: '',
        date: '',
        time: '',
        location: ''
      });

    } catch (error) {
      console.error("Error creating event:", error);
      setMessage({
        type: 'error',
        content: 'Failed to create event. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">
          Only the contract owner can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>

      {message.content && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Cost (ETH)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
            required
            step="0.000000000000000001"
            min="0"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter ticket cost in ETH"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Maximum Tickets</label>
          <input
            type="number"
            name="maxTickets"
            value={formData.maxTickets}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter maximum number of tickets"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Date</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter date (e.g., Jun 30)"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Time</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter time (e.g., 7:00PM EST)"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Enter event location"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white rounded-lg ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvents;
