import React from "react";
import {format} from "date-fns";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {motion} from "framer-motion";
import FareCalendarPicker from "../FareCalendarPicker";
import {TripType} from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DateSelectorProps {
  index: number;
  tripType: TripType;
  setTripType: (type: TripType) => void;
  departureDate: Date | null;
  returnDate: Date | null;
  setActiveSegmentIndex: (idx: number) => void;
  setOpenPopup: (popup: string | null) => void;
}

function DepartureField({departureDate, onClick}: {departureDate: Date | null; onClick: () => void}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 rounded-lg px-3.5 py-4 lg:py-2.5 cursor-pointer border border-transparent hover:border-[#1A73E8] bg-white transition-colors"
    >
      <h3 className="text-base sm:text-lg lg:text-base font-bold text-nowrap">
        {departureDate ? format(departureDate, "dd MMM''yy") : "Departure Date"}
      </h3>
      <p className="text-xs sm:text-sm lg:text-xs text-text-muted font-light mt-0.5">
        {departureDate ? format(departureDate, "EEEE") : "Please select date"}
      </p>
    </div>
  );
}

function ReturnField({
  tripType,
  returnDate,
  onClick,
}: {
  tripType: TripType;
  returnDate: Date | null;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3.5 py-4 lg:py-2.5 transition-colors relative border border-transparent",
        tripType === "one-way"
          ? "bg-gray-50/50 cursor-not-allowed border-gray-100"
          : "cursor-pointer hover:border-[#1A73E8] bg-white",
      )}
    >
      {tripType === "one-way" ? (
        <p className="text-[11px] lg:text-[10px] text-text-muted font-medium mt-1 leading-tight">
          Save more with
          <br />
          round trip
        </p>
      ) : (
        <>
          <h3 className="text-base sm:text-lg lg:text-base font-bold text-nowrap">
            {returnDate ? format(returnDate, "dd MMM''yy") : "Arrival Date"}
          </h3>
          <p className="text-xs sm:text-sm lg:text-xs text-text-muted font-light mt-0.5">
            {returnDate ? format(returnDate, "EEEE") : "Please select date"}
          </p>
        </>
      )}
    </div>
  );
}

export default function DateSelector({
  index,
  tripType,
  setTripType,
  departureDate,
  returnDate,
  setActiveSegmentIndex,
  setOpenPopup,
}: DateSelectorProps) {
  return (
    <>
      <DepartureField
        departureDate={departureDate}
        onClick={() => {
          setActiveSegmentIndex(index);
          setOpenPopup("calendar");
        }}
      />
      {index === 0 && (
        <ReturnField
          tripType={tripType}
          returnDate={returnDate}
          onClick={() => {
            setOpenPopup("calendar");
          }}
        />
      )}
    </>
  );
}

export function CalendarPopup({
  openPopup,
  setOpenPopup,
  tripType,
  departureDate,
  returnDate,
  handleDateSelect,
  activeSegmentIndex,
}: any) {
  if (openPopup !== "calendar") return null;

  const isRangeMode = activeSegmentIndex === 0 && tripType !== "multi-city";

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95, y: 20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      exit={{opacity: 0, scale: 0.95, y: 20}}
      className="absolute z-100 top-[140px] sm:top-[160px] left-1/2 -translate-x-1/2 lg:left-[40%] lg:translate-x-0 w-max"
    >
      <FareCalendarPicker
        tripType={tripType}
        departureDate={departureDate}
        returnDate={returnDate}
        onDateSelect={handleDateSelect}
        onClose={() => setOpenPopup(null)}
        isRange={isRangeMode}
      />
    </motion.div>
  );
}
