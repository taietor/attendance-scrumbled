import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Importa Axios

const CreateEmployerPage = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Stato per errori
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se tutti i campi sono compilati
    if (!name || !surname || !email || !password) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }

    try {
      // Invia i dati al backend per creare un nuovo employer
      const response = await axios.post("http://localhost:5000/api/auth/create-employer", {
        name,
        surname,
        email,
        password,
      });

      // Mostra il messaggio di successo
      console.log("Employer creato con successo:", response.data);

      // Naviga alla dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Errore durante la creazione dell'employer:", err);
      setError(err.response?.data?.message || "Errore durante la creazione dell'employer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-purple-100 rounded-xl shadow-2xl border border-purple-300"
    >
      <div className="bg-purple-300 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-center text-purple-900">
          Creazione nuovo utente:
        </h2>
      </div>

      {error && <p className="text-red-500">{error}</p>} {/* Mostra errore se presente */}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-purple-900 mb-2">Nome:</label>
          <input
            type="text"
            placeholder="Nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-900 mb-2">Cognome:</label>
          <input
            type="text"
            placeholder="Cognome..."
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-900 mb-2">Email:</label>
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-purple-900 mb-2">Password:</label>
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-white"
          />
        </div>

        <div className="flex justify-between mt-6">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
          >
            <Save className="mr-2" size={20} />
            Salva
          </motion.button>

          <motion.button
            type="button"
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
          >
            <X className="mr-2" size={20} />
            Annulla
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateEmployerPage;
