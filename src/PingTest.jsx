import { useState } from "react";
import axios from "axios";

function PingTest() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePing = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/ping", { params: formData });
      setResponse(res.data.message || "No response message");
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to server");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ping Test</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Message</label>
        <input
          type="text"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter message"
        />
      </div>

      <button
        onClick={handlePing}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Send Ping
      </button>

      {response && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  );
}

export default PingTest;