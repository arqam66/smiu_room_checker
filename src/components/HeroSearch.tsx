import { useState, useEffect } from 'react';
import { Search, BookOpen, Laptop } from 'lucide-react';
import { z } from 'zod';
import { BUILDINGS_DATA } from '../data';
import { Room } from '../types';
import logoImg from '../assets/images/smiu_logo_1779567984801.png';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShortcutClick: (type: string) => void;
  onSuggestionClick: (roomInfo: { room: Room; buildingName: string; buildingId: string }) => void;
}

export default function HeroSearch({
  searchQuery,
  onSearchChange,
  onShortcutClick,
  onSuggestionClick,
}: HeroSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isBotVerified, setIsBotVerified] = useState(false);

  // Zod schema for search input validation
  const searchSchema = z.string()
    .max(50, "Search query is too long")
    .regex(/^[a-zA-Z0-9\s-]*$/, "Search contains invalid characters");

  // Flatten all rooms to enable comprehensive location/room autocomplete
  const allRooms = BUILDINGS_DATA.flatMap((b) =>
    b.rooms.map((r) => ({
      ...r,
      buildingName: b.name,
      buildingId: b.id,
    }))
  );

  // Match suggestions by ID, name, floor location, type, or building name with robust normalization
  const matches = searchQuery.trim()
    ? allRooms
        .filter(
          (r) => {
            const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanQuery = normalize(searchQuery);
            return (
              normalize(r.id).includes(cleanQuery) ||
              normalize(r.name).includes(cleanQuery) ||
              normalize(r.floor).includes(cleanQuery) ||
              normalize(r.type).includes(cleanQuery) ||
              normalize(r.buildingName).includes(cleanQuery)
            );
          }
        )
    : [];

  return (
    <section className="relative mb-8 sm:mb-12 rounded-xl border border-[#1A1A1A]/10 bg-[#E5E2D9]" id="hero-banner">
      {/* Subtle beige gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/80 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-full bg-[#FAF9F6]/20"></div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 px-3 sm:px-6 pt-7 sm:pt-12 pb-8 sm:pb-14 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-4 sm:mb-6 h-16 w-16 sm:h-28 sm:w-28 md:h-36 md:w-36 transition-transform hover:scale-105 duration-350 bg-white rounded-2xl shadow-lg border border-[#1A1A1A]/10 p-2 overflow-hidden flex items-center justify-center shrink-0">
          <img
            src={logoImg}
            alt="Sindh Madressatul Islam University Logo"
            className="h-full w-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
            loading="eager"
            width={144}
            height={144}
          />
        </div>

        {/* Title */}
        <div className="mb-2 sm:mb-4 flex flex-col items-center gap-1">
          <h2 className="font-headline text-2xl sm:text-5xl md:text-6xl font-light tracking-tighter text-[#1A1A1A] leading-none">
            Spaces <span className="italic font-normal font-headline text-[#D1512D]">in</span> Dialogue
          </h2>
        </div>

        <p className="mx-auto mb-5 sm:mb-10 max-w-xs sm:max-w-xl text-[10px] sm:text-xs md:text-sm italic font-serif text-[#1A1A1A]/70 leading-relaxed font-semibold px-1">
          Explore lecture halls, labs and syndicate chambers inside SMIU's historic campus registry.
        </p>

        {/* Search Box */}
        <div className="relative w-full max-w-2xl">
          <div className="search-focus w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded flex flex-col sm:flex-row items-stretch sm:items-center transition-all p-1 gap-1 sm:gap-0">
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex items-center pl-3 pr-2 text-[#1A1A1A]/50 shrink-0">
                <Search className="h-4 w-4 text-[#1A1A1A]" />
              </div>
              <input
                type="text"
                className={`w-full bg-transparent border-0 ring-0 text-[11px] sm:text-sm italic text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none focus:outline-none focus:ring-0 py-2.5 sm:py-3 ${validationError ? 'text-red-500' : ''}`}
                placeholder="Search rooms, labs, floors…"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  const result = searchSchema.safeParse(value);
                  if (!result.success) {
                    setValidationError(result.error.issues[0].message);
                  } else {
                    setValidationError(null);
                  }
                  onSearchChange(value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 220)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                  }
                }}
                id="hero-search-input"
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => {
                if (!isBotVerified) {
                  alert("Please complete the bot verification.");
                  return;
                }
                setShowSuggestions(false);
              }}
              className={`${isBotVerified ? 'bg-[#1A1A1A] hover:bg-[#D1512D]' : 'bg-gray-400 cursor-not-allowed'} text-[#F9F7F2] px-4 sm:px-6 py-2.5 rounded text-[10px] uppercase tracking-widest font-extrabold transition-all shrink-0 w-full sm:w-auto`}
              disabled={!isBotVerified}
            >
              Look up
            </button>
          </div>
          {validationError && (
            <div className="absolute left-0 right-0 -bottom-6 text-left">
              <span className="text-[10px] text-red-600 font-bold bg-white/80 px-2 py-0.5 rounded border border-red-200">{validationError}</span>
            </div>
          )}

          {/* Bot Protection Placeholder (Turnstile) */}
          <div className="mt-4 flex justify-center">
            <div
              className="cf-turnstile border border-[#1A1A1A]/10 rounded bg-white p-2 text-[9px] font-mono text-[#1A1A1A]/60 flex items-center gap-2 cursor-pointer hover:bg-gray-50"
              onClick={() => setIsBotVerified(true)}
            >
              <div className={`w-3 h-3 rounded-full ${isBotVerified ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
              {isBotVerified ? 'Verified Student Access' : 'Click to verify student session'}
            </div>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && matches.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[#FAF9F6] border-2 border-[#1A1A1A] rounded shadow-2xl z-[100] text-left overflow-hidden divide-y divide-[#1A1A1A]/10 max-h-[280px] sm:max-h-[420px] overflow-y-auto">
              <div className="bg-[#E5E2D9]/40 px-3.5 py-1.5 text-[8px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/50 font-sans sticky top-0">
                Suggested Rooms &amp; Locations
              </div>
              {matches.map((room) => (
                <div
                  key={room.id}
                  onMouseDown={() => {
                    onSuggestionClick({
                      room: {
                        id: room.id,
                        name: room.name,
                        floor: room.floor,
                        status: room.status,
                        type: room.type,
                        currentActivity: room.currentActivity,
                        nextActivity: room.nextActivity,
                        amenities: room.amenities,
                        capacity: room.capacity
                      },
                      buildingName: room.buildingName,
                      buildingId: room.buildingId
                    });
                    setShowSuggestions(false);
                  }}
                  className="px-3 sm:px-4 py-2.5 hover:bg-[#E5E2D9] cursor-pointer transition-colors flex items-center justify-between gap-2 font-sans"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-white bg-[#1A1A1A] px-1.5 py-0.5 rounded shrink-0">
                      {room.id}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[#1A1A1A] truncate max-w-[140px] sm:max-w-none">
                      {room.id === 'M-202' ? 'SMIU Central Library' : room.name.split(' (')[0]}
                    </span>
                  </div>
                  <span className="text-[8px] text-[#D1512D] font-extrabold uppercase tracking-widest shrink-0 hidden sm:block">
                    {room.buildingName} · {room.floor}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
