import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { getUserById } from "../api/usersApi"; // centralized helper

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
      getUserById(loggedInUser.id)
        .then((res) => {
          setWishlist(res.wishlist || []);
          setOrders(res.orders || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">No user logged in</h2>
        <Link to="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="relative p-4 md:p-8 bg-gray-100">
      <Link
        to="/"
        className="absolute top-1 right-2 font-semibold text-sm hover:underline"
      >
        Go Home
      </Link>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <p className="flex flex-col items-center text-center">
          <FaCircleUser className="text-[100px] my-5" />
          <span className="font-semibold">Name:</span> {user?.username}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
      </div>

      {/* Wishlist */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-3 text-center hover:shadow transition flex flex-col items-center"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="w-full flex flex-col items-center"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full max-w-[120px] h-[120px] object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm sm:text-base font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    ₹{product.price}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products in wishlist</p>
        )}
      </div>

      {/* Orders */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        {orders.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {orders.map((item, idx) => {
              const statusText =
                item.status === "Delivered"
                  ? "Delivered"
                  : "Shipping in process - Arrives in 3-5 days";

              return (
                <div
                  key={idx}
                  className="border rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full max-w-[120px] h-[120px] sm:h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-base sm:text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                  <span
                    className={`mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
