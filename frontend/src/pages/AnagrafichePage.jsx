import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnagrafichePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null); // Stato per gestire l'employer selezionato
  const navigate = useNavigate();

  // Funzione per ottenere tutti gli employer dal database
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch("/api/auth/get-employers");
        const data = await response.json();
        setEmployers(data.employers);
        setFilteredEmployers(data.employers); // Inizialmente mostra tutti gli employer
      } catch (error) {
        console.error("Errore nel recuperare gli employer:", error);
      }
    };

    fetchEmployers();
  }, []);

  // Funzione per filtrare i risultati della ricerca
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = employers.filter((employer) =>
      `${employer.name} ${employer.surname}`.toLowerCase().includes(term)
    );
    setFilteredEmployers(filtered);
  };

  // Funzione per selezionare un employer e mostrare i suoi dettagli
  const handleDetails = async (employerId) => {
    if (selectedEmployer && selectedEmployer._id === employerId) {
      // Se già selezionato, deseleziona e torna alla lista
      setSelectedEmployer(null);
      return;
    }

    try {
      const response = await fetch(`/api/auth/employer/${employerId}`);
      const data = await response.json();
      setSelectedEmployer(data.employer); // Mostra i dettagli dell'employer selezionato
    } catch (error) {
      console.error("Errore nel recuperare i dettagli dell'employer:", error);
    }
  };

  // Funzione per eliminare l'employer
  const handleDelete = async () => {
    try {
      await fetch(`/api/auth/employer/${selectedEmployer._id}`, {
        method: "DELETE",
      });
      // Rimuovi l'employer dalla lista e reimposta lo stato
      setEmployers(employers.filter((emp) => emp._id !== selectedEmployer._id));
      setSelectedEmployer(null); // Chiude il modulo dei dettagli
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'employer:", error);
    }
  };

  // Funzione per modificare la password (reindirizza alla pagina di modifica)
  const handleEditPassword = () => {
    navigate(`/employer/${selectedEmployer._id}/edit-password`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl border border-purple-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Anagrafiche Utenti:</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca per nome o cognome..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-8 border border-purple-300 rounded-lg bg-white"
          />
          <Search className="absolute left-2 top-2 text-purple-600" size={20} />
        </div>
      </div>

      {/* Tabella degli employer */}
      <AnimatePresence>
        {!selectedEmployer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-y-auto max-h-96"
          >
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-purple-900">Nome</th>
                  <th className="px-4 py-2 text-purple-900">Cognome</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployers.map((employer) => (
                  <tr key={employer._id} className="border-t border-purple-300">
                    <td className="px-4 py-2">{employer.name}</td>
                    <td className="px-4 py-2">{employer.surname}</td>
                    <td className="px-4 py-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDetails(employer._id)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600"
                      >
                        Dettagli
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sezione dei dettagli dell'employer */}
      {selectedEmployer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-900 text-center">
            {selectedEmployer.name} {selectedEmployer.surname}
          </h2>
          <p className="text-center">Email: {selectedEmployer.email}</p>
          <p className="text-center">ID: {selectedEmployer._id}</p>

          {/* Pulsante per eliminare l'employer */}
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
          >
            Elimina profilo
          </motion.button>

          {/* Pulsante per modificare la password */}
          <motion.button
            onClick={handleEditPassword}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
          >
            Modifica password
          </motion.button>

          {/* Pulsante per chiudere i dettagli */}
          <motion.button
            onClick={() => setSelectedEmployer(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 mt-4 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600"
          >
            Esci
          </motion.button>
        </motion.div>
      )}

      {/* Barra di navigazione */}
      <div className="mt-8">
        <div className="flex justify-between bg-purple-300 p-4 rounded-lg shadow-md">
          <button onClick={() => navigate("/")} className="flex flex-col items-center">
            <Home size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Home</span>
          </button>
          <button onClick={() => navigate("/anagrafiche")} className="flex flex-col items-center">
            <User size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Anagrafiche</span>
          </button>
          <button onClick={() => navigate("/timetable")} className="flex flex-col items-center">
            <Calendar size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Orari</span>
          </button>
          <button onClick={() => navigate("/settings")} className="flex flex-col items-center">
            <Settings size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Impostazioni</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnagrafichePage;
