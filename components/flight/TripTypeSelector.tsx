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
    <div className="flex items-center space-x-8 mb-8">
      {(["one-way", "round-trip", "multi-city"] as TripType[]).map((type) => (
        <label key={type} className="flex items-center space-x-3 cursor-pointer group">
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
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              tripType === type ? "border-primary" : "border-gray-300 group-hover:border-primary",
            )}
          >
            {tripType === type && <div className="w-3 h-3 rounded-full bg-primary" />}
          </div>
          <span
            className={cn(
              "text-base font-medium capitalize",
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
