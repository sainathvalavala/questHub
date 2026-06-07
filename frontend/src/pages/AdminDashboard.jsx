import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, Trash2, Calendar, FileText, CheckCircle, ShieldAlert, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load admin feeds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAllQuestions();
  }, [user, isAuthenticated]);

  const handleAdminDelete = async (questionId) => {
    if (!window.confirm('WARNING: Admin override. Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(`/api/questions/${questionId}`);
      setQuestions(prev => prev.filter(q => q._id !== questionId));
    } catch (err) {
      console.error('Failed to moderate question:', err);
      alert('Moderation action failed.');
    }
  };

  // Calculate stats from loaded questions list
  const totalQuestions = questions.length;
  const solvedQuestions = questions.filter(q => q.status === 'solved').length;
  const unsolvedQuestions = totalQuestions - solvedQuestions;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Administration Dashboard</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Global platform moderation & content checks</p>
          </div>
        </div>
        
        <button
          onClick={fetchAllQuestions}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold border border-white/5"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-200 bg-red-900/30 border border-red-500/20 p-3 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary statistics counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Questions</span>
            <p className="text-2xl font-extrabold text-white mt-0.5">{totalQuestions}</p>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Solved Posts</span>
            <p className="text-2xl font-extrabold text-white mt-0.5">{solvedQuestions}</p>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Open Queries</span>
            <p className="text-2xl font-extrabold text-white mt-0.5">{unsolvedQuestions}</p>
          </div>
        </div>
      </div>

      {/* Moderation table list */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="p-4 bg-white/5 border-b border-white/5 font-bold text-sm text-slate-300">
          Recent Platform Questions ({questions.length})
        </div>

        {questions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No questions logged on the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-slate-400 font-bold uppercase bg-white/[0.01]">
                  <th className="p-4">Question Title</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Asker</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">
                      <Link to={`/questions/${q._id}`} className="hover:text-brand-300 transition-colors line-clamp-1">
                        {q.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {q.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-medium border border-white/5">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-400">{q.asker?.username || 'System User'}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        q.status === 'solved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAdminDelete(q._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete Question (Admin Override)"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
