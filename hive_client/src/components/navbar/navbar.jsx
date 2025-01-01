import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Home,
    LogOut,
    PlusCircle,
    User,
    Settings,
    Menu,
    X,
} from "lucide-react";
import styles from "./navbar.module.scss";
import StateContext from "../../contexts/authcontext";

const Navbar = () => {
    const { authData, logoutUser } = useContext(StateContext);
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    const toggleDropdown = (dropdownName) => {
        if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownName);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <Home className={styles.icon} />
                    <span>BeeHive</span>
                </Link>

                {/* Hamburger Menu Icon */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Links Section */}
                <div
                    ref={mobileMenuRef}
                    className={`${styles.links} ${
                        isMobileMenuOpen ? styles.open : ""
                    }`}
                >
                    <Link to="/rooms" className={styles.link}>
                        Browse Rooms
                    </Link>
                    <Link to="/users-list" className={styles.link}>
                        Beekeepers
                    </Link>
                    {["beekeeper", "user"].includes(authData?.user?.role) && (
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.link}
                                onClick={() => toggleDropdown("spaces")}
                            >
                                <User className={styles.icon} />
                                My Spaces
                            </button>
                            {activeDropdown === "spaces" && (
                                <div className={styles.dropdownMenu}>
                                    <Link
                                        to="/user-rooms"
                                        className={styles.link}
                                    >
                                        <User className={styles.icon} />
                                        My Rooms
                                    </Link>
                                    <Link
                                        to="/create-room"
                                        className={styles.link}
                                    >
                                        <PlusCircle className={styles.icon} />
                                        Create Room
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    {["beekeeper", "admin"].includes(authData?.user?.role) && (
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.link}
                                onClick={() => toggleDropdown("management")}
                            >
                                <Settings className={styles.icon} />
                                Management
                            </button>
                            {activeDropdown === "management" && (
                                <div className={styles.dropdownMenu}>
                                    <Link
                                        to="/services"
                                        className={styles.link}
                                    >
                                        <User className={styles.icon} />
                                        Services
                                    </Link>
                                    {authData?.user?.role === "beekeeper" && (
                                        <Link
                                            to="/create-service"
                                            className={styles.link}
                                        >
                                            <PlusCircle
                                                className={styles.icon}
                                            />
                                            Create Service
                                        </Link>
                                    )}
                                    {authData?.user?.role === "admin" && (
                                        <Link
                                            to="/create-category"
                                            className={styles.link}
                                        >
                                            <PlusCircle
                                                className={styles.icon}
                                            />
                                            Create Category
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <div className={styles.dropdownContainer}>
                        <button
                            className={styles.link}
                            onClick={() => toggleDropdown("account")}
                        >
                            <User className={styles.icon} />
                            Account
                        </button>
                        {activeDropdown === "account" && (
                            <div className={styles.dropdownMenu}>
                                <Link to="/profile" className={styles.link}>
                                    <User className={styles.icon} />
                                    Profile
                                </Link>
                                {!authData ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className={styles.link}
                                        >
                                            <User className={styles.icon} />
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className={styles.link}
                                        >
                                            <User className={styles.icon} />
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleLogout}
                                        className={styles.logoutButton}
                                    >
                                        <LogOut className={styles.icon} />
                                        Logout
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
