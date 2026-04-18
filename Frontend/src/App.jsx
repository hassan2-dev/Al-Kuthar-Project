import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { getAuthToken } from "./api/axiosInstance";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SaleContract from "./pages/SaleContract";
import SaleContractPrint from "./Prints/SaleContractPrint";
import RentContract from "./pages/RentContract";
import RentContractPrint from "./Prints/RentContractPrint";
import Archive from "./pages/Archive";
import ContractView from "./pages/ContractView";

function RequireAuth() {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  useTheme(); // applies data-theme to <html> on mount + when toggled
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sale-contract" element={<SaleContract />} />
        <Route path="/sale-contract/print" element={<SaleContractPrint />} />
        <Route path="/rent-contract" element={<RentContract />} />
        <Route path="/rent-contract/print" element={<RentContractPrint />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/contract-view/:id" element={<ContractView />} />
      </Route>
    </Routes>
  );
}

export default App;