import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { FaHeart, FaCheckCircle, FaTruck } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { getProductById, addProductReview } from "../api/productsApi";
import { getCart, addCartItem, updateCartItem } from "../api/cartApi";
import { getUserById, updateUser } from "../api/usersApi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [popup, setPopup] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const loggedUser = localStorage.getItem("loggedInUser");
      return loggedUser ? JSON.parse(loggedUser) : null;
    } catch {
      return null;
    }
  });

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data); // assuming API returns the object directly
        setReviews(data.review || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch wishlist
  useEffect(() => {
    if (!user) return;
    const fetchWishlist = async () => {
      try {
        const data = await getUserById(user.id);
        setWishlist(data.wishlist || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, [user]);

  // Fetch cart
  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const data = await getCart(user.id);
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) return navigate("/login");

    try {
      const cart = await getCart(user.id);
      const existingItem = cart.find((item) => item.productId === product.id);
      const today = new Date().toLocaleDateString("en-GB");

      if (product.stock === 0) {
        setPopup("Product is out of stock!");
        setTimeout(() => setPopup(null), 2000);
        return;
      }

      if (existingItem) {
        const newQuantity = Math.min((existingItem.quantity || 1) + 1, product.stock);
        await updateCartItem(existingItem.id, { quantity: newQuantity });
        setPopup(`${product.name} quantity updated!`);
      } else {
        await addCartItem({
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          img: product.img,
          quantity: 1,
          stock: product.stock,
          date: today,
        });
        setPopup(`${product.name} added to cart!`);
      }

      const updatedCart = await getCart(user.id);
      setCartItems(updatedCart);
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const submitReview = async () => {
    if (!reviewText.trim()) return;
    const newReviews = [...reviews, reviewText];
    try {
      await addProductReview(product.id, newReviews);
      setReviews(newReviews);
      setReviewText("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const handleWishlist = async (product) => {
    if (!user) return navigate("/login");

    try {
      const exists = wishlist.some((item) => item.id === product.id);
      const updatedWishlist = exists
        ? wishlist.filter((item) => item.id !== product.id)
        : [...wishlist, product];

      setWishlist(updatedWishlist);
      await updateUser(user.id, { wishlist: updatedWishlist });
      setPopup(
        exists ? `${product.name} removed from Wishlist!` : `${product.name} added to Wishlist!`
      );
      setTimeout(() => setPopup(null), 2000);
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setPopup("Error updating wishlist");
    }
  };

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );

  const isInCart = cartItems.some((i) => i.productId === product.id);
  const hasOrdered =
    user &&
    user.orders &&
    user.orders.some((order) => order.productId === product.id);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {popup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg z-50">
          {popup}
        </div>
      )}

      <div className="flex justify-end mb-4">
        {user ? (
          <Link
            to="/cart"
            className="relative bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm sm:text-base"
          >
            <TiShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        ) : (
          <Link to="/login">
            <IoIosLogIn className="text-2xl" />
          </Link>
        )}
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 flex justify-center items-start relative">
          <img
            src={product.img}
            alt={product.name}
            className="w-full max-w-sm md:max-w-md object-cover rounded-2xl shadow-lg hover:brightness-105 transition duration-300"
          />
        </div>

        <div className="md:w-1/2 flex flex-col gap-4 text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>
          {/* Price & Details */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="w-28 font-semibold">Our Price:</span>
              <span className="text-yellow-500 font-bold text-lg sm:text-xl">
                ₹{product.price}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="w-28 font-semibold">MRP:</span>
              <span className="line-through text-gray-400">₹{product.mrp}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 font-semibold">Brand:</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 font-semibold">Type:</span>
              <span>{product.type}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 font-semibold">Origin:</span>
              <span>{product.origin}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-28 font-semibold">Size:</span>
              <span>{product.size_ml} ml</span>
            </div>
            <div className="flex gap-2">
              <span
                className={`font-medium ${
                  product.stock === 0
                    ? "text-red-600"
                    : product.stock <= 10
                    ? "text-yellow-600"
                    : "text-green-600"
                } text-xs`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : product.stock <= 10
                  ? `Limited stock`
                  : "In Stock"}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-green-600" /> Trusted Checkout
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaTruck className="text-blue-500" /> Free Delivery
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaCheckCircle className="text-yellow-500" /> Genuine Product
            </div>
          </div>

          {/* Cart & Wishlist Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {product.stock === 0 ? (
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded-xl font-medium shadow-lg cursor-not-allowed w-full sm:w-auto"
                disabled
              >
                Out of Stock
              </button>
            ) : isInCart ? (
              <Link to="/cart" className="w-full sm:w-auto">
                <button className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 px-4 rounded-xl font-medium shadow-lg transition duration-300 text-sm sm:text-base w-full">
                  Go to Cart
                </button>
              </Link>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 px-4 rounded-xl font-medium shadow-lg transition duration-300 text-sm sm:text-base"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() => handleWishlist(product)}
              className="flex items-center justify-center border border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-500 rounded-xl px-4 py-2 transition duration-300"
            >
              <FaHeart
                className={
                  wishlist.some((item) => item.id === product.id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }
              />
              <span className="ml-2 hidden sm:inline">Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="space-y-3 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold">Customer Reviews</h2>
        <div className="flex flex-col gap-2">
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <p
                key={i}
                className="bg-gray-100 text-gray-700 text-sm sm:text-base p-2 rounded-md"
              >
                • {r}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-sm sm:text-base">No reviews yet.</p>
          )}
        </div>

        {hasOrdered && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review..."
              className="flex-1 p-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            />
            <button
              onClick={submitReview}
              className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
