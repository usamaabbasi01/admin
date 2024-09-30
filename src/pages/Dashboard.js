
// import React, { useEffect, useState } from 'react';
// import { dbRealtime } from '../firebase-config';
// import { Line, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
// import { db } from '../firebase-config'; // Firebase config import
// import { collection, getDocs } from 'firebase/firestore'; // Firestore imports
// import { ref, onValue } from 'firebase/database'; // Realtime Database imports

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [totalTeams, setTotalTeams] = useState(0); // Correctly fetch total teams
//   const [totalDesignations, setTotalDesignations] = useState(0);
//   const [pendingApprovals, setPendingApprovals] = useState(0);
//   const [dailyExpenses, setDailyExpenses] = useState([]);
//   const [teamDistribution, setTeamDistribution] = useState({}); // Change to an object for dynamic labels

//   // Fetch Firestore and Realtime Database data
//   useEffect(() => {
//     const fetchFirestoreData = async () => {
//       try {
//         // Fetch total employees
//         const employeeCollection = await getDocs(collection(db, 'employees'));
//         setTotalEmployees(employeeCollection.size);

//         // Fetch total teams
//         const teamCollection = await getDocs(collection(db, 'team'));
//         setTotalTeams(teamCollection.size); // Set the total number of teams

//         const teamCounts = {}; // Object to hold team counts

//         // Initialize team counts
//         teamCollection.forEach((doc) => {
//           const teamName = doc.data().name; // Get the name of the team
//           teamCounts[teamName] = 0; // Initialize count for each team
//         });

//         // Count employees in each team
//         employeeCollection.forEach((doc) => {
//           const teams = doc.data().Team; // Get teams of the employee
//           teams.forEach((team) => {
//             if (teamCounts[team] !== undefined) {
//               teamCounts[team] += 1; // Increment count for the team
//             }
//           });
//         });

//         setTeamDistribution(teamCounts); // Set the team distribution state

//         // Fetch total designations
//         const designationCollection = await getDocs(collection(db, 'designation'));
//         setTotalDesignations(designationCollection.size);

//         // Fetch pending approvals
//         const approvalsCollection = await getDocs(collection(db, 'approvals'));
//         setPendingApprovals(approvalsCollection.size);
//       } catch (error) {
//         console.error('Error fetching Firestore data:', error);
//       }
//     };

//     const fetchRealtimeData = () => {
//       try {
//         const expenseRef = ref(dbRealtime, 'approved');
//         onValue(expenseRef, (snapshot) => {
//           const expensesData = snapshot.val();
//           const expensesArray = [];

//           if (expensesData) {
//             Object.keys(expensesData).forEach((date) => {
//               const dailyForms = expensesData[date]?.submitted_form;

//               let totalExpenseForTheDay = 0;

//               if (dailyForms) {
//                 Object.keys(dailyForms).forEach((employeeId) => {
//                   const form = dailyForms[employeeId];
//                   totalExpenseForTheDay += form.totalExpense || 0;
//                 });
//               }

//               expensesArray.push({
//                 date: date,
//                 totalExpense: totalExpenseForTheDay,
//               });
//             });

//             setDailyExpenses(expensesArray);
//           } else {
//             console.log('No expenses data available');
//           }
//         });
//       } catch (error) {
//         console.error('Error fetching Realtime Database data:', error);
//       }
//     };

//     fetchFirestoreData();
//     fetchRealtimeData();
//   }, []);

//   // Prepare data for Line Chart (Daily Expenses)
//   const dailyExpensesData = {
//     labels: dailyExpenses.length ? dailyExpenses.map((expense) => expense.date) : ['No Data'],
//     datasets: [
//       {
//         label: 'Daily Expenses',
//         data: dailyExpenses.length ? dailyExpenses.map((expense) => expense.totalExpense) : [0],
//         fill: false,
//         borderColor: 'rgba(75,192,192,1)',
//         tension: 0.1,
//       },
//     ],
//   };

//   // Prepare data for Pie Chart (Team Distribution)
//   const teamNames = Object.keys(teamDistribution);
//   const teamCounts = Object.values(teamDistribution);

//   const teamData = {
//     labels: teamNames.length ? teamNames : ['No Teams'],
//     datasets: [
//       {
//         label: 'Team Distribution',
//         data: teamCounts.length ? teamCounts : [1], // Default if no team data
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//       },
//     ],
//   };

//   return (
//     <div className="p-4" style={{ marginLeft: '260px' }}>
//       {/* Top Section: Key Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl">Total Employees</h3>
//           <p className="text-3xl">{totalEmployees}</p>
//         </div>

//         <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl">Total Teams</h3>
//           <p className="text-3xl">{totalTeams}</p>
//         </div>

//         <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl">Total Designations</h3>
//           <p className="text-3xl">{totalDesignations}</p>
//         </div>

//         <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl">Pending Approvals</h3>
//           <p className="text-3xl">{pendingApprovals}</p>
//         </div>
//       </div>

//       {/* Middle Section: Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Line Chart for Expenses */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl mb-4">Expenses (Daily)</h3>
//           <Line data={dailyExpensesData} />
//         </div>

//         {/* Pie Chart for Team Distribution */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl mb-4">Team Distribution</h3>
//           <Pie data={teamData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { dbRealtime } from '../firebase-config'; // Import your Realtime Database configuration
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore'; // Firestore imports
import { ref, onValue } from 'firebase/database'; // Realtime Database imports

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalDesignations, setTotalDesignations] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [teamDistribution, setTeamDistribution] = useState({});

  // Fetch Firestore and Realtime Database data
  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        // Fetch total employees
        const employeeCollection = await getDocs(collection(db, 'employees'));
        setTotalEmployees(employeeCollection.size);

        // Fetch total teams
        const teamCollection = await getDocs(collection(db, 'team'));
        setTotalTeams(teamCollection.size);

        const teamCounts = {};
        teamCollection.forEach((doc) => {
          const teamName = doc.data().name;
          teamCounts[teamName] = 0;
        });

        employeeCollection.forEach((doc) => {
          const teams = doc.data().Team;
          teams.forEach((team) => {
            if (teamCounts[team] !== undefined) {
              teamCounts[team] += 1;
            }
          });
        });

        setTeamDistribution(teamCounts);

        // Fetch total designations
        const designationCollection = await getDocs(collection(db, 'designation'));
        setTotalDesignations(designationCollection.size);
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    const fetchRealtimeData = () => {
      try {
        const approvalsRef = ref(dbRealtime, 'non_approved');
        onValue(approvalsRef, (snapshot) => {
          const approvalsData = snapshot.val();
          let totalPendingForms = 0;

          if (approvalsData) {
            // Loop through each team in non_approved
            Object.keys(approvalsData).forEach((team) => {
              const teamMembers = approvalsData[team];

              // Loop through each employee in the team
              Object.keys(teamMembers).forEach((employeeId) => {
                const submittedForms = teamMembers[employeeId].submitted_form;

                // Count each submitted form
                totalPendingForms += Object.keys(submittedForms).length;
              });
            });

            setPendingApprovals(totalPendingForms); // Set the total pending approvals
          } else {
            console.log('No pending approvals available');
          }
        });
      } catch (error) {
        console.error('Error fetching Realtime Database data:', error);
      }
    };

    fetchFirestoreData();
    fetchRealtimeData();
  }, []);

  // Prepare data for Line Chart (Daily Expenses)
  const dailyExpensesData = {
    labels: dailyExpenses.length ? dailyExpenses.map((expense) => expense.date) : ['No Data'],
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyExpenses.length ? dailyExpenses.map((expense) => expense.totalExpense) : [0],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for Pie Chart (Team Distribution)
  const teamNames = Object.keys(teamDistribution);
  const teamCounts = Object.values(teamDistribution);

  const teamData = {
    labels: teamNames.length ? teamNames : ['No Teams'],
    datasets: [
      {
        label: 'Team Distribution',
        data: teamCounts.length ? teamCounts : [1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="p-4" style={{ marginLeft: '260px' }}>
      {/* Top Section: Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Total Employees</h3>
          <p className="text-3xl">{totalEmployees}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Total Teams</h3>
          <p className="text-3xl">{totalTeams}</p>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Total Designations</h3>
          <p className="text-3xl">{totalDesignations}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Pending Approvals</h3>
          <p className="text-3xl">{pendingApprovals}</p>
        </div>
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart for Expenses */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Expenses (Daily)</h3>
          <Line data={dailyExpensesData} />
        </div>

        {/* Pie Chart for Team Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Team Distribution</h3>
          <Pie data={teamData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
