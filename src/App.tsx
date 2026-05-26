import { useState, useEffect } from 'react';
import { BUILDINGS_DATA, PATHS } from './data';
import { Building, Room } from './types';
import TopAppBar from './components/TopAppBar';
import HeroSearch from './components/HeroSearch';
import CampusMap from './components/CampusMap';
import BuildingDetailPanel from './components/BuildingDetailPanel';
import FacultyDirectory from './components/FacultyDirectory';

import { 
  Building2, ChevronRight, HelpCircle, X, 
  Search, Info as InfoIcon, Landmark, Star, BookOpen, Clock, Award,
  Github, ChevronUp, Map, Users
} from 'lucide-react';

export default function App() {
  // App states
  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS_DATA);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedRoomForPopup, setSelectedRoomForPopup] = useState<{ room: Room; buildingName: string; buildingId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'history' | 'directory'>('map');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [startBuildingId, setStartBuildingId] = useState<string | null>(null);

  // Monitor scroll height to conditionally show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure dark mode class is never active on root to force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Handle selected building change (either lists building or map select)
  const handleSelectBuilding = (id: string | null) => {
    setSelectedBuildingId(id);
    setSelectedRoomId(null);
    setStartBuildingId(null); // Reset wayfinder start point on changing buildings
    // If selecting a building, disable search query so they inspect that building cleanly
    if (id !== null) {
      setSearchQuery('');
    }
  };

  // Toggle active Room Booking (Simulated Interactive Database)
  const handleToggleRoomStatus = (roomId: string) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((b) => {
        // Look through rooms
        const hasRoom = b.rooms.some((r) => r.id === roomId);
        if (!hasRoom) return b;

        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== roomId) return r;

            const nextStatus: 'available' | 'busy' = r.status === 'available' ? 'busy' : 'available';
            const nextActivity =
              nextStatus === 'busy'
                ? 'Reserved for study session (Active Users Booking)'
                : 'Free - Open Study Area';

            return {
              ...r,
              status: nextStatus,
              currentActivity: nextActivity,
            };
          }),
        };
      })
    );
  };

  // Triggered from finding directions inside a room card
  const handleNavigateToRoom = (roomId: string) => {
    // Find building with this room
    const targetBuilding = buildings.find((b) => b.rooms.some((r) => r.id === roomId));
    if (!targetBuilding) return;

    // Directly select and explore the target building detail panel
    setSelectedBuildingId(targetBuilding.id);
    setSearchQuery('');
    setActiveTab('map');
  };

  const handleShortcutClick = (type: string) => {
    setSearchQuery(type);
    setSelectedBuildingId(null);
    setTimeout(() => {
      const el = document.getElementById('global-search-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  // Global search compilation across all buildings and rooms with robust normalization
  const allMatchingRooms: { room: Room; buildingName: string; buildingId: string }[] = [];
  if (searchQuery.trim().length > 0) {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuery = normalize(searchQuery);

    buildings.forEach((b) => {
      b.rooms.forEach((r) => {
        const matchesRoomId = normalize(r.id).includes(cleanQuery);
        const matchesRoomName = normalize(r.name).includes(cleanQuery);
        const matchesType = normalize(r.type).includes(cleanQuery);
        const matchesFloor = normalize(r.floor).includes(cleanQuery);
        const matchesActivity = normalize(r.currentActivity).includes(cleanQuery);
        const matchesAmenities = r.amenities.some((am) => normalize(am).includes(cleanQuery));
        const matchesBuilding = normalize(b.name).includes(cleanQuery);

        if (
          matchesRoomId ||
          matchesRoomName ||
          matchesType ||
          matchesFloor ||
          matchesActivity ||
          matchesAmenities ||
          matchesBuilding
        ) {
          allMatchingRooms.push({
            room: r,
            buildingName: b.name,
            buildingId: b.id,
          });
        }
      });
    });

    // Sort room results alphabetically from A to Z by room ID naturally
    allMatchingRooms.sort((a, b) => a.room.id.localeCompare(b.room.id, undefined, { numeric: true, sensitivity: 'base' }));
  }

  // Get active selected building object
  const activeBuilding = buildings.find((b) => b.id === selectedBuildingId);

  // Wayfinder routing using active PATHS mapping
  const navigationRoute = {
    startBuildingId,
    endBuildingId: selectedBuildingId,
    path: startBuildingId && selectedBuildingId ? PATHS[startBuildingId]?.[selectedBuildingId]?.path || null : null,
    steps: startBuildingId && selectedBuildingId ? PATHS[startBuildingId]?.[selectedBuildingId]?.steps || [] : [],
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] flex flex-col font-sans transition-colors duration-300" id="app-root-container">
      {/* Top Banner Header */}
      <TopAppBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedBuildingId(null);
          setSearchQuery('');
        }}
        onHomeClick={() => {
          setSelectedBuildingId(null);
          setSearchQuery('');
          setActiveTab('map');
        }}
        onHelpClick={() => setShowHelpModal(true)}
      />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        {activeTab === 'history' ? (
          /* Separate SMIU History Editorial Page */
          <div className="bg-[#FAF9F6] border border-[#1A1A1A]/12 rounded p-5 sm:p-8 md:p-12 shadow-sm space-y-12 animate-fade-in" id="smiu-history-page">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#D1512D]/10 border border-[#D1512D]/15 text-[#D1512D]">
                <Award className="h-4 w-4 animate-bounce" />
                <span className="text-[10px] uppercase tracking-widest font-extrabold font-mono">Established 1885</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3.5xl md:text-5xl font-black italic text-[#1A1A1A] tracking-tight leading-tight">
                Sindh Madressatul Islam University
              </h2>
              <p className="text-xs font-sans text-[#1A1A1A]/60 uppercase tracking-widest font-extrabold">
                The Alma Mater of Quaid-e-Azam Mohammad Ali Jinnah
              </p>
              <div className="h-0.5 bg-[#D1512D] w-24 mx-auto my-6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Extensive Historical Narrative */}
              <div className="lg:col-span-7 space-y-6 text-[#1A1A1A]/80 font-serif leading-relaxed text-sm md:text-base">
                <h3 className="font-serif text-xl font-bold italic text-[#D1512D] border-b border-[#1A1A1A]/10 pb-2">
                  The Genesis of Modern Education in Sindh
                </h3>
                <p>
                  Sindh Madressatul Islam (SMIU) was founded on <strong>September 1, 1885</strong>, by the legendary educationist, reformer, and visionary <strong>Khan Bahadur Hassan Ally Effendi</strong>. Closely aligned with the ideals of the Aligarh Movement, Effendi created this institution to provide modern high-quality scientific education, literature, and social sciences to the communities of the South Asian region.
                </p>
                <p>
                  SMI served as the premier cultural and academic oasis of pre-partition Karachi. Its stunning structures, designed in rich colonial Victorian-Gothic styles, stood as a symbol of structural majesty and educational development, housing a library of hundreds of historical manuscripts.
                </p>
                
                <div className="my-8 p-6 bg-[#E5E2D9] border-l-4 border-[#D1512D] text-[#1A1A1A] rounded" id="history-quote-block">
                  <p className="italic font-bold font-serif mb-2 text-md leading-relaxed">
                    "I leave one-third of my personal estate to my beloved alma mater, Sindh Madressatul Islam."
                  </p>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#1A1A1A]/60 font-sans">
                    — From the Last Will & Testament of Quaid-e-Azam Mohammad Ali Jinnah
                  </span>
                </div>

                <p>
                  Its most celebrated alumnus is <strong>Quaid-e-Azam Mohammad Ali Jinnah</strong>, the founding father of Pakistan, who studied here from 1887 to 1892. Jinnah harbored a profound lifelong affection for SMI. In his legacy, he ensured that his estate supported the continuing educational excellence of the school.
                </p>
                <p>
                  On <strong>February 21, 2012</strong>, Sindh Madressatul Islam was officially chartered as a public sector university by the Government of Sindh. Mixing historical grandeur with contemporary digital infrastructure, SMIU offers advanced scientific curricula inside state-of-the-art facilities like the futuristic IT Tower, training the next generation of global leaders.
                </p>
              </div>

              {/* Right Column: Key Landmarks & Timeline */}
              <div className="lg:col-span-5 space-y-6">
                {/* Timeline */}
                <div className="bg-[#FAF9F6]/55 border border-[#1A1A1A]/10 rounded p-6 space-y-5">
                  <h4 className="font-serif text-sm font-bold italic text-[#1A1A1A] pb-2 border-b border-[#1A1A1A]/10 flex items-center gap-2 animate-fade-in">
                    <Clock className="h-4.5 w-4.5 text-[#D1512D]" />
                    Historical Chronology
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <span className="text-[10px] font-mono font-bold text-[#D1512D] bg-[#D1512D]/10 px-2 py-1 rounded min-w-[50px] text-center">
                        1885
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-[#1A1A1A]">Inauguration</h5>
                        <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed font-serif">
                          Sindh Madressatul Islam officially opens its doors as the principal house of modern education.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <span className="text-[10px] font-mono font-bold text-[#D1512D] bg-[#D1512D]/10 px-2 py-1 rounded min-w-[50px] text-center">
                        1887
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-[#1A1A1A]">Jinnah Enters SMI</h5>
                        <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed font-serif">
                          Mohammad Ali Jinnah is admitted under registry number 125, formulating his academic basics.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <span className="text-[10px] font-mono font-bold text-[#D1512D] bg-[#D1512D]/10 px-2 py-1 rounded min-w-[50px] text-center">
                        1943
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-[#1A1A1A]">College Upgradings</h5>
                        <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed font-serif">
                          Quaid-e-Azam inaugurates the science college department in his final physical visit.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <span className="text-[10px] font-mono font-bold text-[#D1512D] bg-[#D1512D]/10 px-2 py-1 rounded min-w-[50px] text-center">
                        2012
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-[#1A1A1A]">University Status</h5>
                        <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed font-serif">
                          Officially chartered as a chartered University, expanding to graduate programs and lab facilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historic structures */}
                <div className="bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded p-6 space-y-4">
                  <h4 className="font-serif text-sm font-bold italic text-[#1A1A1A] flex items-center gap-2">
                    <Landmark className="h-4.5 w-4.5 text-[#D1512D]" />
                    Historic Campus Structures
                  </h4>
                  <div className="space-y-3.5 text-xs text-[#1A1A1A]/85 font-serif">
                    <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/5 rounded">
                      <h5 className="font-bold text-[#D1512D] font-sans text-[10px] uppercase tracking-wider mb-1">The Main Building</h5>
                      <p className="text-[11px] text-[#1A1A1A]/70">Constructed in 1886. Designed by James Strachan, featuring classical arched windows and majestic Victorian-Gothic domes.</p>
                    </div>
                    <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/5 rounded">
                      <h5 className="font-bold text-[#D1512D] font-sans text-[10px] uppercase tracking-wider mb-1">Talpur House</h5>
                      <p className="text-[11px] text-[#1A1A1A]/70">Built in 1901 specifically to harbor the royal princes of the Talpur Dynasty of Sindh during their academic sessions.</p>
                    </div>
                    <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/5 rounded">
                      <h5 className="font-bold text-[#D1512D] font-sans text-[10px] uppercase tracking-wider mb-1">Sir Shahnawaz Bhutto Auditorium</h5>
                      <p className="text-[11px] text-[#1A1A1A]/70">A grand colonial hall hosting major syndicates and debating contests, named after prestigious alumnus Sir Shahnawaz.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'directory' ? (
          /* Separate SMIU Faculty Directory Page with Advanced Searches and Department Lists */
          <FacultyDirectory />
        ) : (
          /* Active Room Finder & Space Mapping layout */
          <>
            {/* Dynamic Hero Banner */}
            <HeroSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onShortcutClick={handleShortcutClick}
              onSuggestionClick={(roomInfo) => {
                setSelectedRoomForPopup(roomInfo);
              }}
            />

            {/* Master Details Content Frame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              
              {/* LEFT PANELS: Show only when not searching */}
              {searchQuery.trim().length === 0 && (
                <aside className="order-2 lg:order-1 lg:col-span-4 space-y-4">
                  {activeBuilding ? (
                    /* 2. Detailed building room inspector card */
                    <BuildingDetailPanel
                      building={activeBuilding}
                      onBack={() => setSelectedBuildingId(null)}
                      highlightedRoomId={selectedRoomId}
                      searchActive={searchQuery.trim().length > 0}
                      startBuildingId={startBuildingId}
                      onSetStartBuilding={setStartBuildingId}
                      allBuildings={buildings}
                      navigationRoute={navigationRoute}
                    />
                  ) : (
                    /* 3. Default structural list of buildings */
                    <div className="space-y-4" id="default-building-list">
                      <div className="flex items-center gap-3 px-1">
                        <div className="p-2 rounded bg-[#FAF9F6] border border-[#1A1A1A]/10 text-[#D1512D]">
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                            Campus Directory
                          </h3>
                          <p className="text-[10px] uppercase tracking-widest font-mono text-[#1A1A1A]/60">SMIU Campus Directory</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {buildings.map((b) => {
                          const isSelected = b.id === selectedBuildingId;
                          return (
                            <div
                              key={b.id}
                              onClick={() => handleSelectBuilding(b.id)}
                              className={`building-card bg-[#FAF9F6] border p-4.5 rounded flex justify-between items-center cursor-pointer group hover:bg-[#FAF9F6]/80 transition-all duration-300 shadow-sm ${
                                isSelected ? 'border-[#1A1A1A] bg-[#E5E2D9] border-2 shadow-sm' : 'border-[#1A1A1A]/12'
                              }`}
                              id={`building-card-${b.id}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded bg-[#D1512D]/10 border border-[#D1512D]/15 flex items-center justify-center text-[#D1512D] group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                                  <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] group-hover:text-[#D1512D]">
                                    {b.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B] animate-pulse"></span>
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A]/60 font-sans">
                                      {b.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="bg-[#E5E2D9] border border-[#1A1A1A]/10 text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:border-transparent px-3 py-1 rounded text-[9px] uppercase tracking-wider font-extrabold transition-all">
                                  {b.rooms.length} rooms
                                </span>
                                <ChevronRight className="h-4 w-4 text-[#1A1A1A]/60 transition-transform chevron mr-1" />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </aside>
              )}

              {/* RIGHT PANELS: Academic Interactive Campus Map widget */}
              <CampusMap
                buildings={buildings}
                selectedBuildingId={selectedBuildingId}
                onSelectBuilding={handleSelectBuilding}
                navigationRoute={navigationRoute}
              />

            </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FAF9F6] border-t border-[#1A1A1A]/10 py-10 mt-16 text-[#1A1A1A]/70 animate-fade-in" id="app-footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-6 text-center">
          
          {/* Tabs in the footer (same as in the navbar) */}
          <div className="flex flex-col items-center gap-2 w-full max-w-sm mt-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/40 font-mono">
              Quick Navigation
            </span>
            <div className="flex items-center gap-1 bg-[#E5E2D9] p-1 rounded border border-[#1A1A1A]/5 w-full justify-center" id="footer-navigation-tabs">
              <button
                onClick={() => {
                  setActiveTab('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 px-3.5 py-2 text-[9px] uppercase tracking-wider font-extrabold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
                id="footer-tab-map-btn"
              >
                <Map className="h-3 w-3 shrink-0" />
                <span>Finder</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 px-3.5 py-2 text-[9px] uppercase tracking-wider font-extrabold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
                id="footer-tab-history-btn"
              >
                <BookOpen className="h-3 w-3 shrink-0" />
                <span>History</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('directory');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 px-3.5 py-2 text-[9px] uppercase tracking-wider font-extrabold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'directory'
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                    : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
                id="footer-tab-directory-btn"
              >
                <Users className="h-3 w-3 shrink-0" />
                <span>Faculty</span>
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-[#1A1A1A]/10 w-24"></div>

          {/* Institutional Title & Github Link */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-lg font-black italic text-[#1A1A1A]">Room Finder</span>
            
            <a
              href="https://github.com/arqam66"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded bg-[#1A1A1A] hover:bg-[#D1512D] text-white px-3.5 py-1.5 text-[9px] uppercase tracking-widest font-extrabold transition-all duration-300"
              id="footer-github-link"
            >
              <Github className="h-3.5 w-3.5 shrink-0" /> arqam66
            </a>

            <p className="text-[11px] font-medium text-[#1A1A1A]/60 mt-1.5">
              © {new Date().getFullYear()} All rights reserved to Arqam Hussain
            </p>
          </div>
        </div>
      </footer>

      {/* HELP MODAL overlay */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/60 p-4 backdrop-blur-sm animate-fade-in" id="help-modal-overlay">
          <div className="w-full max-w-lg bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded shadow-xl overflow-hidden">
            {/* Modal Heading */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#1A1A1A]/10 bg-[#E5E2D9]">
              <div className="flex items-center gap-2 text-[#D1512D]">
                <HelpCircle className="h-5 w-5" />
                <h3 className="font-serif italic font-black text-md text-[#1A1A1A]">Room Finder Assistant Registry</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#1A1A1A]/60 hover:text-black transition-colors cursor-pointer"
                id="close-help-modal"
                title="Close"
                aria-label="Close help modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[440px] overflow-y-auto">
              <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-serif italic">
                The Sindh Madressatul Islam University (SMIU) Room Finder representing a prestigious interactive physical-cyber registry of campus spatial coordinates.
              </p>

              {/* Functional details */}
              <div className="space-y-3.5 text-xs leading-relaxed font-serif">
                <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/12 space-y-1">
                  <p className="font-serif italic font-bold text-[#D1512D] flex items-center gap-1 mr-1">
                    <Search className="h-3.5 w-3.5" /> Direct Campus Search
                  </p>
                  <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">
                    Query codes like "Lab", "Lecture", "M-10" or "AC" inside our search bar. Matches display localized room details and physical asset lists instantly.
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/12 space-y-1">
                  <p className="font-serif italic font-bold text-[#D1512D] flex items-center gap-1 mr-1">
                    <BookOpen className="h-3.5 w-3.5" /> SMIU Historical Chronicle
                  </p>
                  <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">
                    Switch to the "SMIU History" section from navigation tabs to read the majestic legacy of the university, dating back to 1885 during hassan Ally Effendis era.
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/12 space-y-1">
                  <p className="font-serif italic font-bold text-[#D1512D] flex items-center gap-1 mr-1">
                    <Star className="h-3.5 w-3.5" /> Mock Space Reservations
                  </p>
                  <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">
                    Test the reservation module by selecting "Book Space" inside any room info panel. Timetables swap immediately inside memory storage to sync with maps.
                  </p>
                </div>
              </div>

              {/* Administrative Contacts */}
              <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-2.5">
                <p className="text-[9px] uppercase tracking-widest text-[#D1512D] font-mono font-bold">Academic Room Coordinator Contacts</p>
                <div className="grid grid-cols-2 gap-3 text-[10px] text-[#1A1A1A]/70">
                  <div className="p-2.5 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded">
                    <p className="font-bold text-[#1A1A1A]">Main Campus Security Force</p>
                    <p>Auxiliary Gate, Ground Floor</p>
                    <p className="font-mono text-[9px] text-[#D1512D] mt-1 font-bold">Ext. 4022</p>
                  </div>
                  <div className="p-2.5 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded">
                    <p className="font-bold text-[#1A1A1A]">Academic Registrar Office</p>
                    <p>Main Building, Level One Foyer</p>
                    <p className="font-mono text-[9px] text-[#D1512D] mt-1 font-bold">registry@smiu.edu.pk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#E5E2D9] border-t border-[#1A1A1A]/10 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-[#1A1A1A] hover:bg-[#D1512D] text-white px-5 py-2 rounded text-[10px] uppercase tracking-widest font-extrabold transition-all cursor-pointer"
              >
                Close Registry Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Detail Popup Modal Overlay */}
      {selectedRoomForPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/70 backdrop-blur-sm p-4 animate-fade-in" id="room-detail-popup-overlay">
          <div className="bg-[#FAF9F6] border border-[#1A1A1A]/30 w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col" id="room-detail-popup-content">
            {/* Modal Header */}
            <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b border-[#1A1A1A]/10">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-white bg-[#D1512D] px-2.5 py-1 rounded">
                  {selectedRoomForPopup.room.id}
                </span>
                <div>
                  <h3 className="font-serif italic font-bold text-base text-white">
                    {selectedRoomForPopup.room.id === 'M-202' ? 'SMIU Central Library' : selectedRoomForPopup.room.id === 'A-101' ? 'Shahnawaz Auditorium' : selectedRoomForPopup.room.name.split(' (')[0]}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/60 font-mono">Room Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomForPopup(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded transition-all cursor-pointer"
                id="btn-close-room-popup"
                title="Close"
                aria-label="Close room details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[460px] overflow-y-auto text-left">
              {/* Location Card */}
              <div className="p-4 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#D1512D] font-mono font-bold">Physical Coordinates</span>
                <p className="font-serif text-sm font-black text-[#1A1A1A] italic">
                  {selectedRoomForPopup.buildingName}
                </p>
                <p className="text-xs text-[#1A1A1A]/70 font-medium">
                  Located on the <span className="text-[#D1512D] font-bold">{selectedRoomForPopup.room.floor}</span> of this historic academic building.
                </p>
              </div>

              {/* Specifications: Type & Capacity Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/12 rounded space-y-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-[#1A1A1A]/50 font-mono font-bold">Room Category</span>
                  <p className="text-xs font-bold text-[#1A1A1A]">{selectedRoomForPopup.room.type}</p>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] border border-[#1A1A1A]/12 rounded space-y-0.5">
                  <span className="text-[8px] uppercase tracking-widest text-[#1A1A1A]/50 font-mono font-bold">Max Seating Capacity</span>
                  <p className="text-xs font-bold text-[#1A1A1A] font-mono">{selectedRoomForPopup.room.capacity} seats</p>
                </div>
              </div>



              {/* Amenities List */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/50 font-mono font-bold font-extrabold">Amenities available:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedRoomForPopup.room.amenities.map((am) => (
                    <span
                      key={am}
                      className="inline-flex items-center gap-1 rounded bg-[#E5E2D9]/60 border border-[#1A1A1A]/10 px-2 py-0.5 text-[9px] text-[#1A1A1A] font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#E5E2D9] border-t border-[#1A1A1A]/10 flex justify-end">
              <button
                onClick={() => setSelectedRoomForPopup(null)}
                className="bg-[#1A1A1A] hover:bg-[#D1512D] text-white px-5 py-2 rounded text-[10px] uppercase tracking-widest font-extrabold transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
