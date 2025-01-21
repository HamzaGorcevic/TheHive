import React, { useState, useContext } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axiosClient from "../../axios";
import StateContext from "../../contexts/authcontext";
import styles from "./auth.module.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { loginUser } = useContext(StateContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axiosClient.post("/login", {
                email,
                password,
            });
            loginUser(response.data);
            setLoading(false);
            toast.success("Successfully logged in");
            navigate("/rooms");
        } catch (err) {
            setLoading(false);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                setError(err.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
            toast.error("Failed to log in");
            console.error(err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.icon} size={16} />
                            <input
                                className={styles.input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password:</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.icon} size={16} />
                            <input
                                className={styles.input}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={styles.passwordToggle}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} className={styles.icon} />
                                ) : (
                                    <Eye size={16} className={styles.icon} />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    {!loading ? (
                        <button className={styles.submitButton} type="submit">
                            Login
                        </button>
                    ) : (
                        <button
                            className={`${styles.submitButton} ${styles.loading}`}
                            disabled
                        ></button>
                    )}
                </form>
                <div className={styles.secondaryActions}>
                    <a href="/register">If you dont have account register !</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
