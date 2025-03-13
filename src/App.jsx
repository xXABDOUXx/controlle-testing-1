import { useState, useEffect } from "react";

const WEBSOCKET_URL = "ws://192.168.0.112:81";
const ESP32_CAM_STREAM_URL = "http://YOUR_ESP32_CAM_IP:81/stream";

export default function CarControl() {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const [mode, setMode] = useState("AUTO");

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    setWs(socket);

    socket.onopen = () => setStatus("Connected");
    socket.onclose = () => setStatus("Disconnected");
    socket.onmessage = (event) => {
      if (event.data.startsWith("MODE:")) {
        setMode(event.data.split(":")[1]);
      }
    };

    return () => socket.close();
  }, []);

  const sendCommand = (cmd) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(cmd);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">ESP32 Fire Fighting Car Control</h1>
      <p className="text-lg">Status: {status}</p>
      <p className="text-lg">Mode: {mode}</p>

      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => sendCommand("forward")} className="btn">⬆ Forward</button>
        <button onClick={() => sendCommand("left")} className="btn">⬅ Left</button>
        <button onClick={() => sendCommand("right")} className="btn">➡ Right</button>
        <button onClick={() => sendCommand("backward")} className="btn">⬇ Backward</button>
        <button onClick={() => sendCommand("stop")} className="btn">⏹ Stop</button>
      </div>

      <button onClick={() => sendCommand("MANUAL")} className="btn">Switch to Manual</button>
      <button onClick={() => sendCommand("AUTO")} className="btn">Switch to Auto</button>

      <div className="mt-6">
        <h2 className="text-xl">Live Stream</h2>
        <img src={ESP32_CAM_STREAM_URL} alt="ESP32-CAM Stream" className="w-96 border" />
      </div>
    </div>
  );
}
