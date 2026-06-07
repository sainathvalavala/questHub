import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, Filter, HelpCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const SUBJECTS = ['All', 'HTML', 'CSS', 'JavaScript', 'React'];

const Feed = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unsolved, solved

  // Handle debouncing for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedTag && selectedTag !== 'All') params.tag = selectedTag;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

      const res = await axios.get('/api/questions', { params });
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [debouncedSearch, selectedTag, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Search and Quick Filters bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search homework questions (e.g. quadratic equations, cold war)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status filter selection */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-brand-600 text-white border-brand-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                  : 'bg-darkbg-800/80 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'unsolved'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-darkbg-800/80 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Unsolved</span>
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === 'solved'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-darkbg-800/80 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Solved</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center justify-between lg:justify-end">
          <button 
            onClick={fetchQuestions}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-400 bg-white/5 border border-white/5 hover:border-brand-500/20 px-4 py-3.5 rounded-xl transition-all"
            title="Refresh feed"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Questions list container */}
        <div className="flex-1 w-full space-y-6">
          {/* Subject Filter Badge Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 md:-mx-0 md:px-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Subjects:</span>
            </span>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedTag(subject)}
                className={`text-xs px-4 py-2 rounded-full border font-bold transition-all shrink-0 ${
                  selectedTag === subject
                    ? 'bg-brand-500 text-white border-brand-400'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Feed Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loading ? (
              <SkeletonLoader count={4} />
            ) : questions.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-card rounded-2xl p-8">
                <HelpCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-200">No questions found</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  We couldn't find any questions matching your filters. Why not be the first to ask?
                </p>
              </div>
            ) : (
              questions.map((question, idx) => (
                <QuestionCard key={question._id} question={question} index={idx} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <Sidebar />
      </div>
    </div>
  );
};

export default Feed;
