import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BudgetPage = () => {
  const [budget, setBudget] = useState({
    housing: "",
    transportation: "",
    food: "",
    utilities: "",
    insurance: "",
    healthcare: "",
    savings: "",
    debt: "",
    personal: "",
    entertainment: "",
  });

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [payFrequency, setPayFrequency] = useState("monthly");

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/budget/get", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;
        const data = await response.json();
        setBudget(data);
        setMonthlyIncome(data.monthlyIncome);
        setPayFrequency(data.payFrequency);
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };

    fetchBudget();
  }, []);

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setPayFrequency(e.target.value);
  };

  const saveBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/budget/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ budget, monthlyIncome, payFrequency }),
      });

      if (!response.ok) throw new Error("Failed to save budget");
      alert("Budget saved successfully!");
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const calculateYearlyIncome = () => {
    if (payFrequency === "weekly") return (monthlyIncome / 4) * 52;
    if (payFrequency === "biweekly") return (monthlyIncome / 2) * 26;
    return monthlyIncome * 12; // Monthly & Military
  };

  const yearlyIncome = calculateYearlyIncome();

  const totalBudget = Object.values(budget).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  const chartData = Object.entries(budget).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: (parseFloat(value) || 0),
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FFCD56", "#36A2EB", "#4CAF50"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-pink-300 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center">Budget</h1>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
            {Object.keys(budget).map((category, index) => (
              <div key={index} className="mb-4">
                <label className="block font-semibold">{category.replace(/([A-Z])/g, " $1").trim()}</label>
                <input
                  type="number"
                  name={category}
                  value={budget[category]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4">
              <label className="block font-semibold">Monthly Net Income</label>
              <input type="number" value={monthlyIncome} onChange={handleIncomeChange} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Pay Frequency</label>
              <div className="flex gap-4">
                {["weekly", "biweekly", "monthly", "military"].map((freq) => (
                  <label key={freq} className="flex items-center">
                    <input
                      type="radio"
                      name="payFrequency"
                      value={freq}
                      checked={payFrequency === freq}
                      onChange={handleFrequencyChange}
                      className="mr-2"
                    />
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6 font-bold text-green-600 text-xl">
              Yearly Net Income: ${yearlyIncome.toLocaleString()} / year
            </div>
            <button onClick={saveBudget} className="w-full bg-blue-500 text-white p-3 rounded">Save Budget</button>
            <h2 className="text-lg font-bold">Your Budget Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} label>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;

