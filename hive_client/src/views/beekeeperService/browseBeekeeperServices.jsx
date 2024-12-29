import React, { useState, useEffect } from "react";
import { Filter, User } from "lucide-react";
import styles from "./beekeeperService.module.scss";
import axiosClient from "../../axios";

const BrowseServices = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchServices();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/categories");
            if (response.status == 200) {
                console.log("jel ok");
                console.log(response.data);
                setCategories(response.data.categories);
            }
        } catch (err) {
            setError("Failed to load categories");
        }
    };

    const fetchServices = async (categoryId) => {
        try {
            const url = categoryId
                ? `/services/category?categoryservice_id=${categoryId}`
                : "/services";

            const response = await axiosClient.get(url);

            if (response.status == 200) {
                setServices(response.data.services);
            }
        } catch (err) {
            setError("Failed to load services");
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchServices(categoryId);
    };

    return (
        <div className={styles.browseServices}>
            <div className={styles.filters}>
                <h3>
                    <Filter size={20} />
                    Filter by Category
                </h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.servicesGrid}>
                {services.map((service) => (
                    <div key={service.id} className={styles.serviceCard}>
                        <div className={styles.serviceHeader}>
                            <h3>{service.categoryservice.name}</h3>
                            <span className={styles.price}>
                                ${service.price}
                            </span>
                        </div>

                        <div className={styles.beekeeperInfo}>
                            <User size={16} />
                            <span>{service.beekeeper.name}</span>
                        </div>

                        <p className={styles.details}>{service.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseServices;
