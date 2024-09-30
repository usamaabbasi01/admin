import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Ensure this is correctly imported

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // New state for filtered employees
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    team: [],
    station: '',
    designation: ''
  });
  const [editMode, setEditMode] = useState(false);  // Track if we are editing or adding
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [stations, setStations] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  // Fetch employees from Firestore
  const fetchEmployees = async () => {
    const employeeCollection = collection(db, 'employees');
    const employeeSnapshot = await getDocs(employeeCollection);
    const employeeList = employeeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(employeeList);
    setFilteredEmployees(employeeList); // Set initially to full employee list
  };

  // Fetch teams, stations, designations
  const fetchTeams = async () => {
    const teamCollection = collection(db, 'team');
    const teamSnapshot = await getDocs(teamCollection);
    const teamList = teamSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeams(teamList);
  };

  const fetchStations = async () => {
    const stationCollection = collection(db, 'Stations');
    const stationSnapshot = await getDocs(stationCollection);
    const stationList = stationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStations(stationList);
  };

  const fetchDesignations = async () => {
    const designationCollection = collection(db, 'designation');
    const designationSnapshot = await getDocs(designationCollection);
    const designationList = designationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDesignations(designationList);
  };

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
    fetchStations();
    fetchDesignations();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      // Edit existing employee
      const employeeDocRef = doc(db, 'employees', editEmployeeId);
      await updateDoc(employeeDocRef, {
        code: formData.code,
        name: formData.name,
        team: formData.team,
        station: formData.station,
        designation: formData.designation
      });
      setEditMode(false);  // Reset the edit mode
      setEditEmployeeId(null);  // Clear the employee being edited
    } else {
      // Add new employee
      await addDoc(collection(db, 'employees'), {
        code: formData.code,
        name: formData.name,
        team: formData.team,
        station: formData.station,
        designation: formData.designation
      });
    }

    // Reset form after submission
    setFormData({ code: '', name: '', team: [], station: '', designation: '' });
    fetchEmployees();  // Refresh employee list
  };


  // Handle edit button click
  const handleEdit = (employee) => {
    setEditMode(true);
    setEditEmployeeId(employee.id);  // Set employee ID being edited
    setFormData({
      code: employee.Code,
      name: employee.Name,
      team: employee.Team,
      station: employee.Station,
      designation: employee.Designation
    });
  };

  // Handle deletion of an employee
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (confirmation) {
      await deleteDoc(doc(db, 'employees', id)); // Corrected the collection path
      fetchEmployees();
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredList = employees.filter(employee =>
      employee.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      employee.Code.toLowerCase().includes(e.target.value.toLowerCase()) ||
      employee.Team.some(team => team.toLowerCase().includes(e.target.value.toLowerCase())) || 
      employee.Station.toLowerCase().includes(e.target.value.toLowerCase()) || 
      employee.Designation.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(filteredList);
  };

  return (
    <div style={{ marginLeft: "250px" }}>
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <div className='p-3 rounded bg-gray-50'>
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Employee Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Employee Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Team</label>
              <select
                multiple
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: [...e.target.selectedOptions].map(o => o.value) })}
                className="border p-2 rounded w-full"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>{team.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Station</label>
              <select
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                {stations.map((station) => (
                  <option key={station.id} value={station.name}>{station.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                {designations.map((designation) => (
                  <option key={designation.id} value={designation.title}>{designation.title}</option>
                ))}
              </select>
            </div>
          </div>
            <button type="submit" className="bg-purple-500 text-white mt-3 px-3 py-2 rounded">Add Employee</button>
        </form>
      </div>

      <hr className="my-4" />

      <input
        type="text"
        placeholder="Search employees..."
        className="border p-2 rounded w-full mb-4"
        value={searchTerm}
        onChange={handleSearch}
      />

      <table className="min-w-full table-auto table table-hover">
        <thead>
          <tr className='table-secondary'>
            <th className="p-2">Code</th>
            <th className="p-2">Name</th>
            <th className="p-2">Team</th>
            <th className="p-2">Station</th>
            <th className="p-2">Designation</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id}>
              <td className="p-2">{employee.Code}</td>
              <td className="p-2">{employee.Name}</td>
              <td className="p-2">{employee.Team ? employee.Team.join(', ') : 'No Team Assigned'}</td>
              <td className="p-2">{employee.Station}</td>
              <td className="p-2">{employee.Designation}</td>
              <td className="p-2">
                <button onClick={() => handleEdit(employee)} className="text-green-600 mr-4">Edit</button>
                <button onClick={() => handleDelete(employee.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;
