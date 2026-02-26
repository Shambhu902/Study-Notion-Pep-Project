import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const usersRes = await fetch('https://study-notion-pep-project.onrender.com/api/admin/users', { headers });
            if(usersRes.ok) setUsers(await usersRes.json());
            
            const reviewsRes = await fetch('https://study-notion-pep-project.onrender.com/api/admin/reviews', { headers });
            if(reviewsRes.ok) setReviews(await reviewsRes.json());

        } catch (err) {
            toast.error('Failed to load admin data');
        }
    };

    const deleteReview = async (id) => {
        if(!window.confirm('Delete this review permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://study-notion-pep-project.onrender.com/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                toast.success('Review deleted');
                setReviews(reviews.filter(r => r._id !== id));
            } else {
                toast.error('Failed to delete');
            }
        } catch(err) {
            toast.error('Error deleting review');
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-red-800">Admin Dashboard 🛡️</h1>
            
            <div className="mb-6 border-b border-gray-300">
                <button 
                    className={`mr-4 pb-2 font-bold ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({users.length})
                </button>
                <button 
                    className={`pb-2 font-bold ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviews.length})
                </button>
            </div>

            {activeTab === 'users' ? (
                <div className="bg-white rounded shadow p-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Points</th>
                                <th className="p-2">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="p-2 font-medium">{user.name}</td>
                                    <td className="p-2 text-gray-600">{user.email}</td>
                                    <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${user.role==='admin'?'bg-red-100 text-red-800':(user.role==='instructor'?'bg-purple-100 text-purple-800':'bg-blue-100 text-blue-800')}`}>{user.role}</span></td>
                                    <td className="p-2 font-bold text-green-600">{user.points}</td>
                                    <td className="p-2 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-white p-4 rounded shadow border-l-4 border-red-400">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">Assignment: {review.assignmentId?.title || 'Unknown'}</h4>
                                    <p className="text-sm text-gray-600">By: {review.reviewerId?.name || 'Unknown'}</p>
                                </div>
                                <button onClick={() => deleteReview(review._id)} className="text-red-600 hover:text-red-900 font-bold border border-red-200 px-3 py-1 rounded text-sm">Delete</button>
                            </div>
                            <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                                <p><strong>Strengths:</strong> {review.strengths}</p>
                                <p><strong>Weaknesses:</strong> {review.weaknesses}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
