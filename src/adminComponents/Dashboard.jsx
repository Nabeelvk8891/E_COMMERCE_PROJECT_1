import React, { useEffect, useState } from "react";
import SidebarNav from "./Sidenav";
import { getUsers } from "../api/usersApi";
import { getProducts } from "../api/productsApi";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const productsData = await getProducts();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);

        const allOrders = Array.isArray(usersData)
          ? usersData.flatMap((u) => Array.isArray(u.orders) ? u.orders : [])
          : [];
        setOrders(allOrders);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-gray-700">Loading dashboard...</div>;

  const totalIncome = orders.reduce((acc, order) => acc + (Number(order.price) || 0), 0);

  const productsByOrigin = products.reduce((acc, product) => {
    if (product.origin) acc[product.origin] = (acc[product.origin] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Users", value: users.length, color: "from-blue-400 to-blue-600" },
    { label: "Products", value: products.length, color: "from-cyan-400 to-cyan-600" },
    { label: "Orders", value: orders.length, color: "from-yellow-400 to-yellow-600" },
    { label: "Income", value: `$${totalIncome}`, color: "from-green-400 to-green-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarNav
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 transition-all duration-300 p-6 ${isHovered ? "md:ml-56" : "md:ml-20"}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-1 text-gray-500 text-sm md:text-base">Overview of your store metrics</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-lg bg-gradient-to-r ${stat.color} text-white flex flex-col items-start justify-center`}
            >
              <span className="text-sm font-medium">{stat.label}</span>
              <span className="mt-1 text-xl md:text-2xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

  <div className="bg-white p-3 rounded-lg shadow-md" style={{ height: 200 }}>
    <h3 className="text-md font-medium mb-2 text-gray-700">Users vs Products vs Orders</h3>
    <Bar
      data={{
        labels: ["Users", "Products", "Orders"],
        datasets: [
          {
            label: "Count",
            data: [users.length, products.length, orders.length],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
            borderRadius: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // MUST be false
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      }}
    />
  </div>

  <div className="bg-white p-3 rounded-lg shadow-md" style={{ height: 200 }}>
    <h3 className="text-md font-medium mb-2 text-gray-700">Products by Origin</h3>
    <Pie
      data={{
        labels: Object.keys(productsByOrigin).length ? Object.keys(productsByOrigin) : ["No Products"],
        datasets: [
          {
            data: Object.values(productsByOrigin).length ? Object.values(productsByOrigin) : [1],
            backgroundColor: [
              "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
            ],
          },
        ],
      }}
      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
    />
  </div>

  <div className="bg-white p-3 rounded-lg shadow-md lg:col-span-2" style={{ height: 250 }}>
    <h3 className="text-md font-medium mb-2 text-gray-700">Income Trend</h3>
    <Line
      data={{
        labels: orders.length ? orders.map((_, i) => `Order ${i + 1}`) : ["No Orders"],
        datasets: [
          {
            label: "Order Price",
            data: orders.length ? orders.map((o) => Number(o.price) || 0) : [0],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            fill: true,
            pointRadius: 2,
          },
        ],
      }}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
