// components/YearSelector.js
import { motion, AnimatePresence } from "framer-motion";

const YearSelector = ({ show, years, onSelectYear }) => {
  return (
    <AnimatePresence>
      {show && (
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
              onClick={() => onSelectYear(year)}
              className="block w-full text-left text-white hover:bg-gray-700 px-4 py-2"
            >
              {year}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default YearSelector;
