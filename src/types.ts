export interface Room {
  id: string;
  name: string;
  floor: string;
  status: 'available' | 'busy' | 'reserved';
  type: 'Lecture Hall' | 'Computer Lab' | 'Seminar Room' | 'Faculty Office' | 'Conference Room' | 'Library' | 'Auditorium';
  currentActivity: string;
  nextActivity: string;
  amenities: string[];
  capacity: number;
}

export interface Building {
  id: string;
  name: string;
  icon: 'Building2' | 'Home' | 'Landmark' | 'Network' | 'BookOpen' | 'Laptop';
  status: string;
  roomsCount: number;
  rooms: Room[];
  coordinates: { x: number; y: number }; // Map relative coordinates for pathing
}

export interface DirectionStep {
  instruction: string;
  icon: string;
}

export interface SearchFilters {
  searchQuery: string;
  status: 'all' | 'available' | 'busy' | 'reserved';
  type: string;
  floor: string;
}
