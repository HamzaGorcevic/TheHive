import React, { useEffect, useState } from "react";
import { Home, Users, Clock } from "lucide-react";
import styles from "./rooms.module.scss";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get("/rooms");
                setRooms(response.data.rooms);
                setError("");
            } catch (err) {
                setError("Failed to load rooms");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);
    const singleRoomRedirect = (id) => {
        navigate(`/rooms/${id}`);
    };
    if (loading) return <div className={styles.loading}>Loading rooms...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Home size={24} />
                <h2>All Rooms</h2>
            </div>

            <div className={styles.roomGrid}>
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={styles.roomCard}
                        onClick={() => {
                            singleRoomRedirect(room.id);
                        }}
                    >
                        <h3 className={styles.roomTitle}>{room.title}</h3>
                        <p className={styles.roomDescription}>
                            {room.description}
                        </p>
                        {room.solved_message_id ? <p>SOLVED</p> : ""}
                        <div className={styles.roomMeta}>
                            <Users size={16} />
                            <span>{room.creator.name}</span>
                            <Clock size={16} />
                            <span>
                                {new Date(room.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rooms;
