import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AssignmentsToReview = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
       const token = localStorage.getItem('token');
       const res = await fetch('http://localhost:5001/api/assignments/to-review', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       const data = await res.json();
       setAssignments(data);
    };
    fetchAssignments();
  }, []);

  const handleViewFile = (assignment) => {
    if (assignment.uploadType === 'upload') {
      // Download file for preview
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5001/api/assignments/download/${assignment._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        })
        .catch(err => console.error('Preview failed', err));
    } else {
      // Open drive link
      window.open(assignment.fileUrl, '_blank');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Assignments to Review</h2>
      <div className="grid gap-6">
        {assignments.map(assignment => (
          <div key={assignment._id} className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-xl font-bold">{assignment.title}</h3>
               <span className={`px-2 py-1 rounded text-xs font-semibold ${
                 assignment.uploadType === 'upload' 
                   ? 'bg-purple-100 text-purple-800' 
                   : 'bg-blue-100 text-blue-800'
               }`}>
                 {assignment.uploadType === 'upload' ? '📄 File Upload' : '🔗 Drive Link'}
               </span>
             </div>
             <p className="text-gray-600 truncate mb-4">{assignment.description}</p>
             <div className="flex gap-3 mt-4">
                 <button
                   onClick={() => handleViewFile(assignment)}
                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                 >
                   👁️ View File
                 </button>
                 <Link 
                   to={`/submit-review/${assignment._id}`} 
                   className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-medium"
                 >
                    Start Review (Earn 10 pts)
                 </Link>
             </div>
          </div>
        ))}
         {assignments.length === 0 && <p>No assignments available to review.</p>}
      </div>
    </div>
  );
};

export default AssignmentsToReview;
