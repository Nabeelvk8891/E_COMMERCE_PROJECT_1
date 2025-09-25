import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  LogOut,
  BadgeAlert,
  Menu,
  X,
} from "lucide-react";
import logoFull from "../assets/images/zeyoralogo.png";     
import logoIcon from "../assets/images/zeyoralogoleft.png"; 

const SidebarNav = ({ isHovered, setIsHovered, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
    { to: "/productManagement", icon: <Package size={22} />, label: "Products" },
    { to: "/usersdata", icon: <Users size={22} />, label: "Users" },
    { to: "/payment&shipping", icon: <Truck size={22} />, label: "Shipping" },
    { to: "/issueReports", icon: <BadgeAlert size={22} />, label: "Issue Reports" },
  ];

  return (
    <>
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r shadow-md flex flex-col
          transition-[width,transform] duration-300
          ${isHovered ? "w-56" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        `}
      >
        <Link
          to="/dashboard"
          className="flex justify-center items-center w-full mt-6 mb-10"
        >
          <img
            src={isHovered ? logoFull : logoIcon}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              isHovered ? "w-32 h-10" : "w-12 h-12"
            }`}
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isHovered={isHovered}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        {user && (
          <div className="mt-auto w-full px-2 mb-4">
            <NavItem
              icon={<LogOut size={22} />}
              label="Logout"
              isHovered={isHovered}
              onClick={handleLogout}
            />
          </div>
        )}
      </aside>
    </>
  );
};

const NavItem = ({ to, icon, label, isHovered, active, onClick }) => {
  const content = (
    <>
      <div className="flex justify-center w-6 flex-shrink-0">{icon}</div>
      <span
        className={`
          text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300
          ${isHovered ? "max-w-[200px]" : "max-w-0"}
        `}
      >
        {label}
      </span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`
          flex items-center gap-3 py-2 px-2 rounded-lg transition-colors w-full
          ${active ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
        `}
      >
        {content}
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center gap-3 py-2 px-2 rounded-lg transition-colors w-full
          text-gray-700 hover:bg-blue-50 hover:text-blue-600
        `}
      >
        {content}
      </button>
    );
  }
};

export default SidebarNav;
