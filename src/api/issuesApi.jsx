import axiosInstance from "./axiosInstance";

export const getIssues = () => axiosInstance.get("/issues");
export const getIssueById = (id) => axiosInstance.get(`/issues/${id}`);
export const postIssue = (issueData) => axiosInstance.post("/issues", issueData);
