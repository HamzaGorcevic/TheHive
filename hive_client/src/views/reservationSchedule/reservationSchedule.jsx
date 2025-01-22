import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./reservationSchedule.module.scss";
import { toast } from "react-toastify";
import axiosClient from "../../axios";

const ReservationSchedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/reservations-beekeeper");
            if (response.status === 200) {
                const acceptedReservations = response.data.reservations.filter(
                    (res) => res.status !== "pending"
                );
                console.log("Accepted Reservations:", acceptedReservations);
                setReservations(acceptedReservations);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to fetch reservations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className={styles.calendarDay}></div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );

            const dayReservations = reservations.filter((res) => {
                const resDate = new Date(res.reservation_date); // Changed from res.date to res.reservation_date
                return isSameDay(resDate, date);
            });

            // Log for debugging
            if (dayReservations.length > 0) {
                console.log(
                    `Reservations for ${date.toDateString()}:`,
                    dayReservations
                );
            }

            days.push(
                <div
                    key={day}
                    className={`${styles.calendarDay} ${
                        dayReservations.length > 0 ? styles.hasReservations : ""
                    }`}
                >
                    <span className={styles.dayNumber}>{day}</span>
                    {dayReservations.map((res, index) => (
                        <div key={index} className={styles.reservation}>
                            <span className={styles.time}>
                                {new Date(
                                    res.reservation_date
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            <span className={styles.client}>
                                {res.user?.name || "Client"}
                            </span>
                            <span className={styles.client}>
                                {res?.beekeeper_service?.categoryservice?.name}
                            </span>
                            <span className={styles.status}>{res.status}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return days;
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
                <Calendar className={styles.calendarIcon} />
                <h2>Reservation Schedule</h2>
            </div>

            <div className={styles.monthNavigation}>
                <button
                    onClick={goToPreviousMonth}
                    className={styles.navButton}
                >
                    <ChevronLeft />
                </button>
                <h3>{`${
                    monthNames[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`}</h3>
                <button onClick={goToNextMonth} className={styles.navButton}>
                    <ChevronRight />
                </button>
            </div>

            <div className={styles.calendar}>
                <div className={styles.weekDays}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <div key={day} className={styles.weekDay}>
                                {day}
                            </div>
                        )
                    )}
                </div>
                <div className={styles.calendarGrid}>
                    {loading ? (
                        <div className={styles.loading}>
                            Loading reservations...
                        </div>
                    ) : (
                        renderCalendarDays()
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationSchedule;
