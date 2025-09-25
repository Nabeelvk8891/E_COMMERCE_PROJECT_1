import { useEffect, useState } from "react";
import SidebarNav from "./Sidenav";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance"; // 👈 centralized axios

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    type: "",
    brand: "",
    origin: "",
    price: "",
    mrp: "",
    size_ml: "",
    img: "",
    description: "",
    stock: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        price: Number(product.price),
        mrp: Number(product.mrp),
        size_ml: Number(product.size_ml),
        stock: Number(product.stock),
      };
      await axiosInstance.post("/products", newProduct); // 👈 axiosInstance
      onProductAdded();
      onClose();
      setProduct({
        name: "",
        type: "",
        brand: "",
        origin: "",
        price: "",
        mrp: "",
        size_ml: "",
        img: "",
        description: "",
        stock: "",
      });
      alert(`${product.name} is added successfully`);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/20"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 mx-4 sm:mx-0 animate-fade-in overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-lg sm:text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Add New Product
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={product.type}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={product.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            name="origin"
            placeholder="Origin"
            value={product.origin}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={product.mrp}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="number"
            name="size_ml"
            placeholder="Size (ml)"
            value={product.size_ml}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="url"
            name="img"
            placeholder="Image URL"
            value={product.img}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition col-span-1 md:col-span-2"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={product.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

const EditProductModal = ({
  isOpen,
  onClose,
  productData,
  onProductUpdated,
}) => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    type: "",
    brand: "",
    origin: "",
    price: "",
    mrp: "",
    size_ml: "",
    img: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...product,
        price: Number(product.price),
        mrp: Number(product.mrp),
        size_ml: Number(product.size_ml),
        stock: Number(product.stock),
      };
      await axiosInstance.put(`/products/${product.id}`, updatedProduct); // ✅ use axiosInstance
      alert(`${product.name} updated successfully`);
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. See console for details.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-white/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 mx-4 sm:mx-0 overflow-y-auto max-h-[90vh]
                    transform transition-all duration-300 ease-out
                    ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <button
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-lg sm:text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Edit Product
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {Object.keys(product)
            .filter((key) => key !== "id")
            .map((key) => (
              <input
                key={key}
                type={
                  key.includes("price") ||
                  key.includes("size") ||
                  key === "stock"
                    ? "number"
                    : "text"
                }
                name={key}
                placeholder={key.replace("_", " ").toUpperCase()}
                value={product[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            ))}
          <button
            type="submit"
            className="md:col-span-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products"); // 👈 axiosInstance
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/products/${id}`); // 👈 axiosInstance
      setProducts(products.filter((p) => p.id !== id));
      setFiltered(filtered.filter((p) => p.id !== id));
      alert(`${name} deleted successfully`);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleSearch = () => {
    const query = search.toLowerCase();
    setFiltered(products.filter((p) => p.name.toLowerCase().includes(query)));
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 w-full">
          <h1 className="text-2xl font-bold">All Products</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="flex-1 sm:w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <FaSearch />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            <FaPlus /> Add New Product
          </button>
        </div>

        <div className="space-y-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow rounded-xl p-4 hover:shadow-md transition"
            >
              <img
                src={product.img || "https://via.placeholder.com/80"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md mb-3 sm:mb-0"
              />
              <div className="flex-1 sm:ml-4 overflow-hidden">
                <h2 className="font-semibold text-lg truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                <p className="text-green-600 font-bold mt-1">₹{product.price}</p>
                <p
                  className={`mt-2 px-3 py-1 text-sm font-medium rounded-full text-center inline-block ${
                    product.stock <= 0
                      ? "text-red-700 bg-red-100"
                      : product.stock < 5
                      ? "text-orange-700 bg-orange-100"
                      : "text-green-700 bg-green-100"
                  }`}
                >
                  {product.stock <= 0
                    ? "Out of Stock"
                    : product.stock < 5
                    ? `Low Stock (${product.stock} left)`
                    : "In Stock"}
                </p>
              </div>
              <div className="flex gap-3 mt-3 sm:mt-0 sm:ml-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts}
      />

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        productData={selectedProduct}
        onProductUpdated={fetchProducts}
      />
    </div>
  );
};

export default ProductManagement;