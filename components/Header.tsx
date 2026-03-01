import {Bell, ChevronDown} from "lucide-react";

export default function Header() {
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
        <div>
          <button className="flex items-center space-x-2 text-gray-700 font-semibold text-sm hover:text-[#1A73E8] transition-colors">
            <span className="text-base">
              <img src="./usa.png" alt="photos" />
            </span>
            <span>English</span>
            <ChevronDown className="w-5 h-5" />
          </button>
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
