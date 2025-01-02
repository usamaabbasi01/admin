// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import EditEmployeeModal from '../components/EditEmployeeModal'; // Modal for editing employees
// import CloseAccount from '../components/CloseAccount'; // Import CloseAccount component
// import '../App.css';

// const EmployeeDetails = () => {
//   const [employees, setEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editEmployee, setEditEmployee] = useState(null); // Store employee being edited
//   const [showEditModal, setShowEditModal] = useState(false); // Control modal visibility
//   const [selectedEmployee, setSelectedEmployee] = useState(null); // Store employee for account closure

//   const fetchEmployees = async () => {
//     const employeeCollection = collection(db, 'employees');
//     const employeeSnapshot = await getDocs(employeeCollection);
//     const employeeList = employeeSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setEmployees(employeeList);
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Open modal for editing
//   const handleEditClick = (employee) => {
//     console.log("Editing Employee: ", employee);  // Check if this logs the correct employee data
//     setEditEmployee(employee); // Set the employee to be edited
//     setShowEditModal(true); // Open the modal
//   };

//   // Handle employee deletion
//   const handleDelete = async (id) => {
//     const confirmation = window.confirm("Are you sure you want to delete this employee?");
//     if (confirmation) {
//       await deleteDoc(doc(db, 'employees', id));
//       fetchEmployees();
//     }
//   };

//   // Open Close Account Modal
//   const handleCloseAccountClick = (employee) => {
//     setSelectedEmployee(employee);
//   };

//   // Filter employees based on search term
//   const filteredEmployees = employees.filter(employee =>
//     employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     employee.Code.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ marginLeft: "260px" }}>
//       <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search by employee name or code"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border p-2 rounded mb-4 w-full"
//       />

//       <div className='py-3 bg-white rounded'>
//         <div className='d-flex mb-3 py-2 px-3 bg-gray-100 shadow rounded'>
//           <div className='col-1'><strong>Code</strong></div>
//           <div className='col-3'><strong>Name</strong></div>
//           <div className='col-2'><strong>Team</strong></div>
//           <div className='col-2'><strong>Station</strong></div>
//           <div className='col-2'><strong>Designation</strong></div>
//           <div className='col-2'><strong>Action</strong></div>
//         </div>

//         {filteredEmployees.map(employee => (  
//           <div key={employee.id} className='d-flex mb-3 py-2 px-3 bg-white shadow rounded'>
//             <div className='col-1'>{employee.Code}</div>
//             <div className='col-3'>{employee.Name}</div>
//             <div className='col-2'>{employee.Team ? employee.Team.join(', ') : 'No Team Assigned'}</div>
//             <div className='col-2'>{employee.Station}</div>
//             <div className='col-2'>{employee.Designation}</div>
//             <div className="col-2">
//               <button onClick={() => handleEditClick(employee)} className="text-green-600 mr-4">Edit</button>
//               {/* <button onClick={() => handleDelete(employee.id)} className="text-red-600 mr-4">Delete</button> */}
//               <button onClick={() => handleCloseAccountClick(employee)} className="text-red-600">Close Account</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal for editing employee */}
//       {showEditModal && (
//         <>
//           {console.log('Rendering Modal')}  // This should log when modal is rendered
//           <div className="modal-background">
//             <EditEmployeeModal
//               employee={editEmployee}
//               closeModal={() => setShowEditModal(false)}
//               fetchEmployees={fetchEmployees}
//             />
//           </div>
//         </>
//       )}

//       {/* Close Account Component */}
//       {selectedEmployee && (
//         <CloseAccount
//           employeeId={selectedEmployee.id}
//           employeeName={selectedEmployee.Name}
//           closeModal={() => setSelectedEmployee(null)} // Close the account modal
//         />
//       )}
//     </div>
//   );
// };

// export default EmployeeDetails;



import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import * as XLSX from 'xlsx';
import CloseAccount from '../components/CloseAccount'; // Import CloseAccount component
import '../App.css';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEmployee, setEditEmployee] = useState(null); // Store employee being edited
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    team: '',
    station: '',
    designation: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store employee for account closure

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

  // Handle employee edit click
  const handleEditClick = (employee) => {
    console.log("Editing Employee: ", employee);
    setEditEmployee(employee); // Set the employee to be edited
    setFormData({
      code: employee.Code,
      name: employee.Name,
      team: employee.Team ? employee.Team.join(', ') : '',
      station: employee.Station,
      designation: employee.Designation,
    });
  };

  // Handle form submission (update employee)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeDocRef = doc(db, 'employees', editEmployee.id);

    try {
      await updateDoc(employeeDocRef, {
        Code: formData.code,
        Name: formData.name,
        Team: formData.team.split(',').map(team => team.trim()), // Convert team to array
        Station: formData.station,
        Designation: formData.designation,
      });
      setEditEmployee(null); // Reset the edit state
      fetchEmployees(); // Refresh employee list after update
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.Code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to export data to Excel
  const exportToExcel = () => {
    // Create a new array of employees where 'Team' is converted to a string
    const formattedEmployees = employees.map(employee => ({
      ...employee,
      Team: employee.Team ? employee.Team.join(', ') : 'No Team Assigned', // Convert team array to string
    }));

    const ws = XLSX.utils.json_to_sheet(formattedEmployees); // Convert employee data to a worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Employees'); // Append the worksheet to the workbook
    XLSX.writeFile(wb, 'EmployeeDetails.xlsx'); // Download the Excel file
  };

  return (
    <div style={{ marginLeft: "260px" }}>
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      {/* Editable form at the top */}

        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4" style={{fontSize: '12px'}}>
          <div className='d-flex gap-5'>
            <div className="mb-4 w-50">
              <label className="block text-gray-700">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4 w-50">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
          <div className='d-flex gap-5 w-100'>
            <div className="mb-4">
              <label className="block text-gray-700">Team</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="Comma-separated teams"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Station</label>
              <input
                type="text"
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-2">
            Save
          </button>
        </form>

        {/* Search bar */}
      <input
        type="text"
        placeholder="Search by employee name or code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mt-3 mb-2 w-full"
        style={{fontSize: '12px'}}
      />

      {/* <button 
        onClick={exportToExcel} 
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Export to Excel
      </button> */}

      {/* Employee list */}
      <div className='py-3 bg-white rounded'>
        <div className='d-flex mb-3 py-2 px-3 bg-gray-200 rounded'>
          <div className='col-1'><strong>Code</strong></div>
          <div className='col-3'><strong>Name</strong></div>
          <div className='col-2'><strong>Team</strong></div>
          <div className='col-1'></div>
          <div className='col-2'><strong>Station</strong></div>
          <div className='col-1'><strong>Desig</strong></div>
          <div className='col-2'><strong>Action</strong></div>
        </div>

        {filteredEmployees.map(employee => (
          <div key={employee.id} className='d-flex mb-2 py-2 px-3 bg-gray-100 rounded' style={{fontSize: '12px'}}>
            <div className='col-1'>{employee.Code}</div>
            <div className='col-3'>{employee.Name}</div>
            <div className='col-2'>{employee.Team ? employee.Team.join(', ') : 'No Team Assigned'}</div>
            <div className='col-1'></div>
            <div className='col-2'>{employee.Station}</div>
            <div className='col-1'>{employee.Designation}</div>
            <div className="col-2">
              <button onClick={() => handleEditClick(employee)} className="text-green-600 mr-4">Edit</button>
              <button onClick={() => setSelectedEmployee(employee)} className="text-red-600">Close Account</button>
            </div>
          </div>
        ))}
      </div>

      {/* Close Account Component */}
      {selectedEmployee && (
        <CloseAccount
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.Name}
          closeModal={() => setSelectedEmployee(null)} // Close the account modal
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
