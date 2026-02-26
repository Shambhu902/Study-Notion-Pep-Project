import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UploadAssignment = () => {
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'link'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    requiredReviews: 3
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const { title, description, fileUrl, requiredReviews } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  // Validate file type and size
  const validateAndSetFile = (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed!');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB!');
      return;
    }

    setSelectedFile(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let res;

      if (uploadMethod === 'upload') {
        // File upload method
        if (!selectedFile) {
          toast.error('Please select a file to upload');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);
        formDataToSend.append('title', title);
        formDataToSend.append('description', description);
        formDataToSend.append('requiredReviews', requiredReviews);

        res = await fetch('https://study-notion-pep-project.onrender.com/api/assignments/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });
      } else {
        // Link method
        if (!fileUrl) {
          toast.error('Please provide a Google Drive link');
          return;
        }

        res = await fetch('https://study-notion-pep-project.onrender.com/api/assignments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error creating assignment');
      }

      toast.success('Assignment Uploaded 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-6">
      <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl">📤</span>
            </div>
          </div>
          <h2 className="text-5xl font-black mb-2">
            <span className="gradient-text">Upload Assignment</span>
          </h2>
          <p className="text-gray-600 text-lg">Share your work and get valuable peer feedback</p>
        </div>

        {/* Main Card */}
        <div className="glass-effect p-8 rounded-3xl shadow-2xl border border-white/30">
          {/* Toggle between Upload and Link */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setUploadMethod('upload')}
              className={`relative overflow-hidden py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                uploadMethod === 'upload'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">📤</span>
                <span>Upload File</span>
              </div>
              {uploadMethod === 'upload' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('link')}
              className={`relative overflow-hidden py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${
                uploadMethod === 'link'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-400'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">🔗</span>
                <span>Share Link</span>
              </div>
              {uploadMethod === 'link' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              )}
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Assignment Title *</label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={onChange}
                  required
                  placeholder="e.g., Data Structures Project"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  📝
                </span>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="4"
                placeholder="Add any additional details about your assignment..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none text-gray-900"
              />
            </div>

            {/* Conditional rendering based on upload method */}
            {uploadMethod === 'upload' ? (
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Upload File *</label>
                
                {/* Drag and Drop Zone */}
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                      : selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="animate-fade-in">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-white">✓</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-white">📂</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        {dragActive ? 'Drop your file here!' : 'Drag & drop your file here'}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                      <p className="text-xs text-gray-500 bg-gray-100 inline-block px-4 py-2 rounded-full">
                        PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm">Google Drive Link *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fileUrl"
                    value={fileUrl}
                    onChange={onChange}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    🔗
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <span>💡</span>
                  <span>Make sure the link has view access for anyone</span>
                </p>
              </div>
            )}

            {/* Required Reviews */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">Required Reviews</label>
              <div className="relative">
                <input
                  type="number"
                  name="requiredReviews"
                  value={requiredReviews}
                  onChange={onChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  👥
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Number of peer reviews you need for this assignment (1-10)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
            >
              Submit Assignment →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAssignment;
