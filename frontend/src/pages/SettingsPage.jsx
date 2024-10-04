import { motion } from "framer-motion";
import { Edit, Home, User, Calendar, Settings } from "lucide-react"; // Importa le icone necessarie
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg md:rounded-xl shadow-2xl border border-gray-800 min-h-screen md:min-h-0 flex flex-col"
    >
      {/* Contenuto principale */}
      <div className="p-8 flex-grow flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Impostazioni
        </h2>

        {/* Modifica Password */}
        <Link to="/change-password">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-between items-center mb-4 py-3 px-4 bg-purple-500 text-white rounded-full shadow-lg"
          >
            <span className="text-lg font-medium">Modifica Password</span>
            <Edit size={24} className="text-white" />
          </motion.div>
        </Link>

        {/* Altre Impostazioni */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-between items-center py-3 px-4 bg-purple-500 text-white rounded-full mb-6 shadow-lg"
        >
          <span className="text-lg font-medium">Altre Impostazioni</span>
          <Edit size={24} className="text-white" />
        </motion.div>
      </div>

      {/* Barra di Navigazione come footer */}
      <div className="p-4 rounded-lg shadow-md bg-gray-900">
        <div className="flex justify-around">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <Home size={28} className="text-white" />
              <span className="text-sm text-white">Home</span>
            </motion.div>
          </Link>
          <Link to="/anagrafiche">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <User size={28} className="text-white" />
              <span className="text-sm text-white">Anagrafiche</span>
            </motion.div>
          </Link>
          <Link to="/timetable">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <Calendar size={28} className="text-white" />
              <span className="text-sm text-white">Orari</span>
            </motion.div>
          </Link>
          <Link to="/settings">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <Settings size={28} className="text-white" />
              <span className="text-sm text-white">Impostazioni</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
