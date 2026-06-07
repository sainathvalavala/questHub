import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QuestionCard from '../components/QuestionCard';
import { User, Award, HelpCircle, MessageSquare, ThumbsUp, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Determine a gamified rank title based on contribution points
const getRankTitle = (points = 0) => {
  if (points >= 500) return 'Grandmaster Mind';
  if (points >= 300) return 'Brainly Scholar';
  if (points >= 150) return 'Peer Mentor';
  return 'Knowledge Seeker';
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isSelf = !id || (currentUser && currentUser._id === id);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      let userData;
      if (isSelf) {
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }
        const res = await axios.get('/api/auth/me');
        userData = res.data;
      } else {
        const res = await axios.get(`/api/auth/profile/${id}`);
        userData = res.data;
      }
      setProfileUser(userData);

      // Fetch questions asked by this specific user
      const qRes = await axios.get(`/api/questions`, {
        params: { asker: userData._id }
      });
      setUserQuestions(qRes.data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, currentUser, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-200">Profile not found</h3>
        <p className="text-slate-400 mt-2">{errorMsg || 'This user does not exist.'}</p>
      </div>
    );
  }

  const rankTitle = getRankTitle(profileUser.points);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Profile Header Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Large Avatar badge */}
          <div className="h-24 w-24 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-extrabold text-brand-400 text-3xl shrink-0 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            {profileUser.username.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-white">{profileUser.username}</h2>
              <span className="text-xs px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold rounded-full uppercase tracking-wider">
                {rankTitle}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined community in {new Date(profileUser.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
            </p>

            {/* Public/Private Role Alert badge */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg border border-white/5 font-semibold">
                Role: {profileUser.role === 'admin' ? 'Administrator' : 'User'}
              </span>
              {isSelf && (
                <span className="text-xs px-2.5 py-1 bg-brand-500/15 text-brand-400 rounded-lg border border-brand-500/20 font-semibold">
                  Primary Profile
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5 relative z-10">
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <Award className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Points</span>
            <span className="text-xl font-extrabold text-white">{profileUser.points || 0} pts</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <HelpCircle className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Questions Posted</span>
            <span className="text-xl font-extrabold text-white">{profileUser.stats?.questionsCount || 0}</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <MessageSquare className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Answers Provided</span>
            <span className="text-xl font-extrabold text-white">{profileUser.stats?.answersCount || 0}</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <ThumbsUp className="h-5 w-5 text-pink-400 mx-auto mb-1.5" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Upvotes Received</span>
            <span className="text-xl font-extrabold text-white">{profileUser.stats?.upvotesReceived || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* User Questions Feed */}
      <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-brand-400" />
        <span>Questions asked by {profileUser.username} ({userQuestions.length})</span>
      </h3>

      {userQuestions.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl p-6">
          <p className="text-slate-400 text-sm">No questions asked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userQuestions.map((question, idx) => (
            <QuestionCard key={question._id} question={question} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
