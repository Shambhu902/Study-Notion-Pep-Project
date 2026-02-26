import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const InstructorDashboard = () => {
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState({ total: 0, reviews: 0, open: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://study-notion-pep-project.onrender.com/api/instructor/assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAssignments(data);
                
                // Calculate Stats
                const total = data.length;
                const reviews = data.reduce((acc, curr) => acc + (curr.receivedReviewsCount || 0), 0);
                const open = data.filter(a => a.status === 'pending').length;
                setStats({ total, reviews, open });
            } else {
                toast.error('Failed to load instructor data');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const closeAssignment = async (id) => {
        if(!window.confirm('Are you sure you want to close this assignment?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://study-notion-pep-project.onrender.com/api/instructor/close-assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId: id })
            });
            if(res.ok) {
                toast.success('Assignment Closed');
                fetchAssignments();
            } else {
                toast.error('Failed to close');
            }
        } catch(err) {
            toast.error('Error closing assignment');
        }
    };

    const exportReviews = (id) => {
        const token = localStorage.getItem('token');
        // Direct download link logic
        // For fetch with headers to work with download, we use a trick or simply window.open if cookies were used.
        // Since we use Bearer token, we need to fetch then blob.
        fetch(`https://study-notion-pep-project.onrender.com/api/instructor/export/${id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reviews-${id}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(err => toast.error('Export failed'));
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-indigo-800">Instructor Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-indigo-500">
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Total Assignments</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Total Reviews Submitted</h3>
                    <p className="text-3xl font-bold">{stats.reviews}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 uppercase text-xs font-bold">Pending Assignments</h3>
                    <p className="text-3xl font-bold">{stats.open}</p>
                </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Loading assignments...</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 text-lg mb-2">No assignments found</p>
                        <p className="text-gray-400 text-sm">Students haven't submitted any assignments yet.</p>
                    </div>
                ) : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assign => (
                                <tr key={assign._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 font-bold">{assign.title}</p>
                                        <p className="text-gray-400 text-xs">{new Date(assign.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{assign.submittedBy ? assign.submittedBy.name : 'Unknown'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${assign.status === 'reviewed' ? 'text-green-900' : (assign.status === 'closed' ? 'text-gray-900' : 'text-yellow-900')}`}>
                                            <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${assign.status === 'reviewed' ? 'bg-green-200' : (assign.status === 'closed' ? 'bg-gray-200' : 'bg-yellow-200')}`}></span>
                                            <span className="relative">{assign.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((assign.receivedReviewsCount / assign.requiredReviews) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{assign.receivedReviewsCount} / {assign.requiredReviews}</span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex gap-2">
                                        <button onClick={() => exportReviews(assign._id)} className="text-blue-600 hover:text-blue-900 text-xs font-bold border border-blue-200 px-2 py-1 rounded">Export</button>
                                        {assign.status !== 'closed' && (
                                            <button onClick={() => closeAssignment(assign._id)} className="text-red-600 hover:text-red-900 text-xs font-bold border border-red-200 px-2 py-1 rounded">Close</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboard;
