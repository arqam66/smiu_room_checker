import { Map, BookOpen, Users } from 'lucide-react';
import { Navbar } from "flowbite-react";

interface TopAppBarProps {
  activeTab: 'map' | 'history' | 'directory';
  onTabChange: (tab: 'map' | 'history' | 'directory') => void;
  onHomeClick: () => void;
  onHelpClick: () => void;
}

export default function TopAppBar({
  activeTab,
  onTabChange,
  onHomeClick,
  onHelpClick,
}: TopAppBarProps) {

  return (
    <Navbar
      fluid={true}
      rounded={true}
      className="border-b border-[#1A1A1A]/10 bg-[#F9F7F2]"
    >
      <Navbar.Brand href="#" onClick={onHomeClick} className="flex items-center gap-2">
        <img
          src="/src/assets/images/smiu_logo_1779567984801.png"
          className="h-6 w-6 sm:h-8 sm:w-8 object-cover"
          alt="SMIU Logo"
        />
        <span className="self-center whitespace-nowrap text-sm sm:text-base font-bold text-[#1A1A1A]">
          Room Finder
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active={activeTab === "map"}
          onClick={() => onTabChange("map")}
        >
          <Map className="h-4 w-4 mr-1 inline" /> Finder
        </Navbar.Link>
        <Navbar.Link
          active={activeTab === "history"}
          onClick={() => onTabChange("history")}
        >
          <BookOpen className="h-4 w-4 mr-1 inline" /> History
        </Navbar.Link>
        <Navbar.Link
          active={activeTab === "directory"}
          onClick={() => onTabChange("directory")}
        >
          <Users className="h-4 w-4 mr-1 inline" /> Faculty
        </Navbar.Link>
        <Navbar.Link onClick={onHelpClick}>Help</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

