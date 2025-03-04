import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
/*import DashboardPage from "./pages/DashboardPage";
import PrivateRouter from "./componets/PrivateRoute";
*/
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

          {/* Protexted Route (Only Authenticated Users) */}
          {/*<Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
