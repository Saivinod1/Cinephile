import { Film, Search, Settings } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminClick?: () => void;
  showAdminButton?: boolean;
}

export function Header({ searchQuery, onSearchChange, onAdminClick, showAdminButton = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#232323] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#FAFAFA]">
            <Film size={32} />
            <h1 className="text-2xl font-bold">Cinephile</h1>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FAFAFA]/60"
                size={20}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search movies by title, genre, or language..."
                className="w-full pl-10 pr-4 py-2 bg-[#232323] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20 placeholder:text-[#FAFAFA]/40"
                aria-label="Search movies"
              />
            </div>
          </div>

          {showAdminButton && onAdminClick && (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#232323] text-[#FAFAFA] rounded-lg hover:bg-[#2a2a2a] transition-colors"
              aria-label="Go to admin panel"
            >
              <Settings size={20} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
