import { useEffect, useState } from "react";
import { FaTrash, FaCheck } from "react-icons/fa";
import SidebarNav from "./Sidenav";
import { getIssues } from "../api/issuesApi";
import axiosInstance from "../api/axiosInstance";

const IssueReports = () => {
  const [issues, setIssues] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      const issuesData = await getIssues();
      const issuesWithState = issuesData.map((issue) => ({
        ...issue,
        fixed: issue.fixed || false,
      }));
      setIssues(issuesWithState);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const markFixed = async (id) => {
    try {
      await axiosInstance.patch(`/issues/${id}`, { fixed: true });
      setIssues(
        issues.map((issue) =>
          issue.id === id ? { ...issue, fixed: true } : issue
        )
      );
    } catch (err) {
      console.error("Error marking fixed:", err);
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axiosInstance.delete(`/issues/${id}`);
      setIssues(issues.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting issue:", err);
    }
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
        <h2 className="text-2xl font-bold mb-4">Issue Reports</h2>

        {issues.length === 0 ? (
          <p className="text-gray-500">No issues reported.</p>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{issue.subject}</h3>
                  <p className="text-gray-500 text-sm mt-1">{issue.description}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    <strong>Reported by:</strong> {issue.name} ({issue.email})
                  </p>
                </div>

                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => markFixed(issue.id)}
                    disabled={issue.fixed}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium text-white transition ${
                      issue.fixed
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <FaCheck /> Mark Fixed
                  </button>

                  <button
                    onClick={() => deleteIssue(issue.id)}
                    disabled={!issue.fixed}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white transition ${
                      issue.fixed
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-red-300 cursor-not-allowed"
                    }`}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueReports;
