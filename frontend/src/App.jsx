import React, {useContext} from "react";
import "./index.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// Route Admin
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ManageTask from "./pages/Admin/ManageTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import CreateTask from "./pages/Admin/CreateTask";
// Route Users
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTasksDetails from "./pages/User/ViewTasksDetails";

import {UserContext} from "./context/useContext";
import UserProvider from "./context/useContext";
import PrivateRoute from "./routes/PrivateRoute";
import {Outlet} from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Protected Routes */}
            <Route element={<PrivateRoute allowRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<PrivateRoute allowRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/tasks-details/:id" element={<ViewTasksDetails />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

    <Toaster
        toastOptions={{ 
          className :"",
          style : {
            fontSize : "13px"
          },
         }} />
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const {user, loading} = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }
};
