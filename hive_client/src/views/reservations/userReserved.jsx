import React, { useState, useEffect, useContext } from "react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";
import styles from "./userReserved.module.scss";

function UserReserved() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const { authData } = useContext(StateContext);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/reservations-user");
            if (response.status === 200) {
                setReservations(response.data.reservations);
            }
        } catch (err) {
            toast.error("Failed to fetch reservations.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const response = await axiosClient.put(
                `/reservations/${id}`,
                updatedData
            );
            if (response.status === 200) {
                toast.success("Reservation updated successfully!");
                fetchReservations();
                setEditingReservation(null);
            }
        } catch (err) {
            toast.error("Failed to update reservation.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axiosClient.delete(`/reservations/${id}`);
            if (response.status === 200) {
                toast.success("Reservation deleted successfully!");
                fetchReservations();
            }
        } catch (err) {
            toast.error("Failed to delete reservation.");
        }
    };

    if (loading) {
        return <CustomLoader />;
    }

    return (
        <div className={styles.userReserved}>
            <h1>My Reservations</h1>
            {reservations && reservations?.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <div className={styles.reservationsList}>
                    {reservations?.map((reservation) => (
                        <div
                            key={reservation.id}
                            className={styles.reservationCard}
                        >
                            <div className={styles.cardHeader}>
                                <h2>
                                    {
                                        reservation.beekeeper_service
                                            .categoryservice.name
                                    }
                                </h2>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() =>
                                            setEditingReservation(
                                                reservation.id
                                            )
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                            handleDelete(reservation.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {editingReservation === reservation.id ? (
                                <EditReservationForm
                                    reservation={reservation}
                                    onUpdate={handleUpdate}
                                    onCancel={() => setEditingReservation(null)}
                                />
                            ) : (
                                <div className={styles.reservationDetails}>
                                    <p>
                                        <strong>Beekeeper:</strong>{" "}
                                        {reservation.user.name}
                                    </p>
                                    <p>
                                        <strong>Date & Time:</strong>{" "}
                                        {new Date(
                                            reservation.reservation_date
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {reservation.status}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function EditReservationForm({ reservation, onUpdate, onCancel }) {
    const [reservationDate, setReservationDate] = useState(
        reservation.reservation_date
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(reservation.id, { reservation_date: reservationDate });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.editForm}>
            <label>
                Date & Time:
                <input
                    type="datetime-local"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                />
            </label>

            <div className={styles.formActions}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default UserReserved;
