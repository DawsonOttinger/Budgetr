import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetPage from "./pages/BudgetPage";
import TransactionsPage from "./pages/TransactionsPage";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Route (Only Authenticated Users) */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/budget" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
