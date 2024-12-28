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
                        className={styles.input}
                        disabled={disabled}
                        {...props}
                    />
                </div>
            </label>
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
    const [error, setError] = useState("");
    const { registerUser } = useContext(StateContext);
    const navigate = useNavigate();
    const handleLocationSelect = (location) => {
        setFormData((prev) => ({
            ...prev,
            location: location.country,
            city: location.city,
            latitude: location.lat,
            longitude: location.lng,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axiosClient.post(
                "/register_beekeeper",
                formData
            );
            registerUser(response.data);
            toast.success("Succesfully registered as beekeeper!");
            console.log(response);
            navigate("/rooms");
        } catch (err) {
            toast.error("There is been mistake try again later");
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.header}>
                    {/* <Bee size={40} className={styles.logo} /> */}
                    <h1>Beekeeper Registration</h1>
                </div>

                <div className={styles.formGrid}>
                    <Input
                        icon={User}
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon={Mail}
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon={Lock}
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon={Lock}
                        label="Confirm Password"
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon={TreePine}
                        label="Number of Hives"
                        type="number"
                        name="number_of_hives"
                        value={formData.number_of_hives}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon={TreePine}
                        label="Years of Experience"
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        required
                    />

                    <div className={styles.mapSection}>
                        <h2>Select Your Location</h2>
                        <LocationPicker
                            onLocationSelect={handleLocationSelect}
                        />
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

                    {error && <div className={styles.error}>{error}</div>}

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
