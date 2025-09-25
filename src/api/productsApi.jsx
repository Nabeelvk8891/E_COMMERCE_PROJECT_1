import axiosInstance from "./axiosInstance";

// Get all products
export const getProducts = async () => {
  const res = await axiosInstance.get("/products");
  // Always return an array
  return Array.isArray(res.data) ? res.data : [];
};

// Get product by id
export const getProductById = async (id) => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data; // return product object directly
};

// Update stock
export const updateProductStock = (id, data) =>
  axiosInstance.patch(`/products/${id}`, data);

// Add or update product reviews
export const addProductReview = (id, reviews) =>
  axiosInstance.patch(`/products/${id}`, { review: reviews });
