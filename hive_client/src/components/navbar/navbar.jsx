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
                    <Link to="/create-room" className={styles.link}>
                        <PlusCircle className={styles.icon} />
                        Create Room
                    </Link>
                    <Link to="/user-rooms" className={styles.link}>
                        <User className={styles.icon} />
                        My Rooms
                    </Link>
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
