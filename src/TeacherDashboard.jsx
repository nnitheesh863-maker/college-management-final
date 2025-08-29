import { Link, useNavigate } from "react-router-dom";
function TeacherDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 flex flex-col">
      {/* Navbar */}
      <header className="w-auto mx-4 mt-4 bg-purple-600 text-white py-4 px-6 flex justify-between items-center shadow-2xl rounded-2xl pingowar1">
        <h1 className="text-2xl font-bold sidebar1">Teacher Dashboard</h1>
        <button 
        className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 buttons"
        onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 pingowar">
        {/* Sidebar */}
        <aside className="w-64 bg-white/40 backdrop-blur-lg mx-4 mt-6 mb-4 p-6 shadow-2xl rounded-2xl flex-shrink-0 sidebar">
          <nav className="space-y-4">
            <a
              href="#"
              className="block text-lg font-medium text-gray-800 bg-white/60 rounded-lg px-4 py-2 hover:bg-purple-600 hover:text-white transition sidebar1"
            >
              🏠 Home
            </a>
            <a
              href="#"
              className="block text-lg font-medium text-gray-800 bg-white/60 rounded-lg px-4 py-2 hover:bg-purple-600 hover:text-white transition sidebar2"
            >
              📊 Analytics
            </a>
            <a
              href="#"
              className="block text-lg font-medium text-gray-800 bg-white/60 rounded-lg px-4 py-2 hover:bg-purple-600 hover:text-white transition sidebar3"
            >
              📝 Assignments
            </a>
            <a
              href="#"
              className="block text-lg font-medium text-gray-800 bg-white/60 rounded-lg px-4 py-2 hover:bg-purple-600 hover:text-white transition sidebar4"
            >
              💬 Messages
            </a>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Welcome section */}
          <div className="bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-center mb-6 welcome">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 wlecome">👩‍🏫 Welcome Teacher!</h1>
            <p className="text-lg text-gray-700 mb-6 welcome">You’ve successfully logged in. This will be your teacher’s space.</p>
            <button
              onClick={() => alert("Coming soon!")}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition buttons"
            >
              Explore
            </button>
          </div>

          {/* Graph placeholder */}
          <div className="bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 welcome">📊 Performance Graph</h2>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 buttons">
              Graph Placeholder
            </div>
          </div>

          {/* Attendance Monitor */}
          <div className="bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg mt-6 pingowar">
            <h2 className="text-xl font-bold mb-4 chatbot">📅 Attendance Monitor</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <h3 className="font-semibold text-lg chatbot">Present</h3>
                <p className="text-2xl font-bold text-green-600">28</p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg text-center">
                <h3 className="font-semibold text-lg chatbot">Absent</h3>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot widget */}
      <div className="fixed bottom-6 left-5 bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-2xl w-47 chatbot">
        <h2 className="text-lg font-bold mb-2">🤖 Chatbot</h2>
        <div className="h-40 overflow-y-auto bg-gray-100 p-2 rounded-ld mb-2 text-sm text-gray-700">
          <p><b>Bot:</b> Hello! How can I help you?</p>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
  );
}

export default TeacherDashboard;