import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('Disconnected');
  const [mode, setMode] = useState('auto');
  const [ws, setWs] = useState(null);
  const [cameraIP, setCameraIP] = useState('192.168.1.100'); // Replace with ESP32-CAM IP
  const [carIP, setCarIP] = useState('192.168.1.101'); // Replace with ESP32 Car IP
  const [authKey, setAuthKey] = useState('SECRET_KEY123'); // Match ESP32 code

  const connectWebSocket = useCallback(() => {
    const websocket = new WebSocket(`ws://${carIP}:81`);
    
    websocket.onopen = () => {
      setStatus('Authenticating...');
      websocket.send(authKey);
    };

    websocket.onmessage = (e) => {
      const message = e.data;
      if (message === 'AUTH_SUCCESS') {
        setStatus('Connected (Manual Mode)');
        setMode('manual');
      } else if (message.startsWith('MODE:')) {
        setMode(message.split(':')[1].toLowerCase());
        setStatus(`Connected (${message.split(':')[1]} Mode)`);
      } else {
        console.log('Server:', message);
      }
    };

    websocket.onclose = () => {
      setStatus('Disconnected');
      setMode('auto');
    };

    setWs(websocket);
  }, [carIP, authKey]);

  useEffect(() => {
    connectWebSocket();
    return () => ws?.close();
  }, [connectWebSocket]);

  const sendCommand = (command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(command);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'auto' ? 'MANUAL' : 'AUTO';
    sendCommand(newMode);
  };

  return (
    <div className="app-container">
      <div className="status-bar">
        <div className={`status-indicator ${status.includes('Connected') ? 'connected' : 'disconnected'}`} />
        <span>{status}</span>
        <div className="ip-inputs">
          <input
            type="text"
            value={carIP}
            onChange={(e) => setCarIP(e.target.value)}
            placeholder="Car IP"
          />
          <input
            type="text"
            value={cameraIP}
            onChange={(e) => setCameraIP(e.target.value)}
            placeholder="Camera IP"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="video-feed">
          <h2>Live Camera Feed</h2>
          <img 
            src={`http://${cameraIP}/stream`} 
            alt="Live feed" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/connection-lost.jpg';
            }}
          />
        </div>

        <div className="control-panel">
          <button 
            className={`mode-toggle ${mode}`}
            onClick={toggleMode}
          >
            {mode.toUpperCase()} MODE
          </button>

          {mode === 'manual' && (
            <div className="manual-controls">
              <button onClick={() => sendCommand('forward')}>▲ Forward</button>
              <div className="horizontal-controls">
                <button onClick={() => sendCommand('left')}>◀ Left</button>
                <button onClick={() => sendCommand('stop')}>⏹ Stop</button>
                <button onClick={() => sendCommand('right')}>Right ▶</button>
              </div>
              <button onClick={() => sendCommand('backward')}>▼ Backward</button>
            </div>
          )}

          {mode === 'auto' && (
            <div className="auto-status">
              <h3>Autonomous Mode Active</h3>
              <p>The car is navigating independently</p>
              <p>Obstacle detection and flame sensing enabled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
