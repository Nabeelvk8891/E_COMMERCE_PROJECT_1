import { useEffect, useState } from "react";
import SidebarNav from "./Sidenav";
import { FaTrash, FaBan, FaCheck, FaBoxOpen, FaTimes } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance"; // 👈 centralized axios

const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users"); // 👈 axiosInstance
      const filtered = res.data.filter(user => user.email !== "admin@gmail.com");
      setUsers(filtered);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (user) => {
    try {
      const updatedUser = { ...user, active: !user.active };
      await axiosInstance.put(`/users/${user.id}`, updatedUser); // 👈 axiosInstance
      setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axiosInstance.delete(`/users/${id}`); // 👈 axiosInstance
      setUsers(users.filter(u => u.id !== id));
      alert(`${name} deleted successfully`);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const fetchOrders = (user) => {
    setOrders(user.orders || []);
    setIsOrdersOpen(true);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <SidebarNav
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className={`flex-1 transition-all duration-300 p-6 ${isHovered ? "md:ml-56" : "md:ml-20"}`}>
        <h2 className="text-2xl font-bold mb-4">All Users</h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition"
            >
              <div className="text-left text-sm">
                <h2 className="font-semibold truncate">{user.username}</h2>
                <p>
                  <span className="font-bold">Email:</span> {user.email}
                </p>
                <p
                  className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.active ? "Active" : "Blocked"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => toggleUserStatus(user)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                    user.active
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {user.active ? <FaBan /> : <FaCheck />}
                  {user.active ? "Block" : "Activate"}
                </button>

                <button
                  onClick={() => deleteUser(user.id, user.username)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-700 transition"
                >
                  <FaTrash /> Delete
                </button>

                <button
                  onClick={() => fetchOrders(user)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition"
                >
                  <FaBoxOpen /> Orders
                </button>
              </div>
            </div>
          ))}
        </div>

        {isOrdersOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setIsOrdersOpen(false)}
            ></div>
            <div className="relative bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
                onClick={() => setIsOrdersOpen(false)}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-bold mb-3">Orders</h2>

              {orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-2 flex flex-col sm:flex-row sm:items-center gap-2"
                    >
                      <img
                        src={item.img || "https://via.placeholder.com/80"}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p>Qty: {item.quantity}</p>
                        <p className="text-green-600 font-bold">
                          ₹{item.price}
                        </p>
                        <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                          {item.status === "Delivered"
                            ? "Delivered"
                            : "Shipping in process - Arrives in 5-7 days"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No orders found</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersData;
