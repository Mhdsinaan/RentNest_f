import React, { useEffect, useState } from 'react';
import api from '../Api/Api'; // Axios instance

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/getall");
        const filtered = res.data.filter(u => u.id !== currentUserId);
        setUsers(filtered);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-1/4 border-r p-4 bg-gray-50">
      <h2 className="font-bold mb-4 text-lg">Users</h2>
      {users.map(user => (
        <div
          key={user.id}
          className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectUser(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default UserList;
