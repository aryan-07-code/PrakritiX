import { useState } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Bell, Monitor, Cpu, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [arduinoConnected, setArduinoConnected] = useState(true);
  const [binThreshold, setBinThreshold] = useState(80);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-gray-400 light:text-gray-500" />
          System Configuration
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Appearance & Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
            <Monitor className="text-blue-400 light:text-blue-500" />
            Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white light:text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-400 light:text-gray-500">Receive alerts when bins are full.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-700 light:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white light:text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-400 light:text-gray-500">Toggle dark/light theme.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-700 light:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Hardware Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
            <Cpu className="text-green-400 light:text-green-500" />
            Hardware Integration
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white light:text-gray-900">Arduino Connection</h3>
                <p className="text-sm text-gray-400 light:text-gray-500">Status of the smart bin controller.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold uppercase ${arduinoConnected ? "text-green-400 light:text-green-600" : "text-red-400 light:text-red-600"}`}>
                  {arduinoConnected ? "Connected" : "Disconnected"}
                </span>
                <button
                  onClick={() => setArduinoConnected(!arduinoConnected)}
                  className="px-4 py-2 rounded-lg bg-white/5 light:bg-gray-100 hover:bg-white/10 light:hover:bg-gray-200 text-sm font-medium transition-colors border border-white/10 light:border-gray-300"
                >
                  Toggle
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 light:border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-white light:text-gray-900 flex items-center gap-2">
                    <Trash2 size={16} className="text-purple-400 light:text-purple-500" />
                    Bin Full Threshold
                  </h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">Alert level for bin capacity.</p>
                </div>
                <span className="text-2xl font-black text-blue-400 light:text-blue-600">{binThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={binThreshold}
                onChange={(e) => setBinThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 light:bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>50%</span>
                <span>75%</span>
                <span>95%</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
