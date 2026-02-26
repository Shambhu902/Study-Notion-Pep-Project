import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    fetchAssignment();
    fetchReviews();
  }, [id]);

  const fetchAssignment = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://study-notion-pep-project.onrender.com/api/assignments/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setAssignment(data);
  };

  const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://study-notion-pep-project.onrender.com/api/reviews/assignment/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReviews(data);
  };

  const handleViewFile = () => {
    if (!assignment) return;
    
    if (assignment.uploadType === 'upload') {
      const token = localStorage.getItem('token');
      fetch(`https://study-notion-pep-project.onrender.com/api/assignments/download/${assignment._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        })
        .catch(err => console.error('Preview failed', err));
    } else {
      window.open(assignment.fileUrl, '_blank');
    }
  };

  const markUseful = async (reviewId) => {
      try {
          const token = localStorage.getItem('token');
          const res = await fetch('https://study-notion-pep-project.onrender.com/api/reviews/rate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ reviewId, useful: true })
          });
          if(res.ok) {
              alert('Marked as useful! +5 points to reviewer.');
              fetchReviews(); // Refresh to update store locally if we tracked it, mostly for UI feedback
          }
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Assignment Reviews</h2>
      <div className="grid gap-6">
        {reviews.map(review => (
          <div key={review._id} className="bg-white p-6 rounded shadow-md border border-gray-200">
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <h4 className="font-bold text-lg text-gray-800">{review.reviewerName}</h4>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">Score: {review.usefulnessScore}</span>
                     <button onClick={() => markUseful(review._id)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 font-semibold">
                         👍 Helpful
                     </button>
                 </div>
             </div>
             
             <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                 <div className="bg-blue-50 p-2 rounded">
                     <span className="block text-xl font-bold text-blue-600">{review.ratings.clarity}/5</span>
                     <span className="text-xs text-gray-600">Clarity</span>
                 </div>
                 <div className="bg-green-50 p-2 rounded">
                     <span className="block text-xl font-bold text-green-600">{review.ratings.quality}/5</span>
                     <span className="text-xs text-gray-600">Quality</span>
                 </div>
                 <div className="bg-purple-50 p-2 rounded">
                     <span className="block text-xl font-bold text-purple-600">{review.ratings.effort}/5</span>
                     <span className="text-xs text-gray-600">Effort</span>
                 </div>
             </div>

             <div className="space-y-3">
                 <div>
                     <span className="font-bold text-green-700 block">Strengths:</span>
                     <p className="text-gray-700 bg-green-50 p-2 rounded text-sm">{review.strengths}</p>
                 </div>
                 <div>
                     <span className="font-bold text-red-700 block">Weaknesses:</span>
                     <p className="text-gray-700 bg-red-50 p-2 rounded text-sm">{review.weaknesses}</p>
                 </div>
                 <div>
                     <span className="font-bold text-blue-700 block">Suggestions:</span>
                     <p className="text-gray-700 bg-blue-50 p-2 rounded text-sm">{review.suggestions}</p>
                 </div>
             </div>
          </div>
        ))}
        {reviews.length === 0 && <p>No reviews yet.</p>}
      </div>
    </div>
  );
};

export default ViewReviews;
