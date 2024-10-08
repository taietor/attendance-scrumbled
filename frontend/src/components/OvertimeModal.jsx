// components/OvertimeModal.js
import { motion } from "framer-motion";

const OvertimeModal = ({
  overtimeFormData,
  setOvertimeFormData,
  onClose,
  onSubmit,
  errorMessage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4">Aggiungi Straordinario</h3>

        {/* Messaggio di errore */}
        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Selezione del progetto */}
        <div className="mb-4">
          <p className="mb-2 text-gray-800">Seleziona un progetto:</p>
          <select
            value={overtimeFormData.project}
            onChange={(e) =>
              setOvertimeFormData({
                ...overtimeFormData,
                project: e.target.value,
              })
            }
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
              onChange={(e) =>
                setOvertimeFormData({
                  ...overtimeFormData,
                  overtimeHours: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ore"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={overtimeFormData.overtimeMinutes}
              onChange={(e) =>
                setOvertimeFormData({
                  ...overtimeFormData,
                  overtimeMinutes: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Minuti"
            />
          </div>
        </div>

        {/* Pulsanti di salvataggio e annullamento */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Annulla
          </button>
          <button
            onClick={onSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Salva
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OvertimeModal;
