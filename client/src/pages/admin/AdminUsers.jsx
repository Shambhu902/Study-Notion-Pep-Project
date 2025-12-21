import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVertical, Shield, Ban, CheckCircle, Award, Users } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) setUsers(await res.json());
        } catch(err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateStatus = async (userId, newStatus) => {
        if(!window.confirm(`Set user status to ${newStatus}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/admin/users/status', {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ userId, status: newStatus })
            });
            if(res.ok) {
                toast.success(`User ${newStatus}`);
                fetchUsers();
            } else toast.error('Update failed');
        } catch(err) { toast.error('Error updating status'); }
    };

    const updateRole = async (userId, newRole) => {
        if(!window.confirm(`Change role to ${newRole}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/admin/users/role', {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ userId, role: newRole })
            });
            if(res.ok) {
                toast.success('Role updated');
                fetchUsers();
            } else toast.error('Update failed');
        } catch(err) { toast.error('Error updating role'); }
    };

    if(loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">User Management</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">User</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Points</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-medium text-slate-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                                        user.role === 'instructor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        user.status === 'banned' ? 'bg-gray-800 text-white' : 
                                        user.status === 'suspended' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-slate-600">{user.points} pts</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {user.role !== 'admin' && (
                                            <button onClick={() => updateRole(user._id, 'admin')} title="Make Admin" className="p-2 text-red-600 hover:bg-red-50 rounded"><Award size={16}/></button>
                                        )}
                                        {user.role !== 'instructor' && (
                                            <button onClick={() => updateRole(user._id, 'instructor')} title="Make Instructor" className="p-2 text-purple-600 hover:bg-purple-50 rounded"><Shield size={16}/></button>
                                        )}
                                        {user.role !== 'student' && (
                                            <button onClick={() => updateRole(user._id, 'student')} title="Make Student" className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Users size={16}/></button>
                                        )}

                                        <div className="w-px bg-gray-300 mx-1"></div>

                                        {user.status !== 'banned' ? (
                                             <button onClick={() => updateStatus(user._id, 'banned')} title="Ban User" className="p-2 text-red-600 hover:bg-red-50 rounded"><Ban size={16}/></button>
                                        ) : (
                                             <button onClick={() => updateStatus(user._id, 'active')} title="Activate User" className="p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={16}/></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
