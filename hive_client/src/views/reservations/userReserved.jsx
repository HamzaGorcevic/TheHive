import React, { useState, useEffect, useContext } from "react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";
import styles from "./userReserved.module.scss";
import ReservationCard from "./reservationCard";
import EditReservationForm from "./editReservationForm";

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
        if (
            window.confirm("Are you sure you want to cancel this reservation?")
        ) {
            try {
                const response = await axiosClient.delete(
                    `/reservations/${id}`
                );
                if (response.status === 200) {
                    toast.success("Reservation cancelled successfully!");
                    fetchReservations();
                }
            } catch (err) {
                toast.error("Failed to cancel reservation.");
            }
        }
    };

    if (loading) {
        return <CustomLoader />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>My Reservations</h1>
                <p>Manage your upcoming appointments and services</p>
            </div>

            {reservations?.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No reservations found. Book a service to get started!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {reservations?.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onEdit={setEditingReservation}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {editingReservation && (
                <EditReservationForm
                    reservation={editingReservation}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingReservation(null)}
                />
            )}
        </div>
    );
}

export default UserReserved;
