import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Impostazioni
      </h2>

      {/* Modifica Password */}
      <Link to="/change-password">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-between items-center mb-4 py-3 px-4 bg-purple-500 text-white rounded-full shadow-lg"
        >
          <span>Modifica Password</span>
          <Edit size={20} className="text-white" />
        </motion.div>
      </Link>

      {/* Altre Impostazioni */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex justify-between items-center py-3 px-4 bg-purple-500 text-white rounded-full shadow-lg"
      >
        <span>Altre impostazioni</span>
        <Edit size={20} className="text-white" />
      </motion.div>

      {/* Navigazione in basso */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
        <div className="flex justify-around">
          {/* Icone di navigazione */}
          <Link to="/">
            <motion.div whileHover={{ scale: 1.1 }}>
              <i className="home-icon text-purple-400" size={32} />
            </motion.div>
          </Link>
          <Link to="/settings">
            <motion.div whileHover={{ scale: 1.1 }}>
              <i className="settings-icon text-purple-400" size={32} />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
