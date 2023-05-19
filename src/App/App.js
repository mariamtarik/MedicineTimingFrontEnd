import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Signup from "./../Componants/Register/Register";
import Login from "../Componants/Login/Login";
import MedicineApp from "../Componants/Home/Home";

import "./App.css";

import { Routes, Route } from 'react-router-dom'
import { RequiredAuth } from "../Componants/RequredAuth";
import ShowMedicines from "../Componants/Home/ShowMedicines";

function App() {
  // let navigate = useNavigate();
  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
  }, []);

  let saveUserData = () => {
    try {
      let token = localStorage.getItem("userToken"); //incoded token
      let decodedToken = jwtDecode(token);
      setUserData(decodedToken);
    } catch (err) { }
  };

  let logout = () => {
    setUserData(null);
    localStorage.removeItem("userToken");
    // navigate("/signin")
  };

  console.log(userData);
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login saveUserData={saveUserData} />} />
      <Route
        path="/app"
        element={
          <RequiredAuth>
            <MedicineApp userDate={userData} logout={logout} />
            {/* <ShowMedicines /> */}
          </RequiredAuth>
        }
      />
    </Routes>
  );
}

export default App;
