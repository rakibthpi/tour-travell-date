"use client";

import React, {useState, useRef, useEffect} from "react";
import {Bell, ChevronDown, Menu, X} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className="w-full h-18 bg-white flex items-center justify-center px-4 md:px-6 lg:px-8 z-50 border-b border-gray-100">
      <div className="w-full max-w-7xl container mx-auto flex items-center justify-between">
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center gap-4 lg:gap-8 min-[1140px]:gap-12">
          {/* Logo */}
          <a href="#" className="shrink-0">
            <img className="w-20 md:w-24" src="./logo.png" alt="photos" />
          </a>

          {/* Navigation Menu (Desktop Only) */}
          <nav className="hidden min-[993px]:flex items-center gap-3 lg:gap-6 min-[1140px]:gap-12">
            <a href="#" className="text-[#1A73E8] font-normal text-sm lg:text-base whitespace-nowrap">
              Flight
            </a>
            <a
              href="#"
              className="text-gray-600 font-normal text-sm lg:text-base hover:text-[#1A73E8] transition-colors whitespace-nowrap"
            >
              Hotel
            </a>
            <a
              href="#"
              className="text-gray-600 font-normal text-sm lg:text-base hover:text-[#1A73E8] transition-colors whitespace-nowrap"
            >
              Activities
            </a>
            <a
              href="#"
              className="text-gray-600 font-normal text-sm lg:text-base hover:text-[#1A73E8] transition-colors whitespace-nowrap"
            >
              Transfer
            </a>
            <a
              href="#"
              className="text-gray-600 font-normal text-sm lg:text-base hover:text-[#1A73E8] transition-colors whitespace-nowrap"
            >
              Visa
            </a>
          </nav>
        </div>

        <div className="hidden min-[993px]:flex items-center gap-3 lg:gap-6 min-[1140px]:gap-8 overflow-visible">
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
          <div className="flex items-center gap-3 lg:gap-6 min-[1140px]:gap-10">
            {/* Notification Bell */}
            <button className="text-gray-500 hover:text-[#1A73E8] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Itinerary Link */}
            <a
              href="#"
              className="text-gray-700 font-bold text-xs lg:text-sm hover:text-[#1A73E8] transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <img className="h-3.5 lg:h-4" src="./Itinerary.png" alt="photos" />
              Itinerary
            </a>

            {/* Sign In Button */}
            <button className="bg-[#1A73E8] text-white px-3 lg:px-4 min-[1140px]:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
              Sign In / Register
            </button>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="min-[993px]:hidden p-2 text-gray-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] min-[993px]:hidden"
              />
              <motion.div
                initial={{x: "100%"}}
                animate={{x: 0}}
                exit={{x: "100%"}}
                transition={{type: "spring", damping: 25, stiffness: 200}}
                className="fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl min-[993px]:hidden p-6 flex flex-col"
              >
                <div className="flex justify-between items-center mb-8">
                  <img className="w-20" src="./logo.png" alt="logo" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-4 mb-8">
                  <a href="#" className="text-[#1A73E8] font-bold text-lg py-2 border-b border-gray-50">
                    Flight
                  </a>
                  <a href="#" className="text-gray-600 font-semibold text-lg py-2 border-b border-gray-50">
                    Hotel
                  </a>
                  <a href="#" className="text-gray-600 font-semibold text-lg py-2 border-b border-gray-50">
                    Activities
                  </a>
                  <a href="#" className="text-gray-600 font-semibold text-lg py-2 border-b border-gray-50">
                    Transfer
                  </a>
                  <a href="#" className="text-gray-600 font-semibold text-lg py-2 border-b border-gray-50">
                    Visa
                  </a>
                </nav>

                <div className="flex flex-col gap-6 mt-auto">
                  <div className="flex items-center gap-4">
                    <button className="text-gray-500 relative">
                      <Bell className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <a href="#" className="text-gray-700 font-bold text-base flex items-center gap-2">
                      <img className="h-5" src="./Itinerary.png" alt="itinerary" />
                      Itinerary
                    </a>
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsLangOpen(!isLangOpen)}
                      className="flex items-center space-x-2 text-gray-700 font-semibold text-base"
                    >
                      <img src="./usa.png" alt="English" className="h-[16px]" />
                      <span>English</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isLangOpen && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-2 flex flex-col gap-2">
                        <button className="text-left text-sm font-bold text-[#1A73E8] px-2 py-1">English (US)</button>
                        <button className="text-left text-sm font-semibold text-gray-700 px-2 py-1">Arabic</button>
                        <button className="text-left text-sm font-semibold text-gray-700 px-2 py-1">French</button>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-[#1A73E8] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-200">
                    Sign In / Register
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
