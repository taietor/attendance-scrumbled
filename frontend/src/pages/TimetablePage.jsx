// pages/TimetablePage.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Calendar from "../components/Calendar";
import WorkModal from "../components/WorkModal";
import OvertimeModal from "../components/OvertimeModal";
import ActivityArea from "../components/ActivityArea";
import Notification from "../components/Notification";
import YearSelector from "../components/YearSelector";
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
import { Bell, Plus } from "lucide-react";

const TimetablePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hasNotification, setHasNotification] = useState(true);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const [dateData, setDateData] = useState({});

  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [currentEditDate, setCurrentEditDate] = useState(null);

  // Messaggi di feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Gestione della selezione multipla
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  // Genera una lista di anni per il selettore
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  // Form data
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

  const [overtimeFormData, setOvertimeFormData] = useState({
    project: "",
    overtimeHours: "",
    overtimeMinutes: "",
  });

  // Funzioni di gestione eventi e validazione rimangono inalterate
  // ...

  // Funzioni di gestione della selezione multipla
  const handleDateMouseDown = (e, date) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectedDates([date]);
  };

  const handleDateMouseEnter = (e, date) => {
    if (isSelecting) {
      setSelectedDates((prevDates) => {
        if (!prevDates.some((d) => isSameDay(d, date))) {
          return [...prevDates, date];
        }
        return prevDates;
      });
    }
  };

  const handleDateMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      if (selectedDates.length > 0) {
        setCurrentEditDate(selectedDates[0]);
        setShowWorkModal(true);
      }
    }
  };

  const handleDateTouchStart = (e, date) => {
    setIsSelecting(true);
    setSelectedDates([date]);
  };

  const handleDateTouchMove = (e) => {
    if (isSelecting) {
      const touch = e.touches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      if (targetElement && targetElement.dataset && targetElement.dataset.date) {
        const timestamp = parseInt(targetElement.dataset.date, 10);
        const date = new Date(timestamp);
        if (!selectedDates.some((d) => isSameDay(d, date))) {
          setSelectedDates((prevDates) => [...prevDates, date]);
        }
      }
    }
  };

  const handleDateTouchEnd = () => {
    if (isSelecting) {
      setIsSelecting(false);
      if (selectedDates.length > 0) {
        setCurrentEditDate(selectedDates[0]);
        setShowWorkModal(true);
      }
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentEditDate(date);
    setShowWorkModal(true);
  };

  // Funzioni per la navigazione del calendario
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

  // Gestione del tasto Escape per chiudere le modali
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

  // Funzioni di validazione del form di lavoro
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

    // Verifica che almeno un campo sia compilato
    if (
      !workHours &&
      !workMinutes &&
      !permessiHours &&
      !permessiMinutes &&
      !malattiaHours &&
      !malattiaMinutes &&
      !ferieHours &&
      !ferieMinutes &&
      !workFormData.project
    ) {
      errors.push("Compila almeno un campo.");
    }

    return errors;
  };

  // Funzioni di validazione del form di straordinario
  const validateOvertimeFormData = () => {
    const errors = [];

    const { overtimeHours, overtimeMinutes, project } = overtimeFormData;

    if (!project) {
      errors.push("Seleziona un progetto.");
    }

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

  // Gestione del submit del form di lavoro
  const handleWorkFormSubmit = (response) => {
    if (!response.success) {
      setErrorMessage(response.errors);
      setSuccessMessage("");
      return;
    }
    const submissionData = response.data;


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

    const totalWorkMinutes = parseInt(workHours || 0) * 60 + parseInt(workMinutes || 0);
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

    // Aggiorna dateData
    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const newDateData = { ...dateData };

    newDateData[dateKey] = {
      work: {
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
      },
      overtime: newDateData[dateKey]?.overtime || [],
    };

    setDateData(newDateData);
    setShowWorkModal(false);
    setSelectedDate(currentEditDate);
    // Resetta formData
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
    // Mostra messaggio di successo
    setSuccessMessage("Dati salvati con successo!");
    setErrorMessage("");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Gestione del submit del form di straordinario
  const handleOvertimeFormSubmit = () => {
    const errors = validateOvertimeFormData();
  
    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      setSuccessMessage("");
      return;
    }

    const { project, overtimeHours, overtimeMinutes } = overtimeFormData;

    const overtimeEntry = {
      project,
      overtimeHours,
      overtimeMinutes,
    };

    const dateKey = format(currentEditDate, "yyyy-MM-dd");
    const newDateData = { ...dateData };

    if (!newDateData[dateKey]?.overtime) {
      newDateData[dateKey].overtime = [];
    }

    newDateData[dateKey].overtime.push(overtimeEntry);

    setDateData(newDateData);
    setShowOvertimeModal(false);
    // Resetta formData
    setOvertimeFormData({
      project: "",
      overtimeHours: "",
      overtimeMinutes: "",
    });
    // Mostra messaggio di successo
    setSuccessMessage("Straordinario aggiunto con successo!");
  setErrorMessage("");
  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
  };

  // Funzione per modificare un progetto di lavoro
  const handleEditWork = (dateKey) => {
    const data = dateData[dateKey]?.work;
    if (data) {
      setCurrentEditDate(new Date(dateKey));
      setWorkFormData({
        project: data.project || "",
        workHours: data.workHours || "",
        workMinutes: data.workMinutes || "",
        permessiHours: data.permessiHours || "",
        permessiMinutes: data.permessiMinutes || "",
        malattiaHours: data.malattiaHours || "",
        malattiaMinutes: data.malattiaMinutes || "",
        ferieHours: data.ferieHours || "",
        ferieMinutes: data.ferieMinutes || "",
      });
      setShowWorkModal(true);
    }
  };

  // Funzione per eliminare un progetto di lavoro
  const handleDeleteWork = (dateKey) => {
    const newDateData = { ...dateData };
    delete newDateData[dateKey];
    setDateData(newDateData);
    setSuccessMessage("Attività eliminata con successo!");
    setErrorMessage("");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Funzione per modificare un progetto di straordinario
  const handleEditOvertime = (dateKey, index) => {
    const ot = dateData[dateKey]?.overtime[index];
    if (ot) {
      setOvertimeFormData({
        project: ot.project || "",
        overtimeHours: ot.overtimeHours || "",
        overtimeMinutes: ot.overtimeMinutes || "",
      });
      setShowOvertimeModal(true);
    }
  };

  // Funzione per eliminare un progetto di straordinario
  const handleDeleteOvertime = (dateKey, index) => {
    const newDateData = { ...dateData };
    newDateData[dateKey].overtime.splice(index, 1);
    setDateData(newDateData);
    setSuccessMessage("Straordinario eliminato con successo!");
    setErrorMessage("");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Quando si apre la modale di lavoro, carica i dati se esistono, altrimenti resetta il form
  useEffect(() => {
    setErrorMessage(""); // Resetta il messaggio di errore quando si apre la modale
    if (showWorkModal && currentEditDate) {
      const dateKey = format(currentEditDate, "yyyy-MM-dd");
      const data = dateData[dateKey]?.work;
      if (data) {
        setWorkFormData({
          project: data.project || "",
          workHours: data.workHours || "",
          workMinutes: data.workMinutes || "",
          permessiHours: data.permessiHours || "",
          permessiMinutes: data.permessiMinutes || "",
          malattiaHours: data.malattiaHours || "",
          malattiaMinutes: data.malattiaMinutes || "",
          ferieHours: data.ferieHours || "",
          ferieMinutes: data.ferieMinutes || "",
        });
      } else {
        // Resetta il form se non ci sono dati per la data selezionata
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
      }
    }
  }, [showWorkModal, currentEditDate, dateData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 md:rounded-xl shadow-2xl border border-gray-800 min-h-screen md:min-h-0 flex flex-col relative"
      onMouseUp={handleDateMouseUp}
      onTouchEnd={handleDateTouchEnd}
    >
      {/* Notifiche */}
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      {/* Contenitore principale */}
      <div className="p-4 pb-24 flex-grow flex flex-col">
        {/* Icona delle notifiche */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setHasNotification(!hasNotification)}
            className="relative"
          >
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <YearSelector
              show={showYearSelector}
              years={years}
              onSelectYear={handleYearChange}
            />
          </div>
          <button
            onClick={handleNextMonth}
            className="text-white hover:text-purple-400 transition-colors duration-200"
          >
            {format(addMonths(currentDate, 1), "MMM", { locale: it })} &gt;
          </button>
        </div>

        {/* Sezione Calendario */}
        <Calendar
          currentDate={currentDate}
          dateData={dateData}
          selectedDate={selectedDate}
          isSelecting={isSelecting}
          selectedDates={selectedDates}
          onDateMouseDown={handleDateMouseDown}
          onDateMouseEnter={handleDateMouseEnter}
          onDateClick={handleDateClick}
          onDateTouchStart={handleDateTouchStart}
          onDateTouchMove={handleDateTouchMove}
          onDateTouchEnd={handleDateTouchEnd}
        />

        {/* Area delle Attività */}
        <ActivityArea
          selectedDate={selectedDate}
          dateData={dateData}
          onEditWork={handleEditWork}
          onDeleteWork={handleDeleteWork}
          onEditOvertime={handleEditOvertime}
          onDeleteOvertime={handleDeleteOvertime}
        />

        {/* Bottone "+" per aggiungere straordinario */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              if (selectedDate) {
                setCurrentEditDate(selectedDate);
                setShowOvertimeModal(true);
              }
            }}
            className="bg-purple-500 text-white rounded-full p-3 hover:bg-purple-600 transition-colors duration-200"
            title="Aggiungi Straordinario"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Barra di navigazione come footer */}
      <div className="bg-gray-900 md:relative md:bottom-auto md:w-auto fixed bottom-0 w-full">
        <NavBar />
      </div>

      {/* Modale per i dettagli del lavoro */}
      {showWorkModal && (
        <WorkModal
          workFormData={workFormData}
          setWorkFormData={setWorkFormData}
          onClose={() => {
            setShowWorkModal(false);
            setErrorMessage("");
          }}
          onSubmit={handleWorkFormSubmit}
          errorMessage={errorMessage}
        />
      )}

      {/* Modale per aggiungere straordinario */}
      {showOvertimeModal && (
        <OvertimeModal
          overtimeFormData={overtimeFormData}
          setOvertimeFormData={setOvertimeFormData}
          onClose={() => {
            setShowOvertimeModal(false);
            setErrorMessage("");
          }}
          onSubmit={handleOvertimeFormSubmit}
          errorMessage={errorMessage}
        />
      )}
    </motion.div>
  );
};

export default TimetablePage;
