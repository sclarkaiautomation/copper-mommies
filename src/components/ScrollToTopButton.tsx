import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPos > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Run once on mount to capture current position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="btn-scroll-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 z-40 group cursor-pointer flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-gradient-to-b from-[#332014] via-[#24160E] to-[#150D08] text-[#FAF5EE] border-2 border-[#8C5D38] hover:border-[#D4AF37] shadow-[0_8px_25px_rgba(20,11,6,0.7)] hover:shadow-[0_12px_30px_rgba(184,115,51,0.45)] ring-1 ring-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md"
        >
          {/* Subtle Ambient Bronze Sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B87333]/15 via-transparent to-[#D4AF37]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Upward Arrow Icon with hover animation */}
          <ArrowUp 
            className="w-4 h-4 text-[#D4AF37] group-hover:text-[#FFF4E0] group-hover:-translate-y-0.5 transition-transform duration-200 shrink-0" 
            strokeWidth={2.5}
          />

          {/* Micro Label */}
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E6C594] group-hover:text-white transition-colors select-none">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

