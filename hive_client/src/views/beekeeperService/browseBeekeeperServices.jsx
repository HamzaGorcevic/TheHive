import React, { useState, useEffect, useContext } from "react";
import { Filter, User, Search, Plus } from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../axios";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";
import styles from "./browseService.module.scss";
import ReservationModal from "../../components/reservationModal/reservationModal";
import { useNavigate } from "react-router-dom";

function BrowseServices() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const { authData } = useContext(StateContext);
    // Reservation modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchCategories();
        fetchServices();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/categories");
            if (response.status === 200) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            setError("Failed to load categories");
        }
    };

    const fetchServices = async (categoryId) => {
        try {
            setLoading(true);
            const url = "/services";

            const response = await axiosClient.get(url);
            if (response.status === 200) {
                setServices(response.data.services);
            } else {
                setServices([]);
                toast.warning(response.data.message);
            }
        } catch (err) {
            setError("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter((service) => {
        const matchesCategory =
            !selectedCategory || service.categoryservice_id == selectedCategory;
        console.log(service.categoryservice_id, selectedCategory);
        const matchesSearchTerm = service.user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearchTerm;
    });

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleDelete = async (serviceId) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!isConfirmed) {
            return; // Stop the function if the user cancels the deletion
        }

        try {
            const response = await axiosClient.delete(`/services/${serviceId}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchServices();
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error("An error occurred while deleting the service.");
        }
    };

    const handleReserveClick = (serviceId) => {
        setSelectedServiceId(serviceId);
        setIsModalOpen(true);
    };

    const navigateToDetails = (id) => {
        navigate(`/services/${id}`);
    };

    if (loading) {
        return <CustomLoader />;
    }
    const handleCreateService = () => {
        navigate("/create-service");
    };

    return (
        <div className={styles.browseServices}>
            <button
                className={styles.createServiceBtn}
                onClick={handleCreateService}
            >
                <Plus size={20} />
                Create New Service
            </button>
            <div className={styles.filtersContainer}>
                <div className={styles.searchBar}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by beekeeper name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

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
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.servicesGrid}>
                {filteredServices.map((service) => (
                    <div key={service.id} className={styles.serviceCard}>
                        <div className={styles.cardHeader}>
                            <h2>{service.categoryservice.name}</h2>
                            {(authData?.user?.role === "admin" ||
                                service.user_id === authData?.user?.id) && (
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(service.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        {/* Display the image if it exists */}
                        {service.image_url && (
                            <div className={styles.imageContainer}>
                                <img
                                    src={service.image_url}
                                    alt="Service"
                                    className={styles.image}
                                />
                            </div>
                        )}

                        <div className={styles.userInfo}>
                            <User size={16} />
                            <span>{service.user.name}</span>
                        </div>

                        <div className={styles.content}>
                            <div className={styles.detail}>
                                <span className={styles.label}>Price:</span>
                                <span className={styles.value}>
                                    ${service.price}
                                </span>
                            </div>

                            <div className={styles.description}>
                                <span className={styles.label}>Details:</span>
                                <p className={styles.value}>
                                    {service.details &&
                                        service.details.slice(0, 50)}
                                    ...
                                </p>
                            </div>

                            {/* Reserve Now Button */}
                            {authData?.user?.id != service.user_id && (
                                <button
                                    className={styles.reserveBtn}
                                    onClick={() =>
                                        handleReserveClick(service.id)
                                    }
                                >
                                    Reserve Now
                                </button>
                            )}
                            <button
                                className={styles.detailsBtn}
                                onClick={() => navigateToDetails(service.id)}
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceId={selectedServiceId}
            />
        </div>
    );
}

export default BrowseServices;
