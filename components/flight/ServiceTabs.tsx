import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {tabIcons} from "./DataImg";

const tabs = [
  {label: "Flight", icon: tabIcons.flight},
  {label: "Hotel", icon: tabIcons.hotel},
  {label: "Activities", icon: tabIcons.activities},
  {label: "Transfer", icon: tabIcons.transfer},
  {label: "Visa", icon: tabIcons.visa},
];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ServiceTabs() {
  return (
    <div className="flex items-center gap-2 md:gap-3 mb-4 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={cn(
            "px-4 md:px-7 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 whitespace-nowrap",
            tab.label === "Flight"
              ? "bg-[#1A73E8] text-white shadow-md shadow-blue-500/20"
              : "bg-white/70 text-gray-600 hover:bg-gray-200",
          )}
        >
          <img className="w-5 h-5 md:w-7 md:h-7" src={tab.icon} alt={tab.label} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
