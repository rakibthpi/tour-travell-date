"use client";

import React from "react";
import {DayPicker, type DayProps, type DateRange} from "react-day-picker";
import {format, startOfToday, isBefore} from "date-fns";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FareCalendarPickerProps {
  tripType: "one-way" | "round-trip" | "multi-city";
  departureDate: Date | null;
  returnDate: Date | null;
  onDateSelect: (val: any, selectedDay: Date) => void;
  onClose: () => void;
}

const getFare = (date: Date) => {
  if (!date) return {price: "", isLowest: false, isHigh: false};
  const day = date.getDate();
  const base = 4.5;
  const variance = (Math.sin(day) + 1) * 2;
  const price = (base + variance).toFixed(1);
  return {
    price: `${price}K`,
    isLowest: parseFloat(price) < 5.0,
    isHigh: parseFloat(price) > 7.0,
  };
};

function CustomDayButton(
  props: {
    day: any;
    modifiers: any;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const {day, modifiers, ...buttonProps} = props;
  const date = day.date;

  if (!date) return <button {...buttonProps} className={cn(buttonProps.className, "h-14 w-12")} disabled />;

  const fare = getFare(date);
  const isSelected = modifiers.selected;
  const isStart = modifiers.range_start;
  const isEnd = modifiers.range_end;
  const isMiddle = modifiers.range_middle;
  const isDisabled = modifiers.disabled;
  const isToday = modifiers.today;

  // Premium Highlight Logic
  const cellClasses = cn(
    "flex flex-col items-center justify-center w-full h-full relative z-10 transition-all rounded-xl",
    isStart || isEnd
      ? "bg-[#1A73E8] text-white shadow-lg"
      : isMiddle
        ? "bg-[rgba(26,115,232,0.15)] text-[#1A73E8] rounded-none"
        : isSelected && !isMiddle
          ? "bg-[#1A73E8] text-white shadow-lg"
          : "text-gray-900 hover:bg-gray-100",
    isDisabled && "opacity-20 grayscale cursor-not-allowed hover:bg-transparent",
  );

  return (
    <button {...buttonProps} className={cn(buttonProps.className, cellClasses)}>
      <span className={cn("text-xs font-black", isToday && !isSelected && "text-[#1A73E8] underline decoration-2")}>
        {date.getDate()}
      </span>
      {!isDisabled && (
        <span
          className={cn(
            "text-[9px] font-bold mt-0.5",
            isStart || isEnd || (isSelected && !isMiddle)
              ? "text-white/90"
              : fare.isLowest
                ? "text-green-600"
                : fare.isHigh
                  ? "text-red-400"
                  : "text-gray-400",
          )}
        >
          {fare.price}
        </span>
      )}
    </button>
  );
}

export default function FareCalendarPicker({
  tripType,
  departureDate,
  returnDate,
  onDateSelect,
  onClose,
}: FareCalendarPickerProps) {
  const mode = tripType === "round-trip" ? "range" : "single";

  // Exact DayPicker Binding:
  const selectedConfig =
    mode === "range" ? {from: departureDate || undefined, to: returnDate || undefined} : departureDate || undefined;

  return (
    <div className="bg-white rounded-3xl shadow-[0_24px_80px_-15px_rgba(26,115,232,0.2)] border border-[#e7e7e7] overflow-hidden w-[90vw] sm:w-max max-w-4xl max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-white">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#1A73E8] leading-tight tracking-tight">
            Select journey date
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs sm:text-sm font-bold text-gray-500">
              {mode === "single"
                ? departureDate
                  ? format(departureDate, "dd MMM'yy, EEEE")
                  : "Pick a date"
                : departureDate
                  ? format(departureDate, "dd MMM'yy, EEEE")
                  : "Departure date"}
            </span>
            {mode === "range" && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-300" />
                <span className="text-xs sm:text-sm font-bold text-gray-500">
                  {returnDate ? format(returnDate, "dd MMM'yy, EEEE") : "Return date"}
                </span>
              </>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>

      <div className="p-2 sm:p-4 overflow-auto custom-scrollbar">
        <DayPicker
          mode={mode as any}
          selected={selectedConfig as any}
          onDayClick={(day) => onDateSelect(day, day)}
          numberOfMonths={typeof window !== "undefined" && window.innerWidth <= 767 ? 1 : 2}
          pagedNavigation
          disabled={{before: startOfToday()}}
          components={{
            DayButton: CustomDayButton,
            Chevron: (props) =>
              props.orientation === "left" ? (
                <ChevronLeft className="w-5 h-5 text-[#1A73E8]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#1A73E8]" />
              ),
          }}
          classNames={{
            months: "flex flex-col md:flex-row gap-4 sm:gap-8 justify-center",
            month: "space-y-4",
            month_caption: "flex justify-center pt-2 relative items-center mb-4 sm:mb-6",
            caption_label: "text-base sm:text-lg font-black text-gray-900 tracking-tight",
            nav: "space-x-1 flex items-center",
            button_previous:
              "absolute left-2 h-9 w-9 bg-white p-0 opacity-70 hover:opacity-100 transition-all flex items-center justify-center border border-gray-200 rounded-xl z-20 shadow-sm",
            button_next:
              "absolute right-2 h-9 w-9 bg-white p-0 opacity-70 hover:opacity-100 transition-all flex items-center justify-center border border-gray-200 rounded-xl z-20 shadow-sm",
            month_grid: "w-full border-collapse",
            weekdays: "flex mb-2",
            weekday: "text-gray-400 rounded-md w-12 font-black text-[10px] uppercase tracking-[0.15em] text-center",
            week: "flex w-full",
            day: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-12 h-14 flex items-center justify-center cursor-pointer overflow-hidden",
              "aria-selected:bg-transparent",
            ),
            day_button: "h-full w-full",
            range_start: "day-range-start",
            range_end: "day-range-end",
            range_middle: "day-range-middle",
            today: "is-today",
            outside: "text-gray-300 opacity-30",
            disabled: "text-gray-300 opacity-30 cursor-not-allowed",
            hidden: "invisible",
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center flex-wrap gap-4 sm:space-x-8 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full shadow-sm" />
          <span>Lowest Fare</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-400 rounded-full shadow-sm" />
          <span>Regular Fare</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-400 rounded-full shadow-sm" />
          <span>High Demand</span>
        </div>
      </div>
    </div>
  );
}
