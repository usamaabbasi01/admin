import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

const EditEmployeeModal = ({ employee, closeModal, fetchEmployees }) => {
  const [formData, setFormData] = useState({
    code: employee.Code,
    name: employee.Name,
    team: employee.Team,
    station: employee.Station,
    designation: employee.Designation,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeDocRef = doc(db, 'employees', employee.id);

    try {
      await updateDoc(employeeDocRef, {
        Code: formData.code,
        Name: formData.name,
        Team: formData.team,
        Station: formData.station,
        Designation: formData.designation,
      });
      closeModal(); // Close modal after successful update
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Code:
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>
          <label>
            Team:
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value.split(',') })}
              required
            />
          </label>
          <label>
            Station:
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              required
            />
          </label>
          <label>
            Designation:
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save Changes</button>
          <button type="button" onClick={closeModal} className="ml-2 bg-gray-500 text-white px-4 py-2">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;



// // EditEmployeeModal.js
// import React, { useEffect, useState } from 'react';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase-config'; // Ensure you have the correct import for your Firebase configuration

// const EditEmployeeModal = ({ employee, closeModal, fetchEmployees }) => {
//   const [name, setName] = useState(employee.Name);
//   const [code, setCode] = useState(employee.Code);
//   const [team, setTeam] = useState(employee.Team || []);
//   const [station, setStation] = useState(employee.Station);
//   const [designation, setDesignation] = useState(employee.Designation);

//   const handleUpdate = async () => {
//     // Ensure to check if employee ID is valid
//     const employeeRef = doc(db, 'employees', employee.id); // Use the correct ID from the passed employee prop
//     await updateDoc(employeeRef, {
//       Name: name,
//       Code: code,
//       Team: team,
//       Station: station,
//       Designation: designation,
//     });
//     await fetchEmployees(); // Refresh the list after updating
//     closeModal(); // Close the modal
//   };

//   return (
//     <div className="modal">
//       <h2>Edit Employee</h2>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Name"
//       />
//       <input
//         type="text"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="Code"
//       />
//       {/* Add inputs for team, station, and designation */}

//       <button onClick={handleUpdate}>Update</button>
//       <button onClick={closeModal}>Cancel</button>
//     </div>
//   );
// };

// export default EditEmployeeModal;
