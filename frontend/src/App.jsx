// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateEmployerPage from "./pages/CreateEmployerPage"; // Nuova pagina di Creazione Employer
import SettingsPage from "./pages/SettingsPage"; // Pagina Impostazioni
import EmployerLoginPage from "./pages/EmployerLoginPage"; // Aggiunta pagina per employer
import EmployerDashboardPage from "./pages/EmployerDashboardPage"; // Aggiunto

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import AnagrafichePage from "./pages/AnagrafichePage";
import EmployerDetailsPage from "./pages/EmployerDetailsPage";
import TimetablePage from "./pages/TimetablePage";
import ManageEmployerDataPage from "./pages/ManageEmployerData";
import EmployerSettingsPage from "./pages/EmployerSettingsPage";
import ManageHoursPage from "./pages/ManageHoursPage";

// Protezione delle rotte che richiedono autenticazione
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Reindirizza gli utenti autenticati alla home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protezione delle rotte che richiedono autenticazione per Employer
const EmployerProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user.isEmployer) {
    return <Navigate to="/employer-login" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // Stato per il tema
  const [theme, setTheme] = useState(() => {
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    } else {
      // Rileva le preferenze di sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
  });

  // Funzione per verificare se sessionStorage è disponibile
  const isSessionStorageAvailable = () => {
    try {
      const testKey = "__test__";
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Effettua il toggle del tema e aggiorna sessionStorage
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (isSessionStorageAvailable()) {
      sessionStorage.setItem("theme", newTheme);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Applica il tema al documento
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isCheckingAuth) return <LoadingSpinner />;

  // Dati per le Floating Shapes
  const floatingShapesData = [
    { color: "bg-green-500", size: "w-32 h-32", bottom: "-10%", left: "10%", delay: 0 },
  { color: "bg-emerald-500", size: "w-24 h-24", bottom: "20%", right: "10%", delay: 5 },
  { color: "bg-lime-500", size: "w-16 h-16", bottom: "30%", left: "60%", delay: 2 },
  { color: "bg-blue-500", size: "w-40 h-40", bottom: "15%", right: "30%", delay: 3 },
  { color: "bg-pink-500", size: "w-20 h-20", bottom: "25%", left: "40%", delay: 4 },
  // Aggiungi altre forme con parametri random
  { color: "bg-yellow-500", size: "w-28 h-28", bottom: "10%", left: "70%", delay: 1 },
  { color: "bg-red-500", size: "w-20 h-20", bottom: "35%", right: "50%", delay: 6 },
    // Aggiungi altre FloatingShapes se desideri
  ];

  return (
    <div
      className={`min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden`}
    >
      {/* Floating Shapes Posizionati in Basso */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-between px-4 mb-4 pointer-events-none z-0">
        {floatingShapesData.map((shape, index) => (
          <FloatingShape
            key={index}
            color={shape.color}
            size={shape.size}
            bottom={shape.bottom}
            left={shape.left}
            right={shape.right}
            delay={shape.delay}
          />
        ))}
      </div>

      {/* Contenitore Principale con z-index alto */}
      <div className="relative z-10 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage toggleTheme={toggleTheme} theme={theme} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* Aggiungi la rotta per il login employer */}
          <Route
            path="/employer-login"
            element={
              <RedirectAuthenticatedUser>
                <EmployerLoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* Rotta per gli employer */}
          <Route
            path="/employer-dashboard"
            element={
              <EmployerProtectedRoute>
                <EmployerDashboardPage />
              </EmployerProtectedRoute>
            }
          />
          <Route
            path="/manage-employer-data"
            element={
              <EmployerProtectedRoute>
                <ManageEmployerDataPage />
              </EmployerProtectedRoute>
            }
          />
          <Route
            path="/manage-hours"
            element={
              <EmployerProtectedRoute>
                <ManageHoursPage />
              </EmployerProtectedRoute>
            }
          />
          <Route
            path="/employer-settings"
            element={
              <EmployerProtectedRoute>
                <EmployerSettingsPage />
              </EmployerProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Nuova rotta per la creazione dell'employer */}
          <Route
            path="/create-employer"
            element={
              <ProtectedRoute>
                <CreateEmployerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anagrafiche"
            element={
              <ProtectedRoute>
                <AnagrafichePage />
              </ProtectedRoute>
            }
          />
          {/* Rotta per i dettagli dell'employer */}
          <Route
            path="/employer-details/:id"
            element={
              <ProtectedRoute>
                <EmployerDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Rotta per la pagina delle impostazioni */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <TimetablePage />
              </ProtectedRoute>
            }
          />

          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
