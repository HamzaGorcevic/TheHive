import React, { useState, useEffect } from "react";
import styles from "./UserServices.module.scss";
import axiosClient from "../../axios";
import ServiceCard from "../beekeeperService/serviceCard";
import { toast } from "react-toastify";

const UserServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axiosClient.get("/services/user");
            if (response.status == 200) {
                setServices(response.data.services);
            }
            setError(null);
        } catch (err) {
            setError("Failed to load services. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (deletedId) => {
        try {
            const response = await axiosClient.delete(`/services/${deletedId}`);
            setServices((prevServices) =>
                prevServices.filter((service) => service.id !== deletedId)
            );
            if (response.status == 200) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (er) {
            toast.error(er);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading services...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.servicesContainer}>
            <h1>My Services</h1>
            {services.length === 0 ? (
                <p className={styles.noServices}>
                    No services found. Start by adding a new service.
                </p>
            ) : (
                <div className={styles.servicesList}>
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserServicesList;
