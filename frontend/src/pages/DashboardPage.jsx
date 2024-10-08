// pages/DashboardPage.js
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserPlus, Calendar, Settings, LogOut, Home, Clock, Briefcase, UserCheck, ClipboardList, Users } from "lucide-react";

const DashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Animazioni per i bottoni principali
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-800 min-h-screen flex flex-col">
      {/* Contenitore Scrollabile */}
      <div className="p-6 flex-grow overflow-y-auto">
        {/* Titolo della Dashboard */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Benvenuto, Admin!
        </h2>

        {/* Griglia dei Bottoni Principali */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bottone 1: Crea Utente */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link to="/create-employer">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full aspect-square bg-purple-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center"
                aria-label="Crea un nuovo utente"
              >
                <UserPlus size={48} />
                <span className="mt-2 text-lg font-semibold">Crea Utente</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Bottone 2: Orari */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link to="/timetable">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full aspect-square bg-purple-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center"
                aria-label="Tabelle orarie"
              >
                <Calendar size={48} />
                <span className="mt-2 text-lg font-semibold">Orari</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Bottone 3: Anagrafiche */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link to="/anagrafiche">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full aspect-square bg-purple-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center"
                aria-label="Vai ad Anagrafiche"
              >
                <UserCheck size={48} />
                <span className="mt-2 text-lg font-semibold">Anagrafiche</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Bottone 4: Impostazioni */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
          >
            <Link to="/settings">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full aspect-square bg-purple-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center"
                aria-label="Impostazioni"
              >
                <Settings size={48} />
                <span className="mt-2 text-lg font-semibold">Impostazioni</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Bottone Logout */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-4 bg-red-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center space-y-2 transition-colors duration-200 hover:bg-red-600"
            aria-label="Logout"
          >
            <LogOut size={32} aria-hidden="true" />
            <span className="text-lg font-semibold">Logout</span>
          </motion.button>
        </motion.div>

        {/* Sezione Informativa */}
        <InfoSection />
      </div>

      {/* Barra di Navigazione Fissa */}
      <FooterNav />
    </div>
  );
};

// Componenti Interni

// DashboardButton: Bottone riutilizzabile per la Dashboard
const DashboardButton = ({ to, icon: Icon, label, bgClass, hoverBgClass }) => {
  return (
    <Link to={to} className="w-full">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 ${bgClass} ${hoverBgClass} text-white rounded-lg shadow-lg flex flex-col items-center justify-center space-y-2 transition-colors duration-200`}
        aria-label={label}
      >
        <Icon size={32} aria-hidden="true" />
        <span className="text-lg font-semibold">{label}</span>
      </motion.button>
    </Link>
  );
};

// FooterNav: Barra di navigazione inferiore
const FooterNav = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/anagrafiche", icon: Users, label: "Anagrafiche" },
    { to: "/timetable", icon: Calendar, label: "Orari" },
    { to: "/settings", icon: Settings, label: "Impostazioni" },
  ];

  return (
    <nav className="bg-gray-900 p-4 shadow-lg flex justify-around fixed bottom-0 left-0 w-full">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex flex-col items-center text-white hover:text-gray-400"
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <item.icon size={24} />
            <span className="text-sm">{item.label}</span>
          </motion.div>
        </Link>
      ))}
    </nav>
  );
};

// InfoSection: Sezione Informativa con Statistiche
const InfoSection = () => {
  // Dati di esempio; in un'app reale, questi dovrebbero essere recuperati tramite API o dal tuo stato globale
  const stats = [
    { icon: Clock, label: "Ore Totali", value: "1,234" },
    { icon: Briefcase, label: "Progetti Attivi", value: "12" },
    { icon: UserCheck, label: "Dipendenti", value: "56" },
    { icon: ClipboardList, label: "Permessi", value: "34" },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-center text-white">Statistiche</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <stat.icon size={32} className="text-green-400" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
