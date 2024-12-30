import React, { useState, useEffect, useContext } from "react";
import { Filter, User } from "lucide-react";
import styles from "./beekeeperService.module.scss";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";

const BrowseServices = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [error, setError] = useState("");
    const { authData } = useContext(StateContext);
    useEffect(() => {
        fetchCategories();
        fetchServices();
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

    const fetchServices = async (categoryId) => {
        console.log("sta je");
        try {
            const url = categoryId
                ? `/services/category?categoryservice_id=${categoryId}`
                : "/services";

            const response = await axiosClient.get(url);
            if (response.status == 200) {
                setServices(response.data.services);
            } else {
                setServices([]);
                toast.warning(response.data.message);
            }
        } catch (err) {
            setError("Failed to load services");
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchServices(categoryId);
    };
    const handleDelete = async (serviceId) => {
        console.log("ovde");
        try {
            const response = await axiosClient.delete(`/services/${serviceId}`);
            if (response.status == 200) {
                toast.success(response.data.message);
                fetchServices();
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error(e);
        }
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
                            {authData?.user?.role == "admin" ||
                            service.user_id == authData?.user?.id ? (
                                <button
                                    onClick={() => {
                                        handleDelete(service.id);
                                    }}
                                >
                                    Delete{" "}
                                </button>
                            ) : (
                                ""
                            )}
                        </div>

                        <div className={styles.beekeeperInfo}>
                            <User size={16} />
                            <span>{service.user.name}</span>
                        </div>

                        <p className={styles.details}>{service.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseServices;
