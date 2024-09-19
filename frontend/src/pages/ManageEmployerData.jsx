import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Edit3, Save, XCircle, Home, User, Calendar, Settings } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const EmployerDetailsPage = () => {
  const { user } = useAuthStore(); // Ottieni i dati dell'employer autenticato
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveEmail = () => {
    if (newEmail === confirmEmail) {
      console.log(`Salvataggio nuova email: ${newEmail}`);
      setIsModalOpen(false);
    } else {
      alert("Le email non coincidono");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* Intestazione con icona */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="flex items-center justify-center mb-6"
      >
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
          <span className="text-5xl text-white">😃</span>
        </div>
      </motion.div>

      {/* Nome e cognome */}
      <h2 className="text-center text-3xl font-bold mb-4 text-gray-800">
        {user?.name} {user?.surname}
      </h2>

      {/* Dati dell'employer */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-gray-600">I tuoi dati</p>
          <button onClick={handleOpenModal} className="text-purple-500">
            <Edit3 size={22} />
          </button>
        </div>
        <p className="text-gray-600">
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">ID:</span> {user?.id}
        </p>
      </div>

      {/* Altri dati */}
      <div className="mb-6">
        <p className="font-semibold text-gray-600">Altri dati:</p>
        <DatePicker
          selected={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="w-full py-2 px-4 border border-purple-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 transition"
        />
      </div>

      {/* Sezione cerchi migliorata */}
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        {[
          { label: "Work Days", value: 16, color: "bg-blue-100", borderColor: "border-blue-400" },
          { label: "Malattie", value: 2, color: "bg-red-100", borderColor: "border-red-400" },
          { label: "Ferie", value: 3, color: "bg-yellow-100", borderColor: "border-yellow-400" }
        ].map((circle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <span className="font-bold text-lg text-gray-700 mb-2">{circle.label}</span>
            <div className={`relative flex items-center justify-center rounded-full w-24 h-24 mx-auto border-4 ${circle.borderColor} ${circle.color} shadow-lg`}>
              <span className="text-2xl font-bold text-gray-800">{circle.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modale per modificare l'email */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4">Modifica dati</h3>

            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Modifica indirizzo Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Nuova Email..."
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Conferma nuovo indirizzo Email:</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Conferma Email..."
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-purple-300 transition"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEmail}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
              >
                <Save size={18} className="inline-block mr-2" />
                Salva
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
              >
                <XCircle size={18} className="inline-block mr-2" />
                Annulla
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Barra di navigazione */}
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

export default EmployerDetailsPage;
