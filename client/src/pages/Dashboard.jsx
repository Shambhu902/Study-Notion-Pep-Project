import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [myAssignments, setMyAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Stats
        const statsRes = await fetch('https://study-notion-pep-project.onrender.com/api/users/stats', { headers });
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch Recent Assignments Summary (or all for now)
        const assignRes = await fetch('https://study-notion-pep-project.onrender.com/api/assignments/my', { headers });
        const assignData = await assignRes.json();
        setMyAssignments(assignData.slice(0, 3)); // Show top 3 recent
    };
    fetchData();
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="glass-effect p-8 rounded-2xl shadow-xl">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
          <span className="text-xl font-bold text-gray-700">Loading Dashboard...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-black mb-2">
          <span className="gradient-text">Hello, {stats.name}!</span> 👋
        </h1>
        <p className="text-gray-600 text-lg">Welcome back to your learning hub. Here's what's happening today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="card-hover glass-effect p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Points</h3>
                <span className="text-3xl">⭐</span>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{stats.points}</p>
              <p className="text-xs text-gray-500 mt-2">Keep earning to level up!</p>
          </div>
          
          <div className="card-hover glass-effect p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wide">Reviews Done</h3>
                <span className="text-3xl">✍️</span>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{stats.reviewedCount}</p>
              <p className="text-xs text-gray-500 mt-2">Helping peers grow!</p>
          </div>
          
          <div className="card-hover glass-effect p-6 rounded-2xl shadow-lg border-l-4 border-green-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wide">Helpful Score</h3>
                <span className="text-3xl">👍</span>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{stats.helpfulReviewsCount}</p>
              <p className="text-xs text-gray-500 mt-2">Quality feedback given!</p>
          </div>
          
           <div className="card-hover glass-effect p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10 -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wide">Rank</h3>
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">#{stats.rank || '-'}</p>
              <p className="text-xs text-gray-500 mt-2">Your leaderboard position</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Action Shortcuts */}
              <div className="glass-effect p-8 rounded-2xl shadow-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <span className="text-3xl">🚀</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link to="/upload" className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative z-10">
                            <span className="text-4xl mb-3 block">📤</span>
                            <h4 className="font-bold text-lg mb-1">Upload</h4>
                            <p className="text-blue-100 text-sm">Submit new assignment</p>
                          </div>
                      </Link>
                      <Link to="/reviews" className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative z-10">
                            <span className="text-4xl mb-3 block">📝</span>
                            <h4 className="font-bold text-lg mb-1">Review</h4>
                            <p className="text-purple-100 text-sm">Help your peers</p>
                          </div>
                      </Link>
                       <Link to="/leaderboard" className="group relative overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="relative z-10">
                            <span className="text-4xl mb-3 block">🏅</span>
                            <h4 className="font-bold text-lg mb-1">Leaderboard</h4>
                            <p className="text-yellow-100 text-sm">Check rankings</p>
                          </div>
                      </Link>
                  </div>
              </div>

              {/* My Assignments Preview */}
              <div className="glass-effect p-8 rounded-2xl shadow-xl animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-2xl font-black flex items-center gap-2">
                       <span className="text-3xl">📚</span>
                       Recent Assignments
                     </h3>
                     <Link to="/my-assignments" className="text-purple-600 text-sm font-bold hover:text-purple-800 transition-colors flex items-center gap-1">
                       View All
                       <span>→</span>
                     </Link>
                  </div>
                  <div className="space-y-4">
                      {myAssignments.map((assign, idx) => (
                          <div key={assign._id} className="card-hover bg-white p-6 rounded-xl border-2 border-gray-100 shadow-md animate-fade-in" style={{animationDelay: `${0.4 + idx * 0.1}s`}}>
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                  <div className="flex-1">
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                          {assign.title.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-lg text-gray-900 mb-1">{assign.title}</h4>
                                          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                                            assign.status === 'reviewed' 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                              {assign.status === 'reviewed' ? '✓ Reviewed' : '⏳ Pending'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Progress Bar */}
                                      <div className="mb-2">
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="text-gray-600 font-medium">Review Progress</span>
                                          <span className="text-gray-900 font-bold">{assign.receivedReviewsCount}/{assign.requiredReviews}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                          <div 
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{width: `${(assign.receivedReviewsCount / assign.requiredReviews) * 100}%`}}
                                          ></div>
                                        </div>
                                      </div>
                                  </div>
                                  
                                  <Link 
                                    to={`/assignments/${assign._id}/reviews`} 
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-center whitespace-nowrap"
                                  >
                                      View Feedback →
                                  </Link>
                              </div>
                          </div>
                      ))}
                      {myAssignments.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">📭</div>
                          <p className="text-gray-500 text-lg font-medium">No assignments yet.</p>
                          <Link to="/upload" className="text-purple-600 font-bold hover:text-purple-800 mt-2 inline-block">
                            Upload your first assignment →
                          </Link>
                        </div>
                      )}
                  </div>
              </div>

          </div>

          {/* Sidebar - Badges & Level */}
          <div className="space-y-8">
              <div className="glass-effect p-8 rounded-2xl shadow-xl animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <span className="text-3xl">🏅</span>
                    My Badges
                  </h3>
                  {stats.badges && stats.badges.length > 0 ? (
                    <div className="space-y-3">
                        {stats.badges.map((badge, i) => (
                            <div key={i} className="card-hover bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-xl shadow-lg border-2 border-yellow-300 animate-fade-in" style={{animationDelay: `${0.5 + i * 0.1}s`}}>
                                <div className="flex items-center gap-3">
                                  <span className="text-4xl">🏆</span>
                                  <div>
                                    <p className="font-black text-yellow-900 text-lg">{badge}</p>
                                    <p className="text-yellow-800 text-xs">Achievement unlocked!</p>
                                  </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4 opacity-50">🎯</div>
                      <p className="text-gray-500 font-medium mb-2">No badges yet</p>
                      <p className="text-gray-400 text-sm">Keep reviewing to earn your first badge!</p>
                    </div>
                  )}
              </div>
              
              {/* Motivational Card */}
              <div className="glass-effect p-8 rounded-2xl shadow-xl bg-gradient-to-br from-purple-100 to-blue-100 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <span className="text-3xl">💡</span>
                    Keep Going!
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You're doing great! Every review you provide helps someone learn and grow.
                  </p>
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-sm font-bold text-gray-900 mb-1">Next Milestone</p>
                    <p className="text-2xl font-black gradient-text">{Math.ceil((stats.reviewedCount + 1) / 10) * 10} Reviews</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{width: `${(stats.reviewedCount % 10) * 10}%`}}
                      ></div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
