import { useState, useEffect } from 'react';
import { Building } from '../types';
import { Compass, RefreshCw, ZoomIn, Info as InfoIcon, MapPin } from 'lucide-react';
import styles from "./CampusMap.module.css";
interface CampusMapProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  navigationRoute: {
    startBuildingId: string | null;
    endBuildingId: string | null;
    path: string | null;
    steps: string[];
  };
}

export default function CampusMap({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  navigationRoute,
}: CampusMapProps) {
  const [mapScale, setMapScale] = useState<number>(1);

  // Update CSS variable for map scale
  useEffect(() => {
    document.documentElement.style.setProperty('--map-scale', mapScale.toString());
  }, [mapScale]);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Trigger simulated zoom toggles
  const handleToggleScale = () => {
    setMapScale((prev) => (prev === 1 ? 1.05 : prev === 1.05 ? 1.1 : 1));
  };

  return (
    <section className="col-span-1 lg:col-span-8 flex flex-col h-full order-1 lg:order-2" id="campus-map-section">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-4 gap-2 px-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 rounded bg-[#FAF9F6] border border-[#1A1A1A]/10 text-[#D1512D] shrink-0">
            <ZoomIn className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm sm:text-lg font-bold text-[#1A1A1A] leading-tight">
                Interactive Campus Map
              </h3>
              <span className="sm:hidden text-[7px] bg-[#D1512D]/10 text-[#D1512D] border border-[#D1512D]/15 px-1.5 py-0.5 rounded font-mono animate-pulse shrink-0">
                Swipe
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-mono text-[#1A1A1A]/60">SMIU Digital Twin</p>
          </div>
        </div>

        {/* Legend + buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 px-2 sm:px-3.5 py-1.5 rounded flex items-center gap-2 sm:gap-3.5 text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/70">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1512D]"></span>
              <span className="hidden xs:inline">Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]/40"></span>
              <span className="hidden xs:inline">Inactive</span>
            </div>
            {navigationRoute.path && (
              <div className="flex items-center gap-1 border-l border-[#1A1A1A]/10 pl-2">
                <span className="w-3 h-0.5 bg-[#D1512D] inline-block animate-pulse"></span>
                <span className="text-[#D1512D] hidden sm:inline">Route</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 sm:px-3 py-1.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold border cursor-pointer transition-all ${
              showGrid 
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                : 'bg-[#FAF9F6] border-[#1A1A1A]/12 text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
            }`}
            title="Toggle Grid"
          >
            Grid
          </button>

          <button
            onClick={handleToggleScale}
            className="px-2 sm:px-3 py-1.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold bg-[#FAF9F6] border border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all flex items-center gap-1 cursor-pointer"
            title="Zoom Level"
          >
            <RefreshCw className="h-3 w-3" />
            <span>x{mapScale}</span>
          </button>
        </div>
      </div>

      {/* SVG Map Container — scrollable on mobile, full-width on desktop */}
      <div
        className="relative w-full overflow-x-auto overflow-y-hidden md:overflow-hidden border border-[#1A1A1A]/12 rounded-lg bg-[#FAF9F6] transition-all duration-300"
        id="map-scroll-viewport"
        style={{ touchAction: 'pan-x' }}
      >
        <div 
          className={`w-[560px] xs:w-[640px] sm:w-full aspect-[16/9] relative transition-transform duration-500 ease-out origin-center ${styles.mapScale}`}
        >
          {/* Base SVG Drawing */}
          <svg
            className="absolute inset-0 w-full h-full select-none"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Map Grid Lines overlay */}
            {showGrid && (
              <defs>
                <pattern id="mapPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(26, 26, 26, 0.04)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
            )}
            
            {showGrid && <rect width="100%" height="100%" fill="url(#mapPattern)" />}

            {/* Simulated Campus Boundaries & Walkways */}
            <path
              d="M 80 80 L 720 80 L 720 380 L 80 380 Z"
              fill="rgba(26, 26, 26, 0.005)"
              stroke="rgba(26, 26, 26, 0.08)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Central Main Courtyard and Fountain circle */}
            <circle cx="450" cy="225" r="45" fill="rgba(209, 81, 45, 0.02)" stroke="rgba(209, 81, 45, 0.12)" strokeWidth="1" />
            <circle cx="450" cy="225" r="15" fill="rgba(26, 26, 26, 0.03)" stroke="rgba(26, 26, 26, 0.12)" strokeWidth="1" />

            {/* Permanent Interconnecting Pathway networks */}
            <path
              d="M 200 360 L 400 290 L 520 247"
              stroke="rgba(26, 26, 26, 0.06)"
              strokeWidth="2.5"
            />
            <path
              d="M 520 247 L 560 315"
              stroke="rgba(26, 26, 26, 0.06)"
              strokeWidth="2.5"
            />
            <path
              d="M 520 247 L 640 90"
              stroke="rgba(26, 26, 26, 0.06)"
              strokeWidth="2.5"
            />
            <path
              d="M 200 360 L 400 290 L 520 247 L 640 90 M 520 247 L 560 315"
              opacity="0.3"
              stroke="#D1512D"
              strokeDasharray="5 5"
              strokeWidth="1.5"
            />

            {/* Schematic outlines for buildings */}
            {/* IT Tower schematic */}
            <rect
              x="600"
              y="60"
              width="80"
              height="60"
              rx="4"
              fill={selectedBuildingId === 'it_tower' ? 'rgba(209, 81, 45, 0.06)' : 'rgba(26, 26, 26, 0.02)'}
              stroke={selectedBuildingId === 'it_tower' ? '#D1512D' : 'rgba(26, 26, 26, 0.12)'}
              strokeWidth={selectedBuildingId === 'it_tower' ? '2px' : '1px'}
              className={styles.transitionSmooth}
            />
            {/* Main Building schematic */}
            <rect
              x="475"
              y="202"
              width="90"
              height="80"
              rx="4"
              fill={selectedBuildingId === 'main_building' ? 'rgba(209, 81, 45, 0.06)' : 'rgba(26, 26, 26, 0.02)'}
              stroke={selectedBuildingId === 'main_building' ? '#D1512D' : 'rgba(26, 26, 26, 0.12)'}
              strokeWidth={selectedBuildingId === 'main_building' ? '2px' : '1px'}
              className={styles.transitionSmooth}
            />
            {/* Talpur House schematic */}
            <rect
              x="160"
              y="320"
              width="80"
              height="70"
              rx="4"
              fill={selectedBuildingId === 'talpur_house' ? 'rgba(209, 81, 45, 0.06)' : 'rgba(26, 26, 26, 0.02)'}
              stroke={selectedBuildingId === 'talpur_house' ? '#D1512D' : 'rgba(26, 26, 26, 0.12)'}
              strokeWidth={selectedBuildingId === 'talpur_house' ? '2px' : '1px'}
              className={styles.transitionSmooth}
            />
            {/* Auxiliary schematic */}
            <rect
              x="520"
              y="285"
              width="80"
              height="60"
              rx="4"
              fill={selectedBuildingId === 'auxiliary_building' ? 'rgba(209, 81, 45, 0.06)' : 'rgba(26, 26, 26, 0.02)'}
              stroke={selectedBuildingId === 'auxiliary_building' ? '#D1512D' : 'rgba(26, 26, 26, 0.12)'}
              strokeWidth={selectedBuildingId === 'auxiliary_building' ? '2px' : '1px'}
              className={styles.transitionSmooth}
            />

            {/* Dynamic Active Wayfinding Overlay Line */}
            {navigationRoute.path && (
              <>
                {/* Glow effect for path */}
                <path
                  d={navigationRoute.path}
                  stroke="#D1512D"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.2"
                />
                {/* Core animated wayfinding line */}
                <path
                  d={navigationRoute.path}
                  className={styles.pathAnimation}
                />
              </>
            )}
          </svg>

          {/* Interactive Absolute Overlays with Publication Aesthetics */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* IT Tower Marker */}
            <div 
              className="absolute top-[18%] left-[78%] pointer-events-auto map-marker cursor-pointer animate-fade-in"
              onClick={() => onSelectBuilding('it_tower')}
              id="marker-it_tower"
            >
              <div className={`p-1 sm:p-2 rounded border flex flex-col items-center min-w-[52px] sm:min-w-[90px] text-center shadow-sm transition-colors ${
                selectedBuildingId === 'it_tower' 
                  ? 'border-[#D1512D] bg-[#E5E2D9]' 
                  : 'border-[#1A1A1A]/10 bg-[#FAF9F6]/95 hover:bg-[#FAF9F6]'
              }`}>
                <MapPin className={`h-2.5 w-2.5 sm:h-4 sm:w-4 ${selectedBuildingId === 'it_tower' ? 'text-[#D1512D] fill-[#D1512D]' : 'text-[#1A1A1A]'}`} />
                <span className="text-[6px] sm:text-[9px] font-extrabold text-[#1A1A1A] mt-0.5 uppercase tracking-wide font-sans leading-tight">IT Tower</span>
                <span className="text-[5px] sm:text-[7px] text-[#1A1A1A]/60 bg-[#1A1A1A]/5 px-1 py-0.5 rounded mt-0.5 font-mono">16</span>
              </div>
            </div>

            {/* Main Building Marker */}
            <div 
              className="absolute top-[52%] left-[64%] pointer-events-auto map-marker cursor-pointer"
              onClick={() => onSelectBuilding('main_building')}
              id="marker-main_building"
            >
              <div className={`p-1 sm:p-2 rounded border flex flex-col items-center min-w-[52px] sm:min-w-[100px] text-center shadow-sm transition-colors ${
                selectedBuildingId === 'main_building' 
                  ? 'border-[#D1512D] bg-[#E5E2D9]' 
                  : 'border-[#1A1A1A]/10 bg-[#FAF9F6]/95 hover:bg-[#FAF9F6]'
              }`}>
                <MapPin className={`h-2.5 w-2.5 sm:h-4 sm:w-4 ${selectedBuildingId === 'main_building' ? 'text-[#D1512D] fill-[#D1512D]' : 'text-[#D1512D]'}`} />
                <span className="text-[6px] sm:text-[9px] font-extrabold text-[#1A1A1A] mt-0.5 uppercase tracking-wide font-sans leading-tight">Main Bldg</span>
                <span className="text-[5px] sm:text-[7px] text-[#D1512D] bg-[#D1512D]/10 px-1 py-0.5 rounded mt-0.5 font-mono">9</span>
              </div>
            </div>

            {/* Talpur House Marker */}
            <div 
              className="absolute top-[75%] left-[23%] pointer-events-auto map-marker cursor-pointer"
              onClick={() => onSelectBuilding('talpur_house')}
              id="marker-talpur_house"
            >
              <div className={`p-1 sm:p-2 rounded border flex flex-col items-center min-w-[52px] sm:min-w-[90px] text-center shadow-sm transition-colors ${
                selectedBuildingId === 'talpur_house' 
                  ? 'border-[#D1512D] bg-[#E5E2D9]' 
                  : 'border-[#1A1A1A]/10 bg-[#FAF9F6]/95 hover:bg-[#FAF9F6]'
              }`}>
                <MapPin className={`h-2.5 w-2.5 sm:h-4 sm:w-4 ${selectedBuildingId === 'talpur_house' ? 'text-[#D1512D] fill-[#D1512D]' : 'text-[#1A1A1A]'}`} />
                <span className="text-[6px] sm:text-[9px] font-extrabold text-[#1A1A1A] mt-0.5 uppercase tracking-wide font-sans leading-tight">Talpur</span>
                <span className="text-[5px] sm:text-[7px] text-[#1A1A1A]/60 bg-[#1A1A1A]/5 px-1 py-0.5 rounded mt-0.5 font-mono">14</span>
              </div>
            </div>

            {/* Auxiliary Building Marker */}
            <div 
              className="absolute top-[68%] left-[70%] pointer-events-auto map-marker cursor-pointer"
              onClick={() => onSelectBuilding('auxiliary_building')}
              id="marker-auxiliary_building"
            >
              <div className={`p-1 sm:p-2 rounded border flex flex-col items-center min-w-[52px] sm:min-w-[95px] text-center shadow-sm transition-colors ${
                selectedBuildingId === 'auxiliary_building' 
                  ? 'border-[#D1512D] bg-[#E5E2D9]' 
                  : 'border-[#1A1A1A]/10 bg-[#FAF9F6]/95 hover:bg-[#FAF9F6]'
              }`}>
                <MapPin className={`h-2.5 w-2.5 sm:h-4 sm:w-4 ${selectedBuildingId === 'auxiliary_building' ? 'text-[#D1512D] fill-[#D1512D]' : 'text-[#1A1A1A]'}`} />
                <span className="text-[6px] sm:text-[9px] font-extrabold text-[#1A1A1A] mt-0.5 uppercase tracking-wide font-sans leading-tight">Auxiliary</span>
                <span className="text-[5px] sm:text-[7px] text-[#1A1A1A]/60 bg-[#1A1A1A]/5 px-1 py-0.5 rounded mt-0.5 font-mono">13</span>
              </div>
            </div>

            {/* Compass — hidden on very small screens */}
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 hidden xs:flex">
              <div className="relative flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FAF9F6] border border-[#1A1A1A]/15 shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center text-[7px] sm:text-[9px] font-extrabold text-[#1A1A1A]/70 font-mono">
                  <span className="absolute top-0.5 sm:top-1 text-[#D1512D] font-black">N</span>
                  <span className="absolute right-0.5 sm:right-1">E</span>
                  <span className="absolute bottom-0.5 sm:bottom-1">S</span>
                  <span className="absolute left-0.5 sm:left-1">W</span>
                </div>
                <div className="compass-animation h-6 w-0.5 sm:h-10 sm:w-1 flex items-center justify-center">
                  <div className="h-3 w-0.5 sm:h-5 sm:w-1 bg-[#D1512D] rounded-t-full"></div>
                  <div className="h-3 w-0.5 sm:h-5 sm:w-1 bg-[#1A1A1A]/30 rounded-b-full"></div>
                </div>
              </div>
            </div>

            {/* Legend marker warning */}
            {navigationRoute.path && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded bg-[#FAF9F6] border border-[#1A1A1A]/12 px-3.5 py-1.5 text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] shadow-sm">
                <InfoIcon className="h-3.5 w-3.5 text-[#D1512D] animate-bounce" />
                <span>Showing route from Main Gate connecting junctions.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dynamic Keyframes injected into DOM for SVG navigation path animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
