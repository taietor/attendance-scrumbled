import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const EmployerDashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Benvenuto, {user?.name}!
      </h2>

      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-purple-500 text-white rounded-full shadow-lg"
        >
          Gestisci le tue ore
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-purple-500 text-white rounded-full shadow-lg"
        >
          Gestisci i tuoi dati
        </motion.button>

        <Link to="/settings">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-purple-500 text-white rounded-full shadow-lg"
          >
            Impostazioni
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EmployerDashboardPage;
