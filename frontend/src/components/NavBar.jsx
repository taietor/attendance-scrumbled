import { Home, Calendar, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between bg-gray-800 p-4 rounded-t-xl shadow-md">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center text-gray-400 hover:text-white"
      >
        <Home size={24} />
        <span className="text-sm">Home</span>
      </button>
      <button
        onClick={() => navigate("/anagrafiche")}
        className="flex flex-col items-center text-gray-400 hover:text-white"
      >
        <Users size={24} />
        <span className="text-sm">Anagrafiche</span>
      </button>
      <button
        onClick={() => navigate("/timetable")}
        className="flex flex-col items-center text-gray-400 hover:text-white"
      >
        <Calendar size={24} />
        <span className="text-sm">Orari</span>
      </button>
      <button
        onClick={() => navigate("/settings")}
        className="flex flex-col items-center text-gray-400 hover:text-white"
      >
        <Settings size={24} />
        <span className="text-sm">Impostazioni</span>
      </button>
    </div>
  );
};

export default NavBar;
