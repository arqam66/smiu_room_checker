import { useState } from 'react';
import { 
  Search, Mail, GraduationCap, Copy, Check, Users, ShieldAlert,
  Globe, Phone, MapPin, ChevronRight, BookOpen, UserCheck
} from 'lucide-react';

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  email: string;
  department: string;
}

const FACULTY_DATA: FacultyMember[] = [
  // 1. Computer Science
  { id: 17, name: "Muhammad Malook Rind", designation: "Professor", email: "mrind@smiu.edu.pk", department: "Computer Science" },
  { id: 19, name: "Sarmad Ahmed Shaikh", designation: "Assistant Professor / In-charge Chairperson", email: "sshaikh@smiu.edu.pk", department: "Computer Science" },
  { id: 21, name: "Syeda Nazia Ashraf", designation: "Lecturer", email: "nashraf@smiu.edu.pk", department: "Computer Science" },
  { id: 22, name: "Sahar Zafar Jumani", designation: "Lecturer", email: "sjumani@smiu.edu.pk", department: "Computer Science" },

  // 2. Software Engineering
  { id: 18, name: "Asif Ali Laghari", designation: "Assistant Professor", email: "alaghari@smiu.edu.pk", department: "Software Engineering" },
  { id: 20, name: "Haque Nawaz Lashari", designation: "Lecturer", email: "hlashari@smiu.edu.pk", department: "Software Engineering" },
  { id: 23, name: "Imran Khan", designation: "Lecturer", email: "ikhan@smiu.edu.pk", department: "Software Engineering" },
  { id: 25, name: "Khawaja Fahad Jawed", designation: "Lecturer", email: "kjawed@smiu.edu.pk", department: "Software Engineering" },

  // 3. Artificial Intelligence & Math Sciences
  { id: 24, name: "Qurban Ali", designation: "Lecturer (AI)", email: "qali@smiu.edu.pk", department: "Artificial Intelligence & Math Sciences" },
  { id: 27, name: "Shiza Riaz Memon", designation: "Lecturer (AI)", email: "smemon@smiu.edu.pk", department: "Artificial Intelligence & Math Sciences" },
  { id: 26, name: "Samreen Javed", designation: "Lecturer (Math)", email: "sjaved@smiu.edu.pk", department: "Artificial Intelligence & Math Sciences" },

  // 4. Business Administration
  { id: 1, name: "Jamshed Adil", designation: "Dean, Faculty of Management, Business Administration & Commerce", email: "jadil@smiu.edu.pk", department: "Business Administration" },
  { id: 2, name: "Zahid Ali Channar", designation: "Professor (Lien)", email: "zchannar@smiu.edu.pk", department: "Business Administration" },
  { id: 3, name: "Muhammad Adnan Khurshid", designation: "Assistant Professor", email: "mkhurshid@smiu.edu.pk", department: "Business Administration" },
  { id: 4, name: "Asif Hussain Samo", designation: "Assistant Professor", email: "asamo@smiu.edu.pk", department: "Business Administration" },
  { id: 5, name: "Muhammad Naeem Ahmed", designation: "Assistant Professor", email: "mahmed@smiu.edu.pk", department: "Business Administration" },

  // 5. Accounting, Banking & Finance
  { id: 6, name: "Shahid Obaid", designation: "Assistant Professor", email: "sobaid@smiu.edu.pk", department: "Accounting, Banking & Finance" },
  { id: 8, name: "Faris Mahar", designation: "Lecturer", email: "fmahar@smiu.edu.pk", department: "Accounting, Banking & Finance" },
  { id: 16, name: "Suman Talreja", designation: "Lecturer", email: "stalreja@smiu.edu.pk", department: "Accounting, Banking & Finance" },

  // 6. Media & Communication Studies
  { id: 9, name: "Maheen Iqbal Awan", designation: "Lecturer", email: "mawan@smiu.edu.pk", department: "Media & Communication Studies" },
  { id: 10, name: "Pireh Sikandar", designation: "Lecturer", email: "psikandar@smiu.edu.pk", department: "Media & Communication Studies" },

  // 7. English
  { id: 11, name: "Sahar Channa", designation: "Lecturer", email: "schanna@smiu.edu.pk", department: "English" },
  { id: 12, name: "Sundus", designation: "Lecturer", email: "sundus@smiu.edu.pk", department: "English" },

  // 8. Environmental Sciences
  { id: 28, name: "Hina Shehnaz", designation: "Incharge Chairperson", email: "hshehnaz@smiu.edu.pk", department: "Environmental Sciences" },
  { id: 29, name: "M. Hashim Zuberi", designation: "Assistant Professor", email: "hzuberi@smiu.edu.pk", department: "Environmental Sciences" },
  { id: 30, name: "Naeem Akhtar Samoon", designation: "Lecturer", email: "nsamoon@smiu.edu.pk", department: "Environmental Sciences" },

  // 9. Education
  { id: 13, name: "Muhammad Danish Mujtaba", designation: "Lecturer", email: "mmujtaba@smiu.edu.pk", department: "Education" },
  { id: 15, name: "Ahsan Ali Abbasi", designation: "Lecturer", email: "aabbasi@smiu.edu.pk", department: "Education" },
  { id: 7, name: "Sehrish Abro", designation: "Lecturer", email: "sabro@smiu.edu.pk", department: "Education" },

  // 10. Social & Development Studies
  { id: 14, name: "Muzafar Ali Shah", designation: "Lecturer", email: "mshah@smiu.edu.pk", department: "Social & Development Studies" }
];

export default function FacultyDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyEmail = (email: string, id: number) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter conditions
  const filteredFaculty = FACULTY_DATA.filter(member => {
    const matchesDept = selectedDept === 'All' || member.department === selectedDept;
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const DEPT_WEBSITES: Record<string, string> = {
    'Computer Science': 'cs.smiu.edu.pk',
    'Software Engineering': 'se.smiu.edu.pk',
    'Artificial Intelligence & Math Sciences': 'aims.smiu.edu.pk',
    'Business Administration': 'smiu.edu.pk/Business',
    'Accounting, Banking & Finance': 'abf.smiu.edu.pk',
    'Media & Communication Studies': 'media.smiu.edu.pk',
    'English': 'eng.smiu.edu.pk',
    'Environmental Sciences': 'env.smiu.edu.pk',
    'Education': 'edu.smiu.edu.pk',
    'Social & Development Studies': 'sd.smiu.edu.pk'
  };

  const departments = [
    'All',
    'Computer Science',
    'Software Engineering',
    'Artificial Intelligence & Math Sciences',
    'Business Administration',
    'Accounting, Banking & Finance',
    'Media & Communication Studies',
    'English',
    'Environmental Sciences',
    'Education',
    'Social & Development Studies'
  ];

  // Count per department for statistics badge
  const getDeptCount = (dept: string) => {
    if (dept === 'All') return FACULTY_DATA.length;
    return FACULTY_DATA.filter(m => m.department === dept).length;
  };

  return (
    <div className="space-y-8 animate-fade-in" id="faculty-directory-section">
      
      {/* Directory Editorial Header */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A]/12 rounded p-5 sm:p-8 shadow-sm text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#0d5c46]/10 border border-[#0d5c46]/15 text-[#0d5c46]">
          <Users className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-widest font-extrabold font-mono">SMIU Global Registry</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3.5xl md:text-5xl font-black italic text-[#1A1A1A] tracking-tight leading-tight">
          SMIU Faculty Directory
        </h2>
        <p className="text-[10px] sm:text-xs font-sans text-[#1A1A1A]/60 uppercase tracking-widest font-extrabold max-w-xl mx-auto">
          Sindh Madressatul Islam University — Karachi, Pakistan
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-[#1A1A1A]/70 font-serif pt-2 border-t border-[#1A1A1A]/5 mt-4">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[#0d5c46]" />
            <a href="https://smiu.edu.pk" target="_blank" rel="noopener noreferrer" className="hover:underline">smiu.edu.pk</a>
          </span>
          <span className="text-[#1A1A1A]/20">•</span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[#0d5c46]" />
            <a href="mailto:info@smiu.edu.pk" className="hover:underline">info@smiu.edu.pk</a>
          </span>
          <span className="text-[#1A1A1A]/20">•</span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-[#0d5c46]" />
            <span>+92-21-111-111-885</span>
          </span>
        </div>
      </div>

      {/* Advanced Filter, Tabs & Search Interface Block */}
      <div className="bg-[#FAF9F6] border border-[#1A1A1A]/12 rounded p-6 shadow-sm max-w-5xl mx-auto space-y-6">
        
        {/* Search controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1A1A1A]/40">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search faculty name, job designation, or official email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#1A1A1A]/10 rounded text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0d5c46] focus:ring-1 focus:ring-[#0d5c46] transition-all"
              id="faculty-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#1A1A1A]/40 hover:text-[#D1512D]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="md:col-span-4 flex justify-end gap-2 text-xs font-mono text-[#1A1A1A]/60">
            <span>Matches found: <strong>{filteredFaculty.length}</strong></span>
          </div>
        </div>

        {/* Horizontal Department Selector list */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/60 font-sans block">
            Filter by Department / Division
          </label>
          <div className="flex flex-wrap gap-2" id="faculty-dept-list">
            {departments.map((dept) => {
              const count = getDeptCount(dept);
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#0d5c46] border-transparent text-white'
                      : 'bg-white border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:border-[#1A1A1A]/30 hover:bg-[#1A1A1A]/5'
                  }`}
                  id={`dept-tab-${dept.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{dept === 'All' ? 'All Departments' : dept}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directory Grid & Tables view */}
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Render filtered results grouped logically or in a tabular form resembling Jinnah's actual official registrar papers */}
        {filteredFaculty.length === 0 ? (
          <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded p-12 text-center" id="no-faculty-results">
            <ShieldAlert className="h-10 w-10 text-[#D1512D] mx-auto mb-4 animate-bounce" />
            <h4 className="font-serif italic font-bold text-[#1A1A1A] text-base mb-1">No Faculty Records Found</h4>
            <p className="text-xs text-[#1A1A1A]/60 font-serif max-w-md mx-auto leading-relaxed">
              We couldn't find any listing matching <span className="font-sans font-bold text-[#D1512D]">"{searchQuery}"</span>. Please try checking for typing errors or switch the department filter.
            </p>
          </div>
        ) : (
          /* Render by departments if 'All' is selected, or render singular selected department list */
          departments.filter(d => d !== 'All' && (selectedDept === 'All' || selectedDept === d)).map((deptName) => {
            const facultyInDept = filteredFaculty.filter(m => m.department === deptName);
            if (facultyInDept.length === 0) return null;

            return (
              <div 
                key={deptName} 
                className="bg-white border border-[#1A1A1A]/12 rounded shadow-sm overflow-hidden"
                id={`dept-section-${deptName.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Department Big Title Header */}
                <div className="bg-[#0b6650] text-[#FAF9F6] px-5 py-4 border-b border-[#1A1A1A]/10 flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-white/90" />
                      <h3 className="font-serif italic font-bold text-md tracking-wide">
                        {deptName}
                      </h3>
                    </div>
                    {DEPT_WEBSITES[deptName] && (
                      <a 
                        href={`https://${DEPT_WEBSITES[deptName]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono bg-white/10 text-white/90 px-2 py-0.5 rounded border border-white/10 hover:bg-white/20 transition-all w-fit"
                      >
                        {DEPT_WEBSITES[deptName]}
                      </a>
                    )}
                  </div>
                  <span className="bg-white/10 border border-white/20 text-xs font-mono text-white px-2.5 py-1 rounded">
                    {facultyInDept.length} Records
                  </span>
                </div>

                {/* Grid Table view matching the beautiful original document style */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF9F6] text-[#1A1A1A] border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-wider font-extrabold font-sans">
                        <th className="py-3.5 px-5 text-center w-14">#</th>
                        <th className="py-3.5 px-4 w-52">Name</th>
                        <th className="py-3.5 px-4">Designation</th>
                        <th className="py-3.5 px-4 w-72 text-right pr-6">Email Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]/5 text-xs">
                      {facultyInDept.map((member, index) => {
                        return (
                          <tr 
                            key={member.id} 
                            className="bg-white hover:bg-[#FAF9F6]/45 transition-colors group"
                            id={`faculty-row-${member.id}`}
                          >
                            {/* Number Row */}
                            <td className="py-4 px-5 text-center font-mono text-[#1A1A1A]/50 font-medium">
                              {index + 1}
                            </td>

                            {/* Name Row */}
                            <td className="py-4 px-4 font-sans font-bold text-[#1a1a1a] tracking-tight text-sm">
                              {member.name}
                            </td>

                            {/* Designation Row */}
                            <td className="py-4 px-4 font-serif text-[#1A1A1A]/80 leading-relaxed max-w-xs">
                              {member.designation}
                              {member.designation.includes('In-charge') || member.designation.includes('Dean') ? (
                                <span className="ml-2 inline-flex items-center gap-0.5 bg-[#0d5c46]/10 text-[#0d5c46] text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">
                                  <UserCheck className="h-2.5 w-2.5" /> Administration
                                </span>
                              ) : null}
                            </td>

                            {/* Email Row with active copy/mailbox actions */}
                            <td className="py-4 px-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-2.5">
                                <a 
                                  href={`mailto:${member.email}`}
                                  className="font-mono text-xs text-[#0d5c46] hover:underline hover:text-[#0b6650] transition-colors break-all"
                                  title={`Shoot email to ${member.name}`}
                                >
                                  {member.email}
                                </a>
                                <button
                                  onClick={() => handleCopyEmail(member.email, member.id)}
                                  className="p-1.5 rounded border border-[#1A1A1A]/10 hover:border-[#0d5c46] hover:bg-[#0d5c46]/5 text-[#1A1A1A]/40 hover:text-[#0d5c46] transition-all cursor-pointer"
                                  title="Copy email to clipboard"
                                  id={`btn-copy-${member.id}`}
                                >
                                  {copiedId === member.id ? (
                                    <Check className="h-3 w-3 text-[#0d5c46]" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile responsive Card List for smaller devices */}
                <div className="md:hidden divide-y divide-[#1A1A1A]/5">
                  {facultyInDept.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="p-4 space-y-3 bg-white"
                      id={`faculty-card-mobile-${member.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[9px] text-[#1A1A1A]/40 font-bold block">
                            #{index + 1}
                          </span>
                          <h4 className="font-sans font-bold text-[#1a1a1a] text-sm tracking-tight leading-snug">
                            {member.name}
                          </h4>
                        </div>
                        {member.designation.includes('In-charge') || member.designation.includes('Dean') ? (
                          <span className="bg-[#0d5c46]/10 text-[#0d5c46] text-[8px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 tracking-wide inline-flex items-center gap-0.5">
                            <UserCheck className="h-2 w-2" /> Admin
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-bold tracking-wider text-[#1A1A1A]/40 block">Designation</span>
                        <p className="font-serif text-xs text-[#1A1A1A]/80 leading-relaxed">
                          {member.designation}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#1A1A1A]/5">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[8px] uppercase font-bold tracking-wider text-[#1A1A1A]/40 block">Email Address</span>
                          <a 
                            href={`mailto:${member.email}`}
                            className="font-mono text-xs text-[#0d5c46] hover:underline hover:text-[#0b6650] block truncate"
                          >
                            {member.email}
                          </a>
                        </div>
                        
                        <button
                          onClick={() => handleCopyEmail(member.email, member.id)}
                          className="self-start sm:self-center px-2.5 py-1.5 rounded border border-[#1A1A1A]/10 hover:border-[#0d5c46] hover:bg-[#0d5c46]/5 text-[#1A1A1A]/60 hover:text-[#0d5c46] transition-all cursor-pointer flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide bg-[#FAF9F6]/50"
                          id={`btn-copy-mobile-${member.id}`}
                        >
                          {copiedId === member.id ? (
                            <>
                              <Check className="h-3 w-3 text-[#0d5c46]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Directory Notes */}
      <div className="bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded p-5 max-w-5xl mx-auto flex items-start gap-3.5 text-xs text-[#1A1A1A]/80 leading-relaxed font-serif">
        <div className="bg-white/80 border border-[#1A1A1A]/10 text-[#0d5c46] p-1.5 rounded flex items-center justify-center">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <p className="font-bold mb-1 text-[#1A1A1A] font-sans text-[10px] uppercase tracking-wider">
            Important Information & Registry Guide:
          </p>
          <p className="text-[11px] leading-relaxed">
            Email addresses follow SMIU's standard format <code className="bg-black/5 px-1 rounded font-mono">[first_initial][last_name]@smiu.edu.pk</code> and are estimated according to institutional patterns. Individual phone extension routing or room assignments can be searched directly using the <strong>Room Finder & Map</strong> registry tools on the primary dashboard. For high priority security queries, contact the University registrar.
          </p>
        </div>
      </div>

    </div>
  );
}
