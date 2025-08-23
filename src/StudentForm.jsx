import { useState } from "react";
import axios from "axios";

function StudentForm() {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/register", formData);
      setResponse(res.data.message);
    } catch (err) {
      console.error(err);
      setResponse("Connection Error!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 overflow-hidden">
      {/* Animated floating blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400 clip-circle mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-pink-400 clip-circle mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-400 clip-circle mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>

      {/* Additional floating shapes */}
      <div className="absolute -top-60 -right-32 w-[450px] h-[450px] bg-pink-400 mix-blend-multiply filter blur-md opacity-50 animate-blob animation-delay-2500 rounded-full"></div>
<div className="absolute -bottom-56 left-20 w-[500px] h-[500px] bg-yellow-400 mix-blend-multiply filter blur-md opacity-55 animate-blob animation-delay-4000 rounded-full"></div>
<div className="absolute top-32 -left-60 w-[400px] h-[400px] bg-purple-400 mix-blend-multiply filter blur-md opacity-60 animate-blob animation-delay-3500 rounded-full"></div>
<div className="absolute bottom-40 -right-48 w-[480px] h-[480px] bg-blue-400 mix-blend-multiply filter blur-md opacity-50 animate-blob animation-delay-4500 rounded-full"></div>
     <div className="absolute -top-40 -left-40 w-[300px] h-[400px] bg-green-400 mix-blend-multiply filter blur-md opacity-60 animate-blob rounded-full"></div>
      <div className="relative max-w-md w-full bg-white/20 backdrop-blur-2xl p-10 rounded-3xl shadow-xl transform opacity-0 scale-95 animate-appleIn">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-black">
          📚 Student Registeration Form
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-black font-medium">User Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-2xl shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50 transition"
              required
            />
          </label>
          <label className="block mb-6">
            <span className="text-black font-medium">Passcode</span>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-2xl shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50 transition"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_200%] bg-left text-white py-3 rounded-xl font-semibold text-lg transition-all duration-700 ease-in-out hover:bg-right active:scale-95 transform hover:shadow-xl"
          >
            🚀 Submit
          </button>
        </form>

        {response && (
          <p className={`mt-6 text-center text-lg font-semibold text-black p-4 rounded-lg ${response === "User registered successfully" ? 'bg-green-300 shadow-inner' : 'bg-red-400 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]'} animate-fadeInSlow`}>
            {response}
          </p>
        )}
       {response === "User registered successfully" && (
  <div className="flex justify-center items-center mt-6">
    <a
      href="/login"
      className="text-center text-xl font-bold text-black bg-purple-100 hover:bg-purple-200 px-10 py-5 rounded-2xl shadow-inner transition-colors duration-200"
      style={{ width: "fit-content" }}
    >
      Login?
    </a>
  </div>
)}
        
      </div>

      {/* Tailwind animation definitions */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
        .animation-delay-3800 {
          animation-delay: 3.8s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-4500 {
          animation-delay: 4.5s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        .clip-circle {
          clip-path: circle(50%);
        }
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 0.6s ease forwards;
        }
        @keyframes appleIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px) blur(10px); }
          60% { opacity: 1; transform: scale(1.03) translateY(0) blur(0); }
          100% { opacity: 1; transform: scale(1) translateY(0) blur(0); }
        }
        .animate-appleIn {
          animation: appleIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default StudentForm;