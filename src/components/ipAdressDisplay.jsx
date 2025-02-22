import React, { useState, useEffect } from 'react';

const IPAddressDisplay = () => {
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocalIPAddress = async () => {
      try {
        // Using WebRTC to get local IP address
        const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        
        if (!RTCPeerConnection) {
          setError('WebRTC is not supported in this browser');
          return;
        }

        const pc = new RTCPeerConnection({
          iceServers: []
        });

        pc.createDataChannel('');
        
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(err => setError(err.toString()));

        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) return;

          const localIP = ice.candidate.candidate.split(' ')[4];
          if (localIP.indexOf('.') !== -1) {
            setIpAddress(localIP);
          }
          
          pc.onicecandidate = null;
          pc.close();
        };
      } catch (err) {
        setError('Failed to get local IP address');
        console.error(err);
      }
    };

    getLocalIPAddress();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Local IP Address</h3>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="font-mono">{ipAddress}</p>
      )}
    </div>
  );
};

export default IPAddressDisplay;