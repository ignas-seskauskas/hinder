import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import { WithNav, WithoutNav } from "./components/";

import LoginRegisterView from "./views/Login/LoginRegisterView";
import LoginPage from "./views/Login/LoginPage";
import RegisterPage from "./views/Login/RegisterPage";
import HobbySearcherView from "./views/Home/HobbySearcherView";
import HobbyPage from "./views/Hobby/HobbyPage";
import HobbyListView from "./views/Admin/HobbyListView";
import AdminHomeView from "./views/Home/AdminHomeView";
import RouteListView from "./views/Hobby/RouteListView";
import RoutePage from "./views/Hobby/RoutePage";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<WithoutNav />}>
              <Route path="/" element={<LoginRegisterView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<WithNav />}>
              <Route path="/home" element={<AdminHomeView />} />
              <Route path="/hobby/*" element={<HobbyPage />} />
              <Route path="/hobby/list" element={<HobbyListView />} />
              <Route path="/route/*" element={<RoutePage />} />
              <Route path="/route/list" element={<RouteListView />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
