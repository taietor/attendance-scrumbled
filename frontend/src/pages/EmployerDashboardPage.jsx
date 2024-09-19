import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Calendar, Settings, LogOut } from "lucide-react";

const EmployerDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Navigate to the login page after logout
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-900">
        Benvenuto, {user?.name}!
      </h2>

      {/* Buttons Section */}
      
      <div className="space-y-4">
      <Link to="/manage-hours">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-purple-500 text-white rounded-full shadow-lg"
        >
          Gestisci le tue ore
        </motion.button>
        </Link>
        <Link to="/manage-employer-data">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 mt-6 bg-purple-500 text-white rounded-full shadow-lg"
        >
          Gestisci i tuoi dati
        </motion.button>
        </Link>

        <Link to="/employer-settings">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-purple-500 text-white rounded-full shadow-lg mt-4" // Added margin-top
          >
            Impostazioni
          </motion.button>
        </Link>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-full shadow-lg"
        >
          Logout
        </motion.button>
      </div>

      {/* Internal Navigation Bar */}
      <div className="mt-8 p-4 rounded-lg shadow-md bg-purple-200">
        <div className="flex justify-around">
          <Link to="/employer-dashboard">
            <div className="flex flex-col items-center">
              <Home size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Home</span>
            </div>
          </Link>
          <Link to="/manage-employer-data">
            <div className="flex flex-col items-center">
              <User size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Anagrafiche</span>
            </div>
          </Link>
          <Link to="/manage-hours">
            <div className="flex flex-col items-center">
              <Calendar size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Orari</span>
            </div>
          </Link>
          <Link to="/employer-settings">
            <div className="flex flex-col items-center">
              <Settings size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Impostazioni</span>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployerDashboardPage;
