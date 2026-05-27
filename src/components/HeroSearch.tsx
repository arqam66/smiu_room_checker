import { useState } from 'react';
import { Search, BookOpen, Laptop } from 'lucide-react';
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
    <section className="relative mb-12 rounded-xl border border-[#1A1A1A]/10 bg-[#E5E2D9]" id="hero-banner">
      {/* Subtle beige gradients for low contrast publication look */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/80 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-full bg-[#FAF9F6]/20"></div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 px-6 pt-12 pb-14 flex flex-col items-center text-center">
        {/* Official Branded Logo Emblem */}
        <div className="mb-6 h-28 w-28 sm:h-36 sm:w-36 transition-transform hover:scale-105 duration-350 bg-white rounded-2xl shadow-lg border border-[#1A1A1A]/10 p-2.5 overflow-hidden flex items-center justify-center shrink-0">
          <img
            src={logoImg}
            alt="SMIU Brand Logo"
            className="h-full w-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Editorial Typography Title */}
        <div className="mb-4 flex flex-col items-center justify-center gap-2.5">
          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl font-light tracking-tighter text-[#1A1A1A] leading-none mb-2">
            Spaces <span className="italic font-normal font-headline text-[#D1512D]">in</span> Dialogue
          </h2>
        </div>
        
        <p className="mx-auto mb-10 max-w-xl text-xs sm:text-sm italic font-serif text-[#1A1A1A]/70 leading-relaxed font-semibold">
          An exploration into lecture halls, computer laboratories and syndicate chambers configured inside Sindh Madressatul Islam's historic physical registry.
        </p>

        {/* Publication Style Search Box Boxed inside Relative bounds for floating suggestions dropdown */}
        <div className="relative w-full max-w-2xl px-2 sm:px-0">
          <div className="search-focus w-full bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded flex flex-col sm:flex-row items-stretch sm:items-center transition-all p-1 gap-1 sm:gap-0">
            <div className="flex items-center flex-1 min-w-0">
              <div 
                className="flex items-center pl-3 pr-2 text-[#1A1A1A]/50 shrink-0 cursor-pointer hover:text-[#D1512D] transition-colors"
                onClick={() => {
                  setShowSuggestions(false);
                  setTimeout(() => {
                    const el = document.getElementById('left-panel-container');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 120);
                }}
              >
                <Search className="h-4.5 w-4.5 text-[#1A1A1A] hover:scale-110 transition-transform" />
              </div>
              <input
                type="text"
                className="w-full bg-transparent border-0 ring-0 text-xs sm:text-sm italic text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none focus:outline-none focus:ring-0 py-2.5 sm:py-3"
                placeholder="Search rooms, labs, floors ('CR-A02', 'IT-Tower')..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 220)} // small delay to allow click handlers on suggestions
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSuggestions(false);
                    setTimeout(() => {
                      const el = document.getElementById('left-panel-container');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 120);
                  }
                }}
                id="hero-search-input"
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => {
                setShowSuggestions(false);
                setTimeout(() => {
                  const el = document.getElementById('left-panel-container');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 120);
              }}
              className="bg-[#1A1A1A] hover:bg-[#D1512D] text-[#F9F7F2] px-4 sm:px-6 py-2 sm:py-2.5 rounded text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold transition-all cursor-pointer shrink-0"
            >
              Look up
            </button>
          </div>

          {/* Floated Suggestions Autocomplete List overlay */}
          {showSuggestions && matches.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[#FAF9F6] border-2 border-[#1A1A1A] rounded shadow-2xl z-[100] text-left overflow-hidden divide-y divide-[#1A1A1A]/10 max-h-[480px] overflow-y-auto">
              <div className="bg-[#E5E2D9]/40 px-3.5 py-1.5 text-[8px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/50 font-sans">
                Suggested Rooms & Locations
              </div>
              {matches.map((room) => (
                <div
                  key={room.id}
                  onMouseDown={() => {
                    // Trigger the popup modal callback
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
                  className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#E5E2D9] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 font-sans"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white bg-[#1A1A1A] px-1.5 sm:px-2 py-0.5 rounded text-center shrink-0">
                      {room.id}
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A] truncate max-w-[180px] sm:max-w-none">
                      {room.id === 'M-202' ? 'SMIU Central Library' : room.name.split(' (')[0]}
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-[#D1512D] font-extrabold uppercase tracking-widest text-left sm:text-right truncate">
                    {room.buildingName} • {room.floor}
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
