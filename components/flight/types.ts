export type TripType = "one-way" | "round-trip" | "multi-city";
export type TabType = "Flight" | "Hotel" | "Activities" | "Transfer" | "Visa";
export type CabinClass = "Economy" | "Business" | "First";

export interface Airport {
  city: string;
  code: string;
  airport: string;
  country: string;
}

export interface FlightSegment {
  id: string;
  from: Airport | null;
  to: Airport | null;
  date: Date | null;
}

export const MOCK_AIRPORTS: Airport[] = [
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
