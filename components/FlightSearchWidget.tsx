"use client";

import React, {useState, useRef, useEffect, useMemo} from "react";
import {
  Plane,
  Hotel,
  Map,
  CreditCard,
  ArrowRightLeft,
  ChevronDown,
  Plus,
  Minus,
  X,
  Calendar as CalendarIcon,
  Loader2,
  User,
  Search,
  MapPin,
} from "lucide-react";
import {format, addDays, isBefore, startOfToday} from "date-fns";
import {motion, AnimatePresence} from "framer-motion";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import FareCalendarPicker from "./FareCalendarPicker";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TripType = "one-way" | "round-trip" | "multi-city";
type TabType = "Flight" | "Hotel" | "Tour" | "Visa";
type CabinClass = "Economy" | "Business" | "First";

interface Airport {
  city: string;
  code: string;
  airport: string;
  country: string;
}

interface FlightSegment {
  id: string;
  from: Airport | null;
  to: Airport | null;
  date: Date | null;
}

const MOCK_AIRPORTS: Airport[] = [
  {city: "Dhaka", code: "DAC", airport: "Hazrat Shahjalal Intl Airport", country: "Bangladesh"},
  {city: "Chittagong", code: "CGP", airport: "Shah Amanat Intl", country: "Bangladesh"},
  {city: "Sylhet", code: "ZYL", airport: "Osmani Intl Airport", country: "Bangladesh"},
  {city: "Cox's Bazar", code: "CXB", airport: "Cox's Bazar Airport", country: "Bangladesh"},
  {city: "Dubai", code: "DXB", airport: "Dubai International Airport", country: "UAE"},
  {city: "London", code: "LHR", airport: "Heathrow Airport", country: "United Kingdom"},
  {city: "Singapore", code: "SIN", airport: "Changi Airport", country: "Singapore"},
  {city: "New York", code: "JFK", airport: "John F. Kennedy Intl Airport", country: "USA"},
  {city: "Bangkok", code: "BKK", airport: "Suvarnabhumi Airport", country: "Thailand"},
  {city: "Kolkata", code: "CCU", airport: "Netaji Subhash Chandra Bose Intl", country: "India"},
];

export default function FlightSearchWidget() {
  const [activeTab, setActiveTab] = useState<TabType>("Flight");
  const [tripType, setTripType] = useState<TripType>("one-way");

  // Requirement 4: State Management
  const [segments, setSegments] = useState<FlightSegment[]>([
    {
      id: "1",
      from: MOCK_AIRPORTS[0],
      to: MOCK_AIRPORTS[1],
      date: addDays(new Date(), 3),
    },
  ]);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  // Passenger State
  const [passengers, setPassengers] = useState({adults: 1, children: 0, infants: 0});
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");

  // UI State
  const [openPopup, setOpenPopup] = useState<"calendar" | "passengers" | "fromSearch" | "toSearch" | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Requirement 5: Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenPopup(null);
        setErrorStatus(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Requirement 5: Swap button logic
  const handleSwap = (index: number) => {
    const newSegments = [...segments];
    const segment = newSegments[index];
    const temp = segment.from;
    segment.from = segment.to;
    segment.to = temp;
    setSegments(newSegments);
    setErrorStatus(null);
  };

  const addSegment = () => {
    const lastSegment = segments[segments.length - 1];
    const newSegment: FlightSegment = {
      id: Math.random().toString(36).substr(2, 9),
      from: lastSegment.to,
      to: null,
      date: null,
    };
    setSegments([...segments, newSegment]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  // Requirement 1 & 2: Airport Filtering
  const filteredAirports = useMemo(() => {
    if (!searchQuery) return MOCK_AIRPORTS;
    return MOCK_AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.airport.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleAirportSelect = (airport: Airport) => {
    const isFrom = openPopup === "fromSearch";
    const segment = segments[activeSegmentIndex];

    // Requirement 2: Prevent selecting same airport
    if (isFrom) {
      if (segment.to?.code === airport.code) {
        setErrorStatus("Departure and arrival cannot be the same");
        return;
      }
    } else {
      if (segment.from?.code === airport.code) {
        setErrorStatus("Arrival and departure cannot be the same");
        return;
      }
    }

    const newSegments = [...segments];
    if (isFrom) {
      newSegments[activeSegmentIndex].from = airport;
    } else {
      newSegments[activeSegmentIndex].to = airport;
    }
    setSegments(newSegments);
    setOpenPopup(null);
    setSearchQuery("");
    setErrorStatus(null);
  };

  const handleDateSelect = (val: any, selectedDay: Date) => {
    if (!selectedDay) return;

    if (tripType === "one-way" || tripType === "multi-city") {
      setDepartureDate(selectedDay);
      setReturnDate(null);

      const newSegments = [...segments];
      newSegments[activeSegmentIndex].date = selectedDay;
      setSegments(newSegments);

      setOpenPopup(null);
    } else if (tripType === "round-trip") {
      if (!departureDate || (departureDate && returnDate)) {
        // FIRST CLICK or THIRD CLICK (Restart)
        setDepartureDate(selectedDay);
        setReturnDate(null);

        const newSegments = [...segments];
        newSegments[0].date = selectedDay;
        setSegments(newSegments);
      } else {
        // SECOND CLICK
        if (selectedDay > departureDate) {
          setReturnDate(selectedDay);
          setOpenPopup(null);
        } else {
          // Reset if earlier than departure
          setDepartureDate(selectedDay);
          setReturnDate(null);

          const newSegments = [...segments];
          newSegments[0].date = selectedDay;
          setSegments(newSegments);
        }
      }
    }
  };

  const totalTravelers = passengers.adults + passengers.children + passengers.infants;

  // Requirement 5: Disable search button if required empty
  const isSearchDisabled =
    segments.some((s) => !s.from || !s.to || !s.date) || (tripType === "round-trip" && !returnDate);

  const handleSearch = () => {
    if (isSearchDisabled) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans relative" ref={containerRef}>
      {/* Top Tab Navigation */}
      <div className="flex items-center space-x-10 mb-6 px-4">
        {["Flight", "Hotel", "Tour", "Visa"].map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label as TabType)}
            className={cn(
              "flex items-center space-x-2 pb-3 text-lg font-semibold transition-all relative border-b-2",
              activeTab === label
                ? "text-primary border-primary"
                : "text-text-muted border-transparent hover:text-primary",
            )}
          >
            {label === "Flight" && <Plane className="w-5 h-5" />}
            {label === "Hotel" && <Hotel className="w-5 h-5" />}
            {label === "Tour" && <Map className="w-5 h-5" />}
            {label === "Visa" && <CreditCard className="w-5 h-5" />}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[24px] shadow-md p-8 relative border border-border-light">
        {/* Trip Type Selector */}
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

        {/* Error Alert */}
        <AnimatePresence>
          {errorStatus && (
            <motion.div
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold z-[60] border border-red-100 shadow-sm"
            >
              {errorStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Flight Segments */}
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={segment.id} className="relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-border-light rounded-2xl overflow-visible shadow-sm">
                {/* Requirement 1: FROM Field */}
                <div
                  onClick={() => {
                    setActiveSegmentIndex(index);
                    setOpenPopup("fromSearch");
                  }}
                  className="md:col-span-3 p-5 border-b md:border-b-0 md:border-r border-border-light relative group cursor-pointer hover:bg-blue-50/30 transition-colors rounded-l-2xl"
                >
                  <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">From</p>
                  <div className="flex items-baseline space-x-1 overflow-hidden">
                    <h3 className="text-2xl font-black truncate">{segment.from?.city || "Select City"}</h3>
                    {segment.from && (
                      <span className="text-sm font-bold text-text-muted shrink-0 uppercase">{segment.from.code}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate font-medium mt-1">
                    {segment.from?.airport || "Type to search airport"}
                  </p>

                  <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9, rotate: 180}}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwap(index);
                    }}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white border border-border-light p-2 rounded-xl shadow-lg hover:border-primary transition-colors text-primary"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Requirement 2: TO Field */}
                <div
                  onClick={() => {
                    setActiveSegmentIndex(index);
                    setOpenPopup("toSearch");
                  }}
                  className="md:col-span-3 p-5 border-b md:border-b-0 md:border-r border-border-light cursor-pointer hover:bg-blue-50/30 transition-colors pl-8"
                >
                  <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">To</p>
                  <div className="flex items-baseline space-x-1 overflow-hidden">
                    <h3 className="text-2xl font-black truncate">{segment.to?.city || "Select City"}</h3>
                    {segment.to && (
                      <span className="text-sm font-bold text-text-muted shrink-0 uppercase">{segment.to.code}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate font-medium mt-1">
                    {segment.to?.airport || "Type to search airport"}
                  </p>
                </div>

                {/* Requirement 3: DATE SELECTION (Departure) */}
                <div
                  onClick={() => {
                    setActiveSegmentIndex(index);
                    setOpenPopup("calendar");
                  }}
                  className="md:col-span-2 p-5 border-b md:border-b-0 md:border-r border-border-light cursor-pointer hover:bg-blue-50/30 transition-colors"
                >
                  <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Departure</p>
                  <h3 className="text-xl font-bold text-nowrap">
                    {departureDate ? format(departureDate, "dd MMM''yy") : "Select"}
                  </h3>
                  <p className="text-xs text-text-muted font-semibold mt-1">
                    {departureDate ? format(departureDate, "EEEE") : "Date"}
                  </p>
                </div>

                {/* Requirement 3: DATE SELECTION (Return) */}
                {index === 0 && (
                  <div
                    onClick={() => {
                      if (tripType === "round-trip") {
                        setOpenPopup("calendar");
                      }
                    }}
                    className={cn(
                      "md:col-span-2 p-5 border-b md:border-b-0 md:border-r border-border-light cursor-pointer transition-colors relative",
                      tripType === "one-way" ? "bg-gray-50/50 opacity-60 cursor-not-allowed" : "hover:bg-blue-50/30",
                    )}
                  >
                    <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Return</p>
                    {tripType === "one-way" ? (
                      <p className="text-[11px] text-text-muted font-medium mt-2 leading-tight">
                        Save more with round trip
                      </p>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-nowrap">
                          {returnDate ? format(returnDate, "dd MMM''yy") : "Select"}
                        </h3>
                        <p className="text-xs text-text-muted font-semibold mt-1">
                          {returnDate ? format(returnDate, "EEEE") : "--"}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {index === 0 && (
                  <div
                    onClick={() => setOpenPopup("passengers")}
                    className="md:col-span-2 p-5 cursor-pointer hover:bg-blue-50/30 transition-colors rounded-r-2xl"
                  >
                    <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">
                      Traveler & Class
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="overflow-hidden">
                        <h3 className="text-xl font-bold truncate">
                          {totalTravelers} {totalTravelers > 1 ? "Travelers" : "Traveler"}
                        </h3>
                        <p className="text-xs text-text-muted font-semibold mt-1 truncate">{cabinClass}</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    </div>
                  </div>
                )}

                {tripType === "multi-city" && index > 0 && (
                  <button
                    onClick={() => removeSegment(index)}
                    className="absolute -right-3 -top-3 bg-white border border-border-light text-red-500 rounded-full p-1 shadow-md hover:bg-red-50 transition-colors z-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {tripType === "multi-city" && segments.length < 4 && (
          <div className="mt-6">
            <button
              onClick={addSegment}
              className="flex items-center space-x-2 text-primary font-bold text-sm uppercase px-4 py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Flight</span>
            </button>
          </div>
        )}

        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-10">
          <motion.button
            whileHover={!isSearchDisabled ? {scale: 1.05, filter: "brightness(1.05)"} : {}}
            whileTap={!isSearchDisabled ? {scale: 0.95} : {}}
            onClick={handleSearch}
            disabled={isLoading || isSearchDisabled}
            className={cn(
              "font-black px-16 py-4 rounded-[14px] shadow-xl text-xl uppercase tracking-widest flex items-center space-x-3 transition-all",
              isSearchDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-accent text-[#1a1a1a]",
            )}
          >
            {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
            <span>{isLoading ? "Searching..." : "Search Flights"}</span>
          </motion.button>
        </div>

        {/* Popups */}
        <AnimatePresence>
          {/* Requirement 1 & 2: Airport Search Popup */}
          {(openPopup === "fromSearch" || openPopup === "toSearch") && (
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: -20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: -20}}
              className={cn(
                "absolute z-[100] bg-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] border border-border-light rounded-2xl p-0 w-[400px] overflow-hidden top-[120px]",
                openPopup === "fromSearch" ? "left-8" : "left-[30%]",
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
                  filteredAirports.map((airport) => (
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
                  <div className="p-8 text-center text-text-muted font-bold italic">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {openPopup === "calendar" && (
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 20}}
              className="absolute z-[100] top-full mt-4 left-1/2 -translate-x-1/2"
            >
              <FareCalendarPicker
                tripType={tripType}
                departureDate={departureDate}
                returnDate={returnDate}
                onDateSelect={handleDateSelect}
                onClose={() => setOpenPopup(null)}
              />
            </motion.div>
          )}

          {openPopup === "passengers" && (
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: -20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: -20}}
              className="absolute right-8 top-full mt-2 z-50 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-border-light rounded-3xl p-8 w-[360px]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">Adults</p>
                    <p className="text-xs text-text-muted font-medium">12+ years</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setPassengers((p) => ({...p, adults: Math.max(1, p.adults - 1)}))}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-text-muted" />
                    </button>
                    <span className="text-xl font-bold w-4 text-center">{passengers.adults}</span>
                    <button
                      onClick={() => setPassengers((p) => ({...p, adults: Math.min(9, p.adults + 1)}))}
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
                      onClick={() => setPassengers((p) => ({...p, children: Math.max(0, p.children - 1)}))}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-text-muted" />
                    </button>
                    <span className="text-xl font-bold w-4 text-center">{passengers.children}</span>
                    <button
                      onClick={() => setPassengers((p) => ({...p, children: Math.min(9, p.children + 1)}))}
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
                      onClick={() => setPassengers((p) => ({...p, infants: Math.max(0, p.infants - 1)}))}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-text-muted" />
                    </button>
                    <span className="text-xl font-bold w-4 text-center">{passengers.infants}</span>
                    <button
                      onClick={() =>
                        setPassengers((p) => ({...p, infants: Math.min(passengers.adults, p.infants + 1)}))
                      }
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
