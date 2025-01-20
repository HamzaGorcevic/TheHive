import React, { useContext, useEffect, useState } from "react";
import styles from "./user.module.scss";
import axiosClient from "../../axios";
import StateContext, { ContextProvider } from "../../contexts/authcontext";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "react-toastify";

const UserCard = ({ user, isViewMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { logoutUser } = useContext(StateContext);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });
    const { authData, updateUser } = useContext(StateContext);

    const points = isViewMode
        ? user.points
            ? user.points
            : 0
        : authData.user.points
        ? authData.user.points
        : 0;
    const handleEdit = () => {
        setIsEditing(true);
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
        });
    };

    const handleSave = async () => {
        try {
            const response = await axiosClient.put("/user/profile", formData);
            setIsEditing(false);
            updateUser(response.data.token, response.data.user);
            if (response.status == 200) {
                toast.success("Profile updated succesfully");
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                "Failed to update profile:" + error?.response?.data?.message
            );
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
        });
    };

    const handleDelete = async () => {
        if (
            window.confirm(
                "Are you sure you want to delete your profile? This action cannot be undone."
            )
        ) {
            try {
                await axiosClient.delete("/user");
                logoutUser();
            } catch (error) {
                console.error("Failed to delete profile:", error);
            }
        }
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className={styles.editInput}
                        />
                    ) : (
                        <h1>{user?.name}</h1>
                    )}
                    <span className={styles.role}>{user?.role}</span>
                </div>
                {!isViewMode && (
                    <div className={styles.actions}>
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className={styles.editButton}
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={styles.deleteBtn}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className={styles.saveButton}
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className={styles.cancelButton}
                                >
                                    <X size={20} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    {isEditing ? (
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className={styles.editInput}
                        />
                    ) : (
                        <span>{user.email}</span>
                    )}
                </div>
                {authData?.user?.role !== "admin" && (
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Points:</span>
                        <span>{points}</span>
                    </div>
                )}
                <div className={styles.infoItem}>
                    <span className={styles.label}>Member since:</span>
                    <span>
                        {new Date(user.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
