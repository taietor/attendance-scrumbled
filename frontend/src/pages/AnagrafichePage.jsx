// pages/AnagrafichePage.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Calendar, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "react-datepicker/dist/react-datepicker.css";

// Configura il root element per il modale
Modal.setAppElement("#root");

// Colori per il grafico a torta
const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const AnagrafichePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expandedRows, setExpandedRows] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Funzione per generare dati sintetici
  const generateDummyData = (employer) => {
    return {
      ...employer,
      presenze: Math.floor(Math.random() * 20) + 1, // 1-20
      malattie: Math.floor(Math.random() * 5),      // 0-4
      ferie: Math.floor(Math.random() * 10),        // 0-9
      oreStraordinario: Math.floor(Math.random() * 50), // 0-49
      progetti: Math.floor(Math.random() * 10),      // 0-9
      permessi: Math.floor(Math.random() * 5),       // 0-4
    };
  };

  // Funzione per ottenere tutti gli employer dal database
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch("/api/auth/get-employers");
        const data = await response.json();
        // Aggiungi dati sintetici a ogni employer
        const employersWithDummyData = data.employers.map(employer => generateDummyData(employer));
        setEmployers(employersWithDummyData);
        setFilteredEmployers(employersWithDummyData);
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

  // Funzione per gestire l'espansione delle righe
  const toggleRow = (employerId) => {
    if (expandedRows.includes(employerId)) {
      setExpandedRows(expandedRows.filter(id => id !== employerId));
    } else {
      setExpandedRows([...expandedRows, employerId]);
    }
  };

  // Funzione per aprire il modale con dati dettagliati
  const openModal = (employer) => {
    setModalData(employer);
    setModalIsOpen(true);
  };

  // Funzione per chiudere il modale
  const closeModal = () => {
    setModalIsOpen(false);
    setModalData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 min-h-screen flex flex-col"
    >
      <div className="p-8 md:py-4 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Anagrafiche Utenti</h2>
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Cerca per nome o cognome..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Tabella degli employer */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-y-auto max-h-96"
          >
            <table className="w-full text-left table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-gray-700">Nome</th>
                  <th className="px-4 py-2 text-gray-700">Cognome</th>
                  <th className="px-4 py-2 text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployers.map((employer) => (
                  <React.Fragment key={employer._id}>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2">{employer.name}</td>
                      <td className="px-4 py-2">{employer.surname}</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        {/* Bottone per espandere/collassare la riga */}
                        <button
                          onClick={() => toggleRow(employer._id)}
                          className="text-gray-600 hover:text-gray-800 focus:outline-none"
                          aria-label="Toggle Details"
                        >
                          {expandedRows.includes(employer._id) ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {/* Bottone per aprire il modale */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(employer)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-blue-600 transition"
                          aria-label="Visualizza Dettagli"
                        >
                          Dettagli
                        </motion.button>
                      </td>
                    </tr>
                    {/* Righe espandibili */}
                    <AnimatePresence>
                      {expandedRows.includes(employer._id) && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="3" className="px-4 py-2 bg-gray-50">
                            <div className="flex space-x-4">
                              {/* Presenze */}
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-700">Presenze</span>
                                <span className="text-lg text-blue-600">{employer.presenze}</span>
                              </div>
                              {/* Malattie */}
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-700">Malattie</span>
                                <span className="text-lg text-red-600">{employer.malattie}</span>
                              </div>
                              {/* Ferie */}
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-700">Ferie</span>
                                <span className="text-lg text-yellow-600">{employer.ferie}</span>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>

        {/* Modale Dettagliato */}
        {modalData && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Dettagli Dipendente"
            className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 relative overflow-y-auto max-h-screen"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            {/* Bottone di chiusura */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-semibold"
              aria-label="Chiudi Modale"
            >
              &times;
            </button>
            {/* Intestazione del Modale */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              {modalData.name} {modalData.surname}
            </h2>
            <p className="text-center mb-6 text-gray-600">Email: {modalData.email}</p>
            <div className="mb-6 flex justify-center">
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="w-48 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 transition"
              />
            </div>

            {/* Grafici e Dati Dettagliati */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Statistiche Mensili a Sinistra */}
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Statistiche Mensili</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { name: "Presenze", value: modalData.presenze },
                      { name: "Malattie", value: modalData.malattie },
                      { name: "Ferie", value: modalData.ferie },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ore Lavorative a Destra */}
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Ore Lavorative</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Progetti", value: modalData.progetti },
                        { name: "Ore Straordinarie", value: modalData.oreStraordinario },
                        { name: "Permessi", value: modalData.permessi },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#82ca9d"
                      label
                      isAnimationActive={true}
                    >
                      {[
                        { name: "Progetti", value: modalData.progetti },
                        { name: "Ore Straordinarie", value: modalData.oreStraordinario },
                        { name: "Permessi", value: modalData.permessi },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pulsanti Azione */}
            <div className="mt-8 flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Funzione di eliminazione non implementata.")}
                className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
              >
                Elimina profilo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Funzione di modifica password non implementata.")}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                Modifica password
              </motion.button>
            </div>
          </Modal>
        )}
      </div>

      {/* Barra di navigazione */}
      <div className="px-8 py-4 bg-gray-100 flex justify-between">
        <button onClick={() => navigate("/")} className="flex flex-col items-center">
          <Home size={24} className="text-blue-500" />
          <span className="text-sm text-blue-700">Home</span>
        </button>
        <button onClick={() => navigate("/anagrafiche")} className="flex flex-col items-center">
          <User size={24} className="text-blue-500" />
          <span className="text-sm text-blue-700">Anagrafiche</span>
        </button>
        <button onClick={() => navigate("/timetable")} className="flex flex-col items-center">
          <Calendar size={24} className="text-blue-500" />
          <span className="text-sm text-blue-700">Orari</span>
        </button>
        <button onClick={() => navigate("/settings")} className="flex flex-col items-center">
          <Settings size={24} className="text-blue-500" />
          <span className="text-sm text-blue-700">Impostazioni</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AnagrafichePage;
