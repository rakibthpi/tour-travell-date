import React from "react";
import {ChevronDown, Plus, Minus} from "lucide-react";
import {motion} from "framer-motion";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {CabinClass} from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PassengerSelectorProps {
  totalTravelers: number;
  cabinClass: CabinClass;
  setOpenPopup: (popup: string | null) => void;
}

export default function PassengerSelector({totalTravelers, cabinClass, setOpenPopup}: PassengerSelectorProps) {
  return (
    <div
      onClick={() => setOpenPopup("passengers")}
      className="flex-[2] rounded-lg px-3.5 py-2.5 cursor-pointer hover:border-[#1A73E8] bg-white transition-colors"
    >
      <div className="flex items-center justify-between mt-1">
        <div className="overflow-hidden">
          <h3 className="text-xl font-bold truncate tracking-tight">
            {totalTravelers} {totalTravelers > 1 ? "Travelers" : "Traveler"}
          </h3>
          <p className="text-[11px] text-text-muted font-semibold mt-0.5 truncate">{cabinClass}</p>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </div>
  );
}

export function PassengerPopup({openPopup, setOpenPopup, passengers, setPassengers, cabinClass, setCabinClass}: any) {
  if (openPopup !== "passengers") return null;

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95, y: -20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      exit={{opacity: 0, scale: 0.95, y: -20}}
      className="absolute right-8 top-[120px] z-[100] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-border-light rounded-3xl p-8 w-[360px]"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Adults</p>
            <p className="text-xs text-text-muted font-medium">12+ years</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPassengers((p: any) => ({...p, adults: Math.max(1, p.adults - 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-5 h-5 text-text-muted" />
            </button>
            <span className="text-xl font-bold w-4 text-center">{passengers.adults}</span>
            <button
              onClick={() => setPassengers((p: any) => ({...p, adults: Math.min(9, p.adults + 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Children</p>
            <p className="text-xs text-text-muted font-medium">2-12 years</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPassengers((p: any) => ({...p, children: Math.max(0, p.children - 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-5 h-5 text-text-muted" />
            </button>
            <span className="text-xl font-bold w-4 text-center">{passengers.children}</span>
            <button
              onClick={() => setPassengers((p: any) => ({...p, children: Math.min(9, p.children + 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Infants</p>
            <p className="text-xs text-text-muted font-medium">Below 2 years</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPassengers((p: any) => ({...p, infants: Math.max(0, p.infants - 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-5 h-5 text-text-muted" />
            </button>
            <span className="text-xl font-bold w-4 text-center">{passengers.infants}</span>
            <button
              onClick={() => setPassengers((p: any) => ({...p, infants: Math.min(passengers.adults, p.infants + 1)}))}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-4">
          <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Cabin Class</p>
          <div className="grid grid-cols-1 gap-2">
            {["Economy", "Business", "First"].map((type) => (
              <button
                key={type}
                onClick={() => setCabinClass(type as CabinClass)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl font-bold transition-all border",
                  cabinClass === type
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-100 text-text-dark hover:border-primary/30",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setOpenPopup(null)}
          className="w-full bg-[#f4f7fa] py-4 rounded-xl font-black text-primary text-sm uppercase tracking-widest hover:bg-blue-100 transition-all mt-4"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}
