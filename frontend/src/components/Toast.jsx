import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Toast = ({ title, message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Ensure exit animation completes before closing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 5, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-[7%] right-[35%] p-3 rounded-lg shadow-lg bg-[#1D1F40] border-l-4 
            border-fuchsia-600 z-50`} 
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-md text-white font-medium">{title}</h4>
              <p className="text-sm text-white">{message}</p>
            </div>
            <button onClick={() => setVisible(false)} className="ml-4 text-gray-600 ">
              <AiOutlineClose className="w-5 h-5" />
            </button>
          </div>

          {/* Border Bottom Animation */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`rounded-lg absolute bottom-0 left-0 h-1 bg-fuchsia-600`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;