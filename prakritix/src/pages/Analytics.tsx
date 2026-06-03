import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchAPI } from "../lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Activity, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI("/analytics")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          <Activity className="text-green-400 light:text-green-500" />
          Analytics Dashboard
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Type Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
            <PieChartIcon className="text-blue-400 light:text-blue-500" />
            Waste Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.typeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.typeDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0e27", borderColor: "#1a1f3a", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data?.typeDistribution?.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
            <TrendingUp className="text-green-400 light:text-green-500" />
            Recent Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.recentActivity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  cursor={{ fill: "#ffffff05" }}
                  contentStyle={{ backgroundColor: "#0a0e27", borderColor: "#1a1f3a", borderRadius: "12px" }}
                />
                <Bar dataKey="count" fill="url(#colorCount)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scan History Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
        >
          <h2 className="text-xl font-bold mb-6 text-white light:text-gray-900">Scan History Timeline</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.recentActivity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0a0e27", borderColor: "#1a1f3a", borderRadius: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#0a0e27" }}
                  activeDot={{ r: 6, fill: "#60a5fa", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
