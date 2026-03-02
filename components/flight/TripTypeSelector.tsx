import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {FlightSegment, TripType} from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TripTypeSelectorProps {
  tripType: TripType;
  setTripType: (type: TripType) => void;
  segments: FlightSegment[];
  setSegments: (segments: FlightSegment[]) => void;
  addSegment: () => void;
}

export default function TripTypeSelector({
  tripType,
  setTripType,
  segments,
  setSegments,
  addSegment,
}: TripTypeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-3 sm:gap-y-4 sm:gap-x-6 lg:gap-8 mb-8">
      {(["one-way", "round-trip", "multi-city"] as TripType[]).map((type) => (
        <label key={type} className="flex items-center space-x-1.5 md:space-x-3 cursor-pointer group">
          <input
            type="radio"
            name="trip-type"
            checked={tripType === type}
            onChange={() => {
              setTripType(type);
              if (type === "multi-city" && segments.length === 1) addSegment();
              if (type !== "multi-city" && segments.length > 1) setSegments([segments[0]]);
            }}
            className="hidden"
          />
          <div
            className={cn(
              "w-4 h-4 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all",
              tripType === type ? "border-primary" : "border-gray-300 group-hover:border-primary",
            )}
          >
            {tripType === type && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary" />}
          </div>
          <span
            className={cn(
              "text-xs sm:text-base font-medium capitalize",
              tripType === type ? "text-primary font-bold" : "text-text-muted",
            )}
          >
            {type.replace("-", " ")}
          </span>
        </label>
      ))}
    </div>
  );
}
