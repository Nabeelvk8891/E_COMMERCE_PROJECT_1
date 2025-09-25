import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { IoPersonAdd } from "react-icons/io5";
import { Menu, X } from "lucide-react";
import { BsSearch } from "react-icons/bs";
import logo from "../assets/images/zeyoraLogo.png";

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

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const loggedUser = localStorage.getItem("loggedInUser");
      return loggedUser ? JSON.parse(loggedUser) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return setCartItems([]);
      try {
        const data = await getCart(user.id);
        setCartItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [user]);

  const addToCartHandler = async (product) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      const cart = await getCart(user.id);
      const existingItem = cart.find((item) => item.productId === product.id);
      const today = new Date().toLocaleDateString("en-GB");

      if (existingItem) {
        await updateCartItem(existingItem.id, {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + 1,
        });
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
      setTimeout(() => setPopup(null), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setShowSuggestions(false);
      setSearchResults([]);
      return;
    }

    const results = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setShowSuggestions(false);
  };

  // Filter
  const handleFilter = (type) => {
    if (filter === type) setFilter(null);
    else setFilter(type);
  };

  const filteredProducts = (searchQuery ? searchResults : [...products])
    .sort((a, b) => b.id - a.id)
    .filter((p) => {
      if (!filter) return true;
      if (filter === "oud") return p.name.toLowerCase().includes("oud");
      if (filter === "musk") return p.name.toLowerCase().includes("musk");
      if (filter === "vanilla") return p.name.toLowerCase().includes("vanilla");
      if (filter === "amber") return p.name.toLowerCase().includes("amber");
      if (filter === "rose") return p.name.toLowerCase().includes("rose");
      if (filter === "jasmin") return p.name.toLowerCase().includes("jasmin");
      if (filter === "under1000") return Number(p.price) <= 1000;
      if (filter === "under2000") return Number(p.price) <= 2000;
      if (filter === "under5000") return Number(p.price) <= 5000;
      return true;
    });

  return (
    <>
      <nav className="flex items-center justify-between px-2 sm:px-6 py-3 shadow-md bg-white">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-32 h-12 sm:w-40 sm:h-14 md:w-64 md:h-24 lg:w-40 object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/shop" className="text-blue-400 hover:text-blue-600">Shop</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Help/Support</Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/3 mx-2 mb-2 md:mx-0 md:mb-0">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="border border-gray-300 rounded-full px-3 py-1 sm:py-1.5 text-xs sm:text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition-width duration-300"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-blue-700 transition">
              <BsSearch />
            </button>
          </div>

          {showSuggestions && searchResults.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-48 overflow-y-auto z-50">
              {searchResults.map((p) => (
                <li
                  key={p.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setShowSuggestions(false);
                    setSearchQuery("");
                  }}
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0 lg:gap-4">
            {user ? (
              <div className="flex flex-row lg:gap-4">
                <div className="relative">
                  <Link to="/cart">
                    <button className="text-gray-700 hover:text-blue-600 text-2xl p-1 mx-2">
                      <TiShoppingCart />
                    </button>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full px-1">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="text-gray-700 hover:text-blue-600 text-2xl p-1 mx-3">
                  <IoPersonAdd />
                </button>
              </Link>
            )}
          </div>

          <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 flex flex-col gap-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">Shop</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">Help/Support</Link>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {popup && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg z-50">
            {popup}
          </div>
        )}

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {["oud", "musk", "vanilla", "amber", "rose", "jasmin", "under1000", "under2000", "under5000"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-4 py-1 rounded-xl text-sm sm:text-base ${filter === f ? "bg-yellow-500  text-white " : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {f === "under1000"
                ? "Under ₹1000"
                : f === "under2000"
                ? "Under ₹2000"
                : f === "under5000"
                ? "Under ₹5000"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="px-4 py-1 rounded-xl text-sm sm:text-base bg-gray-600 text-white hover:bg-gray-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        <h3 className="text-base sm:text-2xl font-bold mb-4">
          Shop Our Exclusive Collection
        </h3>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={addToCartHandler}
              cartItems={cartItems}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;
