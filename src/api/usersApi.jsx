import axiosInstance from "./axiosInstance";

// Get all users
export const getUsers = () =>
  axiosInstance.get("/users").then(res => res.data);

// Get user by ID
export const getUserById = (id) =>
  axiosInstance.get(`/users/${id}`).then(res => res.data);

// Get user by email (case-insensitive)
export const getUserByEmail = async (email) => {
  const allUsers = await getUsers();
  return allUsers.filter(u => u.email.toLowerCase() === email.toLowerCase());
};

// Create new user
export const createUser = (user) =>
  axiosInstance.post("/users", user).then(res => res.data);

export const updateUser = (id, updatedData) =>
  axiosInstance.patch(`/users/${id}`, updatedData).then(res => res.data);
