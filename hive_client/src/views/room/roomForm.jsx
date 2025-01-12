import React, { useState } from "react";
import { Plus } from "lucide-react";
import styles from "./roomForm.module.scss";
import axiosClient from "../../axios";
import { useNavigate } from "react-router-dom";

const RoomForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post("/rooms", formData);
            setSuccess("Room created successfully!");
            setFormData({ title: "", description: "" });
            navigate("/user-rooms");
            setError("");
        } catch (err) {
            setError("Failed to create room. Please try again.");
            setSuccess("");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.header}>
                    <Plus size={24} />
                    <h2>Create New Room</h2>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.formGroup}>
                    <label>Room Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter room title"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        placeholder="Enter room description"
                    />
                </div>

                {!loading ? (
                    <button type="submit" className={styles.button}>
                        Create Room
                    </button>
                ) : (
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.loading}`}
                        disabled
                    ></button>
                )}
            </form>
        </div>
    );
};

export default RoomForm;
