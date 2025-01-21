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
    BookMarked,
    Building2,
    Users,
    Wrench,
    ChevronDown,
    UserCircle,
    Key,
    UserPlus,
    Bookmark,
    BedDouble,
    CalendarCheck,
    MessageCircleIcon,
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
                    <span>TheHive</span>
                </Link>

                <button
                    className={styles.mobileMenuButton}
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div
                    ref={mobileMenuRef}
                    className={`${styles.links} ${
                        isMobileMenuOpen ? styles.open : ""
                    }`}
                >
                    {["beekeeper", "user", "admin"].includes(
                        authData?.user?.role
                    ) && (
                        <>
                            <Link to="/rooms" className={styles.link}>
                                <MessageCircleIcon className={styles.icon} />
                                Browse Rooms
                            </Link>
                            <Link to="/users-list" className={styles.link}>
                                <Users className={styles.icon} />
                                Beekeepers
                            </Link>
                            {authData?.user?.role != "user" && (
                                <Link to="/services" className={styles.link}>
                                    <Wrench className={styles.icon} />
                                    Services
                                </Link>
                            )}
                        </>
                    )}
                    {["beekeeper", "user"].includes(authData?.user?.role) && (
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.link}
                                onClick={() => toggleDropdown("spaces")}
                            >
                                <Building2 className={styles.icon} />
                                My Spaces
                                <ChevronDown
                                    className={`${styles.dropdownIcon} ${
                                        activeDropdown === "spaces"
                                            ? styles.rotate
                                            : ""
                                    }`}
                                />
                            </button>
                            {activeDropdown === "spaces" && (
                                <div className={styles.dropdownMenu}>
                                    <Link
                                        to="/user-rooms"
                                        className={styles.link}
                                    >
                                        <MessageCircleIcon
                                            className={styles.icon}
                                        />
                                        My Rooms
                                    </Link>
                                    <Link
                                        to="/user-reserved"
                                        className={styles.link}
                                    >
                                        <CalendarCheck
                                            className={styles.icon}
                                        />
                                        Reservations
                                    </Link>
                                    {authData?.user?.role == "beekeeper" && (
                                        <Link
                                            to="/profile"
                                            className={styles.link}
                                        >
                                            <Wrench className={styles.icon} />
                                            My Services
                                        </Link>
                                    )}
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
                                <ChevronDown
                                    className={`${styles.dropdownIcon} ${
                                        activeDropdown === "management"
                                            ? styles.rotate
                                            : ""
                                    }`}
                                />
                            </button>
                            {activeDropdown === "management" && (
                                <div className={styles.dropdownMenu}>
                                    {authData?.user?.role === "beekeeper" && (
                                        <>
                                            <Link
                                                to="/create-service"
                                                className={styles.link}
                                            >
                                                <Wrench
                                                    className={styles.icon}
                                                />
                                                Create Service
                                            </Link>
                                            <Link
                                                to="/create-room"
                                                className={styles.link}
                                            >
                                                <PlusCircle
                                                    className={styles.icon}
                                                />
                                                Create Room
                                            </Link>
                                            <Link
                                                to="/contact"
                                                className={styles.link}
                                            >
                                                <MessageCircleIcon
                                                    className={styles.icon}
                                                />
                                                Contact me
                                            </Link>
                                        </>
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
                            <UserCircle className={styles.icon} />
                            Account
                            <ChevronDown
                                className={`${styles.dropdownIcon} ${
                                    activeDropdown === "account"
                                        ? styles.rotate
                                        : ""
                                }`}
                            />
                        </button>
                        {activeDropdown === "account" && (
                            <div className={styles.dropdownMenu}>
                                {authData && (
                                    <Link to="/profile" className={styles.link}>
                                        <User className={styles.icon} />
                                        Profile
                                    </Link>
                                )}
                                {!authData ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className={styles.link}
                                        >
                                            <Key className={styles.icon} />
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className={styles.link}
                                        >
                                            <UserPlus className={styles.icon} />
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
