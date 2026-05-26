import { useState, useEffect } from 'react';
import { Building } from '../types';
import { 
  Building2, ArrowLeft, ShieldCheck, 
  MapPin, Clock, Users, Coffee, Cpu, Tv, Wifi
} from 'lucide-react';

interface BuildingDetailPanelProps {
  building: Building;
  onBack: () => void;
  highlightedRoomId?: string | null;
  searchActive?: boolean;
  startBuildingId: string | null;
  onSetStartBuilding: (id: string | null) => void;
  allBuildings: Building[];
  navigationRoute: {
    startBuildingId: string | null;
    endBuildingId: string | null;
    path: string | null;
    steps: string[];
  };
}

export default function BuildingDetailPanel({
  building,
  onBack,
  highlightedRoomId = null,
  searchActive = false,
  startBuildingId,
  onSetStartBuilding,
  allBuildings,
  navigationRoute,
}: BuildingDetailPanelProps) {
  // Track currently expanded room ID
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);

  // Auto-expand room if specified by search or navigation highlights
  useEffect(() => {
    if (highlightedRoomId) {
      setExpandedRoomId(highlightedRoomId);
      setTimeout(() => {
        const el = document.getElementById(`room-card-${highlightedRoomId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    }
  }, [highlightedRoomId]);

  const AmenityIcon = ({ amenity }: { amenity: string }) => {
    const norm = amenity.toLowerCase();
    if (norm.includes('wifi') || norm.includes('internet')) {
      return <Wifi className="h-3.5 w-3.5 text-[#1A1A1A]/80" />;
    }
    if (norm.includes('projector') || norm.includes('tv') || norm.includes('screen')) {
      return <Tv className="h-3.5 w-3.5 text-[#D1512D]" />;
    }
    if (norm.includes('computer') || norm.includes('pc') || norm.includes('nvidia') || norm.includes('workstation')) {
      return <Cpu className="h-3.5 w-3.5 text-[#1A1A1A]/80" />;
    }
    if (norm.includes('coffee') || norm.includes('refreshment')) {
      return <Coffee className="h-3.5 w-3.5 text-[#D1512D]" />;
    }
    return <ShieldCheck className="h-3.5 w-3.5 text-[#1A1A1A]/50" />;
  };

  return (
    <div className="space-y-4" id="building-detail-panel">
      {/* Header back navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded bg-[#FAF9F6] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F7F2] border border-[#1A1A1A]/15 cursor-pointer transition-colors"
          id="back-to-buildings-btn"
          title="Back"
          aria-label="Back to buildings list"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#D1512D] font-mono font-bold ml-1">
            SMIU Registry
          </span>
          <h3 className="font-serif text-2xl font-black italic tracking-tight text-[#1A1A1A]">
            {building.name}
          </h3>
        </div>
      </div>



      {/* Rooms List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {building.rooms.length === 0 ? (
          <div className="text-center py-8 bg-[#FAF9F6] rounded border border-[#1A1A1A]/12 text-xs italic font-serif text-[#1A1A1A]/60">
            No rooms recorded in this building.
          </div>
        ) : (
          building.rooms.map((room) => {
            const isExpanded = expandedRoomId === room.id;
            return (
              <div
                key={room.id}
                className={`border rounded transition-all ${
                  isExpanded
                    ? 'border-[#D1512D] bg-[#E5E2D9] shadow-sm'
                    : 'border-[#1A1A1A]/12 bg-[#FAF9F6] hover:bg-[#FAF9F6]/80'
                }`}
                id={`room-card-${room.id}`}
              >
                {/* Collapsed top bar */}
                <div
                  onClick={() => setExpandedRoomId(isExpanded ? null : room.id)}
                  className="flex items-center justify-between p-3.5 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 min-h-[32px] min-w-[72px] rounded flex items-center justify-center font-bold text-[10px] sm:text-xs font-mono bg-[#FAF9F6] border border-[#1A1A1A]/10 text-[#1A1A1A] shadow-sm shrink-0 whitespace-nowrap">
                      {room.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-[#1A1A1A]">{room.id === 'M-202' ? 'SMIU Central Library' : room.id === 'A-101' ? 'Shahnawaz Auditorium' : room.name.split(' (')[0]}</h4>
                        {!searchActive && (
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${room.status === 'available' ? 'bg-[#8A9A5B]' : 'bg-[#D1512D]'}`}></span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#1A1A1A]/60 font-medium mt-0.5">
                        {room.floor} • <span className="text-[#D1512D] font-bold">{room.type}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-3.5 border-t border-[#1A1A1A]/10 bg-[#FAF9F6]/60 space-y-3 rounded-b text-left">
                    {/* Activity specs */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center bg-[#E5E2D9]/70 p-2.5 rounded border border-[#1A1A1A]/10">
                        <span className="text-[#1A1A1A]/60 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold">
                          <Users className="h-3.5 w-3.5 text-[#1A1A1A]/70" /> Seating capacity:
                        </span>
                        <span className="font-bold text-[#1A1A1A] font-mono text-xs">{room.capacity} seats</span>
                      </div>
                    </div>

                    {/* Amenities list */}
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest">Amenities available:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((am) => (
                          <span
                            key={am}
                            className="inline-flex items-center gap-1 rounded bg-[#E5E2D9] border border-[#1A1A1A]/10 px-2 py-0.5 text-[9px] text-[#1A1A1A] font-medium"
                          >
                            <AmenityIcon amenity={am} />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>


                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
