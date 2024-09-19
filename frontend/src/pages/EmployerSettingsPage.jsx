import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, User, Calendar, Settings } from "lucide-react";

const EmployerSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-900">Impostazioni</h2>

      {/* Settings Section */}
      <div className="space-y-4">
        {/* Modifica Password */}
        <div className="flex items-center justify-between bg-purple-200 p-4 rounded-lg shadow-md">
          <span className="text-lg font-semibold text-purple-900">Modifica Password</span>
          <button
            onClick={() => navigate("/employer-change-password")}
            className="bg-purple-500 p-2 rounded-lg text-white"
          >
            <span className="sr-only">Modifica Password</span>
            ✏️
          </button>
        </div>

        {/* Altre Impostazioni */}
        <div className="flex items-center justify-between bg-purple-200 p-4 rounded-lg shadow-md">
          <span className="text-lg font-semibold text-purple-900">Altre impostazioni</span>
          <button
            onClick={() => navigate("/employer-other-settings")}
            className="bg-purple-500 p-2 rounded-lg text-white"
          >
            <span className="sr-only">Altre impostazioni</span>
            ✏️
          </button>
        </div>
      </div>

      {/* Internal Navigation Bar */}
      <div className="mt-8 p-4 rounded-lg shadow-md bg-purple-200">
        <div className="flex justify-around">
          <button onClick={() => navigate("/employer-dashboard")}>
            <div className="flex flex-col items-center">
              <Home size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Home</span>
            </div>
          </button>
          <button onClick={() => navigate("/manage-employer-data")}>
            <div className="flex flex-col items-center">
              <User size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Anagrafiche</span>
            </div>
          </button>
          <button onClick={() => navigate("/manage-hours")}>
            <div className="flex flex-col items-center">
              <Calendar size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Orari</span>
            </div>
          </button>
          <button onClick={() => navigate("/settings")}>
            <div className="flex flex-col items-center">
              <Settings size={24} className="text-purple-600" />
              <span className="text-sm text-purple-700">Impostazioni</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployerSettingsPage;
