import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Image as ImageIcon, Send, Sparkles, AlertCircle, X } from 'lucide-react';

const SUBJECTS = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Other'];

const AskQuestion = () => {
  const { user, updatePoints, updateStats } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: 'Math'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { title, description, tags } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size cannot exceed 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !tags) {
      setErrorMsg('Please complete all fields');
      return;
    }

    if (user && user.points < 10) {
      setErrorMsg('You need at least 10 points to ask a question. Answering questions to earn points!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Prepare multipart form data
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('tags', tags);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await axios.post('/api/questions', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update global context points and stats
      updatePoints(-10);
      updateStats('questionsCount', 1);

      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit question. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back to feed button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Board</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-white">Ask a New Question</h2>
          <p className="text-slate-400 text-sm mt-1">
            Explain your homework problem clearly. High quality questions get answered faster!
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm text-red-200 bg-red-900/30 border border-red-500/20 p-3.5 rounded-xl mb-6"
          >
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title input */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Question Title
            </label>
            <input
              type="text"
              name="title"
              maxLength="150"
              required
              placeholder="e.g. Help with finding the derivative of f(x) = x^2 * sin(x)"
              className="w-full px-4 py-3 rounded-xl text-slate-100 placeholder-slate-500 glass-input text-sm"
              value={title}
              onChange={onChange}
            />
            <span className="text-[10px] text-slate-500 float-right mt-1.5">
              {title.length}/150 characters
            </span>
          </div>

          {/* Subject tag select */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Academic Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setFormData({ ...formData, tags: sub })}
                  className={`text-xs px-4 py-2.5 rounded-xl border font-bold transition-all ${
                    tags === sub
                      ? 'bg-brand-500 text-white border-brand-400'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Description rich content */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Describe your problem
            </label>
            <textarea
              name="description"
              required
              rows="6"
              placeholder="Write out the full homework question, what you've tried so far, and where exactly you are stuck..."
              className="w-full px-4 py-3 rounded-xl text-slate-100 placeholder-slate-500 glass-input text-sm resize-y leading-relaxed font-sans"
              value={description}
              onChange={onChange}
            />
          </div>

          {/* Image Upload attachment */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Upload diagram / textbook snapshot (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block mt-1">
                <img
                  src={imagePreview}
                  alt="Attachment Preview"
                  className="max-h-48 rounded-xl object-contain border border-white/10"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 justify-center w-full border border-dashed border-white/10 hover:border-brand-500/40 py-6 rounded-xl bg-white/5 hover:bg-brand-500/5 cursor-pointer transition-all">
                <ImageIcon className="h-6 w-6 text-slate-400" />
                <span className="text-sm font-semibold text-slate-400">Choose Image File (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Points summary banner */}
          <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Cost per Question</p>
              <p className="text-sm font-extrabold text-amber-400 mt-0.5">-10 Points</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase">Your Balance</p>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {user ? user.points : 0} points
              </p>
            </div>
          </div>

          {/* Submit Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold btn-gradient disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Post Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AskQuestion;
