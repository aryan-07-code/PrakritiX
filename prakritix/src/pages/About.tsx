import { motion } from "motion/react";
import { Info, Cpu, Leaf, ShieldCheck, Github, Globe } from "lucide-react";

export default function About() {
  const techStack = [
    { name: "React", icon: Globe, color: "text-blue-400" },
    { name: "Tailwind CSS", icon: Globe, color: "text-cyan-400" },
    { name: "Express.js", icon: Cpu, color: "text-green-400" },
    { name: "SQLite", icon: Cpu, color: "text-blue-300" },
    { name: "Framer Motion", icon: Globe, color: "text-purple-400" },
    { name: "Recharts", icon: BarChartIcon, color: "text-orange-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] light:shadow-sm"
        >
          <Leaf size={40} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-600 light:from-orange-500 light:to-amber-700 bg-clip-text text-transparent">
          About PrakritiX
        </h1>
        <p className="text-xl text-gray-400 light:text-gray-600 max-w-2xl mx-auto">
          Revolutionizing waste management through artificial intelligence and smart hardware integration.
        </p>
      </div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white light:text-gray-900">
          <Info className="text-blue-400 light:text-blue-500" />
          Our Mission
        </h2>
        <div className="space-y-4 text-gray-300 light:text-gray-700 leading-relaxed text-lg">
          <p>
            PrakritiX was built with a singular goal: to make recycling accurate, effortless, and measurable. 
            By combining computer vision with smart bin technology, we eliminate the confusion of waste sorting.
          </p>
          <p>
            Improper recycling leads to contaminated waste streams, sending otherwise recyclable materials to landfills. 
            Our system ensures that every item ends up in the correct bin, maximizing recycling efficiency and minimizing environmental impact.
          </p>
        </div>
      </motion.section>

      {/* How it Works */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Scan",
            desc: "Hold the item in front of the camera. Our AI model instantly analyzes the object.",
            icon: CameraIcon,
            color: "from-blue-500 to-cyan-400"
          },
          {
            step: "02",
            title: "Classify",
            desc: "The system determines the correct category (Degradable, Non-Degradable, Metal, Hazardous).",
            icon: Cpu,
            color: "from-purple-500 to-pink-400"
          },
          {
            step: "03",
            title: "Sort",
            desc: "The smart bin automatically opens the correct compartment for disposal.",
            icon: TrashIcon,
            color: "from-green-500 to-emerald-400"
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#1a1f3a]/40 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm"
          >
            <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 light:text-gray-100 group-hover:text-white/10 light:group-hover:text-gray-200 transition-colors">
              {item.step}
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
              <item.icon size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white light:text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-400 light:text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] light:from-gray-50 light:to-gray-100 border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 text-center shadow-sm"
      >
        <h2 className="text-2xl font-bold mb-8 text-white light:text-gray-900">Powered By</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 light:bg-white hover:bg-white/10 light:hover:bg-gray-50 transition-colors border border-white/5 light:border-gray-200 min-w-[120px] shadow-sm">
                <Icon size={32} className={tech.color} />
                <span className="font-medium text-gray-300 light:text-gray-700">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}

// Helper icons
function CameraIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

function BarChartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
