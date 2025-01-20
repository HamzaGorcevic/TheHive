import React, { useState } from "react";
import { X } from "lucide-react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import styles from "./reservationModal.module.scss";

function ReservationModal({ isOpen, onClose, serviceId }) {
    const [reservationDate, setReservationDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("Cannot select a past date and time");
            return;
        }

        setReservationDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reservationDate) {
            toast.error("Please select a date and time.");
            return;
        }

        const selectedDate = new Date(reservationDate);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("Cannot make a reservation for a past date and time");
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

    // Get current date and time in ISO format for min attribute
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Reserve Service</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="datetime">Select Date & Time</label>
                        <input
                            id="datetime"
                            type="datetime-local"
                            value={reservationDate}
                            onChange={handleDateChange}
                            min={minDateTime}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading}
                        >
                            {loading ? "Reserving..." : "Reserve Now"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReservationModal;
