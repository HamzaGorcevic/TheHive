import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import styles from "./userReserved.module.scss";

const EditReservationForm = ({ reservation, onUpdate, onCancel }) => {
    const [reservationDate, setReservationDate] = useState(
        reservation.reservation_date
    );

    const handleDateChange = (e) => {
        const selectedDate = new Dsate(e.target.value);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("Cannot select a past date and time");
            return;
        }

        setReservationDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!reservationDate) {
            toast.error("Please select a date and time.");
            return;
        }

        const selectedDate = new Date(reservationDate);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("Cannot update reservation to a past date and time");
            return;
        }

        onUpdate(reservation.id, { reservation_date: reservationDate });
    };

    // Get current date and time in ISO format for min attribute
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Edit Reservation</h3>
                    <button onClick={onCancel} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="datetime">New Date & Time</label>
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
                        <button type="submit" className={styles.saveButton}>
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReservationForm;
