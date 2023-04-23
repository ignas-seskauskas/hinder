import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./views/Login/LoginPage";
import LoginRegisterView from "./views/Login/LoginRegisterView";
import RegisterPage from "./views/Login/RegisterPage";
import HobbySearcherView from "./views/Home/HobbySearcherView";
import WithNav from "./components/WithNav";
import WithoutNav from "./components/WithoutNav";
import HobbyPage from "./views/Hobby/HobbyPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<WithoutNav />}>
            <Route path="/" element={<LoginRegisterView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<WithNav />}>
            <Route path="/home" element={<HobbySearcherView />} />
            <Route path="/hobby" element={<HobbyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
