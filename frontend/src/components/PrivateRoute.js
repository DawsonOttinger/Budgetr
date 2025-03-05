import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login", { replace: true, state: { from: location } });
		} else {
			setIsAuthenticated(true);
		}
	}, [navigate, location]);

	return isAuthenticated ? children : null; // Prevents flickering issues
};

export default PrivateRoute;

