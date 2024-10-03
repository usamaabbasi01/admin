
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { Spinner, Table, Button, Dropdown } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx'; // Import the XLSX library

const MonthlyExpense = () => {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [months, setMonths] = useState([]);

  useEffect(() => {
    // Generate the month options for the dropdown
    const currentYear = new Date().getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const availableMonths = monthNames.slice(0, new Date().getMonth() + 1).map((month, index) => ({
      label: month,
      value: `${currentYear}-${String(index + 1).padStart(2, '0')}`,
    }));
    setMonths(availableMonths);
    setSelectedMonth(availableMonths[availableMonths.length - 1].value); // Default to the current month
  }, []);

  const fetchMonthlyExpense = async () => {
    setLoading(true);
    const firestore = getFirestore();
    const db = getDatabase();

    try {
      // Fetch employee data from Firestore
      const employeesSnapshot = await getDocs(collection(firestore, 'employees'));
      const employees = employeesSnapshot.docs.map(doc => doc.data());

      // Fetch allowances from Firestore
      const designationSnapshot = await getDocs(collection(firestore, 'designation'));
      const designations = designationSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        acc[data.shortTitle] = {
          dailyAllowance: data.dailyAllowance || 0,
          exStation: data.exStation || 0,
          nightStay: data.nightStay || 0,
          mileage: data.mileage || 0
        };
        return acc;
      }, {});

      const expenseData = [];
      const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
      
      // Fetch approved forms from Realtime Database
      const expenseRef = ref(db, 'approved');
      const snapshot = await get(expenseRef);
      const allData = snapshot.val() || {};

      for (const employee of employees) {
        const { Code: employeeCode, Designation: designation, Station: station } = employee;

        // Get allowances for the designation
        const allowance = designations[designation] || {};
        const dailyAllowance = allowance.dailyAllowance;
        const exStationRate = allowance.exStation;
        const nightStayRate = allowance.nightStay;
        const mileageRate = allowance.mileage;

        let businessDays = 0;
        let totalExStation = 0;
        let totalNightStay = 0;
        let totalTraveling = 0;

        // Iterate through all dates in the approved forms
        for (const [dateKey, dateData] of Object.entries(allData)) {
          const [year, month] = dateKey.split('-').map(Number);
          if (year === selectedYear && month === selectedMonthNum) { // Only consider the selected month
            const formSnap = dateData.submitted_form && dateData.submitted_form[employeeCode];
            if (formSnap) {
              if (formSnap.businessDay === 'Yes' || formSnap.businessDay === 'yes') {
                businessDays++;
              }
              if (formSnap.exStation === 'Yes' || formSnap.exStation === 'yes') {
                totalExStation++;
              }
              if (formSnap.nightStay === 'Yes' || formSnap.nightStay === 'yes') {
                totalNightStay++;
              }
              const kilometers = Number(formSnap.kilometers) || 0;
              totalTraveling += mileageRate * kilometers || 0; // Ensure totalTraveling does not become NaN
            }
          }
        }

        // Calculate Big City Allowance only for "Lahore" and "Karachi"
        const bigCityAllowance = (station === "Lahore" || station === "Karachi") ? businessDays * 100 : 0;

        const expenseRow = {
          employeeCode,
          totalExpense: businessDays * dailyAllowance || 0, // Default to 0 if NaN
          totalExStation: totalExStation * exStationRate || 0, // Default to 0 if NaN
          totalNightStay: totalNightStay * nightStayRate || 0, // Default to 0 if NaN
          totalTraveling,
          bigCityAllowance,
        };

        expenseData.push(expenseRow);
      }

      setExpenses(expenseData);
      // Save the record to Firebase Storage
      await saveRecordToFirebase(expenseData, selectedMonth, selectedYear);

    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecordToFirebase = async (data, month, year) => {
    try {
      const storage = getStorage();
      const fileName = `${month}-${year}-expenses.xlsx`; // Filename format
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

      // Convert to binary string
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
      const blob = new Blob([s2ab(excelBuffer)], { type: 'application/octet-stream' });

      // Upload to Firebase Storage
      const storageRefPath = storageRef(storage, `monthly-expenses/${fileName}`);
      await uploadBytes(storageRefPath, blob, 'data_url');

      alert('Expense record saved successfully!');

    } catch (error) {
      console.error('Error saving record to Firebase:', error);
      alert('Failed to save the record.');
    }
  };

  // Helper function to convert string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  };

  // Update the handleMonthChange function to accept the selected value directly
  const handleMonthChange = (monthValue) => {
    setSelectedMonth(monthValue);
  };

  const csvData = expenses.map(expense => ({
    EmployeeCode: expense.employeeCode,
    TotalExpense: expense.totalExpense,
    TotalExStation: expense.totalExStation,
    TotalNightStay: expense.totalNightStay,
    TotalTraveling: expense.totalTraveling,
    BigCityAllowance: expense.bigCityAllowance,
  }));

  return (
    <div className="my-2" style={{marginLeft: "260px"}}>
      <h2 className="text-2xl font-bold mb-4">Monthly Expense Tracker</h2>
      <div className='d-flex justify-content-between p-2 bg-gray-50 gap-3 align-items-center'>
        <Dropdown onSelect={handleMonthChange} className="col-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="btn-sm w-full border-2 border-gray-300 rounded-md hover:border-blue-500 transition">
            {months.find(month => month.value === selectedMonth)?.label || "Select Month"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
            {months.map((month) => (
                <Dropdown.Item key={month.value} eventKey={month.value}>
                {month.label}
                </Dropdown.Item>
            ))}
            </Dropdown.Menu>
        </Dropdown>

        <Button onClick={fetchMonthlyExpense} disabled={loading} className="btn-sm ms-auto col-3 w-full bg-blue-600 text-white hover:bg-blue-500 transition duration-300">
            Calculate Monthly Expense
        </Button>
        <CSVLink data={csvData} filename={"monthly_expenses.csv"} className="btn btn-sm col-2 btn-outline-secondary w-full border-2 border-gray-300 hover:border-blue-500 transition duration-300">
            Export Sheet
        </CSVLink>
      </div>

      {loading && (
        <div className="mt-3 text-center">
          <Spinner animation="border" role="status" className="text-blue-600">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading expenses...</p>
        </div>
      )}

      {!loading && expenses.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Total Expense</th>
              <th>Total Ex Station</th>
              <th>Total Night Stay</th>
              <th>Total Traveling</th>
              <th>Big City Allowance</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.employeeCode}</td>
                <td>{expense.totalExpense.toFixed(2)}</td>
                <td>{expense.totalExStation.toFixed(2)}</td>
                <td>{expense.totalNightStay.toFixed(2)}</td>
                <td>{expense.totalTraveling.toFixed(2)}</td>
                <td>{expense.bigCityAllowance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MonthlyExpense;
