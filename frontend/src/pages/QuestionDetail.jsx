import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, ThumbsUp, Check, Award, AlertCircle, Trash2, Calendar, HelpCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetchQuestionDetails = async () => {
    try {
      const res = await axios.get(`/api/questions/${id}`);
      setQuestion(res.data);
    } catch (err) {
      console.error('Failed to load question details:', err);
      setErrorMsg('Question not found or deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setSubmitLoading(true);
    try {
      const res = await axios.post(`/api/answers/${id}`, { content: answerText });
      setQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, res.data]
      }));
      setAnswerText('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post answer.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleVote = async (answerId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.patch(`/api/answers/${answerId}/vote`);
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(ans => ans._id === answerId ? res.data : ans)
      }));
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleToggleBestAnswer = async (answerId) => {
    try {
      const res = await axios.patch(`/api/answers/${answerId}/best`);
      const { answer, questionStatus } = res.data;
      
      setQuestion(prev => ({
        ...prev,
        status: questionStatus,
        answers: prev.answers.map(ans => {
          if (ans._id === answerId) {
            return answer;
          } else {
            // Reset other answers' best answer state since only 1 can be best
            return { ...ans, isBestAnswer: false };
          }
        })
      }));
    } catch (err) {
      console.error('Failed to mark best answer:', err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This will also delete all answers.')) return;
    try {
      await axios.delete(`/api/questions/${id}`);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    try {
      await axios.delete(`/api/answers/${answerId}`);
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.filter(ans => ans._id !== answerId)
      }));
    } catch (err) {
      console.error('Failed to delete answer:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-200">Question not found</h3>
        <p className="text-slate-400 mt-2">{errorMsg || 'This link might be broken.'}</p>
        <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  const isQuestionAuthor = user && user._id === question.asker?._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb Row */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </button>

        {/* Delete question button */}
        {(isQuestionAuthor || isAdmin) && (
          <button
            onClick={handleDeleteQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Question</span>
          </button>
        )}
      </div>

      {/* Main Question Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl" />

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center font-bold text-brand-400">
              {question.asker?.username?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">{question.asker?.username || 'User'}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Calendar className="h-3 w-3" />
                <span>Asked on {new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {question.tags.map((tag, idx) => (
              <span key={idx} className="text-xs px-3 py-1 bg-white/5 border border-white/5 text-slate-300 rounded-full font-semibold">
                {tag}
              </span>
            ))}
            {question.status === 'solved' ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                <Check className="h-3.5 w-3.5" />
                <span>Solved</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Open</span>
              </span>
            )}
          </div>
        </div>

        {/* Body Text */}
        <h1 className="text-2xl font-extrabold text-white leading-tight mb-4">
          {question.title}
        </h1>
        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-sans">
          {question.description}
        </p>

        {/* Diagram Attachment Thumbnail */}
        {question.imageUrl && (
          <div className="mt-6">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">Attached Problem Image:</p>
            <div 
              onClick={() => setLightboxOpen(true)}
              className="relative group inline-block cursor-zoom-in overflow-hidden rounded-xl border border-white/10"
            >
              <img
                src={question.imageUrl}
                alt="Homework snapshot"
                className="max-h-60 rounded-xl object-contain group-hover:scale-[1.01] transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs gap-1.5">
                <Eye className="h-4 w-4" />
                <span>Zoom Diagram</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Overlay */}
      <AnimatePresence>
        {lightboxOpen && question.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={question.imageUrl}
              alt="Homework diagram full-screen"
              className="max-w-full max-h-full rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answers Section */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-brand-400" />
          <span>Community Answers ({question.answers?.length || 0})</span>
        </h3>

        {question.answers?.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl p-6">
            <p className="text-slate-400 text-sm">No answers submitted yet. Be the first to help out!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {question.answers.map((ans) => {
              const hasUpvoted = user && ans.upvotes.includes(user._id);
              const isResponder = user && ans.responder?._id === user._id;

              return (
                <motion.div
                  key={ans._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card rounded-2xl p-5 md:p-6 transition-all relative overflow-hidden ${
                    ans.isBestAnswer 
                      ? 'border-emerald-500/40 bg-emerald-950/10 shadow-[0_0_20px_rgba(16,185,129,0.08)]' 
                      : 'border-white/5'
                  }`}
                >
                  {/* Highlight bar for best answer */}
                  {ans.isBestAnswer && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  )}

                  {/* Answer Header */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-slate-300 text-xs">
                        {ans.responder?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-xs">{ans.responder?.username || 'User'}</p>
                        <div className="flex items-center gap-1 text-[9px] text-slate-500">
                          <Award className="h-3 w-3 text-amber-500" />
                          <span>{ans.responder?.points || 0} pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Answer Indicator badge */}
                    {ans.isBestAnswer && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                        <Check className="h-3 w-3 shrink-0" />
                        <span>Best Answer (+20 pts)</span>
                      </span>
                    )}
                  </div>

                  {/* Content body */}
                  <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                    {ans.content}
                  </p>

                  {/* Answer actions footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleVote(ans._id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-bold ${
                          hasUpvoted
                            ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                            : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{ans.upvotes.length} Upvotes</span>
                      </button>

                      {/* Best Answer Selector toggle (creator only) */}
                      {isQuestionAuthor && (
                        <button
                          onClick={() => handleToggleBestAnswer(ans._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-bold ${
                            ans.isBestAnswer
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-white/5 border-transparent text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{ans.isBestAnswer ? 'Unmark Best' : 'Mark Best'}</span>
                        </button>
                      )}
                    </div>

                    {/* Delete answer moderation tool */}
                    {(isResponder || isAdmin) && (
                      <button
                        onClick={() => handleDeleteAnswer(ans._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Answer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Answer Submission Form */}
      {isAuthenticated ? (
        isQuestionAuthor ? (
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-2 text-sm text-slate-400">
            <AlertCircle className="h-5 w-5 text-slate-400" />
            <span>You cannot answer your own question. Wait for community experts to respond.</span>
          </div>
        ) : (
          <form onSubmit={handlePostAnswer} className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <h4 className="text-sm font-bold text-white mb-3">Post Your Answer</h4>
            <textarea
              required
              rows="4"
              placeholder="Provide a step-by-step clear explanation for this problem. You will earn +15 points for helping..."
              className="w-full px-4 py-3 rounded-xl text-slate-100 placeholder-slate-500 glass-input text-sm leading-relaxed mb-4 resize-y font-sans"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-400 font-semibold">Earns +15 points for answering</span>
              <button
                type="submit"
                disabled={submitLoading || !answerText.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold btn-gradient disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {submitLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="text-center py-6 glass-card rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-4">Want to submit an answer and earn points?</p>
          <Link to="/login" className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all border border-brand-500/30">
            Sign In to Answer
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
