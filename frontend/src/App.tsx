import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./views/Login/LoginPage";
import LoginRegisterView from "./views/Login/LoginRegisterView";
import RegisterPage from "./views/Login/RegisterPage";
import HobbySearcherView from "./views/Home/HobbySearcherView";
import NavBarView from "./components/NavBar";
import HobbyPage from "./views/Hobby/HobbyPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBarView />
        <Routes>
          <Route path="/" element={<LoginRegisterView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HobbySearcherView />} />
          <Route path="/hobby" element={<HobbyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
