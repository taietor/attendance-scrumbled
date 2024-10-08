// components/Notification.js
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ message, type }) => {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
