import React from "react";
import useUserAuth from "../../hooks/useUserAuth";
import {UserContext} from "../../context/useContext";
import {useContext} from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const UserDashboard = () => {
  useUserAuth();

  const {user} = useContext(UserContext);

  return <DashboardLayout activeMenu={"Dashboard"}>Dashboard</DashboardLayout>;
};

export default UserDashboard;
