import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", formData);
      setResponse(res.data.message);
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setResponse(err.response.data.message);
      } else {
        setResponse("Connection Error!");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 p-6 overflow-hidden">
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
      <div className="relative max-w-md w-full bg-white/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:shadow-xl transition-shadow duration-200 opacity-0 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
           Student Login Form
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">User Name</span>
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
            <span className="text-gray-700 font-medium">Passcode</span>
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
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 active:scale-95 transform transition-all duration-150 hover:shadow-lg hover:scale-105"
          >
            🚀 Login
          </button>
        </form>

        {response && (
          <div className="flex justify-center">
            <div
              className={`w-full mt-6 text-center text-lg font-semibold py-3 rounded-lg
                ${response === "Login successful"
                  ? "bg-green-400 text-white shadow-inner"
                  : "bg-red-500 text-white shadow-inner"}
                mx-auto
              `}
            >
              {response}
            </div>
          </div>
        )}
        {/* Continue button if login successful */}
        {response === "Login successful" && (
          <div className="flex justify-center items-center mt-6">
            <button
              className="bg-green-400 text-white py-3 rounded-xl font-semibold text-lg hover:bg-yellow-400 transition px-20 shadow-2xl hover:shadow-2xl shadow-black-600/50 border-4 border-gray-300"
              onClick={() => navigate("/dashboard")}
            >
              Continue
            </button>
          </div>
        )}
        {response !== "Login successful" && (
          <div className="flex justify-center items-center mt-6">
            <a
              href="/register"
              className="text-center text-xl font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-20 py-5 rounded-2xl shadow-inner transition-colors duration-200"
              style={{ width: "fit-content" }}
            >
              Register?
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
      `}</style>
    </div>
  );
}

export default LoginForm;