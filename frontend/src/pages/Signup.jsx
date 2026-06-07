import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { UserPlus, BookOpen, AlertCircle } from "lucide-react";

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setErrMessage("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrMessage("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErrMessage("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    setErrMessage("");
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setErrMessage(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-500/20 text-brand-400 mb-4 border border-brand-500/30">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Create a New Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join the community to start answering questions!
          </p>
        </div>

        {errMessage && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/20 p-3 rounded-lg"
          >
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
            <span>{errMessage}</span>
          </motion.div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-4 py-2.5 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 glass-input"
                placeholder="studious_coder"
                value={username}
                onChange={onChange}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-2.5 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 glass-input"
                placeholder="you@example.com"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-2.5 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 glass-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={onChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-4 py-2.5 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 glass-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-black w-full py-3"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Sign Up
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-500 hover:text-brand-400 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
