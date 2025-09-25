import React, { useState } from "react";
import logo from "../assets/images/zeyoralogo.png";
import { Link } from "react-router-dom";
import { postIssue } from "../api/issuesApi"; // use API instance

const Contact = () => {
  const [issue, setIssue] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postIssue(issue); // API call via axiosInstance
      setSuccess(true);
      setIssue({ name: "", email: "", subject: "", description: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error posting issue:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAV */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="ZEYORA" className="w-28 h-auto" />
        </div>
        <ul className="flex flex-wrap gap-6 text-sm md:text-base font-medium text-gray-700">
          <Link to="/"><li className="hover:text-blue-600 transition">Home</li></Link>
          <Link to="/shop"><li className="hover:text-blue-600 transition">Shop</li></Link>
          <Link to="/about"><li className="hover:text-blue-600 transition">About</li></Link>
          <Link to="/contact"><li className="text-blue-600 border-b-2 border-blue-600">Help/support</li></Link>
        </ul>
      </nav>

      {/* CONNECT SECTION */}
      <section className="max-w-5xl mx-auto mt-10 px-6 py-10 bg-white rounded-lg shadow-md flex-1">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Connect With Us
        </h2>
        <p className="text-gray-600 mt-2 text-center">
          Feel free to reach out via email, phone, or by reporting an issue.
        </p>

        {/* EMAIL & PHONE */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-8">
          <div className="flex-1 bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Email</h3>
            <p className="text-gray-600">
              <a href="mailto:zeyorastore@gmail.com" className="text-blue-600 hover:underline">
                zeyorastore@gmail.com
              </a>
            </p>
          </div>
          <div className="flex-1 bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Phone</h3>
            <p className="text-gray-600">
              <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1 (234) 567-890
              </a>
            </p>
          </div>
        </div>

        {/* REPORT ISSUE FORM */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Report an Issue
          </h3>
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center mb-4">
              ✅ Issue reported successfully. Our authorities will rectify soon.
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto space-y-4 text-left"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={issue.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={issue.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={issue.subject}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="description"
              placeholder="Describe your issue..."
              rows="5"
              value={issue.description}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Submit Issue
            </button>
          </form>
        </div>

        {/* COMMON ISSUES */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Common Issues & Remedies
          </h3>
          <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
            <li>
              <strong>❌ Payment Failed:</strong> Please check your internet connection, card details, or try another payment method. If amount was deducted, it will be auto-refunded within 5–7 business days.
            </li>
            <li>
              <strong>📦 Order Not Delivered:</strong> Orders usually arrive in 2–5 working days. If delayed, you can track your order or contact our support team.
            </li>
            <li>
              <strong>🔑 Login Issues:</strong> Try resetting your password using the "Forgot Password" option. Still stuck? Contact us for account verification.
            </li>
            <li>
              <strong>🔄 Wrong/Damaged Product:</strong> You can raise a return request within 7 days of delivery. We’ll arrange pickup and full refund/replacement.
            </li>
            <li>
              <strong>💳 Refund Delays:</strong> Refunds are processed within 5–7 business days depending on your bank/payment provider.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Contact;
