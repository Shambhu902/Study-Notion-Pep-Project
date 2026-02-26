import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SubmitReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [formData, setFormData] = useState({
    strengths: '',
    weaknesses: '',
    suggestions: '',
    clarity: 5,
    quality: 5,
    effort: 5
  });

  useEffect(() => {
     // Fetch assignment details to show user what they are reviewing
     const fetchAssignment = async () => {
         const token = localStorage.getItem('token');
         const res = await fetch(`https://study-notion-pep-project.onrender.com/api/assignments/${id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
         });
         const data = await res.json();
         setAssignment(data);
     };
     fetchAssignment();
  }, [id]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      const payload = {
          assignmentId: id,
          ...formData,
          ratings: {
              clarity: parseInt(formData.clarity),
              quality: parseInt(formData.quality),
              effort: parseInt(formData.effort)
          }
      };

      try {
          const res = await fetch('https://study-notion-pep-project.onrender.com/api/reviews/submit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(payload)
          });
          
          if (!res.ok) throw new Error('Failed to submit review');
          
          toast.success('Review Submitted +10 Points! 🌟');
          navigate('/dashboard');
      } catch (err) {
          toast.error(err.message);
      }
  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Review Assignment: {assignment.title}</h2>
        <div className="mb-6 bg-gray-50 p-4 rounded text-sm text-gray-700">
             <p><strong>Description:</strong> {assignment.description}</p>
             <p className="mt-2"><strong>File:</strong> <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open Link</a></p>
        </div>

        <form onSubmit={onSubmit}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div>
                   <label className="block font-bold mb-2">Clarity (1-5)</label>
                   <input type="number" name="clarity" value={formData.clarity} onChange={onChange} min="1" max="5" className="w-full border p-2 rounded"/>
               </div>
               <div>
                   <label className="block font-bold mb-2">Quality (1-5)</label>
                   <input type="number" name="quality" value={formData.quality} onChange={onChange} min="1" max="5" className="w-full border p-2 rounded"/>
               </div>
               <div>
                   <label className="block font-bold mb-2">Effort (1-5)</label>
                   <input type="number" name="effort" value={formData.effort} onChange={onChange} min="1" max="5" className="w-full border p-2 rounded"/>
               </div>
           </div>

           <div className="mb-4">
              <label className="block font-bold mb-2">Strengths</label>
              <textarea name="strengths" value={formData.strengths} onChange={onChange} required minLength="20" rows="3" className="w-full border p-2 rounded"></textarea>
           </div>
           
           <div className="mb-4">
              <label className="block font-bold mb-2">Weaknesses</label>
              <textarea name="weaknesses" value={formData.weaknesses} onChange={onChange} required minLength="20" rows="3" className="w-full border p-2 rounded"></textarea>
           </div>
           
           <div className="mb-4">
              <label className="block font-bold mb-2">Suggestions</label>
              <textarea name="suggestions" value={formData.suggestions} onChange={onChange} required minLength="20" rows="3" className="w-full border p-2 rounded"></textarea>
           </div>

           <div className="mb-4 bg-blue-50 text-blue-800 text-sm p-3 rounded flex items-center">
             <span className="mr-2">🔒</span>
             Your identity is hidden. The assignment owner cannot see who reviewed this.
           </div>

           <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;
