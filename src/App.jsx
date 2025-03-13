import { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('Disconnected')
  const [mode, setMode] = useState('auto')
  const [ws, setWs] = useState(null)
  const [cameraIP, setCameraIP] = useState('192.168.1.100')
  const [carIP, setCarIP] = useState('192.168.1.101')
  const [authKey, setAuthKey] = useState('SECURE_KEY_123')
  const [streamKey, setStreamKey] = useState(Date.now())

  // WebSocket Connection
  useEffect(() => {
    const websocket = new WebSocket(`ws://${carIP}:81`)
    
    websocket.onopen = () => {
      setStatus('Authenticating...')
      websocket.send(authKey)
    }

    websocket.onmessage = (e) => {
      const msg = e.data
      if(msg === 'AUTH_SUCCESS') {
        setStatus('Connected (Auto Mode)')
        setMode('auto')
      } else if(msg.startsWith('MODE:')) {
        const newMode = msg.split(':')[1].toLowerCase()
        setMode(newMode)
        setStatus(`Connected (${newMode.charAt(0).toUpperCase() + newMode.slice(1)} Mode)`)
      }
    }

    websocket.onclose = () => {
      setStatus('Disconnected')
      setMode('auto')
    }

    setWs(websocket)
    return () => websocket.close()
  }, [carIP, authKey])

  const sendCommand = (cmd) => {
    if(ws?.readyState === WebSocket.OPEN) ws.send(cmd)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Connection Status Bar */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status.includes('Connected') ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-600">{status}</span>
          <input
            type="text"
            value={carIP}
            onChange={(e) => setCarIP(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
            placeholder="Car IP"
          />
          <input
            type="password"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
            placeholder="Auth Key"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Camera Stream */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Live Camera Feed</h2>
            <input
              type="text"
              value={cameraIP}
              onChange={(e) => setCameraIP(e.target.value)}
              className="mt-2 p-2 border rounded w-full text-sm"
              placeholder="Camera IP"
            />
          </div>
          <div className="aspect-video bg-black">
            <img
              src={`http://${cameraIP}/stream?t=${streamKey}`}
              alt="Live Stream"
              className="w-full h-full object-contain"
              onError={(e) => e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
              onClick={() => setStreamKey(Date.now())}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <button
            onClick={() => sendCommand(mode === 'auto' ? 'MANUAL' : 'AUTO')}
            className={`w-full py-2 rounded-md mb-4 ${
              mode === 'auto' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'
            } text-white transition-colors`}
          >
            {mode.toUpperCase()} MODE
          </button>

          {mode === 'manual' && (
            <div className="space-y-2">
              <button onClick={() => sendCommand('forward')} className="control-btn">
                ▲ Forward
              </button>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => sendCommand('left')} className="control-btn">
                  ◀ Left
                </button>
                <button onClick={() => sendCommand('stop')} className="control-btn bg-red-500 hover:bg-red-600">
                  ⏹ Stop
                </button>
                <button onClick={() => sendCommand('right')} className="control-btn">
                  Right ▶
                </button>
              </div>
              <button onClick={() => sendCommand('backward')} className="control-btn">
                ▼ Backward
              </button>
            </div>
          )}

          {mode === 'auto' && (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Autonomous Mode Active</h3>
              <p className="text-blue-700 mt-2">
                Vehicle is navigating independently using sensor data. 
                Obstacle avoidance and flame detection systems are engaged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
