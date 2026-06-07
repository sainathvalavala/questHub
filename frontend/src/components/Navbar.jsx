import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  BookOpen,
  LogOut,
  ShieldAlert,
  Award,
  User,
  LogIn,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setThemeMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  const currentTheme = themes.find((t) => t.id === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-300"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-white/10 py-2 z-50"
          >
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeMode(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-500/20 text-brand-400 group-hover:scale-105 transition-transform duration-200 border border-brand-500/30">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="font-sans font-extrabold text-xl tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
          QuestHub
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <AnimatePresence mode="wait">
          {isAuthenticated && user && (
            <motion.div
              key={user.points}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.05)]"
            >
              <Award className="h-4 w-4 shrink-0" />
              <span>{user.points} pts</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/40 transition-colors text-sm font-semibold"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">
                  {user.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="btn-black text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
