import React, { useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { Spinner, Table, Button } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

const MonthlyExpense = () => {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);

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
        acc[data.Designation] = {
          dailyAllowance: data.dailyAllowance || 0,
          exStation: data.exStation || 0,
          nightStay: data.nightStay || 0,
          mileage: data.mileage || 0
        };
        return acc;
      }, {});

      const expenseData = [];
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so +1

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
          if (year === currentYear && month === currentMonth) { // Only consider the current month
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
              totalTraveling += mileageRate * kilometers;
            }
          }
        }

        // Calculate Big City Allowance only for "Lahore" and "Karachi"
        const bigCityAllowance = (station === "Lahore" || station === "Karachi") ? businessDays * 100 : 0;

        const expenseRow = {
          employeeCode,
          totalExpense: businessDays * dailyAllowance,
          totalExStation: totalExStation * exStationRate,
          totalNightStay: totalNightStay * nightStayRate,
          totalTraveling,
          bigCityAllowance,
        };

        expenseData.push(expenseRow);
      }

      setExpenses(expenseData);

    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="rounded p-3 bg-light my-5">
      <Button onClick={fetchMonthlyExpense} disabled={loading}>
        Calculate Monthly Expense
      </Button>
      <CSVLink data={csvData} filename={"monthly_expenses.csv"} className="btn btn-outline-secondary ms-3">
        Export Sheet
      </CSVLink>

      {loading && (
        <div className="mt-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Calculating expenses, please wait...</p>
        </div>
      )}

      <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
        <Table hover style={{ fontSize: '14px' }}>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Total Daily Allowance</th>
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
                <td>{expense.totalExpense}</td>
                <td>{expense.totalExStation}</td>
                <td>{expense.totalNightStay}</td>
                <td>{expense.totalTraveling}</td>
                <td>{expense.bigCityAllowance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MonthlyExpense;
