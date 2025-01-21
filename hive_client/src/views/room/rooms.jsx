import React, { useContext, useEffect, useState } from "react";
import { Home, Users, Clock, CheckCircle, Search, Plus } from "lucide-react";
import styles from "./roomsList.module.scss";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StateContext from "../../contexts/authcontext";
import CustomLoader from "../../components/loader/loader";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { authData } = useContext(StateContext);
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/rooms");
            setRooms(response.data.rooms);
            setFilteredRooms(response.data.rooms);
            setError("");
        } catch (err) {
            setError("Failed to load rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        const filtered = rooms.filter(
            (room) =>
                room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setFilteredRooms(filtered);
    }, [searchTerm, rooms]);

    const singleRoomRedirect = (id) => {
        navigate(`/rooms/${id}`);
    };

    const handleDelete = async (roomId, e) => {
        e.stopPropagation();
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this room ?"
        );

        if (!isConfirmed) {
            return;
        }
        try {
            const response = await axiosClient.delete(`rooms/${roomId}`);
            if (response.status == 200) {
                toast.success("Room deleted succesfully!");
                fetchRooms();
            }
        } catch (e) {
            toast.error(e);
        }
    };

    if (loading) return <CustomLoader />;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.header}>
                    <Home size={24} />
                    <h2>All Rooms</h2>
                </div>
                <button
                    className={styles.createRoomButton}
                    onClick={() => navigate("/create-room")}
                >
                    <Plus size={20} />
                    Create Room
                </button>
            </div>

            <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.roomGrid}>
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        className={styles.roomCard}
                        onClick={() => {
                            singleRoomRedirect(room.id);
                        }}
                    >
                        <h3 className={styles.roomTitle}>{room.title}</h3>
                        <p className={styles.roomDescription}>
                            {room.description && room.description.slice(0, 80)}{" "}
                            ...
                        </p>
                        {authData?.user?.role == "admin" ||
                        authData?.user?.id == room.user_id ? (
                            <button
                                className={styles.deleteBtn}
                                onClick={(e) => handleDelete(room.id, e)}
                            >
                                Delete room
                            </button>
                        ) : (
                            ""
                        )}
                        {room.solved_message_id && (
                            <div className={styles.solvedStatus}>
                                <CheckCircle size={16} />
                                SOLVED
                            </div>
                        )}
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
