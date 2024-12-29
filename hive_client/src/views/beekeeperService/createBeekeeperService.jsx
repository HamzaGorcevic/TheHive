import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./beekeeperService.module.scss";
import axiosClient from "../../axios";

const CreateService = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryservice_id: "",
        price: "",
        details: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/categories");
            if (response.status == 200) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            setError("Failed to load categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/services", formData);

            if (response.ok) {
                setFormData({ categoryservice_id: "", price: "", details: "" });
                setError("");
            }
        } catch (err) {
            setError("Failed to create service");
        }
    };

    return (
        <div className={styles.createService}>
            <h2>Create Available Service</h2>

            {error && (
                <div className={styles.errorMessage}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="category">Service Category</label>
                    <select
                        id="category"
                        value={formData.categoryservice_id}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                categoryservice_id: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="details">Service Details</label>
                    <textarea
                        id="details"
                        value={formData.details}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                details: e.target.value,
                            })
                        }
                        required
                        maxLength={800}
                        rows={4}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Create Service
                </button>
            </form>
        </div>
    );
};

export default CreateService;
