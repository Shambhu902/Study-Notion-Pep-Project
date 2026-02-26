import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import UploadAssignment from './pages/UploadAssignment';
import MyAssignments from './pages/MyAssignments';
import AssignmentsToReview from './pages/AssignmentsToReview';
import SubmitReview from './pages/SubmitReview';
import Leaderboard from './pages/Leaderboard';
import ViewReviews from './pages/ViewReviews';
import AdminLayout from './components/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';

const AppContent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Verify token and get role
                const res = await fetch('https://study-notion-pep-project.onrender.com/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const user = await res.json();
                    setIsAuthenticated(true);
                    setUserRole(user.role);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch (err) {
                 localStorage.removeItem('token');
                 setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        navigate('/');
    };

    const setAuth = (bool) => {
        setIsAuthenticated(bool);
        if(bool) checkAuth(); // Re-fetch role on login
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    const isInstructor = userRole === 'instructor';
    const isAdmin = userRole === 'admin';

    const location = useLocation();

    // Separate layout for Admin
    if (isAuthenticated && isAdmin && location.pathname.startsWith('/admin')) {
        return (
            <>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/admin" element={<AdminLayout logout={logout} />}>
                        <Route index element={<AdminHome />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                    </Route>
                </Routes>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            <nav className="p-5 glass-effect shadow-lg flex justify-between items-center sticky top-0 z-50 border-b border-purple-100">
                <Link to="/" className="text-2xl font-extrabold gradient-text flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl">🎓</span> StudyNotion 
                    {isInstructor && <span className="text-xs text-purple-800 bg-purple-100 px-3 py-1 rounded-full font-semibold">Instructor</span>}
                </Link>
                <div className="space-x-6 flex items-center">
                    {isAuthenticated ? (
                        <>
                            {!isInstructor && !isAdmin && (
                                <>
                                    <Link to="/upload" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                                        Upload
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link to="/my-assignments" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                                        My Work
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link to="/reviews" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                                        Review Peers
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                    <Link to="/leaderboard" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                                        Leaderboard
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                </>
                            )}
                            {isInstructor && (
                                <Link to="/instructor-dashboard" className="text-purple-600 font-bold hover:text-purple-800 transition-colors duration-200">Instructor Dashboard</Link>
                            )}
                            {isAdmin && (
                                <Link to="/admin" className="text-red-600 font-bold hover:text-red-800 transition-colors duration-200">Admin Dashboard</Link>
                            )}
                            
                            <span className="border-l pl-4 mx-2 h-6 block border-purple-200"></span>
                            <button onClick={logout} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                             <Link to="/login" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200">Login</Link>
                             <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register setAuth={setAuth} />} />
                
                {/* Routing Logic */}
                <Route path="/dashboard" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" /> : (isInstructor ? <Navigate to="/instructor-dashboard" /> : <Dashboard />)) : <Navigate to="/login" />} />
                <Route path="/instructor-dashboard" element={isAuthenticated && isInstructor ? <InstructorDashboard /> : <Navigate to="/dashboard" />} />
                <Route path="/admin" element={isAuthenticated && isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />} />

                {/* Common Routes */}
                <Route path="/upload" element={isAuthenticated ? <UploadAssignment /> : <Navigate to="/login" />} />
                <Route path="/my-assignments" element={isAuthenticated ? <MyAssignments /> : <Navigate to="/login" />} />
                <Route path="/reviews" element={isAuthenticated ? <AssignmentsToReview /> : <Navigate to="/login" />} />
                <Route path="/submit-review/:id" element={isAuthenticated ? <SubmitReview /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/assignments/:id/reviews" element={isAuthenticated ? <ViewReviews /> : <Navigate to="/login" />} />
                
                <Route path="/" element={
                   isAuthenticated ? <Navigate to="/dashboard" /> : (
                    <div className="min-h-screen">
                        {/* Hero Section */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-20">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
                                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
                            </div>
                            
                            <div className="max-w-7xl mx-auto px-6 relative z-10">
                                <div className="text-center animate-fade-in-up">
                                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-sm font-semibold text-gray-700">Collaborative Learning Platform</span>
                                    </div>
                                    
                                    <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
                                        <span className="gradient-text">StudyNotion</span>
                                    </h1>
                                    
                                    <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
                                        Empower your learning through <span className="text-purple-600 font-bold">peer collaboration</span>. 
                                        Review assignments, earn badges, and climb the leaderboard.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                        <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                                            🚀 Get Started Free
                                        </Link>
                                        <Link to="/login" className="glass-effect text-gray-800 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            Login
                                        </Link>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center gap-8 text-center">
                                        <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                                            <div className="text-4xl font-black gradient-text">10K+</div>
                                            <div className="text-gray-600 font-medium">Reviews Submitted</div>
                                        </div>
                                        <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                                            <div className="text-4xl font-black gradient-text">500+</div>
                                            <div className="text-gray-600 font-medium">Active Students</div>
                                        </div>
                                        <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
                                            <div className="text-4xl font-black gradient-text">98%</div>
                                            <div className="text-gray-600 font-medium">Satisfaction Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="text-center mb-16 animate-fade-in-up">
                                    <h2 className="text-5xl font-black mb-4 text-gray-900">Why Choose <span className="gradient-text">StudyNotion</span>?</h2>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of collaborative learning with powerful features designed for students and instructors.</p>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Feature 1 */}
                                    <div className="card-hover bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg">
                                        <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                            <span className="text-3xl">✍️</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Peer Review System</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">Submit your assignments and receive constructive feedback from your peers. Learn by reviewing others' work and gain valuable insights.</p>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Anonymous review process
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Detailed feedback system
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Track your submissions
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    {/* Feature 2 */}
                                    <div className="card-hover bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg">
                                        <div className="w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                            <span className="text-3xl">🏆</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Gamified Learning</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">Earn points and badges for quality reviews. Compete on the leaderboard and showcase your expertise to the community.</p>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Earn badges & achievements
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Real-time leaderboard
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Point-based rewards
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    {/* Feature 3 */}
                                    <div className="card-hover bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg">
                                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                                            <span className="text-3xl">📊</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Progress Tracking</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">Monitor your learning journey with comprehensive analytics. View your reviews, track improvements, and measure your growth.</p>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Detailed analytics dashboard
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Performance insights
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                Assignment history
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Section */}
                        <div className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="animate-slide-in-left">
                                        <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
                                            <span className="text-2xl">👨‍🏫</span>
                                            <span className="text-sm font-bold text-purple-800">FOR INSTRUCTORS</span>
                                        </div>
                                        <h2 className="text-5xl font-black mb-6 text-gray-900">Complete <span className="gradient-text">Control</span> Over Your Classroom</h2>
                                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">Empower your teaching with powerful tools designed specifically for instructors. Manage assignments, monitor student progress, and ensure quality feedback.</p>
                                        
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Create & Manage Assignments</h4>
                                                    <p className="text-gray-600">Easily create assignments with custom deadlines, requirements, and review criteria.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Monitor Student Activity</h4>
                                                    <p className="text-gray-600">Track submissions, review quality, and student participation in real-time.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">3</div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Quality Control</h4>
                                                    <p className="text-gray-600">Review and moderate peer feedback to ensure constructive and valuable insights.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">4</div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 text-gray-900">Analytics & Insights</h4>
                                                    <p className="text-gray-600">Access detailed analytics on class performance, engagement, and learning outcomes.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="animate-slide-in-right">
                                        <div className="relative">
                                            <div className="glass-effect p-8 rounded-3xl shadow-2xl">
                                                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-2xl text-white mb-6">
                                                    <h3 className="text-2xl font-bold mb-2">Instructor Dashboard</h3>
                                                    <p className="text-purple-100">Powerful tools at your fingertips</p>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                                                        <div>
                                                            <div className="text-sm text-gray-500">Active Assignments</div>
                                                            <div className="text-2xl font-bold text-gray-900">12</div>
                                                        </div>
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                                                        <div>
                                                            <div className="text-sm text-gray-500">Total Submissions</div>
                                                            <div className="text-2xl font-bold text-gray-900">284</div>
                                                        </div>
                                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">📤</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                                                        <div>
                                                            <div className="text-sm text-gray-500">Peer Reviews</div>
                                                            <div className="text-2xl font-bold text-gray-900">856</div>
                                                        </div>
                                                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">💬</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
                            <div className="max-w-4xl mx-auto px-6 text-center">
                                <h2 className="text-5xl font-black text-white mb-6 animate-fade-in-up">Ready to Transform Your Learning?</h2>
                                <p className="text-xl text-purple-100 mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>Join thousands of students and instructors already using StudyNotion to enhance their educational experience.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                                    <Link to="/register" className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                                        Start Learning Now
                                    </Link>
                                    <Link to="/login" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                   )
                } />
            </Routes>
        </div>
    );
};

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;
