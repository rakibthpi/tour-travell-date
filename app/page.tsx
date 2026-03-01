import FlightSearchWidget from "@/components/flight/FlightSearchWidget";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col font-sans">
      <Header />

      <main className="flex-1 relative overlay-hero flex flex-col items-center justify-start pt-16 p-4">
        {/* Hero Background */}
        <div className="absolute inset-0 -z-10 bg-[#f4f7fa]">
          <Image src="/hero-bg.png" alt="Travel Background" fill className="object-cover brightness-95 z-10" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f4f7fa]/30 to-[#f4f7fa]" />
        </div>

        <div className="w-full max-w-7xl mx-auto space-y-12">
          <FlightSearchWidget />
        </div>
      </main>
    </div>
  );
}
