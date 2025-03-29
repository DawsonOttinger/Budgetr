import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState({ name: "", email: "" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBudget = async () => {
      const token = localStorage.getItem("token");
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error("User fetch failed");
        setUser(userData);
  
        const budgetRes = await fetch("http://localhost:5000/api/budget/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!budgetRes.ok) return;
        const data = await budgetRes.json();
        setBudget(data); 
        setMonthlyIncome(data.monthlyIncome || 0);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
  
    fetchUserAndBudget();
  }, []);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  const saveBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/budget/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ budget, monthlyIncome }),
      });
      if (!response.ok) throw new Error("Failed to save budget");
      alert("Budget saved successfully!");
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const yearlyIncome = monthlyIncome * 12;

  const chartData = Object.entries(budget).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: parseFloat(value) || 0,
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF", "#FFCD56", "#36A2EB", "#4CAF50"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-pink-300 p-6">
      <nav className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-6">
        <img src="/logo.png" alt="Budgetr Logo" className="h-12" />
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/budget" className="hover:underline">Budget</Link>
          <Link to="/transactions" className="hover:underline">Transactions</Link>
        </div>
        <div className="relative">
          <button className="w-10 h-10 bg-black text-white rounded-full" onClick={toggleProfileMenu}>
            {user.name.charAt(0).toUpperCase()}
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col items-center text-center p-4">
              <p className="text-sm font-bold">Hello, {user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <hr className="my-2" />
              <button onClick={handleLogout} className="w-full text-center hover:underline">Logout</button>
            </div>
          )}
        </div>
      </nav>

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
                  value={budget[category] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4">
              <label className="block font-semibold">Monthly Net Income</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={handleIncomeChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-6 font-bold text-green-600 text-xl">
              Yearly Net Income: ${yearlyIncome.toLocaleString()} / year
            </div>
            <button onClick={saveBudget} className="w-full bg-blue-500 text-white p-3 rounded">Save Budget</button>
            <h2 className="text-lg font-bold mt-6">Your Budget Breakdown</h2>
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
