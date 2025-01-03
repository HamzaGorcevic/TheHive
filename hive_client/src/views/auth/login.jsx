import React, { useState, useContext } from "react";
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
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/login", {
                email,
                password,
            });
            loginUser(response.data);
            toast.success("Successfully logged in");
            navigate("/rooms");
        } catch (err) {
            // Check for a response from the server
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                setError(err.response.data.message); // Show the error from the backend
            } else {
                setError("Login failed. Please try again."); // Fallback error
            }
            toast.error("Failed to log in");
            console.error(err);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password:</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button className={styles.submitButton} type="submit">
                        Login
                    </button>
                    <a href="/register">If you dont have account register !</a>
                </form>
            </div>
        </div>
    );
};

export default Login;
