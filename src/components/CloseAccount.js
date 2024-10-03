import React, { useState } from 'react';
import { db } from '../firebase-config'; // Adjust the path based on your project structure
import { doc, updateDoc } from 'firebase/firestore'; // Firestore imports
import { useNavigate } from 'react-router-dom';

const CloseAccount = ({ employeeId, employeeName }) => {
  const [closureReason, setClosureReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCloseAccount = async () => {
    if (!closureReason) {
      alert('Please provide a reason for account closure.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update employee document to mark it as closed
      const employeeRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeRef, {
        status: 'closed', // Mark the account as closed
        closureReason: closureReason, // Store the closure reason
        closureDate: new Date().toISOString(), // Store the closure date
      });
      
      alert(`Successfully closed account for ${employeeName}`);
      navigate('/employees'); // Redirect to the employee list or dashboard
    } catch (error) {
      console.error('Error closing account:', error);
      alert('An error occurred while closing the account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Close Account for {employeeName}</h2>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Reason for closure..."
        value={closureReason}
        onChange={(e) => setClosureReason(e.target.value)}
      />
      <button
        onClick={handleCloseAccount}
        className={`bg-red-500 text-white py-2 px-4 rounded ${isLoading ? 'opacity-50' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Closing...' : 'Close Account'}
      </button>
    </div>
  );
};

export default CloseAccount;
