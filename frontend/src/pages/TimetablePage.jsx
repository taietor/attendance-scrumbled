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
import { Bell, Plus, Edit, Trash } from "lucide-react";

const TimetablePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasNotification, setHasNotification] = useState(true);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const [dateData, setDateData] = useState({});

  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [currentEditDate, setCurrentEditDate] = useState(null);
  const [currentEditProjectIndex, setCurrentEditProjectIndex] = useState(null); // Per modifiche

  // Messaggi di feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const daysOfWeek = ["L", "M", "M", "G", "V", "S", "D"];

  // Genera i giorni per il mese corrente
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handler per selezionare una data
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentEditDate(date);
    setCurrentEditProjectIndex(null); // Reset modifica progetto
    setShowWorkModal(true);
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

  // Lista di anni per il selettore
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  // Chiudi la modale con il tasto Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowWorkModal(false);
        setShowOvertimeModal(false);
        setErrorMessage("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Stato per il form principale
  const [workFormData, setWorkFormData] = useState({
    project: "",
    workHours: "",
    workMinutes: "",
    permessiHours: "",
    permessiMinutes: "",
    malattiaHours: "",
    malattiaMinutes: "",
    ferieHours: "",
    ferieMinutes: "",
  });

  // Stato per il form di straordinario
  const [overtimeFormData, setOvertimeFormData] = useState({
    project: "",
    overtimeHours: "",
    overtimeMinutes: "",
  });

  // Funzione di validazione del form di lavoro
  const validateWorkFormData = () => {
    const errors = [];

    const {
      workHours,
      workMinutes,
      permessiHours,
      permessiMinutes,
      malattiaHours,
      malattiaMinutes,
      ferieHours,
      ferieMinutes,
    } = workFormData;

    // Calcolo totale minuti
    const totalWorkMinutes =
      parseInt(workHours || 0) * 60 +
      parseInt(workMinutes || 0) +
      parseInt(permessiHours || 0) * 60 +
      parseInt(permessiMinutes || 0) +
      parseInt(malattiaHours || 0) * 60 +
      parseInt(malattiaMinutes || 0) +
      parseInt(ferieHours || 0) * 60 +
      parseInt(ferieMinutes || 0);

    if (totalWorkMinutes > 480) {
      errors.push("Il totale delle ore non può superare 8 ore.");
    }

    // Validazione dei minuti
    ["workMinutes", "permessiMinutes", "malattiaMinutes", "ferieMinutes"].forEach((field) => {
      if (parseInt(workFormData[field] || 0) > 59) {
        errors.push("I minuti non possono superare 59.");
      }
    });

    return errors;
  };

  // Funzione di validazione del form di straordinario
  const validateOvertimeFormData = () => {
    const errors = [];

    const { overtimeHours, overtimeMinutes } = overtimeFormData;

    if (!overtimeHours && !overtimeMinutes) {
      errors.push("Inserisci almeno un'ora o un minuto per lo straordinario.");
    }

    if (parseInt(overtimeHours || 0) < 0 || parseInt(overtimeHours || 0) > 8) {
      errors.push("Le ore di straordinario devono essere tra 0 e 8.");
    }

    if (parseInt(overtimeMinutes || 0) > 59) {
      errors.push("I minuti non possono superare 59.");
    }

    return errors;
  };

  // Calcola il colore del pallino
  const calculateDotColor = (workData) => {
    const {
      workHours,
      workMinutes,
      permessiHours,
      permessiMinutes,
      malattiaHours,
      malattiaMinutes,
      ferieHours,
      ferieMinutes,
    } = workData;

    const totalWorkMinutes =
      parseInt(workHours || 0) * 60 + parseInt(workMinutes || 0);
    const totalJustificationMinutes =
      parseInt(permessiHours || 0) * 60 +
      parseInt(permessiMinutes || 0) +
      parseInt(malattiaHours || 0) * 60 +
      parseInt(malattiaMinutes || 0) +
      parseInt(ferieHours || 0) * 60 +
      parseInt(ferieMinutes || 0);

    const totalMinutes = totalWorkMinutes + totalJustificationMinutes;

    let dotColor = "blu"; // Default se si seleziona solo il progetto

    if (totalMinutes === 480 && totalWorkMinutes === 480) {
      dotColor = "verde";
    } else if (totalMinutes === 480 && totalWorkMinutes === 0) {
      dotColor = "rosso";
    } else if (totalMinutes < 480 && totalWorkMinutes > 0) {
      dotColor = "giallo";
    }

    return dotColor;
  };

  // Gestione submit form lavoro
  const handleWorkFormSubmit = () => {
    const errors = validateWorkFormData();

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      return;
    }

    const {
      project,
      workHours,
      workMinutes,
      permessiHours,
      permessiMinutes,
      malattiaHours,
      malattiaMinutes,
      ferieHours,
      ferieMinutes,
    } = workFormData;

    const dotColor = calculateDotColor(workFormData);

    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const newDateData = { ...dateData };

    // Se è in modalità modifica
    if (currentEditProjectIndex !== null) {
      newDateData[dateKey].work.projects[currentEditProjectIndex] = {
        project,
        workHours,
        workMinutes,
        permessiHours,
        permessiMinutes,
        malattiaHours,
        malattiaMinutes,
        ferieHours,
        ferieMinutes,
        dotColor,
      };
    } else {
      // Se è un nuovo progetto
      if (!newDateData[dateKey]) {
        newDateData[dateKey] = { work: { projects: [] }, overtime: [] };
      }
      newDateData[dateKey].work.projects.push({
        project,
        workHours,
        workMinutes,
        permessiHours,
        permessiMinutes,
        malattiaHours,
        malattiaMinutes,
        ferieHours,
        ferieMinutes,
        dotColor,
      });
    }

    setDateData(newDateData);
    setShowWorkModal(false);
    setSuccessMessage("Dati salvati con successo!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    // Resetta form
    setWorkFormData({
      project: "",
      workHours: "",
      workMinutes: "",
      permessiHours: "",
      permessiMinutes: "",
      malattiaHours: "",
      malattiaMinutes: "",
      ferieHours: "",
      ferieMinutes: "",
    });
    setCurrentEditProjectIndex(null);
  };

  // Gestione submit form straordinario
  const handleOvertimeFormSubmit = () => {
    const errors = validateOvertimeFormData();

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      return;
    }

    const { project, overtimeHours, overtimeMinutes } = overtimeFormData;

    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const newDateData = { ...dateData };

    if (!newDateData[dateKey].overtime) {
      newDateData[dateKey].overtime = [];
    }

    newDateData[dateKey].overtime.push({
      project,
      overtimeHours,
      overtimeMinutes,
    });

    setDateData(newDateData);
    setShowOvertimeModal(false);
    setSuccessMessage("Straordinario aggiunto con successo!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    // Resetta form
    setOvertimeFormData({
      project: "",
      overtimeHours: "",
      overtimeMinutes: "",
    });
  };

  // Modifica progetto
  const handleEditProject = (index) => {
    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const projectData = dateData[dateKey].work.projects[index];
    setWorkFormData({
      project: projectData.project,
      workHours: projectData.workHours,
      workMinutes: projectData.workMinutes,
      permessiHours: projectData.permessiHours,
      permessiMinutes: projectData.permessiMinutes,
      malattiaHours: projectData.malattiaHours,
      malattiaMinutes: projectData.malattiaMinutes,
      ferieHours: projectData.ferieHours,
      ferieMinutes: projectData.ferieMinutes,
    });
    setCurrentEditProjectIndex(index);
    setShowWorkModal(true);
  };

  // Elimina progetto
  const handleDeleteProject = (index) => {
    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const newDateData = { ...dateData };
    newDateData[dateKey].work.projects.splice(index, 1);
    // Se non ci sono più progetti, rimuove l'entry
    if (newDateData[dateKey].work.projects.length === 0 && (!newDateData[dateKey].overtime || newDateData[dateKey].overtime.length === 0)) {
      delete newDateData[dateKey];
    }
    setDateData(newDateData);
    setSuccessMessage("Progetto eliminato con successo!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 md:rounded-xl shadow-2xl border border-gray-800 min-h-screen md:min-h-0 flex flex-col relative"
    >
      {/* Messaggio di successo */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
          <button
            onClick={handlePrevMonth}
            className="text-white hover:text-purple-400 transition-colors duration-200"
          >
            &lt; {format(subMonths(currentDate, 1), "MMM", { locale: it })}
          </button>
          <div className="relative">
            <button
              onClick={handleYearClick}
              className="text-xl font-semibold text-white flex items-center hover:text-purple-400 transition-colors duration-200"
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
          <button
            onClick={handleNextMonth}
            className="text-white hover:text-purple-400 transition-colors duration-200"
          >
            {format(addMonths(currentDate, 1), "MMM", { locale: it })} &gt;
          </button>
        </div>

        {/* Sezione Calendario */}
        <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-2">
          <div className="grid grid-cols-7 text-center gap-1 text-sm text-white select-none">
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

              // Ottieni i dati per la data
              const data = dateData[dateKey];

              const dotColorToBorderClass = {
                rosso: "border-red-500",
                blu: "border-blue-500",
                giallo: "border-yellow-500",
                verde: "border-green-500",
              };

              let borderColorClass = "border-gray-600";

              if (isSelected) {
                borderColorClass = "border-purple-500";
              } else if (isToday) {
                borderColorClass = "border-green-500";
              } else if (data?.work && data.work.projects.length > 0) {
                // Determina il colore basato sul primo progetto
                borderColorClass = dotColorToBorderClass[data.work.projects[0].dotColor] || "border-gray-600";
              }

              return (
                <div
                  key={dateKey}
                  data-date={date.getTime()}
                  onClick={() => handleDateSelect(date)}
                  className={`relative p-1 rounded-lg cursor-pointer border overflow-hidden ${
                    isSelected
                      ? "bg-purple-500 text-white border-purple-500"
                      : `text-gray-200 ${borderColorClass}`
                  } hover:bg-purple-600 transition-colors duration-200`}
                  style={{ minHeight: "70px" }}
                >
                  {/* Pallino principale in alto a sinistra */}
                  {data?.work?.projects && data.work.projects.length > 0 && (
                    <span
                      className={`absolute top-1 left-1 h-2 w-2 rounded-full ${
                        {
                          rosso: "bg-red-500",
                          blu: "bg-blue-500",
                          giallo: "bg-yellow-500",
                          verde: "bg-green-500",
                        }[data.work.projects[0].dotColor]
                      }`}
                    ></span>
                  )}

                  {/* Contenuto della casella */}
                  {!data?.work || data.work.projects.length === 0 ? (
                    // Nessun dato, numero del giorno centrato
                    <span className="text-lg font-bold flex items-center justify-center h-full">
                      {format(date, "d")}
                    </span>
                  ) : (
                    // Dati presenti, numero del giorno in alto a destra, informazioni sul progetto e ore
                    <>
                      <span className="absolute top-0.5 right-0.5 text-xs font-bold">
                        {format(date, "d")}
                      </span>
                      <div className="mt-3 text-xs leading-tight">
                        {/* Progetto principale */}
                        <p className="truncate font-semibold">{data.work.projects[0].project}</p>
                        <p>
                          L: {data.work.projects[0].workHours}h {data.work.projects[0].workMinutes}m
                        </p>
                        {data.work.projects[0].permessiHours || data.work.projects[0].permessiMinutes ? (
                          <p>
                            P: {data.work.projects[0].permessiHours}h {data.work.projects[0].permessiMinutes}m
                          </p>
                        ) : null}
                        {data.work.projects[0].malattiaHours || data.work.projects[0].malattiaMinutes ? (
                          <p>
                            M: {data.work.projects[0].malattiaHours}h {data.work.projects[0].malattiaMinutes}m
                          </p>
                        ) : null}
                        {data.work.projects[0].ferieHours || data.work.projects[0].ferieMinutes ? (
                          <p>
                            F: {data.work.projects[0].ferieHours}h {data.work.projects[0].ferieMinutes}m
                          </p>
                        ) : null}

                        {/* Straordinari */}
                        {data.overtime && data.overtime.length > 0 && (
                          <div className="mt-2">
                            {data.overtime.map((ot, index) => (
                              <p key={index} className="text-xs font-medium text-yellow-300">
                                + {ot.project}: {ot.overtimeHours}h {ot.overtimeMinutes}m
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Area delle attività selezionate */}
        <div className="mt-4 flex-grow overflow-y-auto">
          {dateData[format(selectedDate, "yyyy-MM-dd")] ? (
            <>
              {/* Elenco dei progetti */}
              <div className="space-y-4">
                {dateData[format(selectedDate, "yyyy-MM-dd")].work.projects.map((project, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-white">{project.project}</p>
                      <p className="text-sm text-gray-300">
                        L: {project.workHours}h {project.workMinutes}m | P: {project.permessiHours}h {project.permessiMinutes}m | M: {project.malattiaHours}h {project.malattiaMinutes}m | F: {project.ferieHours}h {project.ferieMinutes}m
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentEditProjectIndex(index);
                          setShowWorkModal(true);
                        }}
                        className="text-yellow-300 hover:text-yellow-500 transition-colors duration-200"
                        title="Modifica Progetto"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Elimina Progetto"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Straordinari */}
                {dateData[format(selectedDate, "yyyy-MM-dd")].overtime && dateData[format(selectedDate, "yyyy-MM-dd")].overtime.length > 0 && (
                  <div className="bg-gray-600 p-4 rounded-lg shadow">
                    <p className="text-lg font-semibold text-yellow-300">Straordinari</p>
                    {dateData[format(selectedDate, "yyyy-MM-dd")].overtime.map((ot, index) => (
                      <p key={index} className="text-sm text-gray-300">
                        {ot.project}: {ot.overtimeHours}h {ot.overtimeMinutes}m
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Pulsante "+" per aggiungere attività */}
              <button
                onClick={() => setShowOvertimeModal(true)}
                className="fixed bottom-24 right-6 bg-purple-500 text-white rounded-full p-3 shadow-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center"
                title="Aggiungi Straordinario"
              >
                <Plus size={20} />
              </button>
            </>
          ) : (
            <p className="text-gray-300">Nessuna attività programmata per questa data.</p>
          )}
        </div>
      </div>

      {/* Barra di navigazione come footer */}
      <div className="bg-gray-900 md:relative md:bottom-auto md:w-auto fixed bottom-0 w-full">
        <NavBar />
      </div>

      {/* Modale per i dettagli del lavoro */}
      {showWorkModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => {
            setShowWorkModal(false);
            setErrorMessage("");
            setCurrentEditProjectIndex(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Inserisci i dettagli del lavoro</h3>

            {/* Messaggio di errore */}
            {errorMessage && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>
            )}

            {/* Selezione del progetto */}
            <div className="mb-4">
              <p className="mb-2 text-gray-800">Seleziona un progetto:</p>
              <select
                value={workFormData.project}
                onChange={(e) => setWorkFormData({ ...workFormData, project: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Seleziona un progetto</option>
                <option value="Progetto A">Progetto A</option>
                <option value="Progetto B">Progetto B</option>
                <option value="Progetto C">Progetto C</option>
              </select>
            </div>

            {/* Inserimento ore di lavoro */}
            <div className="mb-4">
              <p className="mb-2 text-gray-800">Ore di lavoro:</p>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={workFormData.workHours}
                  onChange={(e) => setWorkFormData({ ...workFormData, workHours: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ore"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={workFormData.workMinutes}
                  onChange={(e) => setWorkFormData({ ...workFormData, workMinutes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Minuti"
                />
              </div>
            </div>

            {/* Inserimento giustificativi */}
            <div className="mb-4">
              <p className="mb-2 text-gray-800">Giustificativi:</p>

              {/* Permessi */}
              <div className="mb-2">
                <p className="text-gray-700">Permessi:</p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={workFormData.permessiHours}
                    onChange={(e) => setWorkFormData({ ...workFormData, permessiHours: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Ore"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workFormData.permessiMinutes}
                    onChange={(e) => setWorkFormData({ ...workFormData, permessiMinutes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Minuti"
                  />
                </div>
              </div>

              {/* Malattia */}
              <div className="mb-2">
                <p className="text-gray-700">Malattia:</p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={workFormData.malattiaHours}
                    onChange={(e) => setWorkFormData({ ...workFormData, malattiaHours: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Ore"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workFormData.malattiaMinutes}
                    onChange={(e) => setWorkFormData({ ...workFormData, malattiaMinutes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Minuti"
                  />
                </div>
              </div>

              {/* Ferie */}
              <div>
                <p className="text-gray-700">Ferie:</p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={workFormData.ferieHours}
                    onChange={(e) => setWorkFormData({ ...workFormData, ferieHours: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Ore"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workFormData.ferieMinutes}
                    onChange={(e) => setWorkFormData({ ...workFormData, ferieMinutes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Minuti"
                  />
                </div>
              </div>
            </div>

            {/* Pulsanti di salvataggio e annullamento */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowWorkModal(false);
                  setErrorMessage("");
                  setCurrentEditProjectIndex(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Annulla
              </button>
              <button
                onClick={handleWorkFormSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Salva
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modale per aggiungere straordinario */}
      {showOvertimeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => {
            setShowOvertimeModal(false);
            setErrorMessage("");
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Aggiungi Straordinario</h3>

            {/* Messaggio di errore */}
            {errorMessage && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>
            )}

            {/* Selezione del progetto */}
            <div className="mb-4">
              <p className="mb-2 text-gray-800">Seleziona un progetto:</p>
              <select
                value={overtimeFormData.project}
                onChange={(e) => setOvertimeFormData({ ...overtimeFormData, project: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Seleziona un progetto</option>
                <option value="Progetto A">Progetto A</option>
                <option value="Progetto B">Progetto B</option>
                <option value="Progetto C">Progetto C</option>
              </select>
            </div>

            {/* Inserimento ore di straordinario */}
            <div className="mb-4">
              <p className="mb-2 text-gray-800">Ore di straordinario:</p>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={overtimeFormData.overtimeHours}
                  onChange={(e) => setOvertimeFormData({ ...overtimeFormData, overtimeHours: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ore"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={overtimeFormData.overtimeMinutes}
                  onChange={(e) => setOvertimeFormData({ ...overtimeFormData, overtimeMinutes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Minuti"
                />
              </div>
            </div>

            {/* Pulsanti di salvataggio e annullamento */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowOvertimeModal(false);
                  setErrorMessage("");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Annulla
              </button>
              <button
                onClick={handleOvertimeFormSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Salva
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TimetablePage;
