import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const Register = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    const { name, email, password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('https://study-notion-pep-project.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                if (props.setAuth) props.setAuth(true);
                navigate('/dashboard');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (err) {
             console.error(err);
             toast.error('Error registering');
        }
    };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Card */}
        <div className="glass-effect p-10 rounded-3xl shadow-2xl border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-4xl">🚀</span>
              </div>
            </div>
            <h2 className="text-4xl font-black mb-2">
              <span className="gradient-text">Join StudyNotion</span>
            </h2>
            <p className="text-gray-600">Start your collaborative learning journey today</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name" 
                  value={name} 
                  onChange={onChange} 
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                  placeholder="John Doe"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email" 
                  value={email} 
                  onChange={onChange} 
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                  placeholder="your.email@example.com"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>
              </div>
            </div>
            
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'student'})}
                  className={`relative overflow-hidden py-4 px-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                    formData.role === 'student' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-2xl">🎓</span>
                    <span className="text-sm">Student</span>
                  </div>
                  {formData.role === 'student' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'instructor'})}
                  className={`relative overflow-hidden py-4 px-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                    formData.role === 'instructor' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-400'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-2xl">👨‍🏫</span>
                    <span className="text-sm">Instructor</span>
                  </div>
                  {formData.role === 'instructor' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  value={password} 
                  onChange={onChange} 
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200 mt-2"
            >
              Create Account →
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 rounded-full">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            to="/login"
            className="block w-full text-center bg-white border-2 border-purple-200 text-purple-600 font-bold py-4 px-6 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
