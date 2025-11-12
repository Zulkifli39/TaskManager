import React, {useState, useEffect, useContext} from "react";
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {UserContext} from "../../context/useContext";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import moment from "moment";
import CustomPieChart from "../../components/charts/CustomPieChart";
import TaskListTable from "../../components/TaskListTable";
import InfoCard from "../../components/card/InfoCard";
import {addThousandsSeparator} from "../../utils/helper";
import {IoMdCard} from "react-icons/io";
import {LuArrowRight} from "react-icons/lu";
import CustomBarChart from "../../components/charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();
  const {user} = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      {
        status: "Pending",
        count: taskDistribution?.pending || 0,
      },
      {
        status: "In Progress",
        count: taskDistribution?.in_progress || 0,
      },
      {
        status: "Completed",
        count: taskDistribution?.completed || 0,
      },
    ];
    setPieChartData(taskDistributionData);

    const taskPriorityLevelsData = [
      {
        priority: "Low",
        count: taskPriorityLevels?.Low || 0,
      },
      {
        priority: "Medium",
        count: taskPriorityLevels?.Medium || 0,
      },
      {
        priority: "High",
        count: taskPriorityLevels?.High || 0,
      },
    ];
    setBarChartData(taskPriorityLevelsData);
  };

  const getDashboard = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_USER_DASHBOARD_DATA);
      if (response) {
        setDashboardData(response.data);

        // Untuk menyiapkan data chart agar ditampilkan
        prepareChartData(response.data.charts || null);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="card my-5">
        <div className="">
          <div className="cols-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            {/* Untuk Hari, tanggal sekarang */}
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.all || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Pending Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.pending || 0)}
            color="bg-red-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="In Progress Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.in_progress || 0)}
            color="bg-yellow-500"
          />
          <InfoCard
            icon={<IoMdCard />}
            label="Completed Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.completed || 0)}
            color="bg-green-500"
          />
        </div>

        {/* Untuk Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Task Distribution</h5>
            </div>

            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Task Priority Levels</h5>
            </div>

            <CustomBarChart data={barChartData} />
          </div>
        </div>

        {/* Untuk Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Tasks</h5>

                <button className="card-btn" onClick={onSeeMore}>
                  See All <LuArrowRight className="text-base" />
                </button>
              </div>

              <TaskListTable tableData={dashboardData?.recentTasks || []} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
