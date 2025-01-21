import React, { useState, useContext } from "react";
import axiosClient from "../../axios";
import StateContext from "../../contexts/authcontext";
import styles from "./auth.module.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { registerUser } = useContext(StateContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one number");
        }
        return errors;
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate password
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors;
        }

        // Validate password confirmation
        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = ["Passwords do not match"];
        }

        // Validate email
        if (!formData.email.includes("@")) {
            newErrors.email = ["Please enter a valid email address"];
        }

        // Validate name
        if (formData.name.trim().length < 2) {
            newErrors.name = ["Name must be at least 2 characters long"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            registerUser(response.data);
            setLoading(false);
            toast.success("Successfully registered");
            navigate("/rooms");
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.errors) {
                setErrors((prev) => ({
                    ...prev,
                    server: err.response.data.message,
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    server: "Registration failed. Please try again.",
                }));
            }
        }
    };

    const renderFieldError = (fieldErrors) => {
        if (!fieldErrors) return null;
        return (
            <div className={styles.fieldError}>
                {Array.isArray(fieldErrors) ? (
                    fieldErrors.map((error, index) => (
                        <p key={index} className={styles.errorText}>
                            {error}
                        </p>
                    ))
                ) : (
                    <p className={styles.errorText}>{fieldErrors}</p>
                )}
            </div>
        );
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.title}>Join TheHive</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Name:</label>
                        <input
                            className={`${styles.input} ${
                                errors.name ? styles.inputError : ""
                            }`}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {renderFieldError(errors.name)}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            className={`${styles.input} ${
                                errors.email ? styles.inputError : ""
                            }`}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {renderFieldError(errors.email)}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password:</label>
                        <input
                            className={`${styles.input} ${
                                errors.password ? styles.inputError : ""
                            }`}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {renderFieldError(errors.password)}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Confirm Password:
                        </label>
                        <input
                            className={`${styles.input} ${
                                errors.passwordConfirm ? styles.inputError : ""
                            }`}
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                        />
                        {renderFieldError(errors.passwordConfirm)}
                    </div>
                    {errors.server && (
                        <p className={styles.error}>{errors.server}</p>
                    )}
                    <button
                        className={`${styles.submitButton} ${
                            loading ? styles.loading : ""
                        }`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
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
