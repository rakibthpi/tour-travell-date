"use client";

import React, {useState, useRef, useEffect, useMemo} from "react";
import {Plus, X} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {addDays, isBefore, startOfToday} from "date-fns";

// Imports from subcomponents
import ServiceTabs from "./ServiceTabs";
import TripTypeSelector from "./TripTypeSelector";
import LocationSelector, {LocationPopup} from "./LocationSelector";
import DateSelector, {CalendarPopup} from "./DateSelector";
import PassengerSelector, {PassengerPopup} from "./PassengerSelector";
import SearchButton from "./SearchButton";

import {TabType, TripType, FlightSegment, CabinClass, Airport, MOCK_AIRPORTS} from "./types";

export default function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("one-way");

  const [segments, setSegments] = useState<FlightSegment[]>([
    {
      id: "1",
      from: null,
      to: null,
      date: null,
    },
  ]);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const [passengers, setPassengers] = useState({adults: 1, children: 0, infants: 0});
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");

  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

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
        setDepartureDate(selectedDay);
        setReturnDate(null);

        const newSegments = [...segments];
        newSegments[0].date = selectedDay;
        setSegments(newSegments);
      } else {
        if (selectedDay > departureDate) {
          setReturnDate(selectedDay);
          setOpenPopup(null);
        } else {
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

  const isSearchDisabled =
    segments.some((s) => !s.from || !s.to || !s.date) || (tripType === "round-trip" && !returnDate);

  const handleSearch = () => {
    if (isSearchDisabled) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans relative" ref={containerRef}>
      <ServiceTabs />

      <div className="bg-white/70 rounded-lg shadow-md p-8 relative border border-border-light">
        <TripTypeSelector
          tripType={tripType}
          setTripType={setTripType}
          segments={segments}
          setSegments={setSegments}
          addSegment={addSegment}
        />

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

        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={segment.id} className="relative w-full">
              <div className="flex items-center gap-3 w-full">
                <LocationSelector
                  segment={segment}
                  index={index}
                  setActiveSegmentIndex={setActiveSegmentIndex}
                  setOpenPopup={setOpenPopup}
                  handleSwap={handleSwap}
                />

                <DateSelector
                  index={index}
                  tripType={tripType}
                  setTripType={setTripType}
                  departureDate={departureDate}
                  returnDate={returnDate}
                  setActiveSegmentIndex={setActiveSegmentIndex}
                  setOpenPopup={setOpenPopup}
                />

                {index === 0 && (
                  <PassengerSelector
                    totalTravelers={totalTravelers}
                    cabinClass={cabinClass}
                    setOpenPopup={setOpenPopup}
                  />
                )}

                {index === 0 && (
                  <SearchButton isLoading={isLoading} isSearchDisabled={isSearchDisabled} handleSearch={handleSearch} />
                )}

                {tripType === "multi-city" && index > 0 && (
                  <button
                    onClick={() => removeSegment(index)}
                    className="ml-4 bg-white border border-gray-200 text-red-500 rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
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

        <AnimatePresence>
          {(openPopup === "fromSearch" || openPopup === "toSearch") && (
            <LocationPopup
              key="location-popup"
              openPopup={openPopup}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredAirports={filteredAirports}
              handleAirportSelect={handleAirportSelect}
            />
          )}
          {openPopup === "calendar" && (
            <CalendarPopup
              key="calendar-popup"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              tripType={tripType}
              departureDate={departureDate}
              returnDate={returnDate}
              handleDateSelect={handleDateSelect}
            />
          )}
          {openPopup === "passengers" && (
            <PassengerPopup
              key="passenger-popup"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              passengers={passengers}
              setPassengers={setPassengers}
              cabinClass={cabinClass}
              setCabinClass={setCabinClass}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
