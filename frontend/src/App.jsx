import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Wrapper for routes requiring user authentication
const PrivateRoute = ({ children }) => {
  const { loading, isAuthenticated } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Wrapper for routes restricted to administrators
const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-lightbg-50 dark:bg-darkbg-900 text-slate-900 dark:text-slate-100 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Views */}
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/profile/:id" element={<Profile />} />

              {/* Authenticated User Views */}
              <Route path="/ask" element={
                <PrivateRoute>
                  <AskQuestion />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              {/* Admin Moderation Views */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              {/* Redirect any other routing query back to feed */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
