import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://study-notion-pep-project.onrender.com/api/users/leaderboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch leaderboard');
        }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-8">
    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🏆 StudyNotion Leaderboard 🏆</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Points</th>
                      <th className="px-6 py-3">Reviews Done</th>
                      <th className="px-6 py-3">Helpful Reviews</th>
                      <th className="px-6 py-3">Badges</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map((user, index) => (
                      <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-bold text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 font-bold text-blue-600">{user.points}</td>
                          <td className="px-6 py-4">{user.reviewedCount}</td>
                          <td className="px-6 py-4">{user.helpfulReviewsCount}</td>
                          <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {user.badges.map((badge, i) => (
                                    <span key={i} className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                        {badge}
                                    </span>
                                ))}
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

export default Leaderboard;
