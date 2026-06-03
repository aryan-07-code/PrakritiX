import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AnimatePresence, motion } from "motion/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Scanner from "./pages/Scanner";
import Analytics from "./pages/Analytics";
import Bins from "./pages/Bins";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import BiogasTracker from "./pages/BiogasTracker";
import Background3D from "./components/Background3D";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: "20%",
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: "-20%",
  },
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/login" element={
            <motion.div key="login" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <Login />
            </motion.div>
          } />
          <Route path="/signup" element={
            <motion.div key="signup" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <Signup />
            </motion.div>
          } />
          
          <Route path="/" element={
            <motion.div key="home" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Home /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/scanner" element={
            <motion.div key="scanner" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Scanner /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/analytics" element={
            <motion.div key="analytics" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Analytics /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/biogas" element={
            <motion.div key="biogas" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><BiogasTracker /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/bins" element={
            <motion.div key="bins" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Bins /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/profile" element={
            <motion.div key="profile" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Profile /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/settings" element={
            <motion.div key="settings" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><Settings /></ProtectedRoute>
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div key="about" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full h-full absolute inset-0">
              <ProtectedRoute><About /></ProtectedRoute>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Background3D />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
