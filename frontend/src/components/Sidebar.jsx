import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trophy, PlusCircle, PenTool, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/auth/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Ask Question Quick Action */}
      {isAuthenticated && (
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-card p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <HelpCircle className="h-24 w-24 text-brand-400" />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <span>Stuck on Homework?</span>
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Ask the community for help! Asking a question costs 10 points.
          </p>
          <Link
            to="/ask"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white btn-gradient text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Ask a Question</span>
          </Link>
        </motion.div>
      )}

      {/* User Stats Card (If Logged In) */}
      {isAuthenticated && user && (
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="h-10 w-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center font-bold text-brand-400">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-white leading-none">{user.username}</p>
              <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider mt-1 inline-block">
                {user.role} Member
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Asked</span>
              <span className="text-lg font-extrabold text-white">{user.stats?.questionsCount || 0}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Answered</span>
              <span className="text-lg font-extrabold text-white">{user.stats?.answersCount || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Card */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
          <span>Top Brains</span>
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-800 rounded-lg" />
                  <div className="h-4 bg-slate-800 rounded w-20" />
                </div>
                <div className="h-4 bg-slate-800 rounded w-10" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No points recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((u, idx) => (
              <div 
                key={u._id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`font-sans font-extrabold text-sm w-4 text-center ${
                    idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <Link to={`/profile/${u._id}`} className="font-bold text-sm text-slate-200 hover:text-brand-300 transition-colors">
                      {u.username}
                    </Link>
                    <p className="text-[10px] text-slate-500 font-medium">{u.stats?.answersCount || 0} answers</p>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-amber-400">
                  {u.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
