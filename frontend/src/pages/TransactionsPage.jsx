import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    chargedTo: "Checking",
    transactionType: "Deposit",
    category: "Housing",
    transactionName: "",
    amount: "",
  });

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const addTransaction = () => {
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setShowModal(false);
    setNewTransaction({
      chargedTo: "Checking",
      transactionType: "Deposit",
      category: "Housing",
      transactionName: "",
      amount: "",
    });
  };

  const deleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 to-pink-300 p-6">
      <nav className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <div className="text-xl font-bold">BUDGETR</div>
        <div>
          <Link to="/dashboard" className="mx-4 text-gray-700 hover:text-black">Dashboard</Link>
          <Link to="/budget" className="mx-4 text-gray-700 hover:text-black">Budget</Link>
          <Link to="/transactions" className="mx-4 text-gray-700 hover:text-black">Transactions</Link>
        </div>
        <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
          D
        </div>
      </nav>
      <div className="container mx-auto mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white p-3 rounded-full text-xl shadow-lg"
          >
            +
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">There are currently no transactions</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Charged To</th>
                  <th className="border border-gray-300 p-2">Transaction Type</th>
                  <th className="border border-gray-300 p-2">Category</th>
                  <th className="border border-gray-300 p-2">Transaction Name</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{transaction.chargedTo}</td>
                    <td className="border border-gray-300 p-2">{transaction.transactionType}</td>
                    <td className="border border-gray-300 p-2">{transaction.category}</td>
                    <td className="border border-gray-300 p-2">{transaction.transactionName}</td>
                    <td className={`border border-gray-300 p-2 ${transaction.transactionType === "Deposit" ? "text-green-500" : transaction.transactionType === "Purchase" ? "text-red-500" : ""}`}>
                      ${transaction.amount}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button onClick={() => deleteTransaction(index)} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;