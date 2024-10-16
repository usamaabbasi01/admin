import React, { useState } from 'react';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All fields are required");
      return;
    }

    // Simulate password change action
    // Here you would call an API or service to change the password
    console.log("Changing password...");

    // Reset form and display success message
    setPasswordChanged(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError(null);
  };

  return (
    <div className="p-6" style={{ marginLeft: "260px" }}>
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <form onSubmit={handlePasswordChange}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter your current password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="Enter your new password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            placeholder="Confirm your new password"
          />
        </div>

        {passwordError && (
          <div className="text-red-500 text-sm mb-4">{passwordError}</div>
        )}

        {passwordChanged && (
          <div className="text-green-500 text-sm mb-4">Password changed successfully!</div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Settings;
