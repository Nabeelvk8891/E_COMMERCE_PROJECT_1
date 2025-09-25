import { useEffect, useState } from "react";
import SidebarNav from "./Sidenav";
import axiosInstance from "../api/axiosInstance"; // 👈 centralized axios instance

const PaymentShipping = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Sidebar state
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/users"); // 👈 use axiosInstance
        setUsers(res.data);

        const allOrders = res.data.flatMap((user) =>
          (user.orders || []).map((order) => ({
            ...order,
            userName: user.username,
            userId: user.id,
            status: order.status || "Shipping in process",
          }))
        );
        setOrders(allOrders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const markDelivered = async (index) => {
    const order = orders[index];
    if (order.status === "Delivered") return;

    const updatedOrders = orders.map((o, i) =>
      i === index ? { ...o, status: "Delivered" } : o
    );
    setOrders(updatedOrders);

    const user = users.find((u) => u.id === order.userId);
    if (!user) return;

    const updatedUserOrders = user.orders.map((o) =>
      o.id === order.id ? { ...o, status: "Delivered" } : o
    );

    try {
      await axiosInstance.patch(`/users/${user.id}`, {
        orders: updatedUserOrders,
      }); // 👈 use axiosInstance
    } catch (err) {
      console.error("Failed to update order status on server", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 transition-all duration-300 p-6 ${isHovered ? "md:ml-56" : "md:ml-20"}`}>
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <p className="text-gray-500">Delivered</p>
            <p className="text-xl font-bold">
              {orders.filter((o) => o.status === "Delivered").length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <p className="text-gray-500">In Process</p>
            <p className="text-xl font-bold">
              {orders.filter((o) => o.status !== "Delivered").length}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.img || "https://via.placeholder.com/80"}
                  alt={order.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-gray-800">{order.name}</p>
                  <p className="text-gray-500 text-sm">
                    {order.userName} | Quantity: {order.quantity} | Date:{" "}
                    {order.date}
                  </p>
                  <p className="text-gray-700 font-medium">
                    Price: ${order.price}
                  </p>
                </div>
              </div>
              <div className="flex gap-5 mt-3 sm:mt-0 items-center">
                <p
                  className={`font-medium text-xs lg:text-sm ${
                    order.status === "Delivered" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-white ${
                    order.status === "Delivered"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={order.status === "Delivered"}
                  onClick={() => markDelivered(index)}
                >
                  {order.status === "Delivered" ? "Delivered" : "Mark Delivered"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentShipping;
