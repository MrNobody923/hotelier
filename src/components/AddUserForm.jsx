import React, { useState } from 'react';

export default function AddUserForm() {
  // State to hold the form data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff'); // Set a default role
  const [message, setMessage] = useState('');

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing

    try {
      // Send the data to the Node.js backend
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User successfully created!');
        // Clear the form fields after successful creation
        setUsername('');
        setPassword('');
        setRole('staff');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      setMessage("Network error. Is your Node.js server running?");
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      
      {/* Display success or error messages */}
      {message && (
        <div className="mb-4 p-3 rounded bg-blue-50 text-blue-800 text-sm">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter temporary password"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
