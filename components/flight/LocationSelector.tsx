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
      className="flex-[2] rounded-lg px-3.5 py-2.5 cursor-pointer hover:border-[#1A73E8] bg-white transition-colors relative"
    >
      <div className="flex items-baseline space-x-1 overflow-hidden">
        <h3 className="text-base font-bold truncate">{segment.from?.city || "Departure City"}</h3>
        {segment.from && (
          <span className="text-sm font-light text-text-muted shrink-0 uppercase">{segment.from.code}</span>
        )}
      </div>
      <p className="text-sm text-text-muted truncate font-light mt-0.5">
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
      className="flex-[2] rounded-lg px-3.5 py-2.5 cursor-pointer hover:border-[#1A73E8] bg-white transition-colors ml-2"
    >
      <div className="flex items-baseline space-x-1 overflow-hidden">
        <h3 className="text-base font-bold truncate">{segment.to?.city || "Arrival City"}</h3>
        {segment.to && <span className="text-sm font-light text-text-muted shrink-0 uppercase">{segment.to.code}</span>}
      </div>
      <p className="text-sm text-text-muted truncate font-light mt-0.5">
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
        "absolute z-[100] bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] border border-border-light rounded-2xl p-0 w-[400px] overflow-hidden top-[160px]",
        openPopup === "fromSearch" ? "left-8" : "left-[20%]",
      )}
    >
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          autoFocus
          type="text"
          placeholder="Type city or airport..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none w-full font-bold text-gray-700 placeholder:text-gray-400"
        />
      </div>
      <div className="max-h-[300px] overflow-auto custom-scrollbar">
        {filteredAirports.length > 0 ? (
          filteredAirports.map((airport: Airport) => (
            <div
              key={airport.code}
              onClick={() => handleAirportSelect(airport)}
              className="flex items-center justify-between p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-black text-lg text-gray-800 leading-tight">
                    {airport.city}, {airport.country}
                  </p>
                  <p className="text-xs text-text-muted font-bold mt-1 line-clamp-1">{airport.airport}</p>
                </div>
              </div>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-black text-primary uppercase">
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
