import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchAPI } from "../lib/api";
import { Trash2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function Bins() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBins = async () => {
    try {
      setRefreshing(true);
      const data = await fetchAPI("/bins");
      setBins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBins();
    const interval = setInterval(loadBins, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleEmpty = async (type: string) => {
    try {
      await fetchAPI("/bins/empty", {
        method: "POST",
        body: JSON.stringify({ type }),
      });
      loadBins();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "full": return "text-red-400 bg-red-500/10 border-red-500/50";
      case "warning": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/50";
      default: return "text-green-400 bg-green-500/10 border-green-500/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "full": return <AlertTriangle className="text-red-400" size={20} />;
      case "warning": return <AlertTriangle className="text-yellow-400" size={20} />;
      default: return <CheckCircle className="text-green-400" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white light:text-gray-900">
          <Trash2 className="text-purple-400 light:text-purple-500" />
          Bin Status Monitor
        </h1>
        <button
          onClick={loadBins}
          className={`p-2 rounded-full bg-white/5 light:bg-gray-100 hover:bg-white/10 light:hover:bg-gray-200 transition-colors ${refreshing ? "animate-spin" : ""}`}
        >
          <RefreshCw size={24} className="text-gray-400 light:text-gray-500" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {bins.map((bin, idx) => (
            <motion.div
              key={bin.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
            >
              {/* Background Fill Level Indicator */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/20 light:from-blue-100/50 to-transparent -z-10 transition-all duration-1000"
                style={{ height: `${bin.fill_level}%` }}
              />

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white light:text-gray-900 mb-1">{bin.type}</h3>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(bin.status)}`}>
                    {getStatusIcon(bin.status)}
                    {bin.status}
                  </div>
                </div>
                <div className="text-4xl font-black text-white/20 light:text-gray-200 group-hover:text-white/40 light:group-hover:text-gray-300 transition-colors">
                  {bin.fill_level}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/5 light:bg-gray-100 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bin.fill_level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    bin.status === "full" ? "bg-red-500" :
                    bin.status === "warning" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                />
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 light:text-gray-500">
                <span>Updated: {new Date(bin.last_updated).toLocaleTimeString()}</span>
                {bin.fill_level > 0 && (
                  <button
                    onClick={() => handleEmpty(bin.type)}
                    className="text-blue-400 light:text-blue-600 hover:text-blue-300 light:hover:text-blue-700 font-medium hover:underline"
                  >
                    Empty Bin
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
