import React, { useState, useEffect } from "react";
import { AlertCircle, Plus } from "lucide-react";
import styles from "./createService.module.scss";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateService = () => {
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        categoryservice_id: "",
        price: "",
        details: "",
        image: null, // Add image to formData
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/categories");
            if (response.status === 200) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            toast.error("Failed to create service");
            setError("Failed to load categories");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create FormData object
            const data = new FormData();
            data.append("categoryservice_id", formData.categoryservice_id);
            data.append("price", formData.price);
            data.append("details", formData.details);
            if (formData.image) {
                data.append("image", formData.image); // Append the image file
            }

            // Send the request with FormData
            const response = await axiosClient.post("/services", data, {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the content type
                },
            });

            if (response.status === 200) {
                setFormData({
                    categoryservice_id: "",
                    price: "",
                    details: "",
                    image: null,
                });
                setLoading(false);
                setError("");
                toast.success("Successfully created service!");
                navigate("/services");
            }
        } catch (err) {
            setLoading(false);

            setError("Failed to create service");
            toast.error(err.message || "An error occurred");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file }); // Update the image in formData

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.createService}>
                <div className={styles.header}>
                    <Plus size={24} />
                    <h2>Create Available Service</h2>
                </div>

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
                                setFormData({
                                    ...formData,
                                    price: e.target.value,
                                })
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

                    <div className={styles.formGroup}>
                        <label htmlFor="image">Service Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    {imagePreview && formData.image ? (
                        <img
                            className={styles.imageContainer}
                            src={imagePreview}
                        />
                    ) : (
                        ""
                    )}
                    {!loading ? (
                        <button type="submit" className={styles.submitButton}>
                            Create Service
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled
                            className={`${styles.submitButton} ${styles.loading}`}
                        ></button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateService;
