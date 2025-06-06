import { useState, useEffect } from "react";
import {
  Users,
  Package,
  Bell,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import VD from "./VD";
import CD from "./CD";
import image1 from "./assets/K_logo3.png"; // Adjust the path as necessary
import Administration from "./Administration";
import { useNavigate } from "react-router-dom";
import HallBooking from "./HallBooking";
import CalendarFile from "./CalendarFile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [role, setRole] = useState("");

  // Handle time-based greeting and current time
  useEffect(() => {
    const updateTimeInfo = () => {
      const now = new Date();
      const hours = now.getHours();

      // Set greeting based on time of day
      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      // Format current time
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTimeInfo();
    const interval = setInterval(updateTimeInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      if (storedRole === "Admin" || storedRole === "User") {
      setActiveTab("visitorsDashboard");
    } else if (storedRole === "Office Executive") {
      setActiveTab("hallBooking");
    }
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
    }
  }, []);

  const handleNavigation = (path) => {
    setActiveTab(path);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.setItem("loggedOut", "true");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="z-20 flex h-16 lg:h-20 items-center justify-between bg-white pr-6 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-4 rounded-md p-1 lg:hidden hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <img
              src={image1}
              alt="Logo"
              className="lg:ml-10 h-16 lg:h-20 w-full "
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-10 bg-gray-900 bg-opacity-50">
            <div className="bg-blue-800 w-64 h-full p-4 flex flex-col text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Navigation</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-blue-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {(role === "User" || role === "Admin") && (
    <>
              <button
                onClick={() => handleNavigation("visitorsDashboard")}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 ${
                  activeTab === "visitorsDashboard"
                    ? "bg-blue-900 shadow-lg"
                    : "hover:bg-blue-700"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Visitors Dashboard</span>
              </button>

              <button
                onClick={() => handleNavigation("courierDashboard")}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 ${
                  activeTab === "courierDashboard"
                    ? "bg-blue-900 shadow-lg"
                    : "hover:bg-blue-700"
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                <span>Courier Dashboard</span>
              </button>
               </>
  )}
              {role === "Admin" && (
                <button
                  onClick={() => handleNavigation("administration")}
                  className={`flex items-center px-4 py-3 rounded-lg mb-2 ${
                    activeTab === "administration"
                      ? "bg-blue-900 shadow-lg"
                      : "hover:bg-blue-700"
                  }`}
                >
                  <Package className="mr-3 h-5 w-5" />
                  <span>Administration</span>
                </button>
              )}

              {role === "Office Executive" && (
                <>
                  <button
                    onClick={() => handleNavigation("hallBooking")}
                    className={`flex items-center px-4 py-3 rounded-lg mb-2 ${
                      activeTab === "hallBooking"
                        ? "bg-blue-900 shadow-lg"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <Package className="mr-3 h-5 w-5" />
                    <span>Hall Booking</span>
                  </button>

                  <button
                    onClick={() => handleNavigation("calendar")}
                    className={`flex items-center px-4 py-3 rounded-lg mb-2 ${
                      activeTab === "calendar"
                        ? "bg-blue-900 shadow-lg"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    <span>Calendar</span>
                  </button>
                </>
              )}

              <div className="flex-grow"></div>

              <div className="border-t border-blue-700 pt-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 hover:bg-blue-700 rounded-lg"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="p-6 mx-auto px-20">
            {/* Welcome Banner */}
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{greeting}, {role}</h2>
                  <p className="text-blue-100">
                    Welcome to your Kristellar Aerospace's Control Panel
                  </p>
                </div>
                <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <p className="text-sm text-black">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xl font-semibold text-black">
                    {currentTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="mb-6 flex flex-wrap gap-3 space-x-4 hidden lg:block">
              {(role === "User" || role === "Admin") && (
    <>
              <button
                onClick={() => handleNavigation("visitorsDashboard")}
                className={`rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                  activeTab === "visitorsDashboard"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>Visitors Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigation("courierDashboard")}
                className={`rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                  activeTab === "courierDashboard"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  <span>Courier Dashboard</span>
                </div>
              </button>
               </>
  )}

              {role === "Admin" && (
                <button
                  onClick={() => handleNavigation("administration")}
                  className={`rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                    activeTab === "administration"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    <span>Administration</span>
                  </div>
                </button>
              )}

              {role === "Office Executive" && (
                <>
                  <button
                    onClick={() => handleNavigation("hallBooking")}
                    className={`rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                      activeTab === "hallBooking"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      <span>Hall Booking</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigation("calendar")}
                    className={`rounded-lg px-5 py-3 font-medium transition-all duration-200 ${
                      activeTab === "calendar"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      <span>Calendar</span>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Dashboard Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === "visitorsDashboard" && <VD />}
              {activeTab === "courierDashboard" && <CD />}
              {activeTab === "administration" && <Administration />}
              {activeTab === "hallBooking" && <HallBooking />}
              {activeTab === "calendar" && <CalendarFile />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;