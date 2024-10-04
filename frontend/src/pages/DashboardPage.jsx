import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Calendar, Home, Settings, Users } from "lucide-react";

const DashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg md:rounded-xl shadow-2xl border border-gray-800 min-h-screen md:min-h-0 flex flex-col"
    >
      {/* Contenitore principale */}
      <div className="p-8 md:py-4 flex-grow flex flex-col">
        {/* Titolo della Dashboard */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Benvenuto, Admin!
        </h2>

        {/* Bottoni principali */}
        <div className="space-y-6 flex-grow">
          <Link to="/create-employer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-purple-500 text-white rounded-full shadow-lg"
            >
              Crea un nuovo utente
            </motion.button>
          </Link>

          <Link to="/timetable">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-purple-500 text-white rounded-full shadow-lg"
            >
              Tabelle orarie
            </motion.button>
          </Link>

          <Link to="/anagrafiche">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-purple-500 text-white rounded-full shadow-lg"
            >
              Vai ad Anagrafiche
            </motion.button>
          </Link>

          <Link to="/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-purple-500 text-white rounded-full shadow-lg"
            >
              Impostazioni
            </motion.button>
          </Link>

          {/* Bottone Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-6 bg-red-500 text-white rounded-full shadow-lg"
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* Barra di navigazione come footer */}
      <nav className="bg-gray-900 p-4 shadow-lg flex justify-between rounded-lg">
        <Link
          to="/"
          className="flex flex-col items-center text-white hover:text-gray-400"
        >
          <Home size={24} />
          <span className="text-sm">Home</span>
        </Link>
        <Link
          to="/anagrafiche"
          className="flex flex-col items-center text-white hover:text-gray-400"
        >
          <Users size={24} />
          <span className="text-sm">Anagrafiche</span>
        </Link>
        <Link
          to="/timetable"
          className="flex flex-col items-center text-white hover:text-gray-400"
        >
          <Calendar size={24} />
          <span className="text-sm">Orari</span>
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center text-white hover:text-gray-400"
        >
          <Settings size={24} />
          <span className="text-sm">Impostazioni</span>
        </Link>
      </nav>
    </motion.div>
  );
};

export default DashboardPage;
