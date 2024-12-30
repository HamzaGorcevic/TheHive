import React, { useContext, useEffect, useState } from "react";
import styles from "./user.module.scss";
import axiosClient from "../../axios";
import StateContext from "../../contexts/authcontext";

const UserCard = ({ user }) => {
    const [points, setPoints] = useState(0);
    const { authData } = useContext(StateContext);
    useEffect(() => {
        const getUserPoints = async () => {
            const response = await axiosClient.get("/votes");
            setPoints(response.data.votes);
        };
        getUserPoints();
    });

    return (
        <div className={styles.profileCard}>
            <div className={styles.header}>
                <h1>{user.name}</h1>
                <span className={styles.role}>{user.role}</span>
            </div>
            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span>{user.email}</span>
                </div>
                {authData?.user?.role != "admin" ? (
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Points:</span>
                        <span>{points}</span>
                    </div>
                ) : (
                    ""
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
