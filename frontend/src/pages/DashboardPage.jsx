import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    // Fetch user data from backend or local storage
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("Fetched User Data:", data);

        if (!response.ok) throw new Error("Failed to fetch user data");

        setUser({ name: data.name, email: data.email });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Replace with actual user data
  const [date, setDate] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ type: "Checking", nickname: "", balance: "" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setDate(today.toLocaleDateString("en-US", options));
  }, []);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);



  const budgetData = [
    { name: "Housing", value: 30 },
    { name: "Transportation", value: 15 },
    { name: "Food", value: 10 },
    { name: "Utilities", value: 10 },
    { name: "Insurance", value: 5 },
    { name: "Medical & Healthcare", value: 5 },
    { name: "Savings & Investing", value: 10 },
    { name: "Debt Payments", value: 5 },
    { name: "Personal Spending", value: 5 },
    { name: "Entertainment", value: 5 },
  ];

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#D4AF37", "#8A2BE2", "#1E90FF", "#32CD32"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-pink-300 px-6 py-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4">
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
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg dlex flex-col items-center text-center">
              <p className="text-sm font-bold">Hello, {user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <hr className="my-2" />
              <button className="w-full text-center hover:underline">Link with Plaid</button>
              <button className="w-full text-center hover:underline">Logout</button>
              <div className="flex items-center text-center mt-2">
                <span className="mr-2">Dark Mode</span>
                <input type="checkbox" className="toggle-checkbox" />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Greeting & Date */}
      <div className="text-left mt-6">
        <h1 className="text-3xl font-bold">Hello, {user.name}. Welcome back!</h1>
        <p className="text-gray-600">{date}</p>
      </div>

      {/* Bank Accounts & Pie Chart */}
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold flex items-center justify-between w-full">Bank Accounts <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-full shadow-lg text-lg" onClick={() => setShowAddAccountModal(true)}>+</button></h2>
          <div className="h-32 w-full bg-gray-100 rounded-lg shadow-inner mt-4 overflow-y-auto p-2">
            {bankAccounts.length === 0 ? (
              <p className="text-gray-500 text-center">No bank accounts have been added.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Type</th>
                    <th className="p-2">Nickname</th>
                    <th className="p-2">Balance</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map((acc, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{acc.type}</td>
                      <td className="p-2">{acc.nickname}</td>
                      <td className="p-2">${parseFloat(acc.balance).toLocaleString()}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>



        </div >

        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold">Budget Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label>
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {showAddAccountModal && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
              <h3 className='text-lg font-semibold mb-4'>Add Bank Account</h3>
              <label className='block mb-2'>Account Type</label>
              <select
                className='w-full p-2 border rounded-lg mb-4'
                value={newAccount.type}
                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
              >
                <option value='Checking'>Checking</option>
                <option value='Savings'>Savings</option>
              </select>
              <label className='block mb-2'>Nickname</label>
              <input
                type='text'
                className='w-full p-2 border rounded-lg mb-4'
                value={newAccount.nickname}
                onChange={(e) => setNewAccount({ ...newAccount, nickname: e.target.value })}
              />
              <label className='block mb-2'>Balance</label>
              <input
                type='text'
                className='w-full p-2 border rounded-lg mb-4'
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              />
              <div className='flex justify-end gap-4'>
                <button
                  className='px-4 py-2 bg-gray-400 text-white rounded-lg'
                  onClick={() => setShowAddAccountModal(false)}
                >Cancel</button>
                <button
                  className='px-4 py-2 bg-blue-500 text-white rounded-lg'
                  onClick={() => {
                    setBankAccounts([...bankAccounts, newAccount]);
                    setNewAccount({ type: "Checking", nickname: "", balance: "" });
                    setShowAddAccountModal(false);
                  }}
                >Add</button>
              </div>
            </div>
          </div>
        )}

      </div >
    </div >
  );
};

export default DashboardPage;

