import { Film, LayoutDashboard, ListVideo, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'movies';
  onTabChange: (tab: 'dashboard' | 'movies') => void;
  onBackToClient: () => void;
}

export function AdminLayout({ children, activeTab, onTabChange, onBackToClient }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#181818] flex">
      <aside className="w-64 bg-[#232323] border-r border-[#181818] flex flex-col">
        <div className="p-6 border-b border-[#181818]">
          <div className="flex items-center gap-2 text-[#FAFAFA] mb-6">
            <Film size={32} />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={onBackToClient}
            className="flex items-center gap-2 px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg hover:bg-[#2a2a2a] transition-colors w-full"
          >
            <ArrowLeft size={18} />
            <span>Back to Client</span>
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'text-[#FAFAFA] hover:bg-[#181818]'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('movies')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'movies'
                    ? 'bg-[#FAFAFA] text-[#181818]'
                    : 'text-[#FAFAFA] hover:bg-[#181818]'
                }`}
              >
                <ListVideo size={20} />
                <span className="font-medium">Manage Movies</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
