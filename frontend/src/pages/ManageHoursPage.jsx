import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Home,
  User,
  Calendar,
  Settings,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Importa axios per le chiamate API
import { useAuthStore } from "../store/authStore"; // Per prendere nome e cognome dell'employer

const ManageHoursPage = () => {
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [justifications, setJustifications] = useState({}); // Stato per giustificativi
  const [workDays, setWorkDays] = useState({}); // Giorni lavorativi
  const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // Giorno selezionato
  const [justificationType, setJustificationType] = useState(""); // Tipo di giustificativo
  const [justificationReason, setJustificationReason] = useState(""); // Motivazione
  const [projects, setProjects] = useState({}); // Progetti
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // Modale aperto/chiuso



  const navigate = useNavigate();

  // Funzione per calcolare le settimane del mese selezionato
  const calculateWeeks = (month, year) => {
    const weeksArray = [];
    let currentDate = new Date(year, month, 1); // Primo giorno del mese

    const firstDayOfWeek = currentDate.getDay();
    let week = new Array(firstDayOfWeek).fill(null);

    while (currentDate.getMonth() === month) {
      if (week.length === 7) {
        weeksArray.push(week);
        week = [];
      }
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeksArray.push(week);
    }

    return weeksArray;
  };

  useEffect(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const weeks = calculateWeeks(month, year);
    setWeeks(weeks);
  }, [selectedMonth]);

  const handleWeekSelection = (index) => {
    setSelectedWeek(index);
  };
  const toggleProjectModal = (day) => {
    setSelectedDay(day);
    setIsProjectModalOpen(true);
  };

  const toggleJustificationModal = (day, type) => {
    setSelectedDay(day);
    setJustificationType(type);
    setIsJustificationModalOpen(true);
  };

  const handleSaveJustification = () => {
    if (!justificationReason || !selectedDay) return;

    const dayKey = selectedDay.toDateString();
    setJustifications((prevJustifications) => ({
      ...prevJustifications,
      [dayKey]: {
        type: justificationType,
        reason: justificationReason.slice(0, 5), // Mostra solo le prime 5 lettere
      },
    }));

    // Chiudi il modale
    setIsJustificationModalOpen(false);
    setJustificationReason("");
  };

  // Array dei giorni della settimana per visualizzarli sopra le caselle
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl border border-purple-300"
    >
      {/* Header del Calendario */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Gestisci le tue ore</h2>
        <button
          onClick={() => setSelectedMonth(new Date())}
          className="bg-purple-500 p-2 rounded-lg text-white"
        >
          <CalendarIcon size={22} />
        </button>
      </div>

      {/* Selettore Mese e Anno */}
      <div className="mb-4">
        <DatePicker
          selected={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="w-full py-2 px-4 border border-purple-300 rounded-lg"
        />
      </div>

      {/* Settimane */}
      <div className="flex justify-between mb-6">
        <button
          onClick={() => handleWeekSelection(selectedWeek - 1)}
          disabled={selectedWeek <= 0}
        >
          <ChevronLeft />
        </button>
        <span className="text-lg font-semibold text-purple-900">
          {`Settimana ${selectedWeek + 1}`}
        </span>
        <button
          onClick={() => handleWeekSelection(selectedWeek + 1)}
          disabled={selectedWeek >= weeks.length - 1}
        >
          <ChevronRight />
        </button>
      </div>

 {/* Giorni della settimana sopra le caselle */}
 <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-center font-semibold text-purple-800"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Giorni di lavoro */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weeks[selectedWeek]?.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Casella quadrata per giorno */}
            <div
              className={`p-2 bg-transparent border-4 ${
                !day || day.getDay() === 0 // Domenica o giorno nullo
                  ? "border-gray-500 cursor-not-allowed"
                  : workDays[day?.toDateString()]
                  ? "border-green-500"
                  : "border-red-500"
              } rounded-lg shadow-md flex items-center justify-center h-12 w-12`}
              onClick={() => toggleWorkDay(day)}
            >
              {day ? (
                <>
                  {workDays[day.toDateString()] ? (
                    <Check className="text-green-500" size={24} />
                  ) : (
                    <X className="text-red-500" size={24} />
                  )}
                </>
              ) : null}
            </div>

            {day && (
              <div className="text-sm text-center mt-2">
                {day.getDate()}{" "}
                <span className="text-gray-600">
                  {day
                    .toLocaleString("default", { month: "short" })
                    .slice(0, 3)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Giustificativi */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-900 mb-2">Giustificativi</h3>
        
        <div className="text-md font-semibold text-purple-700 mb-2">Malattia</div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weeks[selectedWeek]?.map((day, index) => (
            <div
              key={index}
              className="p-2 bg-transparent border-2 border-gray-400 rounded-lg h-12 w-12 flex justify-center items-center cursor-pointer"
              onClick={() => day && toggleJustificationModal(day, "Malattia")}
            >
              {day && justifications[day?.toDateString()]?.type === "Malattia" ? (
                <span className="text-xs">{justifications[day.toDateString()].reason}</span>
              ) : (
                <Plus size={16} />
              )}
            </div>
          ))}
        </div>

        <div className="text-md font-semibold text-purple-700 mb-2">Ferie</div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weeks[selectedWeek]?.map((day, index) => (
            <div
              key={index}
              className="p-2 bg-transparent border-2 border-gray-400 rounded-lg h-12 w-12 flex justify-center items-center cursor-pointer"
              onClick={() => day && toggleJustificationModal(day, "Ferie")}
            >
              {day && justifications[day?.toDateString()]?.type === "Ferie" ? (
                <span className="text-xs">{justifications[day.toDateString()].reason}</span>
              ) : (
                <Plus size={16} />
              )}
            </div>
          ))}
        </div>

        <div className="text-md font-semibold text-purple-700 mb-2">Permessi</div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weeks[selectedWeek]?.map((day, index) => (
            <div
              key={index}
              className="p-2 bg-transparent border-2 border-gray-400 rounded-lg h-12 w-12 flex justify-center items-center cursor-pointer"
              onClick={() => day && toggleJustificationModal(day, "Permessi")}
            >
              {day && justifications[day?.toDateString()]?.type === "Permessi" ? (
                <span className="text-xs">{justifications[day.toDateString()].reason}</span>
              ) : (
                <Plus size={16} />
              )}
            </div>
          ))}
        </div>
      </div>


{/* Progetti */}
<div className="mb-6">
        <h3 className="text-lg font-bold text-purple-900 mb-2">Progetti</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeks[selectedWeek]?.map((day, index) => (
            <div
              key={index}
              className={`p-2 bg-transparent border-4 ${
                !day || day.getDay() === 0
                  ? "border-gray-500 cursor-not-allowed"
                  : "border-blue-400"
              } rounded-lg shadow-md flex justify-center items-center h-12 w-12`}
              onClick={() => day && toggleProjectModal(day)}
            >
              {projects[day?.toDateString()]?.title ? (
                <span className="text-xs text-center">
                  {projects[day.toDateString()].title.slice(0, 10)}...
                </span>
              ) : (
                <Plus size={16} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modale per inserire un giustificativo */}
      {isJustificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Inserisci Giustificativo</h3>
            <p className="mb-4">Nome: {user.name}</p>
            <p className="mb-4">Cognome: {user.surname}</p>
            <textarea
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
              placeholder="Inserisci la motivazione"
              value={justificationReason}
              onChange={(e) => setJustificationReason(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsJustificationModalOpen(false)}
              >
                Cancella
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSaveJustification}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra di Navigazione */}
      <div className="mt-6">
        <div className="flex justify-between bg-purple-300 p-4 rounded-lg shadow-md">
          <button
            onClick={() => navigate("/employer-dashboard")}
            className="flex flex-col items-center"
          >
            <Home size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Home</span>
          </button>
          <button
            onClick={() => navigate("/manage-employer-data")}
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
            onClick={() => navigate("/employer-settings")}
            className="flex flex-col items-center"
          >
            <Settings size={24} className="text-purple-600" />
            <span className="text-sm text-purple-700">Impostazioni</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageHoursPage;
