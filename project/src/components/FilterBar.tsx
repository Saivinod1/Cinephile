import { ArrowUpDown, Eye, Heart } from 'lucide-react';

export type SortOption = 'year-desc' | 'year-asc' | 'favorites' | 'watched';
export type FilterOption = 'all' | 'watched' | 'unwatched' | 'favorites';

interface FilterBarProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

export function FilterBar({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange
}: FilterBarProps) {
  return (
    <div className="bg-[#232323] border-b border-[#181818]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[#FAFAFA]/60 text-sm mb-2">Sort By</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onSortChange('year-desc')}
                className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                  sortBy === 'year-desc'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={sortBy === 'year-desc'}
              >
                <ArrowUpDown size={14} />
                Newest First
              </button>
              <button
                onClick={() => onSortChange('year-asc')}
                className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                  sortBy === 'year-asc'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={sortBy === 'year-asc'}
              >
                <ArrowUpDown size={14} />
                Oldest First
              </button>
              <button
                onClick={() => onSortChange('favorites')}
                className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                  sortBy === 'favorites'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={sortBy === 'favorites'}
              >
                <Heart size={14} />
                Favorites First
              </button>
              <button
                onClick={() => onSortChange('watched')}
                className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-1.5 ${
                  sortBy === 'watched'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={sortBy === 'watched'}
              >
                <Eye size={14} />
                Watched First
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-[#FAFAFA]/60 text-sm mb-2">Filter By</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  filterBy === 'all'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={filterBy === 'all'}
              >
                All Movies
              </button>
              <button
                onClick={() => onFilterChange('watched')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  filterBy === 'watched'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={filterBy === 'watched'}
              >
                Watched
              </button>
              <button
                onClick={() => onFilterChange('unwatched')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  filterBy === 'unwatched'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={filterBy === 'unwatched'}
              >
                Unwatched
              </button>
              <button
                onClick={() => onFilterChange('favorites')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  filterBy === 'favorites'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                }`}
                aria-pressed={filterBy === 'favorites'}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
