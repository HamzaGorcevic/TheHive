import React, { useState, useContext } from "react";
import axiosClient from "../../axios";
import StateContext from "../../contexts/authcontext";
import styles from "./auth.module.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { registerUser } = useContext(StateContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.post("/register", {
                name,
                email,
                password,
            });
            registerUser(response.data);
            setLoading(false);
            toast.success("Successfully registered");
            navigate("/rooms");
        } catch (err) {
            setLoading(false);
            // Check for a response from the server
            console.log(err.response.data.message);
            if (err.response && err.response.data && err.response.data.errors) {
                setError(err.response.data.message); // Show the error from the server
            } else {
                setError("Registration failed. Please try again."); // Fallback error
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>Join TheHive</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Name:</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    {!loading ? (
                        <button className={styles.submitButton} type="submit">
                            Register
                        </button>
                    ) : (
                        <button
                            className={`${styles.submitButton} ${styles.loading}`}
                            disabled
                        ></button>
                    )}
                </form>
                <div className={styles.secondaryActions}>
                    <a href="/login">Already have an account? Sign in</a>
                    <a href="/register-beekeeper">Register as a beekeeper</a>
                </div>
            </div>
        </div>
    );
};

export { Register };
