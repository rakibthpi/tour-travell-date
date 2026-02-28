import FlightSearchWidget from "@/components/FlightSearchWidget";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10 bg-[#f4f7fa]">
        <Image
          src="/hero-bg.png"
          alt="Travel Background"
          fill
          className="object-cover brightness-95 opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f4f7fa]/30 to-[#f4f7fa]" />
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#003580] drop-shadow-sm">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-text-muted font-medium">Book flights, hotels, and tours at the best prices</p>
        </div>

        <FlightSearchWidget />
      </div>
    </main>
  );
}
