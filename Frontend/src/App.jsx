import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SaleContract from "./pages/SaleContract";
import SaleContractPrint from "./Prints/SaleContractPrint";
import RentContract from "./pages/RentContract";
import Archive from "./pages/Archive";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sale-contract" element={<SaleContract />} />
      <Route path="/sale-contract/print" element={<SaleContractPrint />} />
      <Route path="/rent-contract" element={<RentContract />} />
      <Route path="/archive" element={<Archive />} />
    </Routes>
  );
}

export default App;