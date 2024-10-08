// src/components/FloatingShape.js
import React from "react";
import { motion } from "framer-motion";

const FloatingShape = ({ color, size, bottom, left, right, delay }) => {
  // Definisci animazioni per movimento lento e continuo
  const animation = {
    animate: {
      y: [0, 20, 0], // Movimento verticale
      x: [0, 20, 0], // Movimento orizzontale
    },
    transition: {
      y: {
        yoyo: Infinity,
        duration: 10,
        ease: "easeInOut",
      },
      x: {
        yoyo: Infinity,
        duration: 15,
        ease: "easeInOut",
        delay: delay,
      },
    },
  };

  // Posizionamento dinamico
  const positionStyles = {};
  if (bottom) positionStyles.bottom = bottom;
  if (left) positionStyles.left = left;
  if (right) positionStyles.right = right;

  return (
    <motion.div
      className={`${color} ${size} rounded-full opacity-20 absolute`}
      style={positionStyles}
      {...animation}
    />
  );
};

export default FloatingShape;
