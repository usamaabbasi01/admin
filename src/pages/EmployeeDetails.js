

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import EditEmployeeModal from '../components/EditEmployeeModal'; // Modal for editing employees
// import CloseAccount from '../components/CloseAccount'; // Import CloseAccount component

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
//     setEditEmployee(employee);
//     setShowEditModal(true);
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
//         <EditEmployeeModal
//           employee={editEmployee}
//           closeModal={() => setShowEditModal(false)}
//           fetchEmployees={fetchEmployees}
//         />
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
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import EditEmployeeModal from '../components/EditEmployeeModal'; // Modal for editing employees
import CloseAccount from '../components/CloseAccount'; // Import CloseAccount component

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editEmployee, setEditEmployee] = useState(null); // Store employee being edited
  const [showEditModal, setShowEditModal] = useState(false); // Control modal visibility
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

  // Open modal for editing
  const handleEditClick = (employee) => {
    setEditEmployee(employee); // Set the employee to be edited
    setShowEditModal(true); // Open the modal
  };

  // Handle employee deletion
  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (confirmation) {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    }
  };

  // Open Close Account Modal
  const handleCloseAccountClick = (employee) => {
    setSelectedEmployee(employee);
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

      <div className='py-3 bg-white rounded'>
        <div className='d-flex mb-3 py-2 px-3 bg-gray-100 shadow rounded'>
          <div className='col-1'><strong>Code</strong></div>
          <div className='col-3'><strong>Name</strong></div>
          <div className='col-2'><strong>Team</strong></div>
          <div className='col-2'><strong>Station</strong></div>
          <div className='col-2'><strong>Designation</strong></div>
          <div className='col-2'><strong>Action</strong></div>
        </div>

        {filteredEmployees.map(employee => (  
          <div key={employee.id} className='d-flex mb-3 py-2 px-3 bg-white shadow rounded'>
            <div className='col-1'>{employee.Code}</div>
            <div className='col-3'>{employee.Name}</div>
            <div className='col-2'>{employee.Team ? employee.Team.join(', ') : 'No Team Assigned'}</div>
            <div className='col-2'>{employee.Station}</div>
            <div className='col-2'>{employee.Designation}</div>
            <div className="col-2">
              <button onClick={() => handleEditClick(employee)} className="text-green-600 mr-4">Edit</button>
              {/* <button onClick={() => handleDelete(employee.id)} className="text-red-600 mr-4">Delete</button> */}
              <button onClick={() => handleCloseAccountClick(employee)} className="text-red-600">Close Account</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing employee */}
      {showEditModal && (
          <div className="modal-background">
              <EditEmployeeModal
                  employee={editEmployee}
                  closeModal={() => setShowEditModal(false)}
                  fetchEmployees={fetchEmployees}
              />
          </div>
      )}

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
