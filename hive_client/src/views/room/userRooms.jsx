import React, { useEffect, useState } from "react";
import { User, Clock, CheckCircle, Trash2 } from "lucide-react";
import styles from "./roomsList.module.scss";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomLoader from "../../components/loader/loader";

export const UserRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const singleRoomRedirect = (id) => {
        navigate(`/rooms/${id}`);
    };

    const fetchUserRooms = async () => {
        try {
            const response = await axiosClient.get("/user/rooms");
            setRooms(response.data.rooms);
            setError("");
        } catch (err) {
            setError("Failed to load your rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRooms();
    }, []);

    const handleDelete = async (roomId, e) => {
        e.stopPropagation();
        try {
            const response = await axiosClient.delete(`rooms/${roomId}`);
            if (response.status === 200) {
                toast.success("Room deleted successfully!");
                fetchUserRooms();
            }
        } catch (e) {
            toast.error(e);
        }
    };

    if (loading) return <CustomLoader />;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <User size={24} />
                <h2>My Rooms</h2>
            </div>

            <div className={styles.roomGrid}>
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={styles.roomCard}
                        onClick={() => singleRoomRedirect(room.id)}
                    >
                        <div className={styles.statusWrapper}>
                            {room.solved_message_id && (
                                <>
                                    <div className={styles.solvedStatus}>
                                        <CheckCircle size={16} />
                                        SOLVED
                                    </div>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={(e) =>
                                            handleDelete(room.id, e)
                                        }
                                        title="Delete room"
                                    >
                                        <Trash2 />
                                    </button>
                                </>
                            )}
                        </div>

                        <h3 className={styles.roomTitle}>{room.title}</h3>
                        <p className={styles.roomDescription}>
                            {room.description}
                        </p>
                        <div className={styles.roomMeta}>
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
