import React, { useContext, useState } from "react";
import { MapPin, TreePine, Mail, Lock, User } from "lucide-react";
import axios from "axios";
import styles from "./auth.module.scss";
import LocationPicker from "../../helpers/locationPicker";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import { useNavigate } from "react-router-dom";

const Input = ({
    icon: Icon,
    label,
    type = "text",
    disabled = false,
    error,
    ...props
}) => {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.label}>
                {label}
                <div className={styles.inputWrapper}>
                    {Icon && <Icon className={styles.icon} size={20} />}
                    <input
                        type={type}
                        className={`${styles.input} ${
                            error ? styles.inputError : ""
                        }`}
                        disabled={disabled}
                        {...props}
                    />
                </div>
            </label>
            {error && (
                <div className={styles.fieldError}>
                    {Array.isArray(error) ? (
                        error.map((err, index) => (
                            <p key={index} className={styles.errorText}>
                                {err}
                            </p>
                        ))
                    ) : (
                        <p className={styles.errorText}>{error}</p>
                    )}
                </div>
            )}
        </div>
    );
};

const RegisterBeekeeper = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        number_of_hives: "",
        years_of_experience: "",
        location: "",
        city: "",
        latitude: "",
        longitude: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { registerUser } = useContext(StateContext);
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

        // Validate name
        if (formData.name.trim().length < 2) {
            newErrors.name = ["Name must be at least 2 characters long"];
        }

        // Validate email
        if (!formData.email.includes("@")) {
            newErrors.email = ["Please enter a valid email address"];
        }

        // Validate password
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors;
        }

        // Validate password confirmation
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = ["Passwords do not match"];
        }

        // Validate number of hives
        if (formData.number_of_hives < 1) {
            newErrors.number_of_hives = ["Number of hives must be at least 1"];
        }

        // Validate years of experience
        if (formData.years_of_experience < 0) {
            newErrors.years_of_experience = [
                "Years of experience cannot be negative",
            ];
        }

        // Validate location
        if (!formData.location || !formData.city) {
            newErrors.location = ["Please select your location on the map"];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLocationSelect = (location) => {
        setFormData((prev) => ({
            ...prev,
            location: location.country,
            city: location.city,
            latitude: location.lat,
            longitude: location.lng,
        }));
        // Clear location error when location is selected
        if (errors.location) {
            setErrors((prev) => ({ ...prev, location: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post(
                "/register_beekeeper",
                formData
            );
            registerUser(response.data);
            toast.success("Successfully registered as beekeeper!");
            navigate("/rooms");
        } catch (err) {
            toast.error("There has been a mistake. Please try again later");
            setErrors((prev) => ({
                ...prev,
                server: err.response?.data?.message || "Registration failed",
            }));
        } finally {
            setLoading(false);
        }
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

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.header}>
                    <h1>Beekeeper Registration</h1>
                </div>

                <div className={styles.formGrid}>
                    <Input
                        icon={User}
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

                    <Input
                        icon={Mail}
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        icon={Lock}
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Input
                        icon={Lock}
                        label="Confirm Password"
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        error={errors.password_confirmation}
                        required
                    />

                    <Input
                        icon={TreePine}
                        label="Number of Hives"
                        type="number"
                        name="number_of_hives"
                        value={formData.number_of_hives}
                        onChange={handleChange}
                        error={errors.number_of_hives}
                        required
                        min="1"
                    />

                    <Input
                        icon={TreePine}
                        label="Years of Experience"
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        error={errors.years_of_experience}
                        required
                        min="0"
                    />

                    <div className={styles.mapSection}>
                        <h2>Select Your Location</h2>
                        <LocationPicker
                            onLocationSelect={handleLocationSelect}
                        />
                        {errors.location && (
                            <div className={styles.fieldError}>
                                {errors.location.map((error, index) => (
                                    <p key={index} className={styles.errorText}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <Input
                        icon={MapPin}
                        label="Country"
                        name="location"
                        value={formData.location}
                        disabled
                    />

                    <Input
                        icon={MapPin}
                        label="City"
                        name="city"
                        value={formData.city}
                        disabled
                    />

                    {errors.server && (
                        <div className={styles.error}>{errors.server}</div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register as Beekeeper"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterBeekeeper;
