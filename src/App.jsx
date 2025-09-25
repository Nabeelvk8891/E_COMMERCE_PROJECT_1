import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/publicRoute";
import HomeRoute from "./components/HomeRoute";
import Screenload from "./components/Screenload"


const Home = lazy(() => import("./components/Home"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Shop = lazy(() => import("./components/Shop"));
const Cart = lazy(() => import("./components/Cart"));
const Payment = lazy(() => import("./components/Payment"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const NewRegisterForm = lazy(() => import("./components/NewRegisterForm"));
const Signup = lazy(() => import("./components/Signup"));
const Dashboard = lazy(() => import("./adminComponents/Dashboard"));
const ProductManagement = lazy(() => import("./adminComponents/ProductsManagement"));
const Users = lazy(() => import("./adminComponents/Users"));
const PaymentShipping = lazy(() => import("./adminComponents/PaymentShipping"));
const IssueReports = lazy(() => import("./adminComponents/IssueReports"));

function App() {
  const { isAdmin } = useAuth();

  return (
    <div className="scroll-smooth">
      <Suspense fallback={<Screenload />}>
        <Routes>
          
          <Route path="/login" element={<PublicRoute><NewRegisterForm /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* User Routes */}
          <Route path="/" element={<HomeRoute><Home /></HomeRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/productManagement" element={<ProtectedRoute adminOnly={true}><ProductManagement /></ProtectedRoute>} />
          <Route path="/usersdata" element={<ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>} />
          <Route path="/payment&shipping" element={<ProtectedRoute adminOnly={true}><PaymentShipping /></ProtectedRoute>} />
          <Route path="/issueReports" element={<ProtectedRoute adminOnly={true}><IssueReports /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
