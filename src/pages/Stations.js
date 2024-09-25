// src/pages/Station.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config'; // Make sure this is the correct path to your firebase config
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import trash icon

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [stationName, setStationName] = useState('');

  // Fetch stations from Firestore
  const fetchStations = async () => {
    const stationCollection = collection(db, 'Stations');
    const stationSnapshot = await getDocs(stationCollection);
    const stationList = stationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStations(stationList);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the new station to Firestore
    await addDoc(collection(db, 'Stations'), {
      name: stationName,
    });

    // Reset the input field
    setStationName('');

    // Fetch updated stations
    fetchStations();
  };

  // Handle deletion of a station
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'Stations', id));
    fetchStations(); // Refresh the list after deletion
  };

  return (
    <div style={{marginLeft: "250px"}}>
      <h1 className="text-2xl font-bold mb-4">Stations</h1>
      <div className='p-3 rounded bg-gray-100 mb-4'>
        <form onSubmit={handleSubmit} className="flex space-x-2" style={{ fontSize: '14px' }}>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            placeholder="Station Name"
            required
            className="border p-2 rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-2">Add</button>
        </form>
      </div>

      <table className="min-w-full table-auto table">
        <thead>
          <tr>
            <th className=" p-2">Station Name</th>
            <th className=" p-2"></th> {/* Add actions column */}
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id}>
              <td className=" p-2">{station.name}</td>
              <td className=" p-2 text-center"> {/* Center align actions */}
                <button onClick={() => handleDelete(station.id)} className="text-red-500 hover:text-red-700" style={{fontSize: "12px"}}>
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

export default Stations;
