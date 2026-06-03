import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Camera, BarChart2, Trash2, User, Settings, Info, LogOut, Leaf } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/scanner", icon: Camera, label: "Scanner" },
    { path: "/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/biogas", icon: Leaf, label: "Biogas" },
    { path: "/bins", icon: Trash2, label: "Bins" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" },
    { path: "/about", icon: Info, label: "About" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] light:bg-gray-50 text-white light:text-gray-900 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar for Desktop / Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 w-full md:w-64 md:relative md:h-screen bg-[#1a1f3a]/80 light:bg-white/80 backdrop-blur-md border-t md:border-t-0 md:border-r border-white/10 light:border-gray-200 z-50 flex md:flex-col justify-between p-2 md:p-6 transition-colors duration-300">
        <div className="hidden md:flex flex-col items-center mb-8 gap-2">
          <img 
            src="/logo.png" 
            alt="PrakritiX Logo" 
            className="w-full max-w-[180px] h-auto object-contain bg-white/5 light:bg-gray-100 rounded-2xl p-2"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('fallback-logo-text');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <h1 id="fallback-logo-text" className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent hidden">
            PrakritiX
          </h1>
        </div>
        
        <div className="flex md:flex-col w-full justify-around md:justify-start gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 light:bg-blue-100 light:text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] light:shadow-none"
                    : "text-gray-400 light:text-gray-500 hover:bg-white/5 light:hover:bg-gray-100 hover:text-white light:hover:text-gray-900"
                }`}
              >
                <Icon size={24} />
                <span className="hidden md:block font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:block mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-red-400 light:text-red-500 hover:bg-red-500/10 light:hover:bg-red-50 transition-all"
          >
            <LogOut size={24} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0e27] to-[#0a0e27] light:from-blue-100/50 light:via-gray-50 light:to-gray-50 -z-10 transition-colors duration-300" />
        {children}
      </main>
    </div>
  );
}
