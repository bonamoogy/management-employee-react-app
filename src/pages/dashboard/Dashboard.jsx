import React, { useState, useEffect } from "react";
import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    logins: 0,
    units: 0,
    positions: 0,
    topUsers: [],
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get("/dashboard", { params });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchStats();
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchStats();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      <div className="mb-6">
        <label className="mr-4">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <label className="ml-4 mr-4">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleFilter}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply Filter
        </button>
        <button
          onClick={handleClearFilter}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Filter
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Employees", value: stats.employees },
              { label: "Logins", value: stats.logins },
              { label: "Units", value: stats.units },
              { label: "Positions", value: stats.positions },
            ].map((stat, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-600">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Top 10 Active Users
            </h3>
            <table className="table-auto w-full mt-4 rounded-lg border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-600">
                    Username
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Login Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-200"
                  >
                    <td className="px-4 py-2 text-gray-700">
                      {user.employee?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {user.loginCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
