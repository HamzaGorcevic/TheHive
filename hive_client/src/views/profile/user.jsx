import React from "react";
import styles from "./user.module.scss";

const UserCard = ({ user }) => {
    console.log(user);
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
                <div className={styles.infoItem}>
                    <span className={styles.label}>Points:</span>
                    <span>{user.points ? user.points : 0}</span>
                </div>
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
