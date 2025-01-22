import React, { useState, useEffect, useContext } from "react";
import axiosClient from "../../axios";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";
import styles from "./reservationTable.module.scss";
import { useNavigate } from "react-router-dom";

function ReservationTable() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const { authData } = useContext(StateContext);
    const navigate = useNavigate();
    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/reservations-beekeeper");
            if (response.status === 200) {
                setReservations(
                    response.data.reservations.filter(
                        (res) => res.status == "pending"
                    )
                );
            }
        } catch (err) {
            toast.error("Failed to fetch reservations.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (reservationId) => {
        try {
            const response = await axiosClient.put(
                `/reservations/${reservationId}/accept`
            );
            if (response.status === 200) {
                toast.success("Reservation accepted!");
                navigate("/schedule");
            }
        } catch (err) {
            toast.error("Failed to accept reservation.");
        }
    };

    const handleDecline = async (reservationId) => {
        try {
            const response = await axiosClient.put(
                `/reservations/${reservationId}/decline`
            );
            if (response.status === 200) {
                toast.success("Reservation declined!");
                const filtered = reservations.filter(
                    (res) => res.id != reservationId
                );
                setReservations(filtered);
            }
        } catch (err) {
            toast.error("Failed to decline reservation.");
        }
    };

    if (loading) {
        return <CustomLoader />;
    }

    return (
        <div className={styles.reservationTable}>
            <h2>Reservations</h2>
            <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>User</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>
                                {
                                    reservation.beekeeper_service
                                        .categoryservice.name
                                }
                            </td>
                            <td>{reservation.user.name}</td>
                            <td>
                                {new Date(
                                    reservation.reservation_date
                                ).toLocaleString()}
                            </td>
                            <td>{reservation.status}</td>
                            <td className={styles.actions}>
                                {reservation.status === "pending" && (
                                    <>
                                        <button
                                            className={styles.acceptBtn}
                                            onClick={() =>
                                                handleAccept(reservation.id)
                                            }
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className={styles.declineBtn}
                                            onClick={() =>
                                                handleDecline(reservation.id)
                                            }
                                        >
                                            Decline
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReservationTable;
