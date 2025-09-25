import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCart, updateCartItem, removeCartItem } from "../api/cartApi";
import shopNow from "../assets/images/shopNow.png";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      setUser(null);
      setCart([]);
      return;
    }
    setUser(storedUser);

    const fetchCart = async () => {
      try {
        const data = await getCart(storedUser.id); // no .data
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);

  const increaseQty = async (item) => {
    const newQty = Math.min((item.quantity || 1) + 1, item.stock || 1);
    if (newQty === item.quantity) return;

    try {
      await updateCartItem(item.id, { quantity: newQty });
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const decreaseQty = async (item) => {
    if ((item.quantity || 1) <= 1) return;
    const newQty = (item.quantity || 1) - 1;

    try {
      await updateCartItem(item.id, { quantity: newQty });
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (item) => {
    try {
      await removeCartItem(item.id);
      setCart((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const totalMrp = cart.reduce(
    (sum, item) => sum + Number(item.mrp || 0) * Number(item.quantity || 1),
    0
  );
  const totalDiscount = totalMrp - totalPrice;

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6 w-full min-h-screen">
      <div className="flex-1 bg-gray-100 p-4 md:p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart ({totalItems})</h2>

        {!user ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-gray-500 mb-4">Please log in to view your cart.</p>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Go to Login
              </button>
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/shop">
              <img src={shopNow} alt="Shop Now" className="w-40 md:w-50" />
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-4 gap-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 md:w-20 md:h-20 object-cover rounded-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <p className="text-green-600 font-bold">
                      ₹{Number(item.price || 0) * Number(item.quantity || 1)}
                    </p>
                    <p className="text-gray-400 line-through text-sm">
                      ₹{Number(item.mrp || 0) * Number(item.quantity || 1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap sm:flex-nowrap justify-center">
                {item.stock === 0 && (
                    <p className="text-red-600 text-sm mt-1 sm:mt-0 text-center sm:text-left">
                      Out of Stock
                    </p>
                  )}
                  {item.stock > 0 && item.stock <= 5 && (
                    <p className="text-yellow-600 text-sm mt-1 sm:mt-0 text-center sm:text-left">
                      Only {item.stock} left in stock!
                    </p>
                  )}
                <button
                  onClick={() => decreaseQty(item)}
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() => increaseQty(item)}
                  className={`p-2 rounded-lg ${
                    item.quantity >= item.stock ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  disabled={item.quantity >= item.stock}
                  >
                  <Plus size={16} />
                </button>
                  
                <button
                  onClick={() => removeItem(item)}
                  className="ml-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      <div className="w-full lg:w-1/3 bg-gray-100 p-4 md:p-6 rounded-2xl shadow-md h-fit lg:sticky top-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        {!user ? (
          <p className="text-gray-400 text-sm">Log in to view your order summary.</p>
        ) : cart.length === 0 ? (
          <p className="text-gray-400 text-sm">Add items to your cart to see summary.</p>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{totalMrp}</span>
            </div>
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount:</span>
              <span>-₹{totalDiscount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
            <Link to="/payment">
              <button className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Proceed to Payment
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
