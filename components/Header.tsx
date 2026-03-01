"use client";

import React, {useState, useRef, useEffect} from "react";
import {Bell, ChevronDown} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-18 bg-white flex items-center justify-center px-8 z-50">
      <div className="w-full container mx-auto flex items-center justify-between">
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div>
            <img className="w-24" src="./logo.png" alt="photos" />
          </div>

          {/* Navigation Menu (Desktop Only) */}
          <nav className="hidden lg:flex items-center gap-12">
            <a href="#" className="text-[#1A73E8] font-normal text-base">
              Flight
            </a>
            <a href="#" className="text-gray-600 font-normal text-base hover:text-[#1A73E8] transition-colors">
              Hotel
            </a>
            <a href="#" className="text-gray-600 font-normal text-base hover:text-[#1A73E8] transition-colors">
              Activities
            </a>
            <a href="#" className="text-gray-600 font-normal text-base hover:text-[#1A73E8] transition-colors">
              Transfer
            </a>
            <a href="#" className="text-gray-600 font-normal text-base hover:text-[#1A73E8] transition-colors">
              Visa
            </a>
          </nav>
        </div>
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-2 text-gray-700 font-semibold text-sm hover:text-[#1A73E8] transition-colors"
          >
            <span className="text-base flex items-center">
              <img src="./usa.png" alt="English" className="h-[14px]" />
            </span>
            <span>English</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{opacity: 0, scale: 0.95, y: 10}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95, y: 10}}
                transition={{duration: 0.15}}
                className="absolute top-full mt-4 right-0 bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-xl py-2 w-48 overflow-hidden"
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsLangOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors w-full text-left"
                  >
                    <img src="./usa.png" alt="English" className="w-5" />
                    <span className="text-sm font-bold text-[#1A73E8]">English (US)</span>
                  </button>
                  <button
                    onClick={() => setIsLangOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left group"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
                      AR
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A73E8] transition-colors">
                      Arabic
                    </span>
                  </button>
                  <button
                    onClick={() => setIsLangOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left group"
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
                      FR
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1A73E8] transition-colors">
                      French
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden lg:flex items-center gap-14">
          {/* Language Selector */}

          {/* Notification Bell */}
          <button className="text-gray-500 hover:text-[#1A73E8] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Itinerary Link */}
          <a
            href="#"
            className="text-gray-700 font-bold text-sm hover:text-[#1A73E8] transition-colors flex items-center gap-1"
          >
            <img className="h-4" src="./Itinerary.png" alt="photos" />
            Itinerary
          </a>

          {/* Sign In Button */}
          <button className="bg-[#1A73E8] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
            Sign In / Register
          </button>
        </div>
      </div>
    </header>
  );
}
