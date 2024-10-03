

// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase-config';
// import { dbRealtime } from '../firebase-config'; // Import your Realtime Database configuration
// import { Line, Pie, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
// } from 'chart.js'; // Import necessary chart elements
// import { collection, getDocs } from 'firebase/firestore'; // Firestore imports
// import { ref, onValue } from 'firebase/database'; // Realtime Database imports

// // Register the necessary components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement
// );

// const Dashboard = () => {
//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [totalTeams, setTotalTeams] = useState(0);
//   const [totalDesignations, setTotalDesignations] = useState(0);
//   const [pendingApprovals, setPendingApprovals] = useState(0);
//   const [dailyExpenses, setDailyExpenses] = useState([]);
//   const [teamDistribution, setTeamDistribution] = useState({});

//   // Fetch Firestore and Realtime Database data
//   useEffect(() => {
//     const fetchFirestoreData = async () => {
//       try {
//         // Fetch total employees
//         const employeeCollection = await getDocs(collection(db, 'employees'));
//         setTotalEmployees(employeeCollection.size);

//         // Fetch total teams
//         const teamCollection = await getDocs(collection(db, 'team'));
//         setTotalTeams(teamCollection.size);

//         const teamCounts = {};
//         teamCollection.forEach((doc) => {
//           const teamName = doc.data().name;
//           teamCounts[teamName] = 0;
//         });

//         employeeCollection.forEach((doc) => {
//           const teams = doc.data().Team;
//           teams.forEach((team) => {
//             if (teamCounts[team] !== undefined) {
//               teamCounts[team] += 1;
//             }
//           });
//         });

//         setTeamDistribution(teamCounts);

//         // Fetch total designations
//         const designationCollection = await getDocs(collection(db, 'designation'));
//         setTotalDesignations(designationCollection.size);
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
//                   totalExpenseForTheDay += form.totalExpense || 0; // Ensure this field exists
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

//         // Fetch pending approvals
//         const pendingRef = ref(dbRealtime, 'non_approved'); // Adjust the path as per your structure
//         onValue(pendingRef, (snapshot) => {
//           const pendingData = snapshot.val();
//           if (pendingData) {
//             const totalPending = Object.keys(pendingData).length; // Count total pending forms
//             setPendingApprovals(totalPending);
//           } else {
//             setPendingApprovals(0); // No pending forms
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
//         data: teamCounts.length ? teamCounts : [1],
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//       },
//     ],
//   };

//   // Prepare data for Bar Chart (Example Data)
//   const barData = {
//     labels: teamNames.length ? teamNames : ['No Teams'],
//     datasets: [
//       {
//         label: 'Team Members',
//         data: teamCounts.length ? teamCounts : [1],
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
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

//         {/* Bar Chart for Team Members */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h3 className="text-xl mb-4">Team Members Distribution</h3>
//           <Bar data={barData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { dbRealtime } from '../firebase-config'; // Import your Realtime Database configuration
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'; // Import necessary chart elements
import { collection, getDocs } from 'firebase/firestore'; // Firestore imports
import { ref, onValue } from 'firebase/database'; // Realtime Database imports
import dayjs from 'dayjs'; // Import dayjs for date manipulation

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  BarElement
);

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalDesignations, setTotalDesignations] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
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
        const expenseRef = ref(dbRealtime, 'approved');
        onValue(expenseRef, (snapshot) => {
          const expensesData = snapshot.val();
          const monthlyExpenseCounts = {};

          if (expensesData) {
            Object.keys(expensesData).forEach((date) => {
              const dailyForms = expensesData[date]?.submitted_form;

              if (dailyForms) {
                const month = dayjs(date).format('MM YYYY'); // Get the month and year
                let totalExpenseForTheDay = 0;

                Object.keys(dailyForms).forEach((employeeId) => {
                  const form = dailyForms[employeeId];
                  totalExpenseForTheDay += form.totalExpense || 0; // Ensure this field exists
                });

                // Aggregate by month
                if (monthlyExpenseCounts[month]) {
                  monthlyExpenseCounts[month] += totalExpenseForTheDay;
                } else {
                  monthlyExpenseCounts[month] = totalExpenseForTheDay;
                }
              }
            });

            setMonthlyExpenses(monthlyExpenseCounts);
          } else {
            console.log('No expenses data available');
          }
        });

        // Fetch pending approvals
        const pendingRef = ref(dbRealtime, 'non_approved'); // Adjust the path as per your structure
        onValue(pendingRef, (snapshot) => {
          const pendingData = snapshot.val();
          if (pendingData) {
            const totalPending = Object.keys(pendingData).length; // Count total pending forms
            setPendingApprovals(totalPending);
          } else {
            setPendingApprovals(0); // No pending forms
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

  // Prepare data for Bar Chart (Monthly Expenses)
  const months = Object.keys(monthlyExpenses);
  const monthlyExpenseData = {
    labels: months.length ? months : ['No Data'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: months.length ? months.map(month => monthlyExpenses[month]) : [0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
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


        {/* Bar Chart for Monthly Expenses */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Monthly Expenses</h3>
          <Bar data={monthlyExpenseData} />
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
