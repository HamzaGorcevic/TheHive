import React from "react";
import styles from "./loader.module.scss";

const CustomLoader = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.honeycomb}>
                <div className={styles.honeycombInner}></div>
            </div>
        </div>
    );
};

export default CustomLoader;
