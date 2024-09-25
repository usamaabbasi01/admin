import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure this is correctly imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the delete icon

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');

  // Fetch teams from Firestore
  const fetchTeams = async () => {
    const teamCollection = collection(db, 'team');
    const teamSnapshot = await getDocs(teamCollection);
    const teamList = teamSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeams(teamList);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Handle form submission to add a new team
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new team to Firestore
    await addDoc(collection(db, 'team'), {
      name: teamName,
    });

    // Reset the form
    setTeamName('');

    // Fetch updated teams
    fetchTeams();
  };

  // Handle team deletion
  const handleDelete = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      await deleteDoc(doc(db, 'team', teamId));
      fetchTeams(); // Refresh the teams list after deletion
    }
  };

  return (
    <div style={{ marginLeft: "250px" }}>
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <div className='p-3 rounded bg-gray-50'>
        <form onSubmit={handleSubmit} className="mb-4 space-y-2" style={{ fontSize: '12px' }}>
          <div>
            <label className="block mb-1">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" style={{ fontSize: "14px" }} className="bg-blue-500 text-white mt-3 px-3 py-2 rounded">Add Team</button>
        </form>
      </div>

      <hr className="my-4" />

      <table className="min-w-full table-auto table table-hover" style={{ fontSize: "14px" }}>
        <thead>
          <tr className='table-secondary'>
            <th className="p-2">Team Name</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td className="p-2">{team.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(team.id)}
                  className="text-red-500 hover:text-red-700"
                  style={{fontSize: "12px"}}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Team;
