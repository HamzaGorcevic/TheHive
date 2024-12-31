import React from "react";
import { User, Clock } from "lucide-react";
import styles from "./roomMessages.module.scss";

const Question = ({ room }) => {
    return (
        <div className={styles.question}>
            <h1 className={styles.questionTitle}>{room.title}</h1>
            <div className={styles.questionMeta}>
                <div className={styles.userInfo}>
                    <User size={20} />
                    <span>{room.creator.name}</span>
                </div>
                <div className={styles.messageTime}>
                    <Clock size={16} />
                    <span>{new Date(room.created_at).toLocaleString()}</span>
                </div>
            </div>
            <div className={styles.questionContent}>{room.description}</div>
        </div>
    );
};

export default Question;
