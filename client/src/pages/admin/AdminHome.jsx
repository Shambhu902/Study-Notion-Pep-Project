import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Flag, ShieldAlert } from 'lucide-react';

const AdminHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5001/api/admin/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) setStats(await res.json());
                else toast.error('Failed to load stats');
            } catch(err) {
                toast.error('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if(loading) return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
    if(!stats) return <div className="p-8">No data available</div>;

    const cards = [
        { title: 'Total Users', value: stats.overview.totalUsers, icon: <Users size={24} />, color: 'bg-blue-500' },
        { title: 'Total Reviews', value: stats.overview.totalReviews, icon: <FileText size={24} />, color: 'bg-green-500' },
        { title: 'Instructors', value: stats.overview.totalInstructors, icon: <ShieldAlert size={24} />, color: 'bg-purple-500' },
        { title: 'Flagged', value: stats.overview.flaggedReviews, icon: <Flag size={24} />, color: 'bg-red-500' },
    ];

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-full text-white ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Review Activity (Last 7 Days)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.engagement}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
