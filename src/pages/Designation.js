// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, addDoc } from 'firebase/firestore';
// import { db } from '../firebase-config'; // Ensure this is correctly imported

// const Designation = () => {
//   const [designations, setDesignations] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     shortTitle: '',
//     dailyAllowance: '',
//     exStation: '',
//     nightStation: '',
//     mileage: ''
//   });

//   // Fetch designations from Firestore
//   const fetchDesignations = async () => {
//     const designationCollection = collection(db, 'designation');
//     const designationSnapshot = await getDocs(designationCollection);
//     const designationList = designationSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setDesignations(designationList);
//   };

//   useEffect(() => {
//     fetchDesignations();
//   }, []);

//   // Function to generate short title automatically
//   const generateShortTitle = (title) => {
//     if (!title) return '';
//     const words = title.split(' ');
//     if (words.length > 1) {
//       return words.map(word => word.charAt(0)).join('').toUpperCase(); // Get first letter of each word
//     }
//     return title.slice(0, 2).toUpperCase(); // If only one word, take first two letters
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Add the new designation to Firestore
//     await addDoc(collection(db, 'designation'), {
//       title: formData.title,
//       shortTitle: formData.shortTitle, // Use the generated short title
//       dailyAllowance: parseInt(formData.dailyAllowance),
//       exStation: parseInt(formData.exStation),
//       nightStation: parseInt(formData.nightStation),
//       mileage: parseFloat(formData.mileage),
//     });

//     // Reset the form
//     setFormData({
//       title: '',
//       shortTitle: '',
//       dailyAllowance: '',
//       exStation: '',
//       nightStation: '',
//       mileage: ''
//     });

//     // Fetch updated designations
//     fetchDesignations();
//   };

//   // Update the short title whenever the title changes
//   const handleTitleChange = (e) => {
//     const newTitle = e.target.value;
//     setFormData((prevData) => ({
//       ...prevData,
//       title: newTitle,
//       shortTitle: generateShortTitle(newTitle) // Automatically generate short title
//     }));
//   };

//   return (
//     <div style={{marginLeft: "250px"}}>
//       <h1 className="text-2xl font-bold mb-4">Designations</h1>
//       <div className='p-3 rounded bg-gray-50'>
//         <form onSubmit={handleSubmit} className="mb-4 space-y-2" style={{ fontSize: '12px' }}>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1">Title</label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={handleTitleChange} // Update title and short title
//                 required
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Short Title</label>
//               <input
//                 type="text"
//                 value={formData.shortTitle}
//                 readOnly // Short title is now read-only
//                 className="border p-2 rounded w-full bg-gray-200"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Daily Allowance</label>
//               <input
//                 type="number"
//                 value={formData.dailyAllowance}
//                 onChange={(e) => setFormData({ ...formData, dailyAllowance: e.target.value })}
//                 required
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Ex Station</label>
//               <input
//                 type="number"
//                 value={formData.exStation}
//                 onChange={(e) => setFormData({ ...formData, exStation: e.target.value })}
//                 required
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Night Station</label>
//               <input
//                 type="number"
//                 value={formData.nightStation}
//                 onChange={(e) => setFormData({ ...formData, nightStation: e.target.value })}
//                 required
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Mileage</label>
//               <input
//                 type="number"
//                 value={formData.mileage}
//                 onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
//                 required
//                 className="border p-2 rounded w-full"
//               />
//             </div>
//           </div>
//           <button type="submit" style={{fontSize: "14px"}} className="bg-blue-500 text-white mt-3 px-3 py-2 rounded">Add Designation</button>
//         </form>
//       </div>

//       <hr className="my-4" />

//       <table className="min-w-full table-auto table table-hover" style={{fontSize: "14px"}}>
//         <thead>
//           <tr className='table-secondary'>
//             <th className="p-2">Title</th>
//             <th className="p-2">Short Title</th>
//             <th className="p-2">Daily Allowance</th>
//             <th className="p-2">Ex Station</th>
//             <th className="p-2">Night Station</th>
//             <th className="p-2">Mileage</th>
//           </tr>
//         </thead>
//         <tbody>
//           {designations.map((designation) => (
//             <tr key={designation.id}>
//               <td className="p-2">{designation.title}</td>
//               <td className="p-2">{designation.shortTitle}</td>
//               <td className="p-2">{designation.dailyAllowance}</td>
//               <td className="p-2">{designation.exStation}</td>
//               <td className="p-2">{designation.nightStation}</td>
//               <td className="p-2">{designation.mileage}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Designation;



import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Designation = () => {
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    dailyAllowance: '',
    exStation: '',
    nightStation: '',
    mileage: ''
  });

  // Fetch designations from Firestore
  // const fetchDesignations = async () => {
  //   const designationCollection = collection(db, 'designation');
  //   const designationSnapshot = await getDocs(designationCollection);
  //   const designationList = designationSnapshot.docs.map(doc => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setDesignations(designationList);
  // };




  const fetchDesignations = async () => {
    const hierarchyDoc = await getDoc(doc(db, 'pchierarchy', 'hierarchy'));
    if (hierarchyDoc.exists()) {
      const hierarchyData = hierarchyDoc.data().hierarchy;
      // Convert the map to an array, keeping the order
      const designationList = Object.keys(hierarchyData).map(key => ({
        id: key,
        ...hierarchyData[key]
      }));
      setDesignations(designationList);
    }
  };




  useEffect(() => {
    fetchDesignations();
  }, []);

  // Function to generate short title automatically
  const generateShortTitle = (title) => {
    if (!title) return '';
    const words = title.split(' ');
    if (words.length > 1) {
      return words.map(word => word.charAt(0)).join('').toUpperCase(); // Get first letter of each word
    }
    return title.slice(0, 2).toUpperCase(); // If only one word, take first two letters
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new designation to Firestore
    await addDoc(collection(db, 'designation'), {
      title: formData.title,
      shortTitle: formData.shortTitle, // Use the generated short title
      dailyAllowance: parseInt(formData.dailyAllowance),
      exStation: parseInt(formData.exStation),
      nightStation: parseInt(formData.nightStation),
      mileage: parseFloat(formData.mileage),
    });

    // Reset the form
    setFormData({
      title: '',
      shortTitle: '',
      dailyAllowance: '',
      exStation: '',
      nightStation: '',
      mileage: ''
    });

    // Fetch updated designations
    fetchDesignations();
  };

  // Update the short title whenever the title changes
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      title: newTitle,
      shortTitle: generateShortTitle(newTitle) // Automatically generate short title
    }));
  };

  // Handle drag end event
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(designations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update state
    setDesignations(items);

    // Save updated hierarchy to Firestore
    await setDoc(doc(db, 'pchierarchy', 'hierarchy'), { hierarchy: items });
  };

  return (
    <div style={{ marginLeft: "260px" }}>
      <h1 className="text-2xl font-bold mb-4">Designations</h1>
      <div className='p-3 rounded bg-gray-100'>
        <form onSubmit={handleSubmit} className="mb-4 space-y-2" style={{ fontSize: '12px' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange} // Update title and short title
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Short Title</label>
              <input
                type="text"
                value={formData.shortTitle}
                readOnly // Short title is now read-only
                className="border p-2 rounded w-full bg-gray-200"
              />
            </div>
            <div>
              <label className="block mb-1">Daily Allowance</label>
              <input
                type="number"
                value={formData.dailyAllowance}
                onChange={(e) => setFormData({ ...formData, dailyAllowance: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Ex Station</label>
              <input
                type="number"
                value={formData.exStation}
                onChange={(e) => setFormData({ ...formData, exStation: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Night Station</label>
              <input
                type="number"
                value={formData.nightStation}
                onChange={(e) => setFormData({ ...formData, nightStation: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
          <div className='grid grid-cols-1'>
            <button type="submit" style={{ fontSize: "14px", backgroundColor: "#7e22ce" }} className="text-white mt-3 px-3 py-2 rounded col-3 ms-auto">Add Designation</button>
          </div>
          {/* <button type="submit" style={{ fontSize: "14px", backgroundColor: "#7e22ce" }} className="text-white mt-3 px-3 py-2 rounded col-4 ms-auto">Add Designation</button> */}
        </form>
      </div>

      <hr className="my-4" />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="designations">
          {(provided) => (
            <table className="min-w-full table-auto table table-hover" style={{ fontSize: "14px" }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr className='table-secondary'>
                  <th  className="p-2">Drag</th>
                  <th  className="p-2">Title</th>
                  <th  className="p-2">Short Title</th>
                  <th  className="p-2">Daily Allowance</th>
                  <th  className="p-2">Ex Station</th>
                  <th  className="p-2">Night Station</th>
                  <th  className="p-2">Mileage</th>
                </tr>
              </thead>
              <tbody>
                {designations.map((designation, index) => (
                  <Draggable key={designation.id} draggableId={designation.id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td className="p-2">
                          <span style={{ cursor: 'grab' }}>≡</span>
                        </td>
                        <td className="p-2">{designation.title}</td>
                        <td className="p-2">{designation.shortTitle}</td>
                        <td className="p-2">{designation.dailyAllowance}</td>
                        <td className="p-2">{designation.exStation}</td>
                        <td className="p-2">{designation.nightStation}</td>
                        <td className="p-2">{designation.mileage}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Designation;
