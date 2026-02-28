import React from "react";
import {Bell} from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-18 bg-white border-b border-gray-100 flex items-center justify-center px-8 z-50">
      <div className="w-full max-w-[1200px] flex items-center justify-between">
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="text-2xl font-black text-[#1A73E8] tracking-tight">Trip963</div>

          {/* Navigation Menu (Desktop Only) */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-[#1A73E8] font-bold text-sm">
              Flight
            </a>
            <a href="#" className="text-gray-600 font-bold text-sm hover:text-[#1A73E8] transition-colors">
              Hotel
            </a>
            <a href="#" className="text-gray-600 font-bold text-sm hover:text-[#1A73E8] transition-colors">
              Activities
            </a>
            <a href="#" className="text-gray-600 font-bold text-sm hover:text-[#1A73E8] transition-colors">
              Transfer
            </a>
            <a href="#" className="text-gray-600 font-bold text-sm hover:text-[#1A73E8] transition-colors">
              Visa
            </a>
          </nav>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Language Selector */}
          <button className="flex items-center space-x-2 text-gray-700 font-semibold text-sm hover:text-[#1A73E8] transition-colors">
            <span className="text-base">🇺🇸</span>
            <span>ENG</span>
          </button>

          {/* Notification Bell */}
          <button className="text-gray-500 hover:text-[#1A73E8] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Itinerary Link */}
          <a href="#" className="text-gray-700 font-bold text-sm hover:text-[#1A73E8] transition-colors">
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
