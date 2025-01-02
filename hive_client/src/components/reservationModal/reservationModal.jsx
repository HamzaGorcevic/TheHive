import React, { useState } from "react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import styles from "./reservationModal.module.scss";

function ReservationModal({ isOpen, onClose, serviceId }) {
    const [reservationDate, setReservationDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReservation = async () => {
        if (!reservationDate) {
            toast.error("Please select a date and time.");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/reservations", {
                beekeeper_service_id: serviceId,
                reservation_date: reservationDate,
            });

            if (response.status === 201) {
                toast.success("Reservation created successfully!");
                onClose();
            }
        } catch (err) {
            toast.error("Failed to create reservation.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Reserve Service</h2>
                <input
                    type="datetime-local"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                />
                <div className={styles.modalActions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleReservation} disabled={loading}>
                        {loading ? "Reserving..." : "Reserve Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReservationModal;
