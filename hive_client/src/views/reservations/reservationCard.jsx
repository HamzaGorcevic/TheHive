import React from "react";
import { Calendar, Clock, User } from "lucide-react";
import styles from "./userReserved.module.scss";

const ReservationCard = ({ reservation, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3>{reservation.beekeeper_service.categoryservice.name}</h3>
                <span
                    className={`${styles.status} ${
                        styles[reservation.status.toLowerCase()]
                    }`}
                >
                    {reservation.status}
                </span>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                    <User className={styles.icon} />
                    <span>{reservation.user.name}</span>
                </div>
                <div className={styles.infoRow}>
                    <Calendar className={styles.icon} />
                    <span>{formatDate(reservation.reservation_date)}</span>
                </div>
                <div className={styles.infoRow}>
                    <Clock className={styles.icon} />
                    <span>{formatTime(reservation.reservation_date)}</span>
                </div>
            </div>

            <div className={styles.cardActions}>
                <button
                    onClick={() => onEdit(reservation)}
                    className={styles.editButton}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(reservation.id)}
                    className={styles.deleteButton}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ReservationCard;
