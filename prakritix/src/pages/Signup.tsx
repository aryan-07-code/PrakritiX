import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAPI } from "../lib/api";
import { motion } from "motion/react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] light:bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-[#0a0e27] to-[#0a0e27] light:from-green-100/50 light:via-gray-50 light:to-gray-50 -z-10 transition-colors duration-300" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 light:border-gray-200 shadow-[0_0_50px_rgba(74,222,128,0.15)] light:shadow-xl"
      >
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="PrakritiX Logo" 
            className="w-full max-w-[200px] h-auto object-contain bg-white/5 light:bg-gray-100 rounded-2xl p-4 mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('signup-fallback-logo');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <h1 id="signup-fallback-logo" className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 light:from-orange-500 light:to-amber-700 bg-clip-text text-transparent mb-2 hidden">
            Join PrakritiX
          </h1>
          <p className="text-gray-400 light:text-gray-600">Initialize your smart waste profile</p>
        </div>

        {error && (
          <div className="bg-red-500/10 light:bg-red-50 border border-red-500/50 light:border-red-200 text-red-400 light:text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 light:text-gray-700 mb-2">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 light:bg-white border border-white/10 light:border-gray-300 rounded-xl p-3 text-white light:text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 light:text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 light:bg-white border border-white/10 light:border-gray-300 rounded-xl p-3 text-white light:text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 light:text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 light:bg-white border border-white/10 light:border-gray-300 rounded-xl p-3 text-white light:text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Initialize Profile
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 light:text-gray-600">
          Already have access?{" "}
          <Link to="/login" className="text-green-400 light:text-green-600 hover:text-green-300 light:hover:text-green-700 font-medium">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
