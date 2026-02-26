import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Flag } from 'lucide-react';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://study-notion-pep-project.onrender.com/admin/reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) setReviews(await res.json());
        } catch(err) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const deleteReview = async (id) => {
        if(!window.confirm('Delete review?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://study-notion-pep-project.onrender.com/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                toast.success('Review deleted');
                fetchReviews();
            } else toast.error('Failed to delete');
        } catch(err) { toast.error('Error deleting'); }
    };

    const flagReview = async (id) => {
        const reason = prompt("Reason for flagging:");
        if(!reason) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://study-notion-pep-project.onrender.com/api/admin/reviews/flag', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ reviewId: id, reason })
            });
            if(res.ok) {
                toast.success('Review flagged');
                fetchReviews();
            } else toast.error('Flag user failed');
        } catch(err) { toast.error('Error flagging'); }
    };

    if(loading) return <div className="p-8">Loading reviews...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">Review Moderation</h2>
             <div className="grid gap-4">
                {reviews.map(review => (
                    <div key={review._id} className={`bg-white p-6 rounded-lg shadow-sm border ${review.flagged ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{review.assignmentId?.title}</h3>
                                <p className="text-sm text-gray-500">By: {review.reviewerId?.name} • {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => flagReview(review._id)} className="p-2 text-orange-600 hover:bg-orange-50 rounded" title="Flag"><Flag size={18}/></button>
                                <button onClick={() => deleteReview(review._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18}/></button>
                            </div>
                        </div>
                        
                        {review.flagged && (
                            <div className="mb-4 text-xs font-bold text-red-600 uppercase tracking-wide bg-red-100 p-2 rounded inline-block">
                                🚩 Flagged: {review.flagReason}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded mb-2">
                            <div><span className="font-bold block text-gray-700">Strengths</span>{review.strengths}</div>
                            <div><span className="font-bold block text-gray-700">Weaknesses</span>{review.weaknesses}</div>
                            <div><span className="font-bold block text-gray-700">Suggestions</span>{review.suggestions}</div>
                        </div>
                        
                        <div className="flex gap-4 text-sm font-medium text-gray-600 mt-2">
                            <span>Clarity: {review.ratings?.clarity}/5</span>
                            <span>Quality: {review.ratings?.quality}/5</span>
                            <span>Effort: {review.ratings?.effort}/5</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminReviews;
