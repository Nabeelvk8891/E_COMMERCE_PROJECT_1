import axiosInstance from "./axiosInstance";

export const getAds = () => axiosInstance.get("/ads");
export const getAdById = (id) => axiosInstance.get(`/ads/${id}`);
