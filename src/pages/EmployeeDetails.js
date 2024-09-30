import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import EditEmployeeModal from '../components/EditEmployeeModal'; // Modal for editing employees

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEmployee, setEditEmployee] = useState(null); // Store employee being edited
  const [showEditModal, setShowEditModal] = useState(false); // Control modal visibility

  const fetchEmployees = async () => {
    const employeeCollection = collection(db, 'employees');
    const employeeSnapshot = await getDocs(employeeCollection);
    const employeeList = employeeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(employeeList);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open modal for editing
  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  // Handle employee deletion
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (confirmation) {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginLeft: "260px" }}>
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by employee name or code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Employee Table */}
      {/* <table className="min-w-full table-auto table-hover">
            <thead>
            <tr className='bg-gray-200'>
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
                <button onClick={() => handleEditClick(employee)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(employee.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <div className='py-3 bg-white rounded'>
        <div className='d-flex mb-2 py-2 px-3 bg-gray-200 shadow-sm rounded'>
            <div className='col-1'><strong>Code</strong></div>
            <div className='col-3'><strong>Name</strong></div>
            <div className='col-2'><strong>Team</strong></div>
            <div className='col-2'><strong>Station</strong></div>
            <div className='col-2'><strong>Designation</strong></div>
            <div className='col-1'><strong>Action</strong></div>
        </div>

        {filteredEmployees.map(employee => (  
        <div className='d-flex mb-2 py-2 px-3 bg-white shadow-sm rounded'>
            <div className='col-1'>{employee.Code}</div>
            <div className='col-3'>{employee.Name}</div>
            <div className='col-2'>{employee.Team ? employee.Team.join(', ') : 'No Team Assigned'}</div>
            <div className='col-2'>{employee.Station}</div>
            <div className='col-2'>{employee.Designation}</div>
            <div className="col-2">
                <button onClick={() => handleEditClick(employee)} className="text-green-600 mr-4">Edit</button>
                <button onClick={() => handleDelete(employee.id)} className="text-red-600">Delete</button>
            </div>
        </div>
        ))}
      </div>

      {/* Modal for editing employee */}
      {showEditModal && (
        <EditEmployeeModal
          employee={editEmployee}
          closeModal={() => setShowEditModal(false)}
          fetchEmployees={fetchEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
