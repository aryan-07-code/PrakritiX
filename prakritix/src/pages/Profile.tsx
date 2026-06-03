import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { fetchAPI } from "../lib/api";
import { User, Mail, Calendar, Award, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAPI("/user/profile")
      .then((res) => {
        setProfileData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-blue-400 light:text-blue-500" />
          <span className="text-white light:text-gray-900">Agent Profile</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)] light:shadow-sm">
            <div className="w-full h-full bg-[#0a0e27] light:bg-white rounded-full flex items-center justify-center border-4 border-[#1a1f3a] light:border-gray-100">
              <span className="text-4xl font-bold text-white light:text-gray-900 uppercase">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white light:text-gray-900 mb-2">{user?.name}</h2>
          <div className="flex items-center justify-center gap-2 text-gray-400 light:text-gray-500 mb-6">
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 light:text-gray-400 mb-8">
            <Calendar size={16} />
            <span>Joined {new Date(profileData?.user?.created_at).toLocaleDateString()}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-500/10 light:bg-red-50 text-red-400 light:text-red-500 font-bold hover:bg-red-500/20 light:hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-500/20 light:border-red-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </motion.div>

        {/* Stats & Navigation */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 light:from-blue-50 light:to-cyan-50 backdrop-blur-xl border border-blue-500/20 light:border-blue-200 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 light:bg-blue-100 rounded-xl">
                  <ScanIcon className="text-blue-400 light:text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-white light:text-gray-900">Total Scans</h3>
              </div>
              <div className="text-4xl font-black text-white light:text-gray-900">
                {profileData?.stats?.total_scans || 0}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 light:from-green-50 light:to-emerald-50 backdrop-blur-xl border border-green-500/20 light:border-green-200 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/20 light:bg-green-100 rounded-xl">
                  <Award className="text-green-400 light:text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-white light:text-gray-900">Degradable</h3>
              </div>
              <div className="text-4xl font-black text-white light:text-gray-900">
                {profileData?.stats?.degradable_count || 0}
              </div>
            </motion.div>
          </div>

          {/* Menu Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
          >
            <div className="divide-y divide-white/5 light:divide-gray-100">
              {[
                { label: "Account Settings", icon: User, path: "/settings" },
                { label: "Notification Preferences", icon: Mail, path: "/settings" },
                { label: "Scan History", icon: Calendar, path: "/analytics" },
                { label: "Help & Support", icon: InfoIcon, path: "/about" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 light:hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 light:bg-gray-100 rounded-lg group-hover:bg-blue-500/20 light:group-hover:bg-blue-100 group-hover:text-blue-400 light:group-hover:text-blue-600 transition-colors text-gray-400 light:text-gray-500">
                        <Icon size={20} />
                      </div>
                      <span className="font-medium text-gray-300 light:text-gray-700 group-hover:text-white light:group-hover:text-gray-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="text-gray-500 light:text-gray-400 group-hover:text-white light:group-hover:text-gray-900 transition-colors" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function ScanIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect width="10" height="8" x="7" y="8" rx="2" />
    </svg>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
