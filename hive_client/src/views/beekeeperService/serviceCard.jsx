import React from "react";
import { Trash2 } from "lucide-react";
import styles from "./ServiceCard.module.scss";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, onDelete, isViewMode }) => {
    const handleDelete = async () => {
        try {
            onDelete(service.id);
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };
    const navigate = useNavigate();
    const navigateToDetails = (id) => {
        navigate(`/services/${id}`);
    };

    return (
        <div
            className={styles.serviceCard}
            onClick={() => {
                navigateToDetails(service.id);
            }}
        >
            <div className={styles.cardHeader}>
                <h2>Service Details</h2>
                {!isViewMode ? (
                    <button
                        className={styles.deleteBtn}
                        onClick={handleDelete}
                        aria-label="Delete service"
                    >
                        <Trash2 size={20} />
                    </button>
                ) : (
                    ""
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

            <div className={styles.content}>
                <div className={styles.detail}>
                    <span className={styles.label}>Category</span>
                    <span className={styles.value}>
                        {service.categoryservice_id}
                    </span>
                </div>

                <div className={styles.detail}>
                    <span className={styles.label}>Price</span>
                    <span className={styles.value}>${service.price}</span>
                </div>

                <div className={styles.description}>
                    <span className={styles.label}>Details</span>
                    <p className={styles.value}>{service.details}</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
