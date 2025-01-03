import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./userReserved.module.scss";

const EditReservationForm = ({ reservation, onUpdate, onCancel }) => {
    const [reservationDate, setReservationDate] = useState(
        reservation.reservation_date
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(reservation.id, { reservation_date: reservationDate });
    };

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
                            onChange={(e) => setReservationDate(e.target.value)}
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
