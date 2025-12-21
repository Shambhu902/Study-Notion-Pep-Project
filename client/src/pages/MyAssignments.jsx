import React, { useEffect, useState } from 'react';

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
       const token = localStorage.getItem('token');
       const res = await fetch('http://localhost:5001/api/assignments/my', {
           headers: { 'Authorization': `Bearer ${token}` }
       });
       const data = await res.json();
       setAssignments(data);
    };
    fetchAssignments();
  }, []);

  const handleFileAccess = (assignment) => {
    if (assignment.uploadType === 'upload') {
      // Download file
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5001/api/assignments/download/${assignment._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${assignment.title}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(err => console.error('Download failed', err));
    } else {
      // Open link
      window.open(assignment.fileUrl, '_blank');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">My Assignments</h2>
      <div className="grid gap-6">
        {assignments.map(assignment => (
          <div key={assignment._id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
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
            <p className="text-gray-600 mb-4">{assignment.description}</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 items-center">
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  assignment.status === 'reviewed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {assignment.status}
                </span>
                <span className="text-gray-500 text-sm">
                  Reviews: {assignment.receivedReviewsCount}/{assignment.requiredReviews}
                </span>
              </div>
              <button
                onClick={() => handleFileAccess(assignment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                {assignment.uploadType === 'upload' ? '⬇️ Download' : '🔗 Open Link'}
              </button>
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p>No assignments uploaded yet.</p>}
      </div>
    </div>
  );
};

export default MyAssignments;
