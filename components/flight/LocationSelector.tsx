import React from "react";
import {ArrowRightLeft, Search, MapPin} from "lucide-react";
import {motion} from "framer-motion";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {FlightSegment, Airport} from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LocationSelectorProps {
  segment: FlightSegment;
  index: number;
  setActiveSegmentIndex: (idx: number) => void;
  setOpenPopup: (popup: string | null) => void;
  handleSwap: (idx: number) => void;
}

function SwapButton({onSwap}: {onSwap: (e: React.MouseEvent) => void}) {
  return (
    <motion.button
      whileHover={{scale: 1.1}}
      whileTap={{scale: 0.9, rotate: 180}}
      onClick={onSwap}
      className="absolute -right-[26px] top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:border-[#1A73E8] transition-colors text-[#1A73E8]"
    >
      <ArrowRightLeft className="w-4 h-4" />
    </motion.button>
  );
}

function FromInput({
  segment,
  onClick,
  onSwap,
}: {
  segment: FlightSegment;
  onClick: () => void;
  onSwap: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 rounded-lg px-3 sm:px-3.5 py-4 lg:py-2.5 cursor-pointer border border-transparent hover:border-[#1A73E8] bg-white transition-colors relative"
    >
      <div className="flex items-baseline space-x-1 overflow-hidden">
        <h3 className="text-base sm:text-lg lg:text-base font-bold truncate">{segment.from?.city || "Departure"}</h3>
        {segment.from && (
          <span className="text-xs sm:text-sm font-light text-text-muted shrink-0 uppercase">{segment.from.code}</span>
        )}
      </div>
      <p className="text-xs sm:text-sm lg:text-xs text-text-muted truncate font-light mt-0.5">
        {segment.from?.airport || "Select city/airport"}
      </p>

      <SwapButton onSwap={onSwap} />
    </div>
  );
}

function ToInput({segment, onClick}: {segment: FlightSegment; onClick: () => void}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 rounded-lg px-3 sm:px-3.5 py-4 lg:py-2.5 cursor-pointer border border-transparent hover:border-[#1A73E8] bg-white transition-colors"
    >
      <div className="flex items-baseline space-x-1 overflow-hidden">
        <h3 className="text-base sm:text-lg lg:text-base font-bold truncate">{segment.to?.city || "Arrival"}</h3>
        {segment.to && (
          <span className="text-xs sm:text-sm font-light text-text-muted shrink-0 uppercase">{segment.to.code}</span>
        )}
      </div>
      <p className="text-xs sm:text-sm lg:text-xs text-text-muted truncate font-light mt-0.5">
        {segment.to?.airport || "Select city/airport"}
      </p>
    </div>
  );
}

export default function LocationSelector({
  segment,
  index,
  setActiveSegmentIndex,
  setOpenPopup,
  handleSwap,
}: LocationSelectorProps) {
  return (
    <>
      <FromInput
        segment={segment}
        onClick={() => {
          setActiveSegmentIndex(index);
          setOpenPopup("fromSearch");
        }}
        onSwap={(e: React.MouseEvent) => {
          e.stopPropagation();
          handleSwap(index);
        }}
      />
      <ToInput
        segment={segment}
        onClick={() => {
          setActiveSegmentIndex(index);
          setOpenPopup("toSearch");
        }}
      />
    </>
  );
}

export function LocationPopup({openPopup, searchQuery, setSearchQuery, filteredAirports, handleAirportSelect}: any) {
  if (openPopup !== "fromSearch" && openPopup !== "toSearch") return null;
  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95, y: -20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      exit={{opacity: 0, scale: 0.95, y: -20}}
      className={cn(
        "absolute z-[100] bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] border border-border-light rounded-2xl p-0 w-[90vw] sm:w-[400px] overflow-hidden top-[160px] left-1/2 -translate-x-1/2",
        "sm:translate-x-0 sm:left-auto",
        openPopup === "fromSearch" ? "sm:left-8" : "sm:left-[20%]",
      )}
    >
      <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-100 flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          autoFocus
          type="text"
          placeholder="Type city or airport..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-bold text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
        />
      </div>
      <div className="max-h-[300px] overflow-auto custom-scrollbar">
        {filteredAirports.length > 0 ? (
          filteredAirports.map((airport: Airport) => (
            <div
              key={airport.code}
              onClick={() => handleAirportSelect(airport)}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-black text-base sm:text-lg text-gray-800 leading-tight">
                    {airport.city}, {airport.country}
                  </p>
                  <p className="text-[10px] sm:text-xs text-text-muted font-bold mt-1 line-clamp-1">
                    {airport.airport}
                  </p>
                </div>
              </div>
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-black text-primary uppercase">
                {airport.code}
              </span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-text-muted font-bold italic">No results found for "{searchQuery}"</div>
        )}
      </div>
    </motion.div>
  );
}
