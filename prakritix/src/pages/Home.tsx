import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Camera, BarChart2, Trash2, ShieldCheck, Leaf } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: "AI Classification",
      desc: "Real-time object detection and sorting using advanced neural networks.",
      color: "from-blue-500 to-cyan-400",
      link: "/scanner"
    },
    {
      icon: Leaf,
      title: "Biogas Tracker",
      desc: "Monitor the decomposition of your degradable waste into biogas.",
      color: "from-green-600 to-yellow-500",
      link: "/biogas"
    },
    {
      icon: BarChart2,
      title: "Smart Analytics",
      desc: "Track your environmental impact with detailed recycling statistics.",
      color: "from-green-500 to-emerald-400",
      link: "/analytics"
    },
    {
      icon: Trash2,
      title: "Bin Monitoring",
      desc: "Live status updates and fill levels for all connected smart bins.",
      color: "from-purple-500 to-pink-400",
      link: "/bins"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 md:py-24 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 light:bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-white light:text-gray-900">The Future of </span>
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 light:from-green-500 light:via-blue-600 light:to-purple-600 bg-clip-text text-transparent">
            Waste Management
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 light:text-gray-600 max-w-2xl mx-auto mb-10">
          PrakritiX uses advanced machine learning to automatically classify and sort your waste, 
          making recycling effortless and efficient.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/scanner"
            className="px-8 py-4 rounded-full bg-white light:bg-blue-600 text-black light:text-white font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] light:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
          >
            <Camera size={24} />
            Launch Scanner
          </Link>
          <Link 
            to="/about"
            className="px-8 py-4 rounded-full bg-white/10 light:bg-gray-200 text-white light:text-gray-900 font-bold text-lg hover:bg-white/20 light:hover:bg-gray-300 transition-colors backdrop-blur-md border border-white/10 light:border-gray-300"
          >
            Learn More
          </Link>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={feature.link}
                className="block h-full bg-[#1a1f3a]/40 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 p-8 rounded-3xl hover:bg-[#1a1f3a]/60 light:hover:bg-white transition-all hover:-translate-y-2 group shadow-sm"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white light:text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-400 light:text-gray-600 leading-relaxed">{feature.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* Stats/Trust Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 light:from-blue-50 light:to-purple-50 border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
      >
        <div>
          <h2 className="text-3xl font-bold text-white light:text-gray-900 mb-2 flex items-center gap-3">
            <ShieldCheck className="text-green-400 light:text-green-500" size={32} />
            Secure & Private
          </h2>
          <p className="text-gray-400 light:text-gray-600">All scans are processed locally or securely encrypted.</p>
        </div>
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-white light:text-gray-900">99.9%</div>
            <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white light:text-gray-900">4</div>
            <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Core Categories</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white light:text-gray-900">&lt;1s</div>
            <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Latency</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
