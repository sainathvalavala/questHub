import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, CheckCircle2, Calendar } from 'lucide-react';

// Custom subject badges color mappings
const getSubjectBadgeStyle = (subject) => {
  const sub = subject.toLowerCase().trim();
  if (sub.includes('html')) {
    return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
  } else if (sub.includes('css')) {
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  } else if (sub.includes('javascript') || sub === 'js') {
    return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  } else if (sub.includes('react')) {
    return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
  } else if (sub.includes('node')) {
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  }
  return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
};

const QuestionCard = ({ question, index }) => {
  const { _id, title, description, tags, status, answers, asker, createdAt } = question;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap gap-1.5">
            {tags && tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold tracking-wide ${getSubjectBadgeStyle(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            {status === 'solved' ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Solved</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                <HelpCircle className="h-3 w-3 shrink-0" />
                <span>Open</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/questions/${_id}`} className="block group">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-slate-400 text-sm mt-2 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer Meta Row */}
      <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-bold text-brand-400 text-[10px]">
            {asker?.username?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-slate-300">{asker?.username || 'User'}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <Link
          to={`/questions/${_id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-brand-500/20 hover:text-brand-300 border border-transparent hover:border-brand-500/20 transition-all text-xs font-bold"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{answers?.length || 0} {answers?.length === 1 ? 'Answer' : 'Answers'}</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
