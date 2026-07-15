import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border border-white/5 rounded-lg overflow-hidden bg-white/[0.01]">
      <button
        type="button"
        onClick={onClick}
        className="w-full px-6 py-4 flex items-center justify-between font-semibold text-brand-textPrimary text-sm focus:outline-none hover:bg-white/[0.02] transition-colors"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-brand-textMuted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 text-sm text-brand-textSecondary border-t border-white/5">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          title={item.title}
          content={item.content}
          isOpen={openIndex === idx}
          onClick={() => handleToggle(idx)}
        />
      ))}
    </div>
  );
};

export default Accordion;
