import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import VisitorForm from "./VisitorForm"; // your existing visitor form
import CourierForm from "./CourierForm"; 
import SplashScreen from "./SplashScreen";
import SelectionScreen from "./SelectionScreen";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/select" element={<SelectionScreen />} />
        <Route path="/visitor" element={<VisitorForm />} />
        <Route path="/courier" element={<CourierForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
