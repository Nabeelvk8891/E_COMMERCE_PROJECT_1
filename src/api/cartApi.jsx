import axiosInstance from "./axiosInstance";

export const getCart = async (userId) => {
  const res = await axiosInstance.get(`/cart?userId=${userId}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getCartById = async (id) => {
  const res = await axiosInstance.get(`/cart/${id}`);
  return res.data || null;
};

export const addCartItem = async (data) => {
  const res = await axiosInstance.post("/cart", data);
  return res.data;
};

export const updateCartItem = async (id, data) => {
  const res = await axiosInstance.patch(`/cart/${id}`, data);
  return res.data;
};

export const removeCartItem = async (id) => {
  const res = await axiosInstance.delete(`/cart/${id}`);
  return res.data;
};
