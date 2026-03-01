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
      className="flex-[1.5] rounded-lg px-3.5 py-2.5 cursor-pointer hover:border-[#1A73E8] bg-white transition-colors"
    >
      <h3 className="text-base font-bold text-nowrap">
        {departureDate ? format(departureDate, "dd MMM''yy") : "Select"}
      </h3>
      <p className="text-sm text-text-muted font-light mt-0.5">
        {departureDate ? format(departureDate, "EEEE") : "Date"}
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
        "flex-[1.5] rounded-lg px-3.5 py-2.5 transition-colors relative",
        tripType === "one-way"
          ? "bg-gray-50/50 cursor-not-allowed border-gray-100"
          : "cursor-pointer hover:border-[#1A73E8] bg-white",
      )}
    >
      {tripType === "one-way" ? (
        <p className="text-[11px] text-text-muted font-medium mt-1 leading-tight">
          Save more with
          <br />
          round trip
        </p>
      ) : (
        <>
          <h3 className="text-base font-bold text-nowrap">
            {returnDate ? format(returnDate, "dd MMM''yy") : "Select"}
          </h3>
          <p className="text-sm text-text-muted font-light mt-0.5">{returnDate ? format(returnDate, "EEEE") : "--"}</p>
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
            if (tripType === "one-way") {
              setTripType("round-trip");
            }
            setOpenPopup("calendar");
          }}
        />
      )}
    </>
  );
}

export function CalendarPopup({openPopup, setOpenPopup, tripType, departureDate, returnDate, handleDateSelect}: any) {
  if (openPopup !== "calendar") return null;

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95, y: 20}}
      animate={{opacity: 1, scale: 1, y: 0}}
      exit={{opacity: 0, scale: 0.95, y: 20}}
      className="absolute z-[100] top-[120px] left-[40%]"
    >
      <FareCalendarPicker
        tripType={tripType}
        departureDate={departureDate}
        returnDate={returnDate}
        onDateSelect={handleDateSelect}
        onClose={() => setOpenPopup(null)}
      />
    </motion.div>
  );
}
