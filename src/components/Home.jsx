import React, { useEffect, useState } from "react";
import logo from "../assets/images/zeyoraLogo.png";
import { TiShoppingCart } from "react-icons/ti";
import { IoPersonAdd } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ShieldCheck, ThumbsUp, Globe } from "lucide-react";
import { BsSearch } from "react-icons/bs";
import AdBanner from "./AdBanner";

// Import API instances
import { getProducts } from "../api/productsApi";
import { getCart, addCartItem, updateCartItem } from "../api/cartApi";

const ProductCard = ({ product, addToCart, cartItems = [] }) => {
  // Ensure cartItems is always an array
  const isInCart = cartItems.some(
    (item) => item.productId == product.id || item.id == product.id
  );

  let stockStatus = "";
  let stockColor = "";
  if (product.stock > 10) {
    stockStatus = "In Stock";
    stockColor = "from-green-400 to-green-600";
  } else if (product.stock > 0) {
    stockStatus = "Limited Stock";
    stockColor = "from-yellow-400 to-yellow-600";
  } else {
    stockStatus = "Out of Stock";
    stockColor = "from-red-400 to-red-600";
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-100 via-white to-white rounded-xl shadow-md p-2 text-center hover:scale-105 transition w-full min-w-0 flex flex-col overflow-hidden group">
      <span
        className={`absolute top-3 left-3 px-3 py-0.5 rounded-full text-white text-[10px] sm:text-xs font-semibold bg-gradient-to-r ${stockColor} overflow-hidden z-10`}
      >
        <span className="relative z-10">{stockStatus}</span>
        <span className="absolute top-0 left-[-100%] w-2/3 h-full bg-white opacity-30 transform -skew-x-12 animate-shimmer"></span>
      </span>

      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col relative z-0">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-40 sm:h-48 md:h-60 lg:h-72 object-cover rounded-lg shadow-md group-hover:brightness-105 transition duration-300 z-0"
        />
        <h3 className="mt-2 text-xs sm:text-sm md:text-lg font-semibold truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-1 md:gap-2">
          <p className="text-yellow-500 font-semibold text-xs sm:text-sm md:text-lg">
            ₹{product.price}
          </p>
          <p className="text-gray-400 line-through text-[10px] sm:text-xs md:text-sm">
            ₹{product.mrp}
          </p>
        </div>
      </Link>

      {product.stock === 0 ? (
        <button
          disabled
          className="mt-2 w-full py-1.5 sm:py-2 md:py-3 px-2 rounded-lg text-xs sm:text-sm md:text-base font-medium text-white shadow-md bg-gray-400 cursor-not-allowed"
        >
          Out of Stock
        </button>
      ) : isInCart ? (
        <Link to="/cart">
          <button className="mt-2 w-full py-1.5 sm:py-2 md:py-3 px-2 rounded-lg text-xs sm:text-sm md:text-base font-medium text-white shadow-md bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 hover:shadow-lg transition duration-300">
            ➜ Go to Cart
          </button>
        </Link>
      ) : (
        <button
          className="mt-2 w-full py-1.5 sm:py-2 md:py-3 px-2 rounded-lg text-xs sm:text-sm md:text-base font-medium text-white shadow-md bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg transition duration-300"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      )}

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}</style>
    </div>
  );
};


const Home = () => {
  const [products, setProducts] = useState([]); // ✅ always an array
  const [popup, setPopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loginIsOpen, setloginIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // ✅ always an array
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    return loggedUser ? JSON.parse(loggedUser) : null;
  });

  // Fetch products
useEffect(() => {
  getProducts()
    .then((data) => setProducts(data)) // ✅ directly set array
    .catch((e) => {
      console.error("Error fetching products:", e);
      setProducts([]);
    });
}, []);

  // Fetch user cart
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    getCart(user.id)
      .then((res) => setCartItems(res?.data || []))
      .catch((err) => {
        console.error(err);
        setCartItems([]); // ✅ fallback
      });
  }, [user]);

  const addToCart = async (product) => {
  if (!user) {
    alert("Please log in to add items to your cart.");
    navigate("/login");
    return;
  }

  try {
    // Optimistic update: add/update cart locally first
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        const today = new Date().toLocaleDateString("en-GB");
        return [
          ...prev,
          {
            userId: user.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            img: product.img,
            quantity: 1,
            stock: product.stock,
            date: today,
          },
        ];
      }
    });

    // Then run API calls in the background
    const cartRes = await getCart(user.id);
    const cart = cartRes?.data || [];
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      await updateCartItem(existingItem.id, {
        ...existingItem,
        quantity: (existingItem.quantity || 1) + 1,
      });
      setPopup(`${product.name} quantity updated!`);
    } else {
      const today = new Date().toLocaleDateString("en-GB");
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

    // Sync local cart with latest server data
    const updatedCart = await getCart(user.id);
    setCartItems(updatedCart?.data || []);

    setTimeout(() => setPopup(null), 3000);
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const results = (products || []).filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    const results = (products || []).filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    setCartItems([]);
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/");
  };

  const premiumProducts = (products || [])
    .filter((p) => p.price > 5000)
    .slice(0, 12);

  return (
    <>
      <div className="nav-div">
        <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-white relative ">
          <div className="logo">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-32 h-12 sm:w-40 sm:h-14 md:w-64 md:h-24 lg:w-40  object-contain"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-blue-400 hover:text-blue-600">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-600">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">
              Help/Support
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md ml-3 md:mx-0"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className=" border border-gray-300 rounded-full px-3 py-1 sm:py-1.5 text-xs sm:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition-width duration-300"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              <BsSearch />
            </button>
          </form>

          <div className="flex items-center gap-0 lg:gap-5 relative ml-2">
            {user && (
              <Link to="/cart" className="relative ">
                <button className="text-gray-700 hover:text-blue-600 text-2xl p-1 mx-1">
                  <TiShoppingCart />
                </button>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            <div className="relative">
              <button
                className="text-gray-700 hover:text-blue-600 text-2xl p-1 mx-1"
                onClick={() => setloginIsOpen(!loginIsOpen)}
              >
                {user ? (
                  <FaRegCircleUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                ) : (
                  <IoPersonAdd />
                )}
              </button>
              {user ? (
                <h3 className=" md:block text-[10px]">{user.username}</h3>
              ) : (
                <h4 className="hidden md:block text-[10px]">Login/Signin</h4>
              )}

              {loginIsOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    {user ? (
                      <>
                        <li>
                          <Link
                            to="/userProfile"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setloginIsOpen(false)}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              setloginIsOpen(false);
                            }}
                            className="w-full  px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to="/login"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setloginIsOpen(false)}
                          >
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/signup"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setloginIsOpen(false)}
                          >
                            Signup
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-2xl ml-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {isOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Help/Support
            </Link>
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:text-white bg-white hover:bg-blue-600 text-sm px-4 py-2 border border-gray-300 rounded-full shadow-sm transition-colors duration-200 w-full text-center"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="text-gray-700 hover:text-blue-600 text-2xl p-1">
                  <FaRegCircleUser />
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="product-box">
        <div className="p-6 relative">
          {popup && (
            <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50">
              {popup}
            </div>
          )}

          <AdBanner />
          <br />
          <br />

          <div className="bg-white py-3 px-2">
            <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto text-center">
              {/* Authenticity */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="p-1 rounded-full border border-gray-300 bg-white shadow-sm">
                  <ShieldCheck className="text-gray-800 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs sm:text-sm font-semibold">
                    Authenticity
                  </h3>
                  <p className="text-[9px] sm:text-xs text-gray-500">
                    Certified products only
                  </p>
                </div>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="p-1 rounded-full border border-gray-300 bg-white shadow-sm">
                  <ThumbsUp className="text-gray-800 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs sm:text-sm font-semibold">Trusted</h3>
                  <p className="text-[9px] sm:text-xs text-gray-500">
                    Thousands of happy customers
                  </p>
                </div>
              </div>

              {/* Global Reach */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="p-1 rounded-full border border-gray-300 bg-white shadow-sm">
                  <Globe className="text-gray-800 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs sm:text-sm font-semibold">
                    Worldwide
                  </h3>
                  <p className="text-[9px] sm:text-xs text-gray-500">
                    Delivery across the globe
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-100 to-purple-100 text-center py-3 px-6 rounded-xl shadow-md mt-8 sm:mt-12 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 tracking-wide">
              ✨ New Arrivals Just Landed – Explore Now!
            </p>
          </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {(searchQuery ? searchResults.slice(-8) : products.slice(-8)).map(
          (p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={addToCart}
              cartItems={cartItems}
            />
          )
        )}
      </div>

          <h3 className="bg-gradient-to-r from-pink-100 to-purple-100 py-3 sm:py-5 rounded-xl mt-8 sm:mt-12 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg font-semibold text-gray-800 tracking-wide">
            🔥 Trending Products
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(10, 18).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                cartItems={cartItems}
              />
            ))}
          </div>

          <h3 className="bg-gradient-to-r from-pink-100 to-purple-100 py-3 rounded-xl sm:py-5 text-sm sm:text-base md:text-lg font-semibold text-gray-800 tracking-wide mt-8 sm:mt-12 mb-4 sm:mb-6">
            💎 Premium Collection
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {premiumProducts.length > 0 ? (
              premiumProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  addToCart={addToCart}
                  cartItems={cartItems}
                />
              ))
            ) : (
              <p className="text-gray-500">No premium products available.</p>
            )}
          </div>

          {!searchQuery && products.length > 8 && (
            <div className="flex justify-center mt-6">
              <Link to="/shop">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  View More
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3">Zeyora</h4>
            <p className="text-gray-400 text-sm">
              Bringing luxury & elegance to your shopping experience.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">Email: support@zeyora.com</p>
            <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
            <p className="text-gray-400 text-sm">Location: Kerala, India</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Zeyora. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Home;
