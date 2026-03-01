import React from "react";
import {Loader2, Search} from "lucide-react";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {motion} from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchButtonProps {
  isLoading: boolean;
  isSearchDisabled: boolean;
  handleSearch: () => void;
}

export default function SearchButton({isLoading, isSearchDisabled, handleSearch}: SearchButtonProps) {
  return (
    <motion.button
      whileHover={!isSearchDisabled ? {scale: 1.02} : {}}
      whileTap={!isSearchDisabled ? {scale: 0.98} : {}}
      onClick={handleSearch}
      disabled={isLoading || isSearchDisabled}
      className={cn(
        "h-[70px] px-7 rounded-xl flex items-center justify-center transition-all shrink-0 ml-2",
        isSearchDisabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#1A73E8] text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
      )}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
    </motion.button>
  );
}
