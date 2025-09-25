import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, removeCartItem } from "../api/cartApi";
import { getProductById } from "../api/productsApi"; 
import axiosInstance from "../api/axiosInstance";

const Payment = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Fetch user and cart
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
        const data = await getCart(storedUser.id); // returns array directly
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const totalMrp = cart.reduce((sum, item) => sum + Number(item.mrp || 0) * Number(item.quantity || 1), 0);
  const totalDiscount = totalMrp - totalPrice;

  const handleUpiChange = (value) => {
    setUpiId(value);
    if (!value) setUpiError("Enter UPI ID");
    else if (!value.includes("@")) setUpiError("Enter valid UPI ID");
    else setUpiError("");
  };

  const handlePlaceOrder = async () => {
    if (!name || !address || !pinCode) {
      alert("Please fill in all details.");
      return;
    }
    if (paymentMethod === "upi" && (!upiId || !upiId.includes("@"))) {
      setUpiError("Enter valid UPI ID");
      return;
    }

    try {
      const userRes = await axiosInstance.get(`/users/${user.id}`);
      const existingOrders = userRes.data.orders || [];
      const updatedOrders = [...existingOrders, ...cart];
      await axiosInstance.patch(`/users/${user.id}`, { orders: updatedOrders });

      for (let item of cart) {
        const product = await getProductById(item.productId);
        const newStock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
        await axiosInstance.patch(`/products/${item.productId}`, { stock: newStock });
        await removeCartItem(item.id);
      }

      setCart([]);
      setOrderPlaced(true);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="mb-4 text-gray-500">Please log in to proceed with payment.</p>
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Go to Login</button>
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Thank you for shopping!</h2>
        <p className="mb-6 text-gray-700">Your order has been placed successfully and will be shipped in 5-7 days.</p>
        <Link to="/">
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6 w-full min-h-screen">
      {/* Cart Summary */}
      <div className="flex-1 bg-gray-100 p-4 md:p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Cart ({totalItems})</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div className="flex gap-4 items-center">
                <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-600 font-bold">₹{Number(item.price || 0) * Number(item.quantity || 1)}</p>
                </div>
              </div>
              <p className="font-semibold">{item.quantity || 1}</p>
            </div>
          ))
        )}
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Order Summary</h3>
          <div className="flex justify-between mb-1">Subtotal:<span>₹{totalMrp}</span></div>
          <div className="flex justify-between mb-1 text-green-600">Discount:<span>-₹{totalDiscount}</span></div>
          <div className="flex justify-between mb-1 text-green-600">Shipping:<span>Free</span></div>
          <div className="flex justify-between font-bold border-t pt-2 text-lg">Total:<span>₹{totalPrice}</span></div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 md:p-6 rounded-2xl shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Delivery Details & Payment</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" />
        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" />
        <input type="text" placeholder="Pin Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500" />

        <div>
          <p className="font-semibold mb-2">Payment Method:</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} /> UPI
            </label>
          </div>
        </div>

        {paymentMethod === "upi" && (
          <div className="flex flex-col">
            <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => handleUpiChange(e.target.value)} className={`border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 ${upiError ? "border-red-500" : ""}`} />
            {upiError && <span className="text-red-500 text-sm mt-1">{upiError}</span>}
          </div>
        )}

        <p className="text-gray-500 text-sm mt-2">Delivery in 5-7 days | Free delivery</p>

        <div className="flex gap-4 mt-4">
          <button onClick={() => navigate("/cart")} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Edit Cart</button>
          <button onClick={handlePlaceOrder} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
