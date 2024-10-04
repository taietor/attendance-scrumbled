import { motion } from "framer-motion";

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-full opacity-20 pointer-events-none`}
      style={{ top, left }}
      animate={{
        y: [0, -20, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatDelay: delay,
      }}
    />
  );
};

export default FloatingShape;
