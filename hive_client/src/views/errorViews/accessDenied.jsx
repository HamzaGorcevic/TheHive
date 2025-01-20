import React from "react";
import styles from "./accessDenied.module.scss";

const AccessDenied = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Access Denied</h1>
                <p className={styles.message}>
                    You do not have permission to view this page.
                </p>
            </div>
        </div>
    );
};

export default AccessDenied;
