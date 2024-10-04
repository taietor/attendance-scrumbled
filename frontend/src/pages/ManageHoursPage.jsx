import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  setYear,
} from "date-fns";
import { it } from "date-fns/locale";
import { Bell } from "lucide-react";

const ManageHoursPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Per la navigazione tra i mesi
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasNotification, setHasNotification] = useState(true); // Impostato su true per dimostrazione
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedDots, setSelectedDots] = useState({});

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerDate, setColorPickerDate] = useState(null);

  // Dati di esempio (da sostituire con l'API)
  const tasks = [
    {
      date: new Date(2023, 4, 19), // 19 Maggio 2023
      type: "Lavoro ordinario",
      startTime: "9:00",
      endTime: "13:00",
      location: "Remoto",
      status: "Validata",
    },
    {
      date: new Date(2023, 4, 20),
      type: "Lavoro straordinario",
      startTime: "14:00",
      endTime: "18:00",
      location: "In sede",
      status: "Non validata",
    },
    // Aggiungi altri dati fittizi se necessario
  ];

  const daysOfWeek = ["L", "M", "M", "G", "V", "S", "D"];

  // Genera i giorni per il mese corrente
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setColorPickerDate(date);
    setShowColorPicker(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleYearClick = () => {
    setShowYearSelector(!showYearSelector);
  };

  const handleYearChange = (year) => {
    const newDate = setYear(currentDate, year);
    setCurrentDate(newDate);
    setShowYearSelector(false);
  };

  // Genera una lista di anni per il selettore
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  // Chiudi il selettore di colore con il tasto Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showColorPicker]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg md:rounded-xl shadow-2xl border border-gray-800 min-h-screen md:min-h-0 flex flex-col relative"
    >
      {/* Contenitore principale */}
      <div className="p-4 pb-24 flex-grow flex flex-col">
        {/* Icona delle notifiche */}
        <div className="absolute top-4 right-4">
          <button onClick={() => setHasNotification(!hasNotification)} className="relative">
            <Bell size={24} className="text-white" />
            {hasNotification && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Saluto */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Ciao, Vlad!</h1>
          <p className="text-gray-300">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: it })}
          </p>
        </div>

        {/* Navigazione del calendario */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="text-white">
            &lt; {format(subMonths(currentDate, 1), "MMM", { locale: it })}
          </button>
          <div className="relative">
            <button
              onClick={handleYearClick}
              className="text-xl font-semibold text-white flex items-center"
            >
              {format(currentDate, "MMMM yyyy", { locale: it })}
              <svg
                className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                  showYearSelector ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {showYearSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded shadow z-10 overflow-auto max-h-40"
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className="block w-full text-left text-white hover:bg-gray-700 px-4 py-2"
                    >
                      {year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={handleNextMonth} className="text-white">
            {format(addMonths(currentDate, 1), "MMM", { locale: it })} &gt;
          </button>
        </div>

        {/* Sezione Calendario */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-7 text-center gap-2 text-sm text-white">
            {/* Giorni della settimana */}
            {daysOfWeek.map((day) => (
              <span key={day} className="font-bold">
                {day}
              </span>
            ))}

            {/* Spazi vuoti per l'allineamento */}
            {Array.from({ length: (getDay(monthStart) + 6) % 7 }).map((_, index) => (
              <div key={index}></div>
            ))}

            {/* Date */}
            {daysInMonth.map((date) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);

              // Genera una chiave coerente per la data
              const dateKey = format(date, "yyyy-MM-dd");

              // Controlla se c'è un'attività in questa data
              const hasTask = tasks.some((task) => isSameDay(task.date, date));

              // Controlla se c'è un pallino assegnato alla data
              const dotColor = selectedDots[dateKey];
              const dotColorClass = {
                rosso: "bg-red-500",
                blu: "bg-blue-500",
                giallo: "bg-yellow-500",
                verde: "bg-green-500",
              }[dotColor];

              return (
                <div
                  key={dateKey}
                  onClick={() => handleDateClick(date)}
                  className={`relative p-2 rounded-lg cursor-pointer ${
                    isSelected ? "bg-purple-500 text-white" : "text-gray-200"
                  } ${isToday ? "border border-green-500" : ""} hover:bg-purple-600`}
                >
                  {/* Pallini in alto a sinistra */}
                  {dotColor && (
                    <span
                      className={`absolute top-1 left-1 h-2 w-2 rounded-full ${dotColorClass}`}
                    ></span>
                  )}
                  {!dotColor && hasTask && (
                    <span className="absolute top-1 left-1 h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                  {format(date, "d")}
                </div>
              );
            })}
          </div>
        </div>

        {/* Data selezionata */}
        <h3 className="text-lg font-semibold mt-6 text-white">
          {format(selectedDate, "EEEE, d MMMM yyyy", { locale: it })}
        </h3>

        {/* Schede delle attività */}
        <div className="mt-4 flex-grow overflow-y-auto">
          {tasks
            .filter((task) => isSameDay(task.date, selectedDate))
            .map((task, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{task.type}</p>
                  <p className="text-sm text-gray-400">
                    Orario: {task.startTime} - {task.endTime}
                  </p>
                  <p className="text-sm text-gray-400">Modalità: {task.location}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`h-3 w-3 rounded-full mr-2 ${
                      task.status === "Validata" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span
                    className={`text-sm font-bold ${
                      task.status === "Validata" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}

          {/* Messaggio se non ci sono attività */}
          {tasks.filter((task) => isSameDay(task.date, selectedDate)).length === 0 && (
            <p className="text-gray-300">Nessuna attività programmata per questa data.</p>
          )}
        </div>

        {/* Selettore di colore visivo */}
        {showColorPicker && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowColorPicker(false)}
          >
            <div
              className="bg-white p-4 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-2 text-gray-800">Seleziona un colore:</p>
              <div className="flex space-x-4">
                {["rosso", "blu", "giallo", "verde"].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      const dateKey = format(colorPickerDate, "yyyy-MM-dd");
                      setSelectedDots((prevDots) => ({
                        ...prevDots,
                        [dateKey]: color,
                      }));
                      setShowColorPicker(false);
                    }}
                    className={`h-8 w-8 rounded-full ${
                      {
                        rosso: "bg-red-500",
                        blu: "bg-blue-500",
                        giallo: "bg-yellow-500",
                        verde: "bg-green-500",
                      }[color]
                    }`}
                  ></button>
                ))}
              </div>
              <button
                onClick={() => setShowColorPicker(false)}
                className="mt-4 text-sm text-gray-500 underline"
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra di navigazione come footer */}
      <div className="bg-gray-900">
        <NavBar />
      </div>
    </motion.div>
  );
};

export default ManageHoursPage;
