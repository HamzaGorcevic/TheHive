import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, PlusCircle, User } from "lucide-react";
import styles from "./navbar.module.scss";
import StateContext from "../../contexts/authcontext";

const Navbar = () => {
    const { authData, logoutUser } = useContext(StateContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/rooms" className={styles.logo}>
                    <Home className={styles.icon} />
                    <span>BeeHive</span>
                </Link>

                <div className={styles.links}>
                    <Link to="/rooms" className={styles.link}>
                        Browse Rooms
                    </Link>

                    {["beekeeper", "user"].includes(authData?.user?.role) ? (
                        <>
                            <Link to="/user-rooms" className={styles.link}>
                                <User className={styles.icon} />
                                My Rooms
                            </Link>
                            <Link to="/create-room" className={styles.link}>
                                <PlusCircle className={styles.icon} />
                                Create Room
                            </Link>
                        </>
                    ) : (
                        ""
                    )}
                    {["beekeeper", "admin"].includes(authData?.user?.role) ? (
                        <>
                            <Link to="/services" className={styles.link}>
                                <User className={styles.icon} />
                                Services
                            </Link>
                            {authData?.user?.role == "beekeeper" ? (
                                <Link
                                    to="/create-service"
                                    className={styles.link}
                                >
                                    <User className={styles.icon} />
                                    Create Service
                                </Link>
                            ) : (
                                ""
                            )}
                        </>
                    ) : (
                        ""
                    )}

                    {["admin"].includes(authData?.user?.role) ? (
                        <>
                            {" "}
                            <Link to="/create-category" className={styles.link}>
                                Create Category
                            </Link>
                        </>
                    ) : (
                        ""
                    )}
                    <Link to="/profile" className={styles.link}>
                        <User className={styles.icon} />
                        Profile
                    </Link>

                    {!authData ? (
                        <>
                            <Link to="/login" className={styles.link}>
                                <User className={styles.icon} />
                                Login
                            </Link>
                            <Link to="/register" className={styles.link}>
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
            </div>
        </nav>
    );
};

export default Navbar;
