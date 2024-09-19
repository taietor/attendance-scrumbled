import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Home, User, Calendar, Settings } from "lucide-react";

const EmployerDetailsPage = () => {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);

  // Effettua il fetch dei dati dell'employer tramite l'ID
  useEffect(() => {
    const fetchEmployerDetails = async () => {
      try {
        const response = await fetch(`/api/auth/employer/${employerId}`);
        const data = await response.json();
        setEmployer(data.employer);
      } catch (error) {
        console.error("Errore nel recuperare i dettagli dell'employer:", error);
      }
    };
    fetchEmployerDetails();
  }, [employerId]);

  // Funzione per eliminare l'employer
  const handleDelete = async () => {
    try {
      await fetch(`/api/auth/employer/${employerId}`, {
        method: "DELETE",
      });
      navigate("/anagrafiche"); // Torna alla pagina delle anagrafiche
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'employer:", error);
    }
  };

  // Funzione per modificare la password
  const handleEditPassword = () => {
    navigate(`/employer/${employerId}/edit-password`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl border border-purple-300"
    >
      {employer ? (
        <>
          {/* Header del profilo */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-300 p-4 rounded-full">
              <span className="text-6xl">😊</span> {/* Emoji avatar */}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-purple-900 mb-4">
            {employer.name} {employer.surname}
          </h2>

          {/* Dettagli dell'employer */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-purple-800">
              I dati di {employer.name}
            </p>
            <p>
              Email:{" "}
              <span className="text-purple-900">{employer.email}</span>
            </p>
            <p>
              ID: <span className="text-purple-900">{employer._id}</span>
            </p>
            <p>Altri dati: {/* Puoi aggiungere più campi qui in futuro */}</p>
          </div>

          {/* Pulsante per eliminare l'employer */}
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mb-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
          >
            Elimina profilo
          </motion.button>

          {/* Pulsante per modificare la password */}
          <motion.button
            onClick={handleEditPassword}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mb-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
          >
            Modifica password
          </motion.button>

          {/* Barra di navigazione con le icone */}
          <div className="mt-6">
            <div className="flex justify-between bg-purple-300 p-4 rounded-lg shadow-md">
              <button
                onClick={() => navigate("/")}
                className="flex flex-col items-center"
              >
                <Home size={24} className="text-purple-600" />
                <span className="text-sm text-purple-700">Home</span>
              </button>
              <button
                onClick={() => navigate("/anagrafiche")}
                className="flex flex-col items-center"
              >
                <User size={24} className="text-purple-600" />
                <span className="text-sm text-purple-700">Anagrafiche</span>
              </button>
              <button
                onClick={() => navigate("/timetable")}
                className="flex flex-col items-center"
              >
                <Calendar size={24} className="text-purple-600" />
                <span className="text-sm text-purple-700">Orari</span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="flex flex-col items-center"
              >
                <Settings size={24} className="text-purple-600" />
                <span className="text-sm text-purple-700">Impostazioni</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-purple-900">Caricamento dati...</p>
      )}
    </motion.div>
  );
};

export default EmployerDetailsPage;
