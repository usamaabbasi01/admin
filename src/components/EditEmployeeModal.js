// import React, { useState } from 'react';
// import { updateDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase-config';

// const EditEmployeeModal = ({ employee, closeModal, fetchEmployees }) => {
//   const [formData, setFormData] = useState({
//     code: employee.Code,
//     name: employee.Name,
//     team: employee.Team,
//     station: employee.Station,
//     designation: employee.Designation,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const employeeDocRef = doc(db, 'employees', employee.id);

//     try {
//       await updateDoc(employeeDocRef, {
//         Code: formData.code,
//         Name: formData.name,
//         Team: formData.team,
//         Station: formData.station,
//         Designation: formData.designation,
//       });
//       closeModal(); // Close modal after successful update
//       fetchEmployees(); // Refresh employee list
//     } catch (error) {
//       console.error("Error updating employee: ", error);
//     }
//   };

//   return (
//     <div className='modal-body-backgroun'>
//       <div className="modal-content">
//       <h2>Edit Employee</h2>
//       <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
//         <label>
//           Code:
//           <input
//             type="text"
//             value={formData.code}
//             onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           Name:
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           Team:
//           <input
//             type="text"
//             value={formData.team}
//             onChange={(e) => setFormData({ ...formData, team: e.target.value.split(',') })}
//             required
//           />
//         </label>
//         <label>
//           Station:
//           <input
//             type="text"
//             value={formData.station}
//             onChange={(e) => setFormData({ ...formData, station: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           Designation:
//           <input
//             type="text"
//             value={formData.designation}
//             onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
//             required
//             style = {{
//               width: "100%"
//             }}
//           />
//         </label>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">Save Changes</button>
//         <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 mt-4">Cancel</button>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default EditEmployeeModal;



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
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Code:</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Team:</label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value.split(',') })}
              required
            />
          </div>
          <div className="form-group">
            <label>Station:</label>
            <input
              type="text"
              value={formData.station}
              onChange={(e) => setFormData({ ...formData, station: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Designation:</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
