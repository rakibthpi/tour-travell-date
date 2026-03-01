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
    <div className="flex items-center space-x-3 mb-2">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={cn(
            "px-7 py-3 rounded-lg text-base font-bold transition-all shadow-sm flex items-center gap-2",
            tab.label === "Flight"
              ? "bg-[#1A73E8] text-white shadow-md shadow-blue-500/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          <img className="w-7 h-7" src={tab.icon} alt={tab.label} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
