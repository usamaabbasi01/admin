import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    teams: [], // Change from single team to multiple teams
    designation: '',
    station: '',
  });
  const [teams, setTeams] = useState([]);
  const [stations, setStations] = useState([]);
  const [designations, setDesignations] = useState([]);

  // Fetch teams, stations, and designations from Firestore
  const fetchData = async () => {
    try {
      const teamCollection = collection(db, 'team'); // Replace with your actual teams collection name
      const stationCollection = collection(db, 'Stations'); // Replace with your actual stations collection name
      const designationCollection = collection(db, 'designation'); // Replace with your actual designations collection name

      const teamSnapshot = await getDocs(teamCollection);
      const stationSnapshot = await getDocs(stationCollection);
      const designationSnapshot = await getDocs(designationCollection);

      setTeams(teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setStations(stationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setDesignations(designationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTeamChange = (teamId) => {
    setFormData((prevData) => {
      const teams = prevData.teams.includes(teamId)
        ? prevData.teams.filter(id => id !== teamId) // Remove team if already selected
        : [...prevData.teams, teamId]; // Add team if not selected
      return { ...prevData, teams };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeCode = formData.code; // We'll use this as the document ID
    const employeeData = {
      Code: formData.code.toUpperCase(),
      Name: formData.name,
      Teams: formData.teams, // Use array for multiple teams
      Station: formData.station,
      Designation: formData.designation,
    };

    try {
      await setDoc(doc(db, 'employees', employeeCode), employeeData);
      setFormData({ code: '', name: '', teams: [], station: '', designation: '' });
    } catch (error) {
      console.error("Error adding employee: ", error);
    }
  };

  return (
    <div style={{ marginLeft: "260px" }}>
      <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2 w-75">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">Employee Code</label>
            <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1">Employee Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1">Team</label>
            <div className="space-y-1">
              {teams.map((team) => (
                <label key={team.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teams.includes(team.id)}
                    onChange={() => handleTeamChange(team.id)}
                    className="mr-2"
                  />
                  {team.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1">Station</label>
            <select value={formData.station} onChange={(e) => setFormData({ ...formData, station: e.target.value })} className="border p-2 rounded w-full" required>
              <option value="">Select Station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.name}>{station.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Designation</label>
            <select value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="border p-2 rounded w-full" required>
              <option value="">Select Designation</option>
              {designations.map((designation) => (
                <option key={designation.id} value={designation.title}>{designation.title}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white mt-3 px-3 py-2 rounded">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
